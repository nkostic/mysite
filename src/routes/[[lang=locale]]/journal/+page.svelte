<script lang="ts">
  import { onMount } from "svelte";
  import BlueskyMark from "$lib/BlueskyMark.svelte";
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { articleEntries, fetchBlueskyPosts, sortJournalEntries, type BlueskyPost, type JournalEntry } from "$lib/bluesky";
  import { i18n } from "$lib/i18n/state.svelte";
  import { getPosts, hasArchive } from "$lib/posts";
  import { localSearch, searchPosts } from "$lib/search";
  import { siteConfig } from "$lib/site-config";

  const locale = i18n.locale;
  const t = i18n.t;
  const posts = getPosts(locale);

  let query = "";
  let blueskyPosts: BlueskyPost[] = [];
  let results: JournalEntry[] = articleEntries(posts);
  let searching = false;
  let searchError = "";
  let timer: ReturnType<typeof setTimeout>;
  let searchInput: HTMLInputElement;

  onMount(async () => {
    if (!siteConfig.features.blueskyPostsInJournal) return;

    try {
      blueskyPosts = await fetchBlueskyPosts();
      if (!query.trim()) results = sortJournalEntries([...articleEntries(posts), ...blueskyPosts]);
    } catch {
      blueskyPosts = [];
    }
  });

  onMount(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  });

  const matchingSocial = (term: string) => blueskyPosts.filter((post) => !term || post.text.toLowerCase().includes(term));

  function queueSearch() {
    clearTimeout(timer);
    searchError = "";
    searching = true;
    timer = setTimeout(async () => {
      const term = query.trim().toLowerCase();
      try {
        const articles = term ? await searchPosts(locale, query, 50) : posts;
        results = sortJournalEntries([...articleEntries(articles), ...matchingSocial(term)]);
      } catch {
        results = sortJournalEntries([...articleEntries(localSearch(locale, query)), ...matchingSocial(term)]);
        searchError = t.common.searchUnavailable;
      } finally {
        searching = false;
      }
    }, 180);
  }
</script>

<PageHead title={`${t.journal.title} ${t.site.titleSuffix}`} description={t.journal.description} />

<header class="site-header">
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <p>{t.journal.headerLabel}</p>
  <div class="header-end"><LanguageSwitcher /><a class="back" href={i18n.path("/")}><span aria-hidden="true">←</span> {t.common.home}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <header class="intro">
    <p class="eyebrow">{t.journal.archive} / {String(results.length).padStart(2, "0")}</p>
    <h1>{t.journal.heading1}<br />{t.journal.heading2}</h1>
    <label for="journal-search">{t.journal.searchLabel}</label>
    <div class="search-row">
      <span aria-hidden="true">⌕</span>
      <input id="journal-search" bind:this={searchInput} type="search" placeholder={t.common.searchPlaceholder} bind:value={query} oninput={queueSearch} autocomplete="off" aria-keyshortcuts="Meta+K Control+K" />
      <span class="provider">{t.journal.provider}</span>
    </div>
    {#if searchError}<p class="search-error">{searchError} {t.journal.localFallback}</p>{/if}
  </header>

  <p class="sr-only" aria-live="polite">{searching ? t.common.searching : t.journal.notesFound(results.length)}</p>
  <ol class="post-list" aria-busy={searching}>
    {#each results as post, index}
      <li>
        <a href={post.url} target={post.kind === "bluesky" ? "_blank" : undefined} rel={post.kind === "bluesky" ? "noreferrer" : undefined}>
          <span class="number">{String(results.length - index).padStart(2, "0")}</span>
          <span class="copy">
            <span class="meta">{post.displayDate} · {#if post.kind === "bluesky"}<BlueskyMark size={13} /> Bluesky{:else}{post.tags.join(" / ")}{/if}</span>
            {#if post.kind === "bluesky"}
              <span class="title social-post">{post.text}</span>
              <span class="summary">@nkostic.bsky.social</span>
            {:else}
              <span class="title">{post.title}</span>
              <span class="summary">{post.summary}</span>
            {/if}
          </span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    {:else}
      <li class="empty">{t.journal.empty(query)}</li>
    {/each}
  </ol>
  {#if hasArchive}<p class="archive-link"><a href={i18n.path("/archive/")}>{t.archive.link} <span aria-hidden="true">→</span></a></p>{/if}
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
  .archive-link { margin: 28px 0 0; text-align: right; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
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
</style>
