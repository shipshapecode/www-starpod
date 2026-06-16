/**
 * Set (or refresh) the brand icon on the existing standard.site publication
 * record, and correct its name to the show title.
 *
 * The record is updated in place — its rkey is preserved so the
 * /.well-known/site.standard.publication URL and every published document stay
 * associated. Run once to backfill the icon onto an existing publication, or
 * whenever the brand image changes.
 *
 * Required environment variables:
 *   ATPROTO_HANDLE                 - Your Bluesky handle
 *   ATPROTO_APP_PASSWORD           - An app password
 *   STANDARD_SITE_PUBLICATION_RKEY - The publication record key
 * Optional:
 *   STANDARD_SITE_ICON_URL         - Square brand image (defaults to the RSS show artwork)
 *
 * Usage:
 *   ATPROTO_HANDLE=you.bsky.social ATPROTO_APP_PASSWORD=xxxx STANDARD_SITE_PUBLICATION_RKEY=xxxx pnpm tsx scripts/set-publication-icon.ts
 */

import { StandardSitePublisher } from '@bryanguffey/astro-standard-site';
import { getPublicationMeta, updatePublicationRecord } from './standard-site';

async function main() {
  const identifier = process.env.ATPROTO_HANDLE;
  const password = process.env.ATPROTO_APP_PASSWORD;
  const rkey = process.env.STANDARD_SITE_PUBLICATION_RKEY;

  if (!identifier || !password || !rkey) {
    console.error(
      'Missing required environment variables. Need: ATPROTO_HANDLE, ATPROTO_APP_PASSWORD, STANDARD_SITE_PUBLICATION_RKEY'
    );
    process.exit(1);
  }

  const { name, iconUrl } = await getPublicationMeta();

  const publisher = new StandardSitePublisher({ identifier, password });
  await publisher.login();
  console.log(`✅ Logged in as ${publisher.getDid()}`);

  console.log(`📤 Uploading brand image: ${iconUrl}`);
  await updatePublicationRecord(publisher, rkey, { iconUrl, name });

  console.log(`\n🎉 Publication updated — icon set and name is now "${name}".`);
  console.log(
    `   Verify: at://${publisher.getDid()}/site.standard.publication/${rkey}`
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
