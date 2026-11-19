<script lang="ts">
  import { i18n } from "$lib/i18n/state.svelte";

  const t = $derived(i18n.t.composer);

  let {
    open = $bindable(false),
    ready,
    loading,
    signedInHandle = "",
    error = "",
    publishing = false,
    published = false,
    summary = "Write a response",
    heading = "Publish with AT Protocol",
    signedOutCopy = "Sign in with your AT Protocol handle to continue. Your password stays with your provider.",
    textLabel = "Your response",
    submitLabel = "Publish",
    successMessage = "Published.",
    maxLength = 300,
    idPrefix = "atproto-composer",
    onopen,
    onsignin,
    onsignout,
    onpublish,
  }: {
    open?: boolean;
    ready: boolean;
    loading: boolean;
    signedInHandle?: string;
    error?: string;
    publishing?: boolean;
    published?: boolean;
    summary?: string;
    heading?: string;
    signedOutCopy?: string;
    textLabel?: string;
    submitLabel?: string;
    successMessage?: string;
    maxLength?: number;
    idPrefix?: string;
    onopen: () => void | Promise<void>;
    onsignin: (handle: string) => void | Promise<void>;
    onsignout: () => void | Promise<void>;
    onpublish: (text: string) => boolean | void | Promise<boolean | void>;
  } = $props();

  let handle = $state("");
  let text = $state("");

  function handleToggle() {
    if (open) void onopen();
  }

  function handleSignIn(event: SubmitEvent) {
    event.preventDefault();
    const value = handle.trim().replace(/^@/, "");
    if (value) void onsignin(value);
  }

  async function handlePublish(event: SubmitEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    const didPublish = await onpublish(value);
    if (didPublish !== false) text = "";
  }
</script>

<details class="composer" bind:open ontoggle={handleToggle}>
  <summary>
    <span class="summary-mark" aria-hidden="true"></span>
    <span>{summary}</span>
    <span class="summary-action" aria-hidden="true">{open ? t.close : t.open}</span>
  </summary>

  <div class="panel">
    <header>
      <p class="kicker">{t.kicker}</p>
      <h2>{heading}</h2>
    </header>

    {#if signedInHandle}
      <form onsubmit={handlePublish}>
        <div class="session">
          <span><span class="online" aria-hidden="true"></span> {t.signedInAs} <strong>@{signedInHandle}</strong></span>
          <button class="text-button" type="button" onclick={onsignout}>{t.signOut}</button>
        </div>
        <label for={`${idPrefix}-text`}>{textLabel}</label>
        <textarea id={`${idPrefix}-text`} bind:value={text} maxlength={maxLength} rows="4" required></textarea>
        <div class="actions">
          <span aria-live="polite">{text.length}/{maxLength}</span>
          <button class="primary" type="submit" disabled={publishing || !text.trim()}>
            {publishing ? t.publishing : submitLabel}
          </button>
        </div>
        {#if published}<p class="success" aria-live="polite">{successMessage}</p>{/if}
      </form>
    {:else if ready}
      <form onsubmit={handleSignIn}>
        <p class="intro">{signedOutCopy}</p>
        <label for={`${idPrefix}-handle`}>{t.yourHandle}</label>
        <div class="handle-row">
          <input id={`${idPrefix}-handle`} bind:value={handle} placeholder="name.bsky.social" autocomplete="username" autocapitalize="none" spellcheck="false" required />
          <button class="primary" type="submit">{t.continue}</button>
        </div>
        <p class="privacy">{t.privacy}</p>
      </form>
    {:else if loading && !error}
      <p class="loading" aria-live="polite">{t.preparing}</p>
    {/if}

    {#if error}<p class="error" role="alert">{error}</p>{/if}
  </div>
</details>

<style>
  .composer { border-top: 1px solid #cecdc7; background: #faf9f5; }
  summary { min-height: 54px; padding: 0 28px; display: grid; grid-template-columns: auto 1fr auto; gap: 11px; align-items: center; cursor: pointer; color: #333; font-size: 11px; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }
  summary::-webkit-details-marker { display: none; }
  summary::marker { content: ""; }
  .summary-mark { width: 7px; height: 7px; border-radius: 50%; background: #1185fe; }
  .summary-action { color: #777; font-size: 9px; }
  .panel { padding: clamp(22px, 4vw, 36px) 28px 30px; border-top: 1px solid #cecdc7; }
  header { display: grid; grid-template-columns: minmax(100px, .32fr) 1fr; gap: 20px; align-items: baseline; margin-bottom: 30px; }
  .kicker { margin: 0; color: #666; font-size: 9px; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
  h2 { margin: 0; font-size: clamp(24px, 3vw, 38px); line-height: 1; letter-spacing: -.04em; }
  form { margin-left: calc(.32 * (100% - 20px) + 20px); max-width: 680px; }
  .intro { margin: 0 0 22px; max-width: 560px; color: #444; font-size: 14px; line-height: 1.55; }
  label { display: block; margin-bottom: 8px; font-size: 9px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  input, textarea { width: 100%; border: 1px solid #8d8c86; border-radius: 0; background: #fff; color: #0b0b0b; font: inherit; }
  input { min-height: 46px; padding: 0 13px; }
  textarea { min-height: 128px; padding: 13px; resize: vertical; line-height: 1.5; }
  .handle-row { display: grid; grid-template-columns: 1fr auto; }
  button { font: inherit; }
  .primary { min-height: 46px; padding: 0 19px; border: 1px solid #0b0b0b; background: #0b0b0b; color: #fff; font-size: 10px; font-weight: 750; letter-spacing: .05em; cursor: pointer; }
  .primary:disabled { cursor: wait; opacity: .5; }
  .privacy { margin: 12px 0 0; max-width: 600px; color: #686761; font-size: 10px; line-height: 1.5; }
  .session, .actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .session { margin-bottom: 22px; color: #555; font-size: 11px; }
  .online { width: 6px; height: 6px; display: inline-block; margin-right: 5px; border-radius: 50%; background: #23854a; }
  .text-button { padding: 2px; border: 0; background: transparent; color: inherit; font-size: 10px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .actions { margin-top: 10px; color: #666; font-size: 10px; }
  .loading { margin: 0 0 0 calc(.32 * (100% - 20px) + 20px); color: #666; font-size: 12px; }
  .error { margin: 18px 0 0 calc(.32 * (100% - 20px) + 20px); color: #a42b22; font-size: 12px; }
  .success { margin: 14px 0 0; color: #176b3a; font-size: 12px; }
  @media (max-width: 680px) {
    summary { padding: 0 18px; }
    .panel { padding: 24px 18px 26px; }
    header { grid-template-columns: 1fr; gap: 8px; }
    form, .loading, .error { margin-left: 0; }
    .handle-row { grid-template-columns: 1fr; gap: 8px; }
  }
  @media (forced-colors: active) {
    .summary-mark, .online { forced-color-adjust: auto; background: LinkText; }
  }
</style>
