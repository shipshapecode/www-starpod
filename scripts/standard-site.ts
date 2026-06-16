/**
 * Shared helpers for the standard.site publication record.
 *
 * `@bryanguffey/astro-standard-site`'s publisher can create a publication with
 * `name`/`url`/`description`, but its input type omits the lexicon's `icon`
 * field — so the brand image can't be set through it. The icon therefore has to
 * be written with the raw ATProto agent: upload the bytes as a blob, then store
 * the blob ref on the publication record. This module centralizes that so both
 * `create-publication` (initial setup) and `set-publication-icon` (updating an
 * existing record) emit a spec-compliant `icon`.
 */

import sharp from 'sharp';
import parseFeed from 'rss-to-json';

import type { StandardSitePublisher } from '@bryanguffey/astro-standard-site';
import starpodConfig from '../starpod.config';

const PUBLICATION_COLLECTION = 'site.standard.publication';

// standard.site icon constraints: square, at least 256x256, max 1MB, image/*.
const MAX_ICON_BYTES = 1_000_000;
const MIN_ICON_DIMENSION = 256;

export interface PublicationMeta {
  /** The publication name — the show title from the feed. */
  name: string;
  /** URL of the square brand image to use as the publication icon. */
  iconUrl: string;
}

/**
 * Resolve the publication name and brand-image URL from the RSS feed — the same
 * source the site renders from. `STANDARD_SITE_ICON_URL` overrides the feed
 * artwork when a dedicated square brand image is preferred.
 */
export async function getPublicationMeta(): Promise<PublicationMeta> {
  // @ts-expect-error rss-to-json types don't match runtime API
  const feed = (await parseFeed.parse(starpodConfig.rssFeed)) as {
    title?: string;
    image?: string;
  };

  const name = feed.title?.trim();
  const iconUrl = process.env.STANDARD_SITE_ICON_URL || feed.image;

  if (!name) {
    throw new Error('Could not read the show title from the RSS feed.');
  }
  if (!iconUrl) {
    throw new Error(
      'Could not determine a brand image URL — set STANDARD_SITE_ICON_URL.'
    );
  }

  return { name, iconUrl };
}

interface IconBlob {
  bytes: Uint8Array;
  mimeType: string;
}

/** Download the brand image and verify it satisfies the standard.site icon constraints. */
async function fetchIcon(url: string): Promise<IconBlob> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download brand image (${res.status}): ${url}`);
  }

  const mimeType =
    res.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg';
  if (!mimeType.startsWith('image/')) {
    throw new Error(`Brand image is not an image (content-type: ${mimeType}).`);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength > MAX_ICON_BYTES) {
    throw new Error(
      `Brand image is ${(bytes.byteLength / 1024 / 1024).toFixed(
        2
      )}MB; the standard.site icon limit is 1MB.`
    );
  }

  const { width, height } = await sharp(Buffer.from(bytes)).metadata();
  if (!width || !height || width !== height) {
    throw new Error(`Brand image must be square (got ${width}x${height}).`);
  }
  if (width < MIN_ICON_DIMENSION) {
    throw new Error(
      `Brand image must be at least ${MIN_ICON_DIMENSION}x${MIN_ICON_DIMENSION} (got ${width}x${height}).`
    );
  }

  return { bytes, mimeType };
}

/**
 * Update an existing publication record in place — same rkey, preserving its
 * other fields — to set the brand `icon` and, optionally, correct the `name`.
 */
export async function updatePublicationRecord(
  publisher: StandardSitePublisher,
  rkey: string,
  { iconUrl, name }: { iconUrl: string; name?: string }
): Promise<void> {
  const agent = publisher.getAtpAgent();
  const repo = publisher.getDid();

  const existing = await agent.com.atproto.repo.getRecord({
    repo,
    collection: PUBLICATION_COLLECTION,
    rkey
  });

  const record = { ...(existing.data.value as Record<string, unknown>) };

  const icon = await fetchIcon(iconUrl);
  const uploaded = await agent.com.atproto.repo.uploadBlob(icon.bytes, {
    encoding: icon.mimeType
  });
  record.icon = uploaded.data.blob;

  if (name) record.name = name;

  await agent.com.atproto.repo.putRecord({
    repo,
    collection: PUBLICATION_COLLECTION,
    rkey,
    record
  });
}
