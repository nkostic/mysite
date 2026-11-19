import { i18n } from "$lib/i18n/state.svelte";

export type GalleryItem = {
  /** Full-size image shown in the viewer. */
  src: string;
  /** Small preview for the thumbnail strip. Falls back to `src`. */
  thumb?: string;
  alt: string;
  /** Optional visible caption. Empty when the alt text is only a generic description. */
  caption?: string;
};

/** Shared viewer state. One viewer is mounted in the root layout and loaded on first use. */
export const gallery = $state<{ open: boolean; items: GalleryItem[]; index: number; trigger: HTMLElement | null }>({
  open: false,
  items: [],
  index: 0,
  trigger: null,
});

export function openGallery(items: GalleryItem[], index = 0, trigger: HTMLElement | null = null) {
  if (!items.length) return;
  gallery.items = items;
  gallery.index = Math.min(Math.max(index, 0), items.length - 1);
  gallery.trigger = trigger;
  gallery.open = true;
}

export function closeGallery() {
  gallery.open = false;
}

type Options = {
  /** Which images in the container open the viewer. */
  selector?: string;
};

const MIN_SIZE = 64;

/**
 * Makes images inside a container open in the shared viewer, grouped as one gallery.
 *
 * - An image wrapped in `<a data-full="...">` opens that URL (the link stays as the no-JavaScript fallback).
 * - An image with `data-full="..."` opens that URL instead of its own `src`.
 * - `data-caption` overrides the visible caption. Otherwise the alt text is used.
 * - Images inside ordinary links and images marked `data-no-gallery` are left alone.
 *
 * Usage: `<div use:galleryImages>...</div>`
 */
export function galleryImages(node: HTMLElement, options: Options = {}) {
  const selector = options.selector ?? "img";

  const triggerFor = (img: HTMLImageElement): HTMLElement => img.closest<HTMLElement>("a[data-full]") ?? img;

  const eligible = (img: HTMLImageElement) => {
    if (img.hasAttribute("data-no-gallery")) return false;
    if (img.closest("a:not([data-full])")) return false;
    const { width, height } = img.getBoundingClientRect();
    return width === 0 && height === 0 ? true : width >= MIN_SIZE && height >= MIN_SIZE;
  };

  const images = () => [...node.querySelectorAll<HTMLImageElement>(selector)].filter(eligible);

  const itemFor = (img: HTMLImageElement): GalleryItem => ({
    src: img.dataset.full ?? img.closest<HTMLElement>("a[data-full]")?.dataset.full ?? img.currentSrc ?? img.src,
    thumb: img.currentSrc || img.src,
    alt: img.alt,
    caption: img.dataset.caption ?? img.alt,
  });

  function decorate() {
    for (const img of images()) {
      const trigger = triggerFor(img);
      trigger.classList.add("gallery-trigger");
      // A wrapping link is already focusable and labelled. A bare image needs button semantics.
      if (trigger === img && !img.hasAttribute("data-gallery-ready")) {
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", i18n.t.gallery.openImage(img.alt));
        img.setAttribute("data-gallery-ready", "");
      }
    }
  }

  function open(img: HTMLImageElement) {
    const list = images();
    const index = list.indexOf(img);
    if (index < 0) return;
    openGallery(list.map(itemFor), index, triggerFor(img));
  }

  function resolve(target: EventTarget | null): HTMLImageElement | null {
    const el = (target as Element | null)?.closest<HTMLElement>("a[data-full], img");
    if (!el) return null;
    const img = el instanceof HTMLImageElement ? el : el.querySelector<HTMLImageElement>("img");
    return img && node.contains(img) && eligible(img) && img.matches(selector) ? img : null;
  }

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const img = resolve(event.target);
    if (!img) return;
    event.preventDefault();
    open(img);
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof HTMLImageElement) || !target.hasAttribute("data-gallery-ready")) return;
    event.preventDefault();
    open(target);
  };

  node.addEventListener("click", onClick);
  node.addEventListener("keydown", onKeydown);
  const observer = new MutationObserver(decorate);
  observer.observe(node, { childList: true, subtree: true });
  decorate();
  // Layout-dependent size checks need rendered images, so decorate once more after loading.
  node.addEventListener("load", decorate, true);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
      node.removeEventListener("keydown", onKeydown);
      node.removeEventListener("load", decorate, true);
      observer.disconnect();
    },
  };
}
