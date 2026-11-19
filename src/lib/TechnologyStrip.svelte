<script lang="ts">
  import type { Component } from "svelte";

  type Tool = {
    name: string;
    href: string;
    icon?: Component<{ size?: number; color?: string; title?: string }>;
    mark?: string;
  };

  let { tools, label = "Technologies used" }: { tools: Tool[]; label?: string } = $props();
</script>

<nav class="tools" aria-label={label}>
  {#each tools as tool}
    <a href={tool.href} target="_blank" rel="noreferrer">
      <span class="icon" aria-hidden="true">
        {#if tool.icon}
          {@const Icon = tool.icon}
          <Icon size={25} color={tool.name === "Bluesky" ? "#1185fe" : "currentColor"} />
        {:else}
          <span class="mark">{tool.mark}</span>
        {/if}
      </span>
      <span>{tool.name}</span>
    </a>
  {/each}
</nav>

<style>
  .tools { width: calc(100% + 160px); max-width: calc(100vw - 48px); margin: 2.5rem 0 2.5rem 50%; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); border: 2px solid #0b0b0b; transform: translateX(-50%); background: #f5f4ef; font-family: Inter, Helvetica, Arial, sans-serif; }
  a { min-height: 88px; padding: 16px; display: flex; align-items: center; gap: 12px; color: #0b0b0b; text-decoration: none; font-size: 11px; font-weight: 750; line-height: 1.2; letter-spacing: .08em; text-transform: uppercase; }
  a + a { border-left: 1px solid #0b0b0b; }
  a:hover { background: #0b0b0b; color: #f5f4ef; }
  .icon { width: 30px; height: 30px; display: grid; place-items: center; flex: none; }
  .mark { font-size: 11px; font-weight: 800; letter-spacing: -.03em; }
  @media (max-width: 680px) {
    .tools { width: 100%; max-width: 100%; margin: 2rem 0; grid-template-columns: 1fr 1fr; transform: none; }
    a { min-height: 72px; padding: 12px; }
    a + a { border-left: 0; }
    a:nth-child(even) { border-left: 1px solid #0b0b0b; }
    a:nth-child(n + 3) { border-top: 1px solid #0b0b0b; }
  }
</style>
