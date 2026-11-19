<script lang="ts">
  import BlueskyMark from "$lib/BlueskyMark.svelte";

  let { handle, displayName }: { handle: string; displayName: string } = $props();
</script>

<a class="profile-tile" href={`https://bsky.app/profile/${handle}`} target="_blank" rel="noreferrer" aria-label={`View ${displayName} on Bluesky`}>
  <BlueskyMark size={42} />
  <span class="copy">
    <strong>{displayName}</strong>
    <span>@{handle}</span>
  </span>
  <span class="action">View profile <span aria-hidden="true">↗</span></span>
</a>

<style>
  .profile-tile { min-height: clamp(240px, 42vw, 620px); padding: clamp(28px, 5vw, 58px); display: flex; flex-direction: column; justify-content: space-between; gap: 36px; background: var(--surface); color: var(--ink); text-decoration: none; }
  .profile-tile:hover { background: var(--paper); }
  .copy { display: flex; flex-direction: column; gap: 6px; }
  strong { font-size: clamp(28px, 4vw, 52px); line-height: .95; letter-spacing: -.045em; }
  .copy > span { color: var(--muted-strong); font-size: 13px; }
  .action { align-self: flex-start; padding-bottom: 4px; border-bottom: 1px solid; font-size: 9px; font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
  @media (forced-colors: active) { .profile-tile { border: 1px solid CanvasText; } }
</style>
