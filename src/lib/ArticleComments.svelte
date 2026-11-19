<script lang="ts">
  import type { Agent } from "@atproto/api";
  import type { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
  import AtprotoComposer from "$lib/AtprotoComposer.svelte";
  import { localeMeta } from "$lib/i18n";
  import { i18n } from "$lib/i18n/state.svelte";
  import {
    ATPROTO_COMMENT_CALLBACK_PATH,
    ATPROTO_COMMENT_COLLECTION,
    ATPROTO_COMMENT_SCOPE,
    ATPROTO_RETURN_PATH_KEY,
    atprotoCallbackUrl,
    loadAtprotoClient,
  } from "$lib/atproto-oauth";

  type CommentRecord = {
    uri: string;
    text: string;
    createdAt: string;
  };

  let { subject }: { subject: string } = $props();
  let open = $state(false);
  let ready = $state(false);
  let loading = $state(false);
  let publishing = $state(false);
  let published = $state(false);
  let error = $state("");
  let signedInHandle = $state("");
  let comments = $state<CommentRecord[]>([]);
  let client: BrowserOAuthClient | undefined;
  let session: OAuthSession | undefined;
  let agent: Agent | undefined;

  async function loadOwnComments() {
    if (!agent || !session) return;
    const response = await agent.com.atproto.repo.listRecords({
      repo: session.did,
      collection: ATPROTO_COMMENT_COLLECTION,
      limit: 100,
      reverse: true,
    });

    comments = response.data.records.flatMap((item) => {
      const record = item.value as { subject?: unknown; text?: unknown; createdAt?: unknown };
      if (record.subject !== subject || typeof record.text !== "string" || typeof record.createdAt !== "string") return [];
      return [{ uri: item.uri, text: record.text, createdAt: record.createdAt }];
    });
  }

  async function prepare() {
    if (ready || loading) return;
    loading = true;
    error = "";
    try {
      const [{ Agent }, oauthClient] = await Promise.all([import("@atproto/api"), loadAtprotoClient()]);
      client = oauthClient;
      const result = await client.initRestore();
      session = result?.session;
      if (session) {
        agent = new Agent(session);
        signedInHandle = session.did;
        try {
          const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(session.did)}`);
          const profile = response.ok ? await response.json() as { handle?: string } : undefined;
          signedInHandle = profile?.handle ?? session.did;
        } catch {
          signedInHandle = session.did;
        }
        await loadOwnComments();
      }
      ready = true;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : i18n.t.comments.signInUnavailable;
    } finally {
      loading = false;
    }
  }

  async function signIn(handle: string) {
    if (!client) return;
    error = "";
    sessionStorage.setItem(ATPROTO_RETURN_PATH_KEY, `${window.location.pathname}#comments`);
    try {
      await client.signInRedirect(handle, {
        redirect_uri: atprotoCallbackUrl(),
        scope: ATPROTO_COMMENT_SCOPE,
      });
    } catch (cause) {
      error = cause instanceof Error ? cause.message : i18n.t.comments.signInFailed;
    }
  }

  async function signOut() {
    await session?.signOut();
    session = undefined;
    agent = undefined;
    signedInHandle = "";
    comments = [];
  }

  async function publish(text: string) {
    if (!agent || !session) return false;
    publishing = true;
    published = false;
    error = "";
    try {
      await agent.com.atproto.repo.createRecord({
        repo: session.did,
        collection: ATPROTO_COMMENT_COLLECTION,
        record: {
          $type: ATPROTO_COMMENT_COLLECTION,
          subject,
          text,
          createdAt: new Date().toISOString(),
        },
      });
      published = true;
      await loadOwnComments();
      return true;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : i18n.t.comments.publishFailed;
      return false;
    } finally {
      publishing = false;
    }
  }
</script>

<section class="comments" id="comments" aria-labelledby="comments-title">
  <header>
    <p>{i18n.t.comments.kicker}</p>
    <h2 id="comments-title">{i18n.t.comments.heading}</h2>
  </header>

  <p class="note">{i18n.t.comments.note}</p>

  {#if comments.length}
    <ol>
      {#each comments as comment}
        <li>
          <p>{comment.text}</p>
          <small>@{signedInHandle} · <time datetime={comment.createdAt}>{new Intl.DateTimeFormat(localeMeta[i18n.locale].intl, { dateStyle: "medium" }).format(new Date(comment.createdAt))}</time></small>
        </li>
      {/each}
    </ol>
  {/if}

  <AtprotoComposer
    bind:open
    {ready}
    {loading}
    {signedInHandle}
    {error}
    {publishing}
    {published}
    summary={i18n.t.comments.summary}
    heading={i18n.t.comments.composerHeading}
    signedOutCopy={i18n.t.comments.signedOutCopy}
    textLabel={i18n.t.comments.textLabel}
    submitLabel={i18n.t.comments.submitLabel}
    successMessage={i18n.t.comments.success}
    maxLength={1000}
    idPrefix="article-comment"
    onopen={prepare}
    onsignin={signIn}
    onsignout={signOut}
    onpublish={publish}
  />
</section>

<style>
  .comments { margin: 0 0 96px; border: 2px solid; background: #fff; }
  .comments > header { padding: 28px; display: flex; align-items: end; justify-content: space-between; gap: 24px; border-bottom: 1px solid #cecdc7; }
  header p { margin: 0; font-size: 9px; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
  h2 { margin: 0; font-size: clamp(30px, 5vw, 54px); line-height: .9; letter-spacing: -.05em; }
  .note { max-width: 650px; margin: 0; padding: 22px 28px; color: #555; font-size: 12px; line-height: 1.55; }
  ol { margin: 0; padding: 0; border-top: 1px solid #cecdc7; list-style: none; }
  li { padding: 24px 28px; }
  li + li { border-top: 1px solid #cecdc7; }
  li p { margin: 0 0 12px; white-space: pre-wrap; font: 17px/1.55 Georgia, "Times New Roman", serif; }
  small { color: #666; font-size: 10px; }
  @media (max-width: 680px) {
    .comments { margin-bottom: 60px; }
    .comments > header { padding: 22px 18px; }
    .note, li { padding-left: 18px; padding-right: 18px; }
  }
</style>
