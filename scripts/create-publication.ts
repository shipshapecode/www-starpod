/**
 * Create or update the podcast publication record on ATProto
 *
 * Run this once to set up your publication. The returned rkey should be
 * saved as the STANDARD_SITE_PUBLICATION_RKEY environment variable.
 *
 * Required environment variables:
 *   ATPROTO_HANDLE - Your Bluesky handle
 *   ATPROTO_APP_PASSWORD - An app password
 *   STANDARD_SITE_URL - Your podcast site URL
 *
 * Usage:
 *   ATPROTO_HANDLE=you.bsky.social ATPROTO_APP_PASSWORD=xxxx STANDARD_SITE_URL=https://whiskey.fm pnpm tsx scripts/create-publication.ts
 */

import { StandardSitePublisher } from '@bryanguffey/astro-standard-site';
import starpodConfig from '../starpod.config';
import { getPublicationMeta, updatePublicationRecord } from './standard-site';

async function main() {
  const identifier = process.env.ATPROTO_HANDLE;
  const password = process.env.ATPROTO_APP_PASSWORD;
  const siteUrl = process.env.STANDARD_SITE_URL;

  if (!identifier || !password || !siteUrl) {
    console.error(
      'Missing required environment variables. Need: ATPROTO_HANDLE, ATPROTO_APP_PASSWORD, STANDARD_SITE_URL'
    );
    process.exit(1);
  }

  const publisher = new StandardSitePublisher({
    identifier,
    password
  });

  await publisher.login();
  console.log(`✅ Logged in as ${publisher.getDid()}`);

  const { name, iconUrl } = await getPublicationMeta();

  const result = await publisher.publishPublication({
    name,
    url: siteUrl,
    description: starpodConfig.description
  });

  const rkey = result.uri.split('/').pop()!;
  console.log(`✅ Publication created: ${result.uri}`);

  // The publisher input has no `icon` field, so attach the brand image directly.
  console.log(`📤 Uploading brand image: ${iconUrl}`);
  await updatePublicationRecord(publisher, rkey, { iconUrl });

  console.log('\n🎉 Publication ready!');
  console.log(`AT-URI: ${result.uri}`);
  console.log(`\nSave this as STANDARD_SITE_PUBLICATION_RKEY: ${rkey}`);
  console.log(`Save this as STANDARD_SITE_DID: ${publisher.getDid()}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
