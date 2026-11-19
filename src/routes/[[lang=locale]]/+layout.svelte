<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";

  let { children }: { children: Snippet } = $props();
</script>

<!-- Remount the page tree when the locale changes (for example with browser back/forward). -->
{#key page.params.lang ?? "en"}
  {@render children()}
{/key}
