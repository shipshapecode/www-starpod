# Starpod

Build a custom website for your podcast in minutes.

## What's included?

- Home page with show art, episode listings, and player links
- Episode pages with show notes and transcripts
- About page
- Contact page
- RSS-powered content fetching
- Search-engine-friendly defaults
- Easy deployment to Vercel

## Quick Start

1. Clone the repo
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env` and configure your values
4. Start the dev server with `pnpm dev`

## Configuration

Most site settings live in `starpod.config.ts`.

## Development

### Commands

- `pnpm dev` - Start the dev server
- `pnpm build` - Type check and build the site
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit and e2e tests

## AI / LLM Routes

The site exposes a set of LLM-friendly routes generated from your content and RSS feed.

All of the following endpoints are automatically generated at build time from
your `starpod.config.ts` and RSS feed:

- `/llms.txt` - Main discovery file
- `/for-llms` - Human-readable guide page
- `/for-llms.html.md` - Markdown version of guide
- `/about.html.md` - Markdown version of about page
- `/episodes-index.html.md` - Complete episode listing
- `/{episode-slug}.html.md` - Individual episode with transcript
- `/{episode-number}.html.md` - Alternative episode URL

No configuration needed - it just works!

## Polar.sh Checkout Integration

This site uses Polar.sh for sponsor checkout. To set it up:

1. **Get your Polar credentials:**
   - Log in to your [Polar dashboard](https://polar.sh)
   - Go to Settings → API to get your access token
   - Create products for your sponsorship packages
   - Note the product IDs from each product's page

2. **Configure environment variables:** Create a `.env` file in the root
   directory with:

   ```env
   POLAR_ACCESS_TOKEN=your_polar_access_token_here
   POLAR_30SEC_PRODUCT_ID=your_30sec_product_id_here
   POLAR_60SEC_PRODUCT_ID=your_60sec_product_id_here
   POLAR_BOTTLEDROP_PRODUCT_ID=your_bottledrop_product_id_here
   POLAR_CRATE_PRODUCT_ID=your_crate_product_id_here
   POLAR_FULLBARREL_PRODUCT_ID=your_fullbarrel_product_id_here
   POLAR_LABEL_PRODUCT_ID=your_label_product_id_here
   POLAR_SUCCESS_URL=https://whiskey.fm/sponsor/success
   ```

3. **Test the integration:**
   - For testing, you can set `PUBLIC_POLAR_SERVER=sandbox` in your `.env`
   - Visit `/sponsor` and click on a sponsorship option
   - You'll be redirected to Polar's checkout page
   - After successful payment, users return to `/sponsor/success`

4. **Go live:**
   - Remove `PUBLIC_POLAR_SERVER` or set it to `production`
   - Ensure your product IDs are for production products
   - Test with a real payment to confirm everything works

The integration uses the `@polar-sh/astro` package which provides:
- Server-side checkout session creation at `/api/checkout`
- Automatic tax compliance through Polar's Merchant of Record service
- Support for multiple products and dynamic pricing
