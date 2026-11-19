# Project log

## 2026-08-22 | Legacy content migration

- Migrated seven legacy Markdown articles and their media into the current SvelteKit site.
- Added local journal detail routes, a complete archive, RSS, sitemap, article metadata, and an Algolia indexing workflow.
- Preserved the legacy career history and social links in a new About page and the site footer.
- Preserved the existing monochrome editorial design and static Sites build.

## 2026-08-22 | Copy edit

- Rewrote all published articles and page copy in plain English while preserving the original facts and first-person voice.
- Removed AI-style filler, promotional phrasing, decorative emoji, curly quotes, and em dashes.
- Changed both search prompts to "What are you curious about?"
- Linked the footer directly to Nenad's Strava athlete profile.

## 2026-08-22 | New journal articles

- Added articles about AWS MediaTailor, a React Native and Expo stack, and the AI tools Nenad uses today.
- Added minimal technology strips, product links, and a Mermaid ad insertion diagram.
- Corrected the Questrade announcement date to July 8, 2026.
- Renamed the latest article to "AI tools in 2026" and kept its previous URL as a redirect.
- Changed the home page introduction from a role title to "software engineer in Calgary."
- Updated the About page to describe the Questrade Principal Engineer role as the current engagement rather than Nenad's general identity.
- Added the public `nkostic.bsky.social` feed to the home page and journal, mixed with articles by date.
- Added small official-blue Bluesky marks, corrected the profile link, and kept article-only rendering as the fallback.
- Added an article explaining the AT Protocol and this site's public AppView integration.
- Added a shared feature flag and disabled Bluesky posts in the home and journal feeds without removing the integration.
- Added an organization-focused accessibility article based on internal Expo notes and Marcy Sutton Todd's Enterprise Accessibility course materials, with inline attribution and source notes.
- Added a dedicated Bluesky page, enabled it through site configuration, and kept Bluesky posts out of the article feeds.

## 2026-08-26 | Accessibility and Lighthouse pass

- Added skip navigation, visible keyboard focus, reduced-motion and forced-colors support, stronger contrast, search shortcuts, live search status, and improved media descriptions.
- Deferred Mermaid rendering until diagrams approach the viewport.
- Reached 100 accessibility, best practices, and SEO scores on representative Lighthouse audits. Performance scored between 98 and 100.
- Added a compact, keyboard-accessible likes popover that loads Bluesky profiles only when opened.
- Fixed the Bluesky OAuth loopback client ID and callback detection so local reply sign-in returns to the same post.
- Reversed archive numbering so the oldest entry starts at 1 while lists remain sorted newest first.
- Extracted the Bluesky reply form into a reusable AT Protocol composer and documented a staged Cloudflare architecture for public records, private drafts, files, and repository backups.
- Refined the AT Protocol plan so readers comment from their own repositories while a Cloudflare AppView verifies, indexes, and moderates those records.
- Added validated comment and permission Lexicons, a central OAuth callback, and a journal comment pilot that writes public records to each signed-in reader's own repository.
- Added an accessible image loader and a white Bluesky profile tile that closes odd-numbered post galleries without an empty dark cell.
- Added an owner-specific infrastructure checklist for production OAuth, Lexicon publication, Cloudflare D1 and Workers, moderation, synchronization, and later private storage.

## 2026-11-18 | Release branch for the live site

- Prepared the `modernize` branch with only the seven articles that are live on nenadkostic.com. The other five articles and their routes live on `develop`.
- Added Serbian (Latin script) UI and article translations at `/sr/`, with a language switcher, hreflang alternates, per-language feeds, a bilingual sitemap, and per-language Algolia indexes. The Serbian text is a draft for the author's review.
- Replaced legacy Workers Sites with a Cloudflare static assets Worker, added 301 redirects for old URLs, and updated the CI workflow.
- Turned AT Protocol comments off until the production infrastructure checklist is complete.
