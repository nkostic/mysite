import { SITE_ORIGIN, locales, localeMeta, localizePath, type Locale } from "$lib/i18n";
import { getPosts } from "$lib/posts";
import { siteConfig } from "$lib/site-config";
import type { RequestHandler } from "./$types";

export const prerender = true;

// Language-neutral paths mapped to the locales that have them. Each locale gets an entry with hreflang alternates.
const pages = new Map<string, Locale[]>();
const add = (path: string, locale: Locale) => pages.set(path, [...(pages.get(path) ?? []), locale]);

for (const locale of locales) {
  for (const path of ["/", "/about/", "/journal/", ...(siteConfig.features.blueskyPage ? ["/bluesky/"] : [])]) add(path, locale);
  for (const post of getPosts(locale)) add(`/journal/${post.slug}/`, locale);
}

export const GET: RequestHandler = () => {
  const entries = [...pages].flatMap(([path, available]) => {
    const alternates = available.length > 1
      ? [
          ...available.map((code) => `<xhtml:link rel="alternate" hreflang="${localeMeta[code].htmlLang}" href="${SITE_ORIGIN}${localizePath(code, path)}"/>`),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${localizePath("en", path)}"/>`,
        ].join("")
      : "";
    return available.map((code) => `<url><loc>${SITE_ORIGIN}${localizePath(code, path)}</loc>${alternates}</url>`);
  });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join("")}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
};
