import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import { defaultLocale, locales } from "$lib/i18n";
import { getPost, getPosts } from "$lib/posts";
import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

const articles = import.meta.glob<{ default: Component }>("/src/lib/content/posts/*.md");

const markdownPosts = (locale: (typeof locales)[number]) =>
  getPosts(locale).filter((post) => articles[`/src/lib/content/posts/${post.slug}${locale === defaultLocale ? "" : `.${locale}`}.md`]);

export const entries: EntryGenerator = () =>
  locales.flatMap((locale) => markdownPosts(locale).map((post) => (locale === defaultLocale ? { slug: post.slug } : { lang: locale, slug: post.slug })));

export const load: PageLoad = async ({ params }) => {
  const locale = params.lang === "sr" ? "sr" : defaultLocale;
  const post = getPost(locale, params.slug);
  if (!post) error(404, "Article not found");

  const suffix = locale === defaultLocale ? "" : `.${locale}`;
  const loadArticle = articles[`/src/lib/content/posts/${params.slug}${suffix}.md`];
  if (!loadArticle) error(404, "Article not found");

  return {
    post,
    Article: (await loadArticle()).default,
    available: locales.filter((code) => getPost(code, params.slug)),
  };
};
