import { SITE_ORIGIN, locales, localeMeta, localizePath } from "$lib/i18n";
import { hasArchive, slugs } from "$lib/posts";
import { siteConfig } from "$lib/site-config";
import type { RequestHandler } from "./$types";

export const prerender = true;

// Language-neutral paths. Each one is listed once per locale with hreflang alternates.
const paths = [
  "/",
  "/about/",
  "/journal/",
  ...(hasArchive ? ["/archive/"] : []),
  ...(siteConfig.features.blueskyPage ? ["/bluesky/"] : []),
  ...slugs.map((slug) => `/journal/${slug}/`),
];

export const GET: RequestHandler = () => {
  const entries = paths.flatMap((path) => {
    const alternates = [
      ...locales.map((code) => `<xhtml:link rel="alternate" hreflang="${localeMeta[code].htmlLang}" href="${SITE_ORIGIN}${localizePath(code, path)}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${localizePath("en", path)}"/>`,
    ].join("");
    return locales.map((code) => `<url><loc>${SITE_ORIGIN}${localizePath(code, path)}</loc>${alternates}</url>`);
  });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join("")}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
};
