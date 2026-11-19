# Architecture decisions

## 2026-08-22 | Preserve SvelteKit and use MDsveX for journal content

The destination already uses current SvelteKit, Svelte, TypeScript, Vite, pnpm, and static generation. Keep that architecture and migrate legacy Markdown through MDsveX instead of replacing the working stack. Articles remain file-backed, reviewable, and fully prerendered.

## 2026-08-22 | Algolia with resilient local fallback

Use Algolia's HTTP search API in the browser with public search-only credentials. Maintain an indexing script that derives searchable records from article files and requires an admin key only in the indexing environment. If Algolia is unconfigured or unavailable, title, summary, and tag search remains functional locally.

## 2026-08-26 | Shared accessibility baseline

Keep keyboard focus, skip navigation, reduced motion, forced colors, and shared assistive styles in the root Svelte layout. Route components retain semantic landmarks and their own content structure. Load large optional widgets such as Mermaid only when they approach the viewport.

## 2026-11-18 | Locale-prefixed Serbian, unprefixed English

Serve English from the existing URLs and Serbian (Latin script) under `/sr/`, using an optional `[[lang=locale]]` route segment so every page stays prerendered. Existing links, the RSS feed, and OAuth metadata keep working. Articles are separate Markdown files per language, UI strings are typed message catalogs, and each page declares `hreflang` alternates. English-only exceptions: the OAuth callback and the Bluesky thread page, whose URLs are registered redirect URIs.

## 2026-11-18 | Cloudflare Workers static assets for hosting

The live site already runs on Cloudflare under `nenadkostic.com/*`. Replace the legacy Workers Sites setup (KV bucket, Node 14 workflow) with a static assets Worker and a pnpm-based GitHub Actions workflow. Legacy `/blog/<slug>` and `/<slug>` URLs get real 301 redirects from `public/_redirects`.
