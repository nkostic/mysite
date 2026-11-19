# Nenad Kostic — Code & Outside

A static Svelte 5 developer journal with a monochrome editorial design, recent writing, Algolia-ready article search, and social links.

## Local development

```sh
pnpm install
pnpm dev
```

## Search configuration

Copy `.env.example` to `.env` and add Algolia's public search-only values. Without them, the homepage automatically uses its local article index.

## Languages

English is served from the site root and Serbian (Latin script) from `/sr/`.

- UI text lives in `src/lib/i18n/en.ts` and `sr.ts`. Add a key to both; TypeScript fails the check if `sr.ts` is missing one.
- Article metadata (title, summary, tags) lives in `src/lib/posts.ts`. Article bodies are `src/lib/content/posts/<slug>.md` (English) and `<slug>.sr.md` (Serbian).
- Each page emits `hreflang` alternates and a canonical URL. The sitemap lists both languages, and each language has its own RSS feed (`/feed.xml`, `/sr/feed.xml`).
- To add a locale, extend `locales` in `src/lib/i18n/index.ts`, `src/params/locale.ts`, and the `Locale` maps in the same file, then add the translated files.

## Production

```sh
pnpm check
pnpm build
```

The static site is written to `dist/client` and served by a Cloudflare Worker with static assets (`wrangler.jsonc`). Pushes to `master` deploy through `.github/workflows/cloudflare-publish.yaml`, which needs the `CF_API_TOKEN` repository secret. Pull requests only run the check and build. Redirects from the previous site's URLs are in `public/_redirects`.

## Feature flags

`src/lib/site-config.ts` controls the Bluesky page, Bluesky posts in the journal feed, and AT Protocol comments. Comments are off until the production steps in `docs/infra-checklist.md` are complete.
