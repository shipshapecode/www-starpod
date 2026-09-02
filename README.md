# whiskey.fm

The website for [Whiskey Web and Whatnot](https://whiskey.fm), built with
[Starpod](https://github.com/shipshapecode/starpod) — an Astro integration
that turns an RSS feed into a full podcast website.

The `starpod` package generates the core site: episode pages, a persistent
audio player, search, transcripts with clickable timestamps, and
agent-friendly endpoints (llms.txt, markdown twins of every page, an
OpenAPI-documented JSON API). This repo adds everything whiskey.fm-specific
on top:

- `starpod.config.ts` — show metadata (hosts, platforms, RSS feed)
- `src/pages/sponsor.astro` — sponsorship pitch with Polar checkout
  (`src/pages/api/checkout.ts`, local `AdPackageCard` variant)
- `src/pages/collections/` — curated episode collections
- `src/content/transcripts/` — markdown episode transcripts
- `src/img/` — host, guest, and sponsor images the package resolves by
  filename
- `db/` — guest and sponsor seed data for Turso (the schema ships with the
  package)
- `scripts/` — ATProto / standard.site episode publishing
- Component overrides and extra styles wired through the integration's
  `components` and `customCss` options in `astro.config.mjs`

## Development

```bash
pnpm install
pnpm dev        # localhost:4321
pnpm test       # unit (Vitest) + e2e (Playwright)
pnpm build      # astro check + production build
```

Updating the site engine is a normal dependency bump:

```bash
pnpm update starpod
```

See the [starpod README](https://github.com/shipshapecode/starpod/tree/main/packages/starpod)
for the configuration reference, integration options, and custom-page docs.
Environment variables are listed in [.env.example](./.env.example) and
documented in [CLAUDE.md](./CLAUDE.md).

## Deployment

Deployed to Vercel. Episode pages with markdown twins are also served via
`Accept: text/markdown` content negotiation — the integration patches the
Vercel build output automatically.
