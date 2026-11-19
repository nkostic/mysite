import type { Locale } from "$lib/i18n";
import { getPosts, type Post } from "$lib/posts";

const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID as string | undefined;
const searchKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY as string | undefined;
const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME as string | undefined;

export const algoliaReady = Boolean(appId && searchKey && indexName);

/** English keeps the original index name. Other locales use a `_<locale>` suffix (see scripts/index-algolia.mjs). */
export const algoliaIndexFor = (base: string, locale: Locale) => (locale === "en" ? base : `${base}_${locale}`);

/** Matches the title, summary, or tags of the locale's articles. An empty query returns every article. */
export function localSearch(locale: Locale, value: string): Post[] {
  const term = value.trim().toLowerCase();
  const posts = getPosts(locale);
  if (!term) return posts;
  return posts.filter((post) => [post.title, post.summary, ...post.tags].some((field) => field.toLowerCase().includes(term)));
}

/** Searches Algolia when configured and maps hits back to the locale's local article metadata. */
export async function searchPosts(locale: Locale, value: string, hitsPerPage: number): Promise<Post[]> {
  if (!algoliaReady) return localSearch(locale, value);

  const response = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(algoliaIndexFor(indexName!, locale))}/query`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-algolia-application-id": appId!,
      "x-algolia-api-key": searchKey!,
    },
    body: JSON.stringify({ query: value, hitsPerPage }),
  });

  if (!response.ok) throw new Error(`Algolia search failed (${response.status}).`);
  const payload = (await response.json()) as { hits?: { objectID: string; slug?: string }[] };
  const bySlug = new Map(getPosts(locale).map((post) => [post.slug, post]));
  return (payload.hits ?? []).flatMap((hit) => {
    const post = bySlug.get(hit.slug ?? hit.objectID);
    return post ? [post] : [];
  });
}
