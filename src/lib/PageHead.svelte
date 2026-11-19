<script lang="ts">
  import { page } from "$app/state";
  import { SITE_ORIGIN, locales, localeMeta, localizePath, localeFromPathname, stripLocale, type Locale } from "$lib/i18n";

  let {
    title,
    description,
    type = "website",
    noindex = false,
    available = [...locales],
  }: { title: string; description: string; type?: "website" | "article"; noindex?: boolean; available?: Locale[] } = $props();

  const locale = $derived(localeFromPathname(page.url.pathname));
  const neutralPath = $derived(stripLocale(page.url.pathname));
  const canonical = $derived(`${SITE_ORIGIN}${localizePath(locale, neutralPath)}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:locale" content={localeMeta[locale].ogLocale} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <link rel="canonical" href={canonical} />
  <link rel="alternate" type="application/rss+xml" title="RSS" href={localizePath(locale, "/feed.xml")} />
  {#if noindex}<meta name="robots" content="noindex" />{/if}
  {#if available.length > 1}
    {#each available as code}
      <link rel="alternate" hreflang={localeMeta[code].htmlLang} href={`${SITE_ORIGIN}${localizePath(code, neutralPath)}`} />
      {#if code !== locale}<meta property="og:locale:alternate" content={localeMeta[code].ogLocale} />{/if}
    {/each}
    <link rel="alternate" hreflang="x-default" href={`${SITE_ORIGIN}${localizePath("en", neutralPath)}`} />
  {/if}
</svelte:head>
