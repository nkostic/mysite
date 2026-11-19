<script lang="ts">
  import LanguageSwitcher from "$lib/LanguageSwitcher.svelte";
  import PageHead from "$lib/PageHead.svelte";
  import { i18n } from "$lib/i18n/state.svelte";

  const t = i18n.t;
</script>

<PageHead title={`${t.about.title} ${t.site.titleSuffix}`} description={t.about.description} />

<header class="site-header">
  <a class="mark" href={i18n.path("/")} aria-label={t.common.homeAria}>NK</a>
  <p>{t.about.headerLabel}</p>
  <div class="header-end"><LanguageSwitcher /><a class="back" href={i18n.path("/")}><span aria-hidden="true">←</span> {t.common.home}</a></div>
</header>

<main id="main-content" tabindex="-1">
  <header class="intro">
    <p class="eyebrow">{t.about.eyebrow}</p>
    <h1>{t.about.heading1}<br />{t.about.heading2}</h1>
    <img src="/nenadkostic-2023.jpeg" alt={t.about.photoAlt} width="640" height="800" />
  </header>

  <section class="story" aria-labelledby="story-title">
    <h2 id="story-title">{t.about.storyHeading}</h2>
    <div class="copy">
      <p>{t.about.story1}</p>
      <p>{t.about.story2}</p>
    </div>
  </section>

  <ol class="timeline" aria-label={t.about.timelineAria}>
    {#each t.about.timeline as item}
      <li><span>{item.when}</span><div><h3>{item.company}</h3><p>{item.text}</p></div></li>
    {/each}
  </ol>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  :global(a) { color: inherit; }
  .site-header { min-height: 84px; padding: 0 48px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .site-header p { margin: 0; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  .header-end { justify-self: end; display: flex; align-items: center; gap: 24px; }
  .back { text-decoration: none; }
  main { padding: 16px 48px 100px; }
  .intro { min-height: 610px; display: grid; grid-template-columns: .42fr 1.15fr .55fr; gap: 24px; align-items: center; }
  .eyebrow { align-self: start; margin: 40px 0 0; text-transform: uppercase; font-size: 11px; font-weight: 750; letter-spacing: .16em; }
  h1 { margin: 0; font-size: clamp(70px, 9.5vw, 150px); line-height: .8; letter-spacing: -.085em; text-transform: uppercase; }
  .intro img { width: 100%; height: 520px; object-fit: cover; filter: grayscale(1) contrast(1.08); }
  .story { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; padding: 80px 0; border-top: 2px solid; }
  .story h2 { max-width: 650px; margin: 0; font-size: clamp(42px, 6vw, 86px); line-height: .92; letter-spacing: -.065em; text-transform: uppercase; }
  .copy { max-width: 540px; font-size: clamp(20px, 2vw, 29px); line-height: 1.25; letter-spacing: -.025em; }
  .copy p:first-child { margin-top: 0; }
  .timeline { margin: 0; padding: 0; border: 2px solid; list-style: none; }
  .timeline li { display: grid; grid-template-columns: .35fr 1fr; gap: 30px; padding: 30px; }
  .timeline li + li { border-top: 2px solid; }
  .timeline > li > span { text-transform: uppercase; font-size: 10px; font-weight: 750; letter-spacing: .14em; }
  .timeline h3 { margin: 0 0 8px; font-size: clamp(28px, 3vw, 46px); line-height: 1; letter-spacing: -.05em; }
  .timeline p { max-width: 650px; margin: 0; color: var(--muted); line-height: 1.45; }
  @media (max-width: 850px) { .intro { grid-template-columns: 1fr 1fr; } .eyebrow { grid-column: 1 / -1; } }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { padding: 8px 18px 70px; }
    .intro { grid-template-columns: 1fr; padding: 28px 0 8px; }
    .eyebrow { grid-column: auto; margin: 0; }
    .intro img { height: 420px; }
    .story { grid-template-columns: 1fr; padding: 60px 0; }
    .timeline li { grid-template-columns: 70px 1fr; padding: 22px 16px; gap: 10px; }
  }
</style>
