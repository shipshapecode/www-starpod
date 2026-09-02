# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## What is this repo?

The [whiskey.fm](https://whiskey.fm) website (Whiskey Web and Whatnot podcast).
It consumes the [`starpod`](https://github.com/shipshapecode/starpod) npm
package — an Astro integration that generates the entire core podcast site
(episode pages, player, search, transcripts, LLM endpoints) from the RSS feed
configured in `starpod.config.ts`. This repo holds only whiskey.fm-specific
content, pages, and overrides.

## Commands

- **Dev server:** `pnpm dev` (runs on localhost:4321)
- **Build:** `pnpm build` (runs `astro check` then `astro build`; the starpod
  integration injects the `Accept: text/markdown` content-negotiation routes
  into the Vercel build output during the build)
- **Lint:** `pnpm lint` (ESLint with caching)
- **Lint fix:** `pnpm lint:fix`
- **All tests:** `pnpm test` (runs unit + e2e concurrently)
- **Unit tests only:** `pnpm test:unit` (Vitest)
- **Single unit test:** `pnpm exec vitest run tests/unit/Player.test.tsx`
- **E2E tests only:** `pnpm test:e2e` (Playwright, auto-starts dev server)
- **Seed remote DB:** `pnpm db:seed`
- **Push schema to DB:** `pnpm db:push`
- **Drizzle Studio:** `pnpm db:studio`
- **Publish episodes to ATProto:** `pnpm publish:atproto` (or
  `publish:atproto:backfill`)

## Architecture

### The starpod integration

`astro.config.mjs` registers `starpod(starpodConfig, options)`. The
integration injects all core routes (home, `[episode]`, about, contact, 404,
llms.txt, openapi.json, markdown twins, JSON API) and brings its own Preact,
sitemap, Tailwind, and font setup. Options used here:

- `database: true` — per-episode guests/sponsors from Turso via Drizzle.
- `components` — replaces built-in components; this site overrides `InfoCard`
  (`src/components/InfoCard.astro`) to add Collections/Store/Sponsor nav
  links. Other overridable components: Dots, EpisodeList, Hosts,
  LargePlatforms, NotFoundContent, Platforms, ShowArtwork.
- `customCss` — `src/styles/custom.css` loads after the package styles.

Package internals are importable as `starpod/src/*` (mapped in
`tsconfig.json` to `./node_modules/starpod/src/*`, and aliased the same way in
`vitest.config.ts`). Stable exports: `starpod`, `starpod/config`,
`starpod/content`, `starpod/db`, `starpod/db/schema`, `starpod/layout`,
`starpod/components/AdPackageCard`, `starpod/rss`.

Outside Astro (tsx scripts, tests) the `virtual:starpod/config` module doesn't
exist, so standalone code passes the config explicitly, e.g.
`getAllEpisodes(starpodConfig)` in `db/seed.ts` and
`scripts/analyze-transcripts.ts`.

### Site-specific code (this repo)

- `starpod.config.ts` — show metadata: hosts, platforms, RSS feed, blurb,
  description.
- `src/pages/sponsor.astro` — sponsorship pitch page; uses the local
  `src/components/AdPackageCard.astro` (adds Polar `productId` checkout links)
  rather than the package's card. `src/pages/sponsor/success.astro` is the
  post-checkout page and `src/pages/api/checkout.ts` is the Polar checkout
  redirect (needs `POLAR_ACCESS_TOKEN` plus the `POLAR_*_PRODUCT_ID` vars).
- `src/pages/collections/` — curated episode collections, driven by
  `src/data/collections.ts` (static definitions), `src/lib/collections.ts`
  (episode/transcript matching), and `src/lib/topic-keywords.ts`.
- `src/content/transcripts/` — markdown transcripts named by episode number
  (`src/content.config.ts` wires them to the package's `transcriptsLoader`).
  `[HH:MM:SS]` timestamps become clickable seek links.
- `src/img/people/`, `src/img/sponsors/`, `src/img/countries/` — images the
  package (and sponsor page) resolves by filename via root-absolute globs.
- `db/` — seed script and static guest/sponsor data; the schema lives in the
  package (`drizzle.config.ts` points at
  `node_modules/starpod/src/db/schema.ts`).
- `scripts/` — ATProto/standard.site publishing (`publish-atproto-episodes`,
  `create-publication`, `set-publication-icon`, shared helpers in
  `standard-site.ts`) and `analyze-transcripts.ts` for collection keyword
  tuning.

### Testing

- **Unit tests** (`tests/unit/`): Vitest + jsdom + @testing-library/preact.
  These exercise the package internals via the `starpod/src/*` alias. Setup
  file at `tests/unit/test-setup.ts`.
- **E2E tests** (`tests/e2e/`): Playwright against chromium, firefox, webkit.

## Environment Variables

- `DISCORD_WEBHOOK` — contact form submissions (package API route).
- `ASTRO_DB_REMOTE_URL` / `ASTRO_DB_APP_TOKEN` — Turso database.
- `POLAR_ACCESS_TOKEN` and `POLAR_BOTTLEDROP_PRODUCT_ID`,
  `POLAR_LABEL_PRODUCT_ID`, `POLAR_30SEC_PRODUCT_ID`,
  `POLAR_60SEC_PRODUCT_ID` — Polar sponsor checkout.
- `STANDARD_SITE_DID` — ATProto DID for standard.site verification.
- `STANDARD_SITE_PUBLICATION_RKEY` — publication record key from
  `scripts/create-publication.ts`.
- `ATPROTO_HANDLE` / `ATPROTO_APP_PASSWORD` — Bluesky credentials for
  publishing episodes.
- `STANDARD_SITE_URL` — the site URL used when publishing documents.
