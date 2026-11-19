<script lang="ts">
  import { onMount } from "svelte";

  let { chart, label }: { chart: string; label: string } = $props();
  let container: HTMLDivElement;
  let failed = $state(false);

  async function renderDiagram() {
    try {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        themeVariables: {
          background: "#f5f4ef",
          primaryColor: "#f5f4ef",
          primaryTextColor: "#0b0b0b",
          primaryBorderColor: "#0b0b0b",
          lineColor: "#0b0b0b",
          secondaryColor: "#e7e5dd",
          tertiaryColor: "#f5f4ef",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
        },
      });
      const id = `mermaid-${crypto.randomUUID()}`;
      const { svg, bindFunctions } = await mermaid.render(id, chart);
      container.innerHTML = svg;
      bindFunctions?.(container);
    } catch {
      failed = true;
    }
  }

  onMount(() => {
    if (!("IntersectionObserver" in window)) {
      void renderDiagram();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void renderDiagram();
    }, { rootMargin: "200px" });
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div class="diagram" class:failed role="img" aria-label={label} bind:this={container}>
  <noscript><pre>{chart}</pre></noscript>
  {#if failed}<pre>{chart}</pre>{/if}
</div>

<style>
  .diagram { width: calc(100% + 160px); max-width: calc(100vw - 48px); min-height: 250px; margin: 3rem 0 3rem 50%; padding: 24px; border: 2px solid #0b0b0b; transform: translateX(-50%); overflow-x: auto; background: #f5f4ef; }
  .diagram :global(svg) { display: block; width: 100%; height: auto; margin: 0 auto; }
  .diagram.failed { min-height: 0; }
  pre { margin: 0; white-space: pre-wrap; font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
  @media (max-width: 680px) { .diagram { width: 100%; max-width: 100%; min-height: 190px; margin: 2rem 0; padding: 12px; transform: none; } }
</style>
