<script lang="ts">
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { i18n } from "$lib/i18n/state.svelte";

  const t = i18n.t;
</script>

<PageHead title={`${t.privacy.title} ${t.site.titleSuffix}`} description={t.privacy.description} noindex />

<header>
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <div class="header-end"><LanguageSwitcher /><a href={i18n.path("/bluesky/")}>{t.privacy.back}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <p class="eyebrow">AT Protocol</p>
  <h1>{t.privacy.heading}</h1>
  <div class="copy">
    <p>{t.privacy.p1}</p>
    <p>{t.privacy.p2}</p>
    <p>{t.privacy.p3}</p>
  </div>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; }
  :global(a) { color: inherit; }
  header { min-height: 84px; padding: 0 48px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  main { width: min(900px, calc(100% - 96px)); margin: 0 auto; padding: 72px 0 96px; }
  .eyebrow { margin: 0 0 20px; text-transform: uppercase; font-size: 10px; font-weight: 750; letter-spacing: .14em; }
  h1 { margin: 0 0 54px; font-size: clamp(68px, 11vw, 140px); line-height: .82; letter-spacing: -.08em; text-transform: uppercase; }
  .copy { max-width: 720px; font-size: clamp(18px, 2.5vw, 26px); line-height: 1.45; }
  @media (max-width: 680px) { header { min-height: 72px; padding: 0 18px; } main { width: calc(100% - 36px); padding: 48px 0 72px; } }
  .header-end { display: flex; align-items: center; gap: 24px; }
</style>
