<script lang="ts">
  import { page } from "$app/state";
  import { locales, localeMeta, localizePath, stripLocale } from "$lib/i18n";
  import { i18n } from "$lib/i18n/state.svelte";

  const neutralPath = $derived(stripLocale(page.url.pathname));
</script>

<nav class="switcher" aria-label={i18n.t.switcher.aria}>
  {#each locales as code, index}
    {#if index > 0}<span aria-hidden="true">/</span>{/if}
    {#if code === i18n.locale}
      <span class="current" aria-current="true" lang={localeMeta[code].htmlLang}>{code}</span>
    {:else}
      <a href={localizePath(code, neutralPath)} lang={localeMeta[code].htmlLang} hreflang={localeMeta[code].htmlLang} aria-label={localeMeta[code].label} data-sveltekit-reload>{code}</a>
    {/if}
  {/each}
</nav>

<style>
  .switcher { display: inline-flex; align-items: center; gap: 6px; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .switcher a { text-decoration: none; color: #696963; }
  .switcher a:hover { color: #0b0b0b; text-decoration: underline; text-underline-offset: 4px; }
  .current { border-bottom: 2px solid; }
</style>
