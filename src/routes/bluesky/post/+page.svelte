<script lang="ts">
  import { onMount } from "svelte";
  import type { Agent } from "@atproto/api";
  import type { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
  import AtprotoComposer from "$lib/AtprotoComposer.svelte";
  import BlueskyProfileTile from "$lib/BlueskyProfileTile.svelte";
  import BlueskyMark from "$lib/BlueskyMark.svelte";
  import ImageWithLoader from "$lib/ImageWithLoader.svelte";
  import LikesPopover from "$lib/LikesPopover.svelte";
  import { fetchBlueskyThread, type BlueskyPost, type BlueskyReply } from "$lib/bluesky";

  let post: BlueskyPost | undefined;
  let replies: BlueskyReply[] = [];
  let loadError = "";
  let oauthClient: BrowserOAuthClient | undefined;
  let oauthSession: OAuthSession | undefined;
  let agent: Agent | undefined;
  let signedInHandle = "";
  let authError = "";
  let oauthReady = false;
  let oauthLoading = false;
  let replyOpen = false;
  let publishing = false;
  let published = false;

  const POST_URI_KEY = "nk-bluesky-reply-uri";

  function hasOAuthCallback() {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return [search, hash].some((params) => params.has("state") && (params.has("code") || params.has("error")));
  }

  function buildLocalClientId() {
    const hostname = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
    const address = hostname === "::1" ? `[${hostname}]` : hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const callbackUrl = `http://${address}${port}/bluesky/post/`;
    return `http://localhost?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  }

  async function loadThread(uri: string) {
    const thread = await fetchBlueskyThread(uri);
    post = thread.post;
    replies = thread.replies;
  }

  async function initializeBlueskyLogin() {
    if (oauthReady || oauthLoading) return;
    oauthLoading = true;
    const [{ Agent }, { BrowserOAuthClient }] = await Promise.all([
      import("@atproto/api"),
      import("@atproto/oauth-client-browser"),
    ]);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const clientId = isLocal
      ? buildLocalClientId()
      : "https://nenadkostic.com/oauth-client-metadata.json";

    try {
      oauthClient = await BrowserOAuthClient.load({ clientId, handleResolver: "https://bsky.social/" });
      const result = await oauthClient.init();
      oauthReady = true;
      oauthSession = result?.session;
      if (!oauthSession) return;

      agent = new Agent(oauthSession);
      try {
        const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(oauthSession.did)}`);
        const profile = response.ok ? await response.json() as { handle?: string } : undefined;
        signedInHandle = profile?.handle ?? oauthSession.did;
      } catch {
        signedInHandle = oauthSession.did;
      }

      const storedUri = sessionStorage.getItem(POST_URI_KEY);
      if (storedUri && !new URLSearchParams(window.location.search).has("uri")) {
        history.replaceState({}, "", `/bluesky/post/?uri=${encodeURIComponent(storedUri)}`);
      }
    } finally {
      oauthLoading = false;
    }
  }

  async function openReplyBox() {
    if (oauthReady || oauthLoading) return;
    authError = "";
    try {
      await initializeBlueskyLogin();
    } catch (error) {
      authError = error instanceof Error ? error.message : "Bluesky sign in is temporarily unavailable.";
    }
  }

  async function signIn(handle: string) {
    authError = "";
    if (!handle || !oauthClient || !post) return;
    sessionStorage.setItem(POST_URI_KEY, post.id);
    try {
      await oauthClient.signInRedirect(handle, {
        scope: "atproto repo:app.bsky.feed.post?action=create",
      });
    } catch (error) {
      authError = error instanceof Error ? error.message : "Bluesky sign in did not finish.";
    }
  }

  async function signOut() {
    await oauthSession?.signOut();
    oauthSession = undefined;
    agent = undefined;
    signedInHandle = "";
  }

  async function publishReply(text: string) {
    if (!text || !agent || !post) return;
    publishing = true;
    published = false;
    authError = "";
    try {
      await agent.post({
        text,
        reply: {
          root: { uri: post.id, cid: post.cid },
          parent: { uri: post.id, cid: post.cid },
        },
      });
      published = true;
      await loadThread(post.id);
      return true;
    } catch (error) {
      authError = error instanceof Error ? error.message : "Your reply could not be published.";
      return false;
    } finally {
      publishing = false;
    }
  }

  onMount(async () => {
    const uri = new URLSearchParams(window.location.search).get("uri") ?? sessionStorage.getItem(POST_URI_KEY);
    if (!uri) {
      loadError = "This Bluesky post link is missing its post ID.";
      return;
    }

    try {
      await loadThread(uri);
      if (hasOAuthCallback()) {
        replyOpen = true;
        try {
          await initializeBlueskyLogin();
        } catch (error) {
          authError = error instanceof Error ? error.message : "Bluesky sign in is temporarily unavailable.";
        }
      }
    } catch (error) {
      loadError = error instanceof Error ? error.message : "This Bluesky post is temporarily unavailable.";
    }
  });
</script>

<svelte:head>
  <title>Bluesky post | Nenad Kostic</title>
  <meta name="description" content="A Bluesky post by Nenad Kostic, presented on his personal site." />
</svelte:head>

<header class="site-header">
  <a class="mark" href="/" aria-label="NK, Nenad Kostic home">NK</a>
  <p>Bluesky post</p>
  <a class="back" href="/bluesky/"><span aria-hidden="true">←</span> All posts</a>
</header>

<main id="main-content" tabindex="-1">
  {#if loadError}
    <div class="status" role="alert">
      <p>{loadError}</p>
      <a href="/bluesky/">Return to Bluesky posts</a>
    </div>
  {:else if !post}
    <p class="status" aria-live="polite">Loading post...</p>
  {:else}
    <article>
      <h1 class="sr-only">Bluesky post by {post.author.displayName}</h1>
      <header class="post-header">
        <p class="meta"><BlueskyMark size={15} /> <time datetime={post.date}>{post.displayDate}</time></p>
        <p class="text">{post.text}</p>
      </header>

      {#if post.images.length}
        <div class:single={post.images.length === 1} class="gallery">
          {#each post.images as image, index}
            <ImageWithLoader
              src={image.fullsize}
              alt={image.alt || `Photo ${index + 1} of ${post.images.length} shared by ${post.author.displayName}`}
              width={image.width}
              height={image.height}
              eager={index === 0}
            />
          {/each}
          {#if post.images.length > 1 && post.images.length % 2 === 1}
            <BlueskyProfileTile handle={post.author.handle} displayName={post.author.displayName} />
          {/if}
        </div>
      {/if}

      {#if post.video}
        <div class="video-wrap">
          <video controls playsinline poster={post.video.thumbnail} aria-label={post.video.alt || "Video attached to this Bluesky post"}>
            <source src={post.video.playlist} type="application/vnd.apple.mpegurl" />
          </video>
          <p>If the video does not play in your browser, use the original post link below.</p>
        </div>
      {/if}

      {#if post.external}
        <a class="external-card" href={post.external.uri} target="_blank" rel="noreferrer">
          {#if post.external.thumb}<img src={post.external.thumb} alt="" />{/if}
          <span>
            <strong>{post.external.title}</strong>
            {#if post.external.description}<small>{post.external.description}</small>{/if}
            <small>{new URL(post.external.uri).hostname}</small>
          </span>
        </a>
      {/if}

      {#if post.counts.replies || post.counts.likes || post.counts.reposts || post.counts.quotes}
        <ul class="engagement" aria-label="Post engagement">
          {#if post.counts.replies}<li>{post.counts.replies} {post.counts.replies === 1 ? "reply" : "replies"}</li>{/if}
          {#if post.counts.likes}<li><LikesPopover uri={post.id} count={post.counts.likes} /></li>{/if}
          {#if post.counts.reposts}<li>{post.counts.reposts} {post.counts.reposts === 1 ? "repost" : "reposts"}</li>{/if}
          {#if post.counts.quotes}<li>{post.counts.quotes} {post.counts.quotes === 1 ? "quote" : "quotes"}</li>{/if}
        </ul>
      {/if}

      <AtprotoComposer
        bind:open={replyOpen}
        ready={oauthReady}
        loading={oauthLoading}
        signedInHandle={agent ? signedInHandle : ""}
        error={authError}
        {publishing}
        {published}
        summary="Reply to this post"
        heading="Join the conversation"
        signedOutCopy="Sign in with your Bluesky handle to publish a reply. Your password stays with your provider."
        textLabel="Your reply"
        submitLabel="Publish to Bluesky"
        successMessage="Reply published."
        idPrefix="bluesky-reply"
        onopen={() => openReplyBox()}
        onsignin={signIn}
        onsignout={signOut}
        onpublish={publishReply}
      />

      {#if replies.length}
        <section class="conversation" aria-labelledby="conversation-title">
        <div class="conversation-heading">
          <p class="meta">Conversation</p>
          <h2 id="conversation-title">{post.counts.replies === 1 ? "1 reply" : `${post.counts.replies} replies`}</h2>
        </div>

        <ol class="replies">
            {#each replies as reply}
              <li style={`--reply-depth: ${Math.min(reply.depth, 3)}`}>
                <article class="reply">
                  <header>
                    {#if reply.author.avatar}<img src={reply.author.avatar} alt="" width="40" height="40" />{/if}
                    <span><strong>{reply.author.displayName}</strong><small>@{reply.author.handle} · {reply.displayDate}</small></span>
                  </header>
                  <p>{reply.text}</p>
                  {#if reply.images.length}
                    <div class="reply-images">
                      {#each reply.images as image}<img src={image.thumb} alt={image.alt || `Image posted by ${reply.author.displayName}`} loading="lazy" />{/each}
                    </div>
                  {/if}
                  <div class="reply-counts" aria-label="Reply engagement">
                    <span>{reply.counts.likes} likes</span>
                    <span>{reply.counts.replies} replies</span>
                    <span>{reply.counts.reposts} reposts</span>
                  </div>
                </article>
              </li>
            {/each}
        </ol>
        </section>
      {/if}

      <footer>
        <a href={post.url} target="_blank" rel="noreferrer">View original on Bluesky <span aria-hidden="true">↗</span></a>
      </footer>
    </article>
  {/if}
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f5f4ef; color: #0b0b0b; font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  :global(a) { color: inherit; }
  :global(::selection) { background: #1185fe; color: #fff; }
  .site-header { min-height: 84px; padding: 0 48px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-bottom: 2px solid; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  .site-header p { margin: 0; }
  .mark { width: 42px; height: 42px; border: 2px solid; border-radius: 50%; display: grid; place-items: center; text-decoration: none; letter-spacing: -.05em; }
  .back { justify-self: end; text-decoration: none; }
  main { width: min(1120px, calc(100% - 96px)); margin: 0 auto; padding: 72px 0 96px; }
  article { border: 2px solid; background: #fff; }
  .post-header { padding: clamp(28px, 6vw, 72px); }
  .meta { margin: 0 0 34px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; font-size: 10px; font-weight: 750; letter-spacing: .14em; }
  .text { max-width: 960px; margin: 0; white-space: pre-wrap; font-size: clamp(32px, 5vw, 68px); line-height: 1.03; letter-spacing: -.05em; font-weight: 700; }
  .gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; border-top: 2px solid; background: #0b0b0b; }
  .gallery.single { grid-template-columns: 1fr; }
  .external-card { margin: 0; padding: 24px; border-top: 2px solid; display: grid; grid-template-columns: minmax(120px, 240px) 1fr; gap: 24px; align-items: center; text-decoration: none; }
  .external-card:hover { background: #0b0b0b; color: #fff; }
  .external-card img { width: 100%; aspect-ratio: 1.91 / 1; object-fit: cover; border: 1px solid currentColor; }
  .external-card span { display: flex; flex-direction: column; gap: 9px; }
  .external-card strong { font-size: clamp(22px, 3vw, 36px); line-height: 1.05; }
  .external-card small { font-size: 12px; line-height: 1.4; }
  .video-wrap { padding: 24px; border-top: 2px solid; }
  video { width: 100%; max-height: 720px; display: block; background: #0b0b0b; }
  .video-wrap p { margin: 12px 0 0; font-size: 12px; }
  .engagement { margin: 0; padding: 15px 28px; display: flex; flex-wrap: wrap; gap: 8px 20px; border-top: 1px solid #cecdc7; list-style: none; color: #666; font-size: 11px; }
  .conversation { border-top: 2px solid; }
  .conversation-heading { padding: 28px; display: flex; justify-content: space-between; align-items: end; gap: 24px; }
  .conversation-heading .meta { margin: 0; }
  h2 { margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1; letter-spacing: -.05em; }
  .replies { margin: 0; padding: 0; border-top: 2px solid; list-style: none; }
  .replies > li { padding-left: calc(min(var(--reply-depth), 3) * 38px); }
  .replies > li + li { border-top: 1px solid #b9b8b2; }
  .reply { padding: 26px 28px; border: 0; border-left: calc(min(var(--reply-depth), 3) * 2px) solid #1185fe; background: transparent; }
  .reply header { display: flex; align-items: center; gap: 12px; }
  .reply header img { border-radius: 50%; object-fit: cover; }
  .reply header span { display: flex; flex-direction: column; gap: 3px; }
  .reply header strong { font-size: 14px; }
  .reply header small, .reply-counts { color: #555; font-size: 11px; }
  .reply > p { margin: 18px 0; max-width: 760px; white-space: pre-wrap; font-size: 18px; line-height: 1.5; }
  .reply-images { display: flex; gap: 8px; margin: 18px 0; overflow-x: auto; }
  .reply-images img { width: min(220px, 70vw); height: 160px; object-fit: cover; }
  .reply-counts { display: flex; gap: 18px; }
  footer { padding: 28px; border-top: 2px solid; }
  footer a, .status a { font-size: 10px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; text-underline-offset: 4px; }
  .status { margin: 0; padding: 36px; border: 2px solid; font-size: 18px; }
  @media (max-width: 680px) {
    .site-header { min-height: 72px; padding: 0 18px; grid-template-columns: 1fr 1fr; }
    .site-header p { display: none; }
    main { width: calc(100% - 36px); padding: 36px 0 60px; }
    .gallery { grid-template-columns: 1fr; }
    .external-card { grid-template-columns: 1fr; }
    .replies > li { padding-left: calc(min(var(--reply-depth), 3) * 14px); }
    .reply { padding: 22px 18px; }
  }
</style>
