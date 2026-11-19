<script lang="ts">
  import { untrack } from "svelte";
  import { closeGallery, gallery } from "$lib/gallery.svelte";
  import { i18n } from "$lib/i18n/state.svelte";

  const MAX_SCALE = 6;
  const t = $derived(i18n.t.gallery);

  let dialog: HTMLDialogElement | undefined = $state();
  let stage: HTMLDivElement | undefined = $state();
  let figure: HTMLImageElement | undefined = $state();

  let scale = $state(1);
  let x = $state(0);
  let y = $state(0);
  let dragging = $state(false);
  let loaded = $state(false);
  let failed = $state(false);

  const item = $derived(gallery.items[gallery.index]);
  const total = $derived(gallery.items.length);
  const zoomed = $derived(scale > 1.01);

  // Open and close the native dialog from the shared state.
  $effect(() => {
    if (!dialog) return;
    if (gallery.open && !dialog.open) dialog.showModal();
    if (!gallery.open && dialog.open) dialog.close();
  });

  // Lock page scroll while the viewer is open.
  $effect(() => {
    if (!gallery.open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => { root.style.overflow = previous; };
  });

  // Reset zoom and load state for every new image, and warm the neighbours.
  $effect(() => {
    const current = item?.src;
    untrack(() => {
      reset();
      loaded = false;
      failed = false;
      // The image may already be cached and finish loading before the handler attaches.
      queueMicrotask(() => { if (figure?.complete && figure.naturalWidth > 0) loaded = true; });
    });
    if (!current) return;
    for (const offset of [1, -1]) {
      const neighbour = gallery.items[(gallery.index + offset + total) % total];
      if (neighbour && neighbour.src !== current) new Image().src = neighbour.src;
    }
  });

  function reset() {
    scale = 1;
    x = 0;
    y = 0;
  }

  function onClose() {
    // Fired for Escape, the close button, and form dialogs. Keep shared state in sync and return focus.
    if (gallery.open) closeGallery();
    const trigger = gallery.trigger;
    gallery.trigger = null;
    trigger?.focus({ preventScroll: true });
  }

  function go(step: number) {
    if (total < 2) return;
    gallery.index = (gallery.index + step + total) % total;
  }

  function limits() {
    if (!stage || !figure) return { maxX: 0, maxY: 0 };
    const box = stage.getBoundingClientRect();
    return {
      maxX: Math.max(0, (figure.offsetWidth * scale - box.width) / 2),
      maxY: Math.max(0, (figure.offsetHeight * scale - box.height) / 2),
    };
  }

  function clampPan() {
    const { maxX, maxY } = limits();
    x = Math.min(maxX, Math.max(-maxX, x));
    y = Math.min(maxY, Math.max(-maxY, y));
  }

  /** Zooms toward a point (in client coordinates) so the pixel under the cursor stays put. */
  function zoomTo(next: number, clientX?: number, clientY?: number) {
    if (!stage) return;
    const target = Math.min(MAX_SCALE, Math.max(1, next));
    if (target === scale) return;
    const box = stage.getBoundingClientRect();
    const px = (clientX ?? box.left + box.width / 2) - (box.left + box.width / 2);
    const py = (clientY ?? box.top + box.height / 2) - (box.top + box.height / 2);
    const ratio = target / scale;
    x = px - (px - x) * ratio;
    y = py - (py - y) * ratio;
    scale = target;
    if (target === 1) { x = 0; y = 0; }
    clampPan();
  }

  // Pointer gestures: drag to pan when zoomed, swipe to change image at 1x, pinch to zoom, double-tap to toggle.
  const pointers = new Map<number, { x: number; y: number }>();
  let gesture: { startX: number; startY: number; originX: number; originY: number; time: number; moved: number } | null = null;
  let pinch: { distance: number; scale: number } | null = null;
  let lastTap = { time: 0, x: 0, y: 0 };

  const distance = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  function onPointerDown(event: PointerEvent) {
    if ((event.target as Element).closest("button, a")) return;
    stage?.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      pinch = { distance: distance(), scale };
      gesture = null;
    } else if (pointers.size === 1) {
      gesture = { startX: event.clientX, startY: event.clientY, originX: x, originY: y, time: performance.now(), moved: 0 };
    }
  }

  function onPointerMove(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      zoomTo(pinch.scale * (distance() / pinch.distance), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (!gesture) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    gesture.moved = Math.max(gesture.moved, Math.hypot(dx, dy));
    if (zoomed) {
      dragging = true;
      x = gesture.originX + dx;
      y = gesture.originY + dy;
      clampPan();
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (pinch) {
      if (pointers.size < 2) pinch = null;
      gesture = null;
      return;
    }
    const current = gesture;
    gesture = null;
    dragging = false;
    if (!current) return;

    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    const elapsed = performance.now() - current.time;

    if (current.moved < 8 && elapsed < 350) {
      const now = performance.now();
      const isDouble = now - lastTap.time < 320 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 30;
      lastTap = { time: now, x: event.clientX, y: event.clientY };
      if (isDouble) {
        lastTap.time = 0;
        zoomTo(zoomed ? 1 : 2.5, event.clientX, event.clientY);
      } else if (event.target === stage && event.pointerType === "mouse") {
        // A click on the empty area around the image closes the viewer. Touch uses the close button or swipe down.
        closeGallery();
      }
      return;
    }

    if (!zoomed && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    else if (!zoomed && dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.4) closeGallery();
  }

  function onPointerCancel(event: PointerEvent) {
    pointers.delete(event.pointerId);
    gesture = null;
    pinch = null;
    dragging = false;
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002));
    zoomTo(scale * factor, event.clientX, event.clientY);
  }

  // `wheel` must be non-passive to prevent the page from scrolling behind the viewer.
  $effect(() => {
    const node = stage;
    if (!node) return;
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  });

  function onKeydown(event: KeyboardEvent) {
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        if (zoomed) { x -= 60; clampPan(); } else go(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (zoomed) { x += 60; clampPan(); } else go(-1);
        break;
      case "ArrowUp": if (zoomed) { event.preventDefault(); y += 60; clampPan(); } break;
      case "ArrowDown": if (zoomed) { event.preventDefault(); y -= 60; clampPan(); } break;
      case "PageDown": event.preventDefault(); go(1); break;
      case "PageUp": event.preventDefault(); go(-1); break;
      case "Home": event.preventDefault(); gallery.index = 0; break;
      case "End": event.preventDefault(); gallery.index = total - 1; break;
      case "+": case "=": event.preventDefault(); zoomTo(scale * 1.5); break;
      case "-": case "_": event.preventDefault(); zoomTo(scale / 1.5); break;
      case "0": event.preventDefault(); reset(); break;
    }
  }

</script>

<dialog
  bind:this={dialog}
  class="viewer"
  aria-label={t.viewer}
  onclose={onClose}
  aria-describedby="gallery-hint"
  onkeydown={onKeydown}
>
  {#if item}
    <p id="gallery-hint" class="sr-only">{t.hint}</p>
    <header class="bar">
      <p class="counter" aria-live="polite">{#if total > 1}<span class="sr-only">{t.counter(gallery.index + 1, total)}</span><span aria-hidden="true">{gallery.index + 1} / {total}</span>{/if}</p>
      <div class="tools">
        <button type="button" onclick={() => zoomTo(scale / 1.5)} disabled={!zoomed} aria-label={t.zoomOut}><span aria-hidden="true">−</span></button>
        <button type="button" onclick={() => zoomTo(scale * 1.5)} disabled={scale >= MAX_SCALE} aria-label={t.zoomIn}><span aria-hidden="true">+</span></button>
        <button type="button" onclick={reset} disabled={!zoomed && x === 0 && y === 0} aria-label={t.resetZoom}><span aria-hidden="true">1:1</span></button>
        <a href={item.src} target="_blank" rel="noreferrer">{t.openOriginal} <span aria-hidden="true">↗</span></a>
        <button type="button" class="close" onclick={closeGallery} aria-label={t.close}><span aria-hidden="true">×</span></button>
      </div>
    </header>

    <div
      class="stage"
      class:zoomed
      class:dragging
      bind:this={stage}
      role="presentation"
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerCancel}
    >
      {#key item.src}
        <img
          bind:this={figure}
          class:loaded
          src={item.src}
          alt={item.alt}
          draggable="false"
          style:transform={`translate3d(${x}px, ${y}px, 0) scale(${scale})`}
          onload={() => (loaded = true)}
          onerror={() => (failed = true)}
        />
      {/key}
      {#if !loaded && !failed}<p class="status" role="status">{t.loading}</p>{/if}
      {#if failed}<p class="status" role="alert">{t.failed}</p>{/if}

      {#if total > 1}
        <button type="button" class="nav prev" onclick={() => go(-1)} aria-label={t.previous}><span aria-hidden="true">←</span></button>
        <button type="button" class="nav next" onclick={() => go(1)} aria-label={t.next}><span aria-hidden="true">→</span></button>
      {/if}
    </div>

    <footer class="foot">
      {#if item.caption}<p class="caption">{item.caption}</p>{/if}
      {#if total > 1}
        <ul class="thumbs" aria-label={t.thumbnails}>
          {#each gallery.items as thumb, index}
            <li>
              <button type="button" onclick={() => (gallery.index = index)} aria-label={t.thumbnail(index + 1)} aria-current={index === gallery.index ? "true" : undefined}>
                <img src={thumb.thumb ?? thumb.src} alt="" loading="lazy" draggable="false" />
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </footer>
  {/if}
</dialog>

<style>
  .viewer {
    width: 100vw; max-width: none; height: 100vh; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0;
    background: #0b0b0b; color: #f5f4ef; overflow: hidden;
    font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .viewer[open] { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; animation: fade .18s ease-out; }
  .viewer::backdrop { background: rgba(0, 0, 0, .9); }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px max(16px, env(safe-area-inset-right)) 12px max(16px, env(safe-area-inset-left)); text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .counter { margin: 0; min-width: 4.5em; }
  .tools { display: flex; align-items: center; gap: 8px; }
  .tools a { color: inherit; text-decoration: none; padding: 10px 12px; border: 1px solid rgba(245, 244, 239, .35); }
  .tools a:hover { background: #f5f4ef; color: #0b0b0b; }
  button { font: inherit; color: inherit; cursor: pointer; background: transparent; border: 1px solid rgba(245, 244, 239, .35); }
  button:hover:not(:disabled) { background: #f5f4ef; color: #0b0b0b; }
  button:disabled { opacity: .35; cursor: default; }
  .tools button { min-width: 44px; height: 44px; padding: 0 10px; font-size: 16px; letter-spacing: 0; }
  .tools .close { font-size: 24px; line-height: 1; }
  .stage { position: relative; min-height: 0; overflow: hidden; display: grid; place-items: center; touch-action: none; cursor: zoom-in; user-select: none; -webkit-user-select: none; }
  .stage.zoomed { cursor: grab; }
  .stage.dragging { cursor: grabbing; }
  .stage img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; opacity: 0; transform-origin: center; transition: opacity .2s ease; will-change: transform; -webkit-user-drag: none; }
  .stage img.loaded { opacity: 1; }
  .stage.dragging img { transition: none; }
  .status { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; pointer-events: none; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .14em; }
  .nav { position: absolute; top: 50%; width: 52px; height: 52px; margin-top: -26px; font-size: 22px; background: rgba(11, 11, 11, .55); }
  .prev { left: max(12px, env(safe-area-inset-left)); }
  .next { right: max(12px, env(safe-area-inset-right)); }
  .foot { padding: 12px max(16px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); display: grid; gap: 12px; justify-items: center; }
  .caption { max-width: min(720px, 100%); margin: 0; max-height: 5.6em; overflow-y: auto; text-align: center; font-size: 14px; line-height: 1.4; color: #d7d6d0; }
  .thumbs { display: flex; gap: 6px; max-width: 100%; margin: 0; padding: 2px; list-style: none; overflow-x: auto; }
  .thumbs button { width: 56px; height: 56px; padding: 0; flex: none; opacity: .6; overflow: hidden; }
  .thumbs button[aria-current="true"] { opacity: 1; border-color: #f5f4ef; outline: 2px solid #f5f4ef; outline-offset: 1px; }
  .thumbs img { width: 100%; height: 100%; display: block; object-fit: cover; }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  @media (max-width: 680px) {
    .tools a { display: none; }
    .nav { display: none; }
  }
  @media (hover: none) { .nav { display: none; } }
  @media (prefers-reduced-motion: reduce) {
    .viewer[open] { animation: none; }
    .stage img { transition: none; }
  }
  @media (forced-colors: active) {
    .viewer { background: Canvas; color: CanvasText; }
    button, .tools a { border-color: CanvasText; }
    .thumbs button[aria-current="true"] { outline-color: Highlight; }
  }
</style>
