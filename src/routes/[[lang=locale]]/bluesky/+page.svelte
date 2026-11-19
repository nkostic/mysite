<script lang="ts">
  import { onMount } from "svelte";
  import BlueskyMark from "$lib/BlueskyMark.svelte";
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { BLUESKY_HANDLE, BLUESKY_PROFILE_URL, fetchBlueskyPosts, type BlueskyPost } from "$lib/bluesky";
  import { formatDate } from "$lib/i18n";
  import { i18n } from "$lib/i18n/state.svelte";
  import { siteConfig } from "$lib/site-config";

  const locale = i18n.locale;
  const t = i18n.t;

  let posts: BlueskyPost[] = [];
  let loading: boolean = siteConfig.features.blueskyPage;
  let loadError = "";

  onMount(async () => {
    if (!siteConfig.features.blueskyPage) {
      loading = false;
      return;
    }

    try {
      posts = await fetchBlueskyPosts();
    } catch {
      loadError = t.bluesky.loadFailed;
    } finally {
      loading = false;
    }
  });
</script>

<PageHead title={`${t.bluesky.title} ${t.site.titleSuffix}`} description={t.bluesky.description} />

<header class="site-header">
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <p>Bluesky / @{BLUESKY_HANDLE}</p>
  <div class="header-end"><LanguageSwitcher /><a class="back" href={i18n.path("/")}><span aria-hidden="true">←</span> {t.common.home}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <header class="intro">
    <p class="eyebrow"><BlueskyMark size={18} /> {t.bluesky.shortPosts}</p>
    <h1>{t.bluesky.heading1}<br />{t.bluesky.heading2}</h1>
    <div class="profile-copy">
      <p>{t.bluesky.blurb}</p>
      <a href={BLUESKY_PROFILE_URL} target="_blank" rel="me noreferrer">{t.bluesky.viewProfile(BLUESKY_HANDLE)} <span aria-hidden="true">↗</span></a>
    </div>
  </header>

  {#if !siteConfig.features.blueskyPage}
    <p class="status">{t.bluesky.unavailable}</p>
  {:else if loading}
    <p class="status" aria-live="polite">{t.bluesky.loading}</p>
  {:else if loadError}
    <div class="status" role="alert">
      <p>{loadError}</p>
      <a href={BLUESKY_PROFILE_URL}>{t.bluesky.readOnBluesky} <span aria-hidden="true">↗</span></a>
    </div>
  {:else}
    <ol class="post-list" aria-label={t.bluesky.listAria}>
      {#each posts as post, index}
        <li class="post">
          <a class="post-link" href={post.localUrl}>
            <span class="number">{String(posts.length - index).padStart(2, "0")}</span>
            <span class="copy">
              <span class="meta"><BlueskyMark size={13} /> <time datetime={post.date}>{formatDate(locale, post.date)}</time></span>
              <span class="text">{post.text}</span>
              <span class="read-post">{t.bluesky.readPost} <span aria-hidden="true">→</span></span>
            </span>
          </a>
        </li>
      {:else}
        <li class="status">{t.bluesky.none}</li>
      {/each}
    </ol>
  {/if}
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f5f4ef; color: #0b0b0b; font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  :global(a) { color: inherit; }
  :global(::selection) { background: #1185fe; color: #fff; }
  .site-header { min-height: 84px; padding: 0 48px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .site-header p { margin: 0; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  .header-end { justify-self: end; display: flex; align-items: center; gap: 24px; }
  .back { text-decoration: none; }
  main { padding: 16px 48px 80px; }
  .intro { display: grid; grid-template-columns: .42fr 1.1fr .62fr; gap: 28px; align-items: end; padding: 64px 28px 58px 0; }
  .eyebrow, .meta { text-transform: uppercase; font-size: 10px; font-weight: 750; letter-spacing: .14em; }
  .eyebrow { align-self: start; margin: 0; display: flex; align-items: center; gap: 8px; }
  h1 { margin: 0; font-size: clamp(68px, 9.5vw, 142px); line-height: .8; letter-spacing: -.085em; text-transform: uppercase; }
  .profile-copy { font-size: 18px; line-height: 1.35; }
  .profile-copy p { margin: 0 0 24px; }
  .profile-copy a, .status a { font-size: 10px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; text-underline-offset: 4px; }
  .post-list { margin: 0; padding: 0; border: 2px solid; list-style: none; }
  .post-list li + li { border-top: 2px solid; }
  .post-link { min-height: 148px; display: grid; grid-template-columns: 60px 1fr; gap: 24px; align-items: start; padding: 28px 30px; text-decoration: none; transition: background .16s, color .16s; }
  .post-link:hover { background: #0b0b0b; color: #fff; }
  .number { font-size: 10px; letter-spacing: .12em; }
  .copy { display: flex; flex-direction: column; gap: 14px; }
  .meta { display: flex; align-items: center; gap: 7px; }
  .text { max-width: 900px; white-space: pre-wrap; font-size: clamp(23px, 2.8vw, 40px); line-height: 1.08; letter-spacing: -.035em; font-weight: 700; }
  .read-post { width: fit-content; font-size: 10px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; text-decoration: underline; text-underline-offset: 4px; }
  .status { margin: 0; padding: 36px; border: 2px solid; font-size: 18px; }
  .status p { margin-top: 0; }
  @media (max-width: 850px) { .intro { grid-template-columns: 1fr 1fr; } .eyebrow { grid-column: 1 / -1; } }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { padding: 8px 18px 60px; }
    .intro { grid-template-columns: 1fr; padding: 42px 0; }
    .eyebrow { grid-column: auto; }
    h1 { font-size: clamp(58px, 19vw, 86px); }
    .post-link { grid-template-columns: 28px 1fr; gap: 8px; padding: 20px 14px; }
    .text { font-size: 22px; }
  }
</style>
