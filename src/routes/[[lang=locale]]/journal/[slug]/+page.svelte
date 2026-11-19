<script lang="ts">
  import type { PageData } from "./$types";
  import ArticleComments from "$lib/ArticleComments.svelte";
  import { galleryImages } from "$lib/gallery.svelte";
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { SITE_ORIGIN } from "$lib/i18n";
  import { i18n } from "$lib/i18n/state.svelte";
  import { siteConfig } from "$lib/site-config";

  let { data }: { data: PageData } = $props();
  const t = $derived(i18n.t);
  const Article = $derived(data.Article);
</script>

<PageHead title={`${data.post.title} ${t.site.titleSuffix}`} description={data.post.summary} type="article" />

<header class="site-header">
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <p>{t.article.journalLabel} / {data.post.displayDate}</p>
  <div class="header-end"><LanguageSwitcher /><a class="back" href={i18n.path("/#journal")}><span aria-hidden="true">←</span> {t.common.allNotes}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <header class="article-header">
    <p class="eyebrow">{data.post.tags.join(" · ")}</p>
    <h1>{data.post.title}</h1>
    <p class="summary">{data.post.summary}</p>
  </header>

  <article class="prose" use:galleryImages>
    <Article />
  </article>

  {#if siteConfig.features.atprotoComments}
    <ArticleComments subject={`${SITE_ORIGIN}/journal/${data.post.slug}/`} />
  {/if}
</main>

<footer>
  <a href={i18n.path("/")}>{t.site.name}</a>
  <a href={i18n.path("/#journal")}>{t.article.backToJournal} <span aria-hidden="true">↑</span></a>
</footer>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) { margin: 0; background: #f5f4ef; color: #0b0b0b; font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  :global(a) { color: inherit; }
  :global(::selection) { background: #0b0b0b; color: #fff; }
  .site-header { min-height: 84px; padding: 0 48px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .site-header p { margin: 0; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  .header-end { justify-self: end; display: flex; align-items: center; gap: 24px; }
  .back { text-decoration: none; }
  main { width: min(100% - 48px, 980px); margin: 0 auto; }
  .article-header { padding: clamp(70px, 12vw, 150px) 0 60px; border-bottom: 2px solid; }
  .eyebrow { margin: 0 0 34px; text-transform: uppercase; font-size: 11px; font-weight: 750; letter-spacing: .16em; }
  h1 { max-width: 900px; margin: 0; font-size: clamp(56px, 9vw, 126px); line-height: .84; letter-spacing: -.075em; text-transform: uppercase; }
  .summary { width: min(100%, 520px); margin: 48px 0 0 auto; font-size: clamp(18px, 2.2vw, 26px); line-height: 1.25; letter-spacing: -.025em; }
  .prose { width: min(100%, 720px); min-width: 0; margin: 0 auto; padding: 72px 0 120px; overflow-wrap: break-word; font-family: Georgia, "Times New Roman", serif; font-size: clamp(18px, 1.55vw, 21px); line-height: 1.7; }
  .prose :global(h2) { margin: 2.4em 0 .65em; font-family: Inter, sans-serif; font-size: clamp(32px, 5vw, 58px); line-height: .95; letter-spacing: -.055em; }
  .prose :global(h3) { margin-top: 2em; font-family: Inter, sans-serif; font-size: 26px; letter-spacing: -.03em; }
  .prose :global(a) { text-decoration-thickness: 1px; text-underline-offset: 4px; }
  .prose :global(img) { width: calc(100% + 160px); max-width: calc(100vw - 48px); height: auto; margin: 2.5em 0 2.5em 50%; transform: translateX(-50%); filter: saturate(.75); }
  .prose :global(iframe) { width: 100%; max-width: 100%; border: 0; aspect-ratio: 16 / 9; height: auto; }
  .prose :global(pre) { width: 100%; max-width: 100%; overflow-x: auto; padding: 24px; background: #0b0b0b; color: #f5f4ef; font: 14px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .prose :global(code) { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .85em; }
  .prose :global(:not(pre) > code) { padding: .15em .35em; background: #e7e5dd; }
  .prose :global(blockquote) { margin-left: 0; padding-left: 24px; border-left: 3px solid; font-style: italic; }
  footer { min-height: 104px; margin: 0 48px; border-top: 2px solid; display: flex; align-items: center; justify-content: space-between; text-transform: uppercase; font-size: 11px; letter-spacing: .12em; font-weight: 700; }
  footer a { text-decoration: none; }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { width: min(100% - 36px, 980px); }
    .article-header { padding-top: 70px; }
    .summary { margin-top: 34px; }
    .prose { padding: 48px 0 80px; }
    .prose :global(img) { width: 100%; max-width: 100%; margin: 2em 0; transform: none; }
    .prose :global(div) { max-width: 100%; }
    footer { margin: 0 18px; }
  }
  @media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } }
</style>
