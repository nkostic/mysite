<script lang="ts">
  let {
    src,
    href = src,
    alt,
    width,
    height,
    eager = false,
  }: {
    src: string;
    href?: string;
    alt: string;
    width?: number;
    height?: number;
    eager?: boolean;
  } = $props();

  let loaded = $state(false);
  let failed = $state(false);
</script>

<div class="media" class:loaded class:failed style:aspect-ratio={width && height ? `${width} / ${height}` : undefined}>
  {#if !failed}
    <a {href} target="_blank" rel="noreferrer" aria-label={alt ? `Open image: ${alt}` : "Open attached image"}>
      <img
        {src}
        {alt}
        {width}
        {height}
        loading={eager ? "eager" : "lazy"}
        fetchpriority={eager ? "high" : "auto"}
        onload={() => loaded = true}
        onerror={() => failed = true}
      />
    </a>
    {#if !loaded}<span class="loader" aria-hidden="true"><span></span></span>{/if}
  {:else}
    <div class="error" role="img" aria-label={alt || "Attached image could not be loaded"}>
      <span>Image unavailable</span>
    </div>
  {/if}
</div>

<style>
  .media { position: relative; min-width: 0; min-height: clamp(240px, 42vw, 620px); overflow: hidden; background: #ecebe6; }
  a { width: 100%; height: 100%; display: block; }
  img { width: 100%; height: 100%; max-height: 760px; display: block; object-fit: cover; opacity: 0; transition: opacity .22s ease; }
  .loaded img { opacity: 1; }
  .loader { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; background: #ecebe6; pointer-events: none; }
  .loader::before { content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, .72) 50%, transparent 65%); transform: translateX(-100%); animation: sweep 1.4s ease-in-out infinite; }
  .loader span { width: 24px; height: 24px; border: 2px solid #c4c3bd; border-top-color: #1185fe; border-radius: 50%; animation: spin .8s linear infinite; }
  .error { width: 100%; height: 100%; min-height: inherit; display: grid; place-items: center; background: #fff; color: #666; font-size: 10px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes sweep { to { transform: translateX(100%); } }
  @media (prefers-reduced-motion: reduce) {
    img { transition: none; }
    .loader::before, .loader span { animation: none; }
  }
  @media (forced-colors: active) {
    .loader, .error { border: 1px solid CanvasText; }
    .loader span { border-color: CanvasText; border-top-color: LinkText; }
  }
</style>
