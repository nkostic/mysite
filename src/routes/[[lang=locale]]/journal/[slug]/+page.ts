import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import { defaultLocale } from "$lib/i18n";
import { getPost, slugs } from "$lib/posts";
import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

const articles = import.meta.glob<{ default: Component }>("/src/lib/content/posts/*.md");

export const entries: EntryGenerator = () => slugs.flatMap((slug) => [{ slug }, { lang: "sr", slug }]);

export const load: PageLoad = async ({ params }) => {
  const locale = params.lang === "sr" ? "sr" : defaultLocale;
  const post = getPost(locale, params.slug);
  if (!post) error(404, "Article not found");

  const suffix = locale === defaultLocale ? "" : `.${locale}`;
  const loadArticle = articles[`/src/lib/content/posts/${params.slug}${suffix}.md`];
  if (!loadArticle) error(404, "Article not found");

  return { post, Article: (await loadArticle()).default };
};
