<script lang="ts">
  import { onMount } from "svelte";
  import BlueskyMark from "$lib/BlueskyMark.svelte";
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { articleEntries, fetchBlueskyPosts, sortJournalEntries, type JournalEntry } from "$lib/bluesky";
  import { i18n } from "$lib/i18n/state.svelte";
  import { getPosts, type Post } from "$lib/posts";
  import { localSearch, searchPosts } from "$lib/search";
  import { siteConfig } from "$lib/site-config";

  const locale = i18n.locale;
  const t = i18n.t;
  const posts = getPosts(locale);

  let feed: JournalEntry[] = articleEntries(posts);
  let query = "";
  let results: Post[] = [];
  let searching = false;
  let searchError = "";
  let timer: ReturnType<typeof setTimeout>;
  let searchInput: HTMLInputElement;

  onMount(async () => {
    if (!siteConfig.features.blueskyPostsInJournal) return;

    try {
      feed = sortJournalEntries([...articleEntries(posts), ...await fetchBlueskyPosts()]);
    } catch {
      feed = articleEntries(posts);
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

  function queueSearch() {
    clearTimeout(timer);
    searchError = "";
    if (!query.trim()) {
      results = [];
      searching = false;
      return;
    }

    searching = true;
    timer = setTimeout(async () => {
      try {
        results = (await searchPosts(locale, query, 6)).slice(0, 6);
      } catch {
        results = localSearch(locale, query);
        searchError = t.common.searchUnavailable;
      } finally {
        searching = false;
      }
    }, 180);
  }
</script>

<PageHead title={t.site.title} description={t.site.description} />

<header class="site-header">
  <a class="mark" href="#main-content" aria-label={t.common.homeAria}>NK</a>
  <p>{t.home.role}</p>
  <nav class="header-links" aria-label={t.home.primaryNav}>
    <a href="#journal">{t.home.journal} <span aria-hidden="true">↓</span></a>
    {#if siteConfig.features.blueskyPage}<a href={i18n.path("/bluesky/")}>{t.home.bluesky} <span aria-hidden="true">↗</span></a>{/if}
    <LanguageSwitcher />
  </nav>
</header>

<main id="main-content" tabindex="-1">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">{t.home.eyebrow}</p>
      <h1 id="hero-title">{t.home.heroLine1} <span>&amp;</span><br />{t.home.heroLine2}</h1>
      <p class="hero-note">{t.home.heroNote}</p>
    </div>

    <aside class="profile" aria-label={t.home.aboutAria}>
      <img
        src="/nenadkostic-2023.jpeg"
        alt={t.home.photoAlt}
        width="640"
        height="800"
      />
      <div>
        <p class="eyebrow light">{t.home.aboutLabel}</p>
        <p class="intro">{t.home.intro}</p>
        <p class="profile-detail">{t.home.currently} <a href={i18n.path("/about/")}>{t.home.moreAbout}</a></p>
      </div>
    </aside>
  </section>

  <section class="journal" id="journal" aria-labelledby="journal-title">
    <div class="search-panel">
      <p class="eyebrow light">{t.home.searchEyebrow}</p>
      <h2 id="journal-title">{t.home.searchHeading}</h2>
      <div class="search-box">
        <label for="article-search">{t.home.searchLabel}</label>
        <div class="input-row">
          <span aria-hidden="true">⌕</span>
          <input
            id="article-search"
            bind:this={searchInput}
            type="search"
            placeholder={t.common.searchPlaceholder}
            bind:value={query}
            oninput={queueSearch}
            autocomplete="off"
            aria-keyshortcuts="Meta+K Control+K"
          />
          <kbd>⌘ K</kbd>
        </div>
      </div>

      <div class="search-results" aria-live="polite" aria-busy={searching}>
        {#if searching}
          <p class="search-status">{t.common.searching}</p>
        {:else if query.trim() && results.length}
          <ul>
            {#each results as result}
              <li>
                <a href={result.url}>
                  <span>{result.title}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            {/each}
          </ul>
        {:else if query.trim()}
          <p class="search-status">{t.home.noResults(query)}</p>
        {/if}
        {#if searchError}
          <p class="search-error">{searchError} {t.home.localFallback}</p>
        {/if}
      </div>
    </div>

    <div class="posts-panel">
      <div class="section-heading">
        <p class="eyebrow">{t.home.latestEyebrow}</p>
        <a href={i18n.path("/journal/")}>{t.common.allNotes} <span aria-hidden="true">↗</span></a>
      </div>

      <ol class="post-list">
        {#each feed.slice(0, 3) as post, index}
          <li>
            <a href={post.url} target={post.kind === "bluesky" ? "_blank" : undefined} rel={post.kind === "bluesky" ? "noreferrer" : undefined}>
              <span class="post-number">{String(feed.length - index).padStart(2, "0")}</span>
              <span class="post-copy">
                <span class="post-meta"><time datetime={post.date}>{post.displayDate}</time> · {#if post.kind === "bluesky"}<BlueskyMark size={13} /> Bluesky{:else}{post.tags[0]}{/if}</span>
                {#if post.kind === "bluesky"}
                  <span class="post-title social-post">{post.text}</span>
                  <span class="post-summary">@nkostic.bsky.social</span>
                {:else}
                  <span class="post-title">{post.title}</span>
                  <span class="post-summary">{post.summary}</span>
                {/if}
              </span>
              <span class="post-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        {/each}
      </ol>
    </div>
  </section>
</main>

<footer>
  <p>{t.home.elsewhere}</p>
  <nav aria-label={t.home.socialAria}>
    <a href="https://bsky.app/profile/nkostic.bsky.social" rel="me">Bluesky <span aria-hidden="true">↗</span></a>
    <a href="https://x.com/Nesha8x8" rel="me">X <span aria-hidden="true">↗</span></a>
    <a href="https://github.com/nkostic" rel="me">GitHub <span aria-hidden="true">↗</span></a>
    <a href="https://www.linkedin.com/in/nenadkostic/" rel="me">LinkedIn <span aria-hidden="true">↗</span></a>
    <a href="https://www.instagram.com/bitjoggler/" rel="me">Instagram <span aria-hidden="true">↗</span></a>
    <a href="https://www.strava.com/athletes/80778536" rel="me">Strava <span aria-hidden="true">↗</span></a>
  </nav>
  <p class="copyright">© {new Date().getFullYear()} NK</p>
</footer>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :global(a) { color: inherit; }
  :global(::selection) { background: var(--ink); color: var(--on-ink); }

  .site-header {
    min-height: 84px;
    padding: 0 48px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-bottom: 2px solid var(--ink);
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .12em;
  }
  .site-header p { margin: 0; }
  .mark {
    width: 42px;
    height: 42px;
    border: 2px solid;
    border-radius: 50%;
    display: grid;
    place-items: center;
    text-decoration: none;
    letter-spacing: -.05em;
  }
  .header-links { justify-self: end; display: flex; gap: 18px; }
  .header-links a { text-decoration: none; }
  .header-links span { margin-left: 5px; }

  main { padding: 16px 48px 0; }
  .hero, .journal { display: grid; grid-template-columns: 1.18fr .82fr; gap: 16px; }
  .hero { min-height: 530px; }
  .hero-copy {
    padding: 38px 28px 32px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    font-size: 11px;
    line-height: 1.2;
    font-weight: 750;
    letter-spacing: .16em;
  }
  .eyebrow.light { color: var(--on-ink-muted); }
  h1 {
    margin: 32px 0;
    font-size: clamp(72px, 9vw, 150px);
    line-height: .79;
    letter-spacing: -.085em;
    text-transform: uppercase;
    font-weight: 800;
  }
  h1 span { font-weight: 300; }
  .hero-note {
    max-width: 490px;
    margin: 0 0 0 42%;
    font-size: clamp(18px, 1.5vw, 24px);
    line-height: 1.25;
    letter-spacing: -.025em;
  }
  .profile {
    background: var(--ink);
    color: var(--on-ink);
    padding: 18px;
    display: grid;
    grid-template-columns: minmax(140px, .82fr) 1fr;
    gap: 26px;
  }
  .profile img {
    width: 100%;
    height: 100%;
    min-height: 390px;
    object-fit: cover;
    filter: grayscale(1) contrast(1.08);
  }
  .profile > div { display: flex; flex-direction: column; justify-content: space-between; padding: 18px 6px 10px 0; }
  .intro { margin: auto 0; font-size: clamp(19px, 1.6vw, 27px); line-height: 1.08; letter-spacing: -.04em; }
  .profile-detail { color: var(--on-ink-muted); font-size: 13px; line-height: 1.45; margin: 0; }
  .profile-detail a { text-underline-offset: 3px; }

  .journal { margin-top: 16px; align-items: stretch; }
  .search-panel { min-height: 460px; padding: 36px; background: var(--ink); color: var(--on-ink); }
  .search-panel h2 { margin: 70px 0 30px; font-size: clamp(42px, 4.5vw, 72px); line-height: .95; letter-spacing: -.06em; }
  .search-box label { display: block; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: var(--on-ink-muted); }
  .input-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; border-bottom: 2px solid var(--on-ink); }
  .input-row > span { font-size: 30px; transform: translateY(-2px); }
  input {
    width: 100%;
    padding: 15px 0 17px;
    border: 0;
    background: transparent;
    color: var(--on-ink);
    font: inherit;
    font-size: clamp(18px, 2vw, 28px);
  }
  input::placeholder { color: var(--on-ink-placeholder); opacity: 1; }
  kbd { border: 1px solid var(--on-ink-line-2); border-radius: 3px; padding: 5px 7px; color: var(--on-ink-muted); font-family: inherit; font-size: 10px; }
  .search-results { margin-top: 14px; min-height: 88px; }
  .search-results ul { list-style: none; padding: 0; margin: 0; }
  .search-results li + li { border-top: 1px solid var(--on-ink-line); }
  .search-results a { padding: 10px 0; display: flex; justify-content: space-between; text-decoration: none; }
  .search-results a:hover span:first-child { text-decoration: underline; text-underline-offset: 4px; }
  .search-status, .search-error { color: var(--on-ink-muted); font-size: 13px; }
  .search-error { color: var(--danger-on-ink); }

  .posts-panel { border: 2px solid var(--ink); }
  .section-heading { min-height: 84px; padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid; }
  .section-heading a { font-size: 12px; text-transform: uppercase; letter-spacing: .1em; text-decoration: none; }
  .post-list { list-style: none; margin: 0; padding: 0; }
  .post-list li + li { border-top: 2px solid; }
  .post-list a { min-height: 124px; display: grid; grid-template-columns: 42px 1fr auto; gap: 16px; padding: 20px 24px; text-decoration: none; transition: background .16s, color .16s; }
  .post-list a:hover { background: var(--ink); color: var(--on-ink); }
  .post-number, .post-meta { font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }
  .post-meta { display: flex; align-items: center; gap: 6px; }
  .post-copy { display: flex; flex-direction: column; }
  .post-title { margin: 8px 0 5px; font-size: clamp(19px, 1.7vw, 27px); line-height: 1; letter-spacing: -.04em; font-weight: 700; }
  .post-title.social-post { font-size: clamp(18px, 1.55vw, 24px); line-height: 1.08; }
  .post-summary { color: var(--muted); font-size: 12px; line-height: 1.35; }
  .post-list a:hover .post-summary { color: var(--on-ink-muted); }
  .post-arrow { align-self: center; font-size: 22px; }

  footer { margin: 16px 48px 0; min-height: 104px; border-top: 2px solid; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; text-transform: uppercase; font-size: 11px; letter-spacing: .12em; font-weight: 700; }
  footer nav { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  footer nav a { min-height: 44px; border: 1.5px solid; border-radius: 999px; padding: 10px 14px; display: inline-flex; align-items: center; text-decoration: none; }
  footer nav a:hover { background: var(--ink); color: var(--on-ink); }
  .copyright { justify-self: end; }

  @media (max-width: 1100px) {
    .hero, .journal { grid-template-columns: 1fr; }
    .hero-copy { min-height: 460px; }
    .profile { min-height: 440px; }
    .hero-note { margin-left: 50%; }
  }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { padding: 8px 18px 0; }
    .hero, .journal { gap: 8px; }
    .hero-copy { min-height: 410px; padding: 26px 0; }
    h1 { font-size: clamp(62px, 20vw, 92px); }
    .hero-note { margin-left: 24%; }
    .profile { grid-template-columns: 1fr; padding: 12px; }
    .profile img { height: 380px; min-height: 0; }
    .profile > div { min-height: 280px; padding: 16px 6px 8px; }
    .search-panel { min-height: 410px; padding: 28px 20px; }
    .search-panel h2 { margin-top: 55px; }
    .post-list a { padding: 18px 16px; grid-template-columns: 28px 1fr auto; gap: 8px; }
    footer { margin: 8px 18px 0; padding: 28px 0; grid-template-columns: 1fr; text-align: center; }
    .copyright { justify-self: center; }
  }
  @media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } }
</style>
