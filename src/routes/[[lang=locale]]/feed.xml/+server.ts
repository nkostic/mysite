import { SITE_ORIGIN, localeMeta, localizePath } from "$lib/i18n";
import { messages } from "$lib/i18n";
import { getPosts } from "$lib/posts";
import type { RequestHandler } from "./$types";

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character]!);

export const prerender = true;

export const GET: RequestHandler = ({ params }) => {
  const locale = params.lang === "sr" ? "sr" : "en";
  const t = messages[locale];
  const items = getPosts(locale).map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_ORIGIN}${post.url}</link>
      <guid isPermaLink="true">${SITE_ORIGIN}${post.url}</guid>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
    </item>`).join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(t.site.title)}</title><link>${SITE_ORIGIN}${localizePath(locale, "/")}</link><atom:link href="${SITE_ORIGIN}${localizePath(locale, "/feed.xml")}" rel="self" type="application/rss+xml" /><description>${escapeXml(t.site.feedDescription)}</description><language>${localeMeta[locale].htmlLang}</language>${items}</channel></rss>`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
};
