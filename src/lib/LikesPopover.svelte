<script lang="ts">
  import { onMount } from "svelte";
  import { fetchBlueskyLikes, type BlueskyLike } from "$lib/bluesky";

  let { uri, count }: { uri: string; count: number } = $props();
  let open = $state(false);
  let loading = $state(false);
  let loaded = $state(false);
  let loadError = $state("");
  let people = $state<BlueskyLike[]>([]);
	let wrapper: HTMLDivElement;
  let trigger: HTMLButtonElement;

  const label = () => `${count} ${count === 1 ? "like" : "likes"}`;

  async function toggle() {
    open = !open;
    if (!open || loaded || loading) return;

    loading = true;
    loadError = "";
    try {
      people = await fetchBlueskyLikes(uri);
      loaded = true;
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Likes are temporarily unavailable.";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const closeOutside = (event: PointerEvent) => {
      if (open && !wrapper.contains(event.target as Node)) open = false;
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (!open || event.key !== "Escape") return;
      open = false;
      trigger.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  });
</script>

<div class="likes" bind:this={wrapper}>
  <button bind:this={trigger} type="button" aria-expanded={open} aria-haspopup="dialog" onclick={toggle}>{label()}</button>
  {#if open}
		<div class="popover" role="dialog" aria-label="People who liked this post">
      <span class="heading">Liked by</span>
      {#if loading}
        <span class="status" aria-live="polite">Loading...</span>
      {:else if loadError}
        <span class="status error" role="alert">{loadError}</span>
      {:else if people.length}
        <ul>
          {#each people as person}
            <li>
              <a href={`https://bsky.app/profile/${person.handle}`} target="_blank" rel="noreferrer">
                {#if person.avatar}
                  <img src={person.avatar} alt="" width="34" height="34" loading="lazy" />
                {:else}
                  <span class="avatar" aria-hidden="true">{person.displayName.slice(0, 1).toUpperCase()}</span>
                {/if}
                <span class="person"><strong>{person.displayName}</strong><small>@{person.handle}</small></span>
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <span class="status">No likes found.</span>
      {/if}
		</div>
	{/if}
</div>

<style>
  .likes { position: relative; display: inline-flex; }
  button { min-height: 24px; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px; cursor: pointer; }
  button:hover, button[aria-expanded="true"] { color: #0b0b0b; text-decoration-color: currentColor; }
  .popover { position: absolute; z-index: 20; left: -12px; bottom: calc(100% + 10px); width: min(290px, calc(100vw - 40px)); max-height: 310px; overflow: auto; display: block; border: 1px solid #aaa9a3; background: #fff; color: #0b0b0b; box-shadow: 0 12px 34px rgba(0, 0, 0, .12); }
  .heading { position: sticky; top: 0; display: block; padding: 12px 14px 10px; border-bottom: 1px solid #deddd7; background: #fff; font-size: 9px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  ul { margin: 0; padding: 0; list-style: none; }
  li + li { border-top: 1px solid #ecebe6; }
  a { min-height: 54px; padding: 9px 12px; display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; }
  a:hover { background: #f5f4ef; }
  img, .avatar { width: 34px; height: 34px; flex: none; border-radius: 50%; object-fit: cover; }
  .avatar { display: grid; place-items: center; background: #e7e5dd; font-weight: 750; }
  .person { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  strong, small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  strong { font-size: 12px; }
  small { color: #666; font-size: 10px; }
  .status { display: block; padding: 16px 14px; color: #666; font-size: 11px; }
  .error { color: #a42b22; }
  @media (max-width: 520px) { .popover { position: fixed; right: 20px; bottom: 20px; left: 20px; width: auto; max-height: min(360px, 60vh); } }
  @media (forced-colors: active) { .popover { border: 2px solid CanvasText; box-shadow: none; } }
</style>
