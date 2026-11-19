---
title: Adding Bluesky to this site with the AT Protocol
date: 2026-08-22
---

<script>
  import { SiBluesky } from "@icons-pack/svelte-simple-icons";
  import MermaidDiagram from "$lib/MermaidDiagram.svelte";
  import TechnologyStrip from "$lib/TechnologyStrip.svelte";

  const atprotoFlow = `flowchart LR
    P[My Bluesky account] --> PDS[Personal data server]
    PDS --> R[Relay]
    R --> A[Bluesky AppView]
    A -->|Public XRPC request| S[This Svelte site]
    S --> J[Journal ordered by date]`;

  const tools = [
    { name: "Bluesky", href: "https://bsky.app/profile/nkostic.bsky.social", icon: SiBluesky },
    { name: "AT Protocol", href: "https://atproto.com/", mark: "AT" },
    { name: "XRPC", href: "https://atproto.com/specs/xrpc", mark: "XR" },
    { name: "Svelte", href: "https://svelte.dev/", mark: "SV" },
  ];
</script>

I wanted the journal on this site to include the shorter things I post on Bluesky. Copying each post into a Markdown file would work, but I would stop doing it after a week. The better answer was already under the Bluesky app: the AT Protocol.

## What the AT Protocol is

The [AT Protocol](https://atproto.com/) is an open network for social applications. Bluesky is one application built on it. The account, records, feed indexes, and client do not have to live inside one company or one application.

An account has a stable decentralized identifier, usually called a DID. A readable handle such as `nkostic.bsky.social` resolves to that DID. If the handle changes, the DID still identifies the account.

Posts are records stored in a signed repository on a personal data server, or PDS. Lexicons describe the record and API shapes. Bluesky posts use the `app.bsky.feed.post` record type.

## How a post reaches this site

The network has a few distinct jobs. A PDS hosts account data. Relays collect repository events from the network. An AppView indexes those events and prepares the views an application needs, such as profiles, threads, and author feeds.

<TechnologyStrip tools={tools} label="AT Protocol integration" />

<MermaidDiagram chart={atprotoFlow} label="A Bluesky post moving from a personal data server through a relay and AppView into this journal" />

This site does not need to talk to every server in the network. It makes one public request to the Bluesky AppView:

```text
GET https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed
    ?actor=nkostic.bsky.social
    &filter=posts_no_replies
```

The endpoint does not require authentication for public posts. The response includes the post text, creation time, author, record URI, and other view data. I turn the record URI into a link back to the original post on Bluesky.

## How I mixed it into the journal

The Svelte site starts with the Markdown articles it already knows about. After the page loads, it requests my latest Bluesky posts, converts both sources to one small journal entry type, and sorts the result by date.

Articles keep their title, summary, and tags. Bluesky posts keep their full text and point to the original post. A blue butterfly makes the source clear without turning the journal into a Bluesky clone.

If the request fails, the normal article list remains on the page. There is no loading screen and no broken archive. Bluesky is an extra source, not a new dependency for rendering the site.

That separation is the part I like. I publish a long article here when an idea needs room. I post a short note on Bluesky when it does not. The journal can show both without pretending they are the same format.
