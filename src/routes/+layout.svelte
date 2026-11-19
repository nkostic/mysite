<script lang="ts">
  import "../app.css";
  import type { Component, Snippet } from "svelte";
  import { gallery } from "$lib/gallery.svelte";
  import { i18n } from "$lib/i18n/state.svelte";

  let { children }: { children: Snippet } = $props();

  // The image viewer is only downloaded the first time someone opens an image.
  let Viewer = $state<Component>();
  $effect(() => {
    if (gallery.open && !Viewer) void import("$lib/GalleryViewer.svelte").then((module) => (Viewer = module.default));
  });
</script>

<a class="skip-link" href="#main-content">{i18n.t.common.skipToContent}</a>
{@render children()}

{#if Viewer}<Viewer />{/if}

<style>
  :global(body) { min-width: 320px; }
  :global(:focus-visible) { outline: 3px solid #1185fe !important; outline-offset: 4px !important; }
  :global(main:focus) { outline: 0 !important; }
  :global(button), :global(input), :global(textarea), :global(summary) { font: inherit; }
  :global(button), :global(summary), :global(a) { -webkit-tap-highlight-color: rgba(17, 133, 254, .22); }
  :global(.gallery-trigger) { cursor: zoom-in; }
  :global(.sr-only) { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }
  .skip-link { position: fixed; z-index: 1000; top: 12px; left: 12px; padding: 12px 16px; background: #1185fe; color: #fff; font-size: 14px; font-weight: 750; text-decoration: none; transform: translateY(-180%); transition: transform .15s ease; }
  .skip-link:focus { transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    :global(html) { scroll-behavior: auto !important; }
    :global(*), :global(*::before), :global(*::after) { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
  @media (forced-colors: active) {
    :global(:focus-visible) { outline-color: Highlight !important; }
    .skip-link { background: Canvas; color: CanvasText; border: 2px solid CanvasText; }
  }
</style>
