<script lang="ts">
  import { onMount } from "svelte";
  import { ATPROTO_RETURN_PATH_KEY, loadAtprotoClient } from "$lib/atproto-oauth";

  let error = "";

  onMount(async () => {
    try {
      const client = await loadAtprotoClient();
      await client.init();
      const returnPath = sessionStorage.getItem(ATPROTO_RETURN_PATH_KEY) || "/journal/";
      sessionStorage.removeItem(ATPROTO_RETURN_PATH_KEY);
      window.location.replace(returnPath);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "AT Protocol sign in did not finish.";
    }
  });
</script>

<svelte:head>
  <title>AT Protocol sign in | Nenad Kostic</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main id="main-content" tabindex="-1">
  <p class="eyebrow">AT Protocol</p>
  <h1>Finishing sign in.</h1>
  {#if error}<p class="error" role="alert">{error}</p>{/if}
</main>

<style>
  :global(body) { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; }
  main { width: min(680px, calc(100% - 36px)); margin: 0 auto; padding: 18vh 0; }
  .eyebrow { font-size: 10px; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
  h1 { margin: 24px 0; font-size: clamp(48px, 9vw, 96px); line-height: .88; letter-spacing: -.07em; text-transform: uppercase; }
  .error { color: var(--danger); }
</style>
