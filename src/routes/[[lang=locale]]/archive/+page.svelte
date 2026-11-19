<script lang="ts">
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { i18n } from "$lib/i18n/state.svelte";
  import { getArchivedPosts } from "$lib/posts";

  const t = $derived(i18n.t);
  const posts = $derived(getArchivedPosts(i18n.locale));
</script>

<PageHead title={`${t.archive.title} ${t.site.titleSuffix}`} description={t.archive.description} />

<header class="site-header">
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <p>{t.archive.headerLabel}</p>
  <div class="header-end"><LanguageSwitcher /><a class="back" href={i18n.path("/journal/")}><span aria-hidden="true">←</span> {t.archive.back}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <header class="intro">
    <p class="eyebrow">{t.archive.eyebrow} / {String(posts.length).padStart(2, "0")}</p>
    <h1>{t.archive.heading}</h1>
    <p class="lede">{t.archive.intro}</p>
  </header>

  <ol class="post-list">
    {#each posts as post, index}
      <li>
        <a href={post.url}>
          <span class="number">{String(posts.length - index).padStart(2, "0")}</span>
          <span class="copy">
            <span class="meta">{post.displayDate} · {post.tags.join(" / ")}</span>
            <span class="title">{post.title}</span>
            <span class="summary">{post.summary}</span>
          </span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    {/each}
  </ol>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  :global(a) { color: inherit; }
  :global(::selection) { background: var(--ink); color: var(--on-ink); }
  .site-header { min-height: 84px; padding: 0 48px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .site-header p { margin: 0; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  .header-end { justify-self: end; display: flex; align-items: center; gap: 24px; }
  .back { text-decoration: none; }
  main { padding: 16px 48px 80px; }
  .intro { display: grid; grid-template-columns: .4fr 1.1fr .85fr; gap: 28px; align-items: end; padding: 60px 28px 50px 0; }
  .eyebrow, label, .meta, .provider { text-transform: uppercase; font-size: 10px; font-weight: 750; letter-spacing: .14em; }
  .eyebrow { align-self: start; margin: 0; }
  h1 { margin: 0; font-size: clamp(72px, 10vw, 150px); line-height: .78; letter-spacing: -.085em; text-transform: uppercase; }
  label { display: block; margin-bottom: 12px; }
  .search-row { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; border-bottom: 2px solid; }
  .search-row > span:first-child { font-size: 28px; }
  input { min-width: 0; padding: 14px 0; border: 0; background: transparent; font: inherit; font-size: 20px; }
  input::placeholder { color: var(--muted); opacity: 1; }
  .search-error { font-size: 12px; color: var(--danger); }
  .post-list { margin: 0; padding: 0; border: 2px solid; list-style: none; }
  .post-list li + li { border-top: 2px solid; }
  .post-list a { min-height: 150px; display: grid; grid-template-columns: 60px 1fr auto; gap: 24px; align-items: center; padding: 26px 30px; text-decoration: none; transition: background .16s, color .16s; }
  .post-list a:hover { background: var(--ink); color: var(--on-ink); }
  .number { align-self: start; font-size: 10px; letter-spacing: .12em; }
  .copy { display: flex; flex-direction: column; }
  .title { margin: 11px 0 8px; font-size: clamp(28px, 3.5vw, 52px); line-height: .92; letter-spacing: -.055em; font-weight: 750; }
  .title.social-post { max-width: 900px; font-size: clamp(23px, 2.8vw, 40px); line-height: 1.06; }
  .meta { display: flex; align-items: center; gap: 6px; }
  .summary { color: var(--muted); font-size: 13px; line-height: 1.4; }
  .post-list a:hover .summary { color: var(--on-ink-muted); }
  .arrow { font-size: 26px; }
  .empty { padding: 40px; }
  @media (max-width: 850px) { .intro { grid-template-columns: 1fr 1fr; } .eyebrow { grid-column: 1 / -1; } }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { padding: 8px 18px 60px; }
    .intro { grid-template-columns: 1fr; padding: 42px 0; }
    .eyebrow { grid-column: auto; }
    .post-list a { grid-template-columns: 30px 1fr auto; gap: 8px; padding: 20px 14px; }
    .summary { display: none; }
  }
  .lede { margin: 0; max-width: 360px; color: var(--muted); font-size: 14px; line-height: 1.45; }
</style>
