<script lang="ts">
  import { onMount } from "svelte";
  import { i18n } from "$lib/i18n/state.svelte";

  let theme = $state<"light" | "dark">("light");

  function apply(next: "light" | "dark", persist: boolean) {
    theme = next;
    document.documentElement.dataset.theme = next;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute("content", next === "dark" ? "#0e0e0d" : "#f5f4ef");
      meta.removeAttribute("media");
    }
    if (!persist) return;
    try { localStorage.setItem("theme", next); } catch { /* storage unavailable: the choice lasts for this visit only */ }
  }

  onMount(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    let saved: string | null = null;
    try { saved = localStorage.getItem("theme"); } catch { /* ignore */ }
    theme = saved === "light" || saved === "dark" ? saved : media.matches ? "dark" : "light";
    // Until the visitor chooses, keep following the system setting.
    const follow = (event: MediaQueryListEvent) => {
      let chosen: string | null = null;
      try { chosen = localStorage.getItem("theme"); } catch { /* ignore */ }
      if (!chosen) theme = event.matches ? "dark" : "light";
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  });

  const label = $derived(theme === "dark" ? i18n.t.theme.toLight : i18n.t.theme.toDark);
</script>

<button type="button" class="theme-toggle" aria-label={label} title={label} onclick={() => apply(theme === "dark" ? "light" : "dark", true)}>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if theme === "dark"}
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    {:else}
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    {/if}
  </svg>
</button>

<style>
  .theme-toggle { width: 34px; height: 34px; display: inline-grid; place-items: center; padding: 0; border: 0; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; }
  .theme-toggle:hover { background: var(--ink); color: var(--on-ink); }
</style>
