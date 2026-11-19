# Infrastructure checklist for AT Protocol comments

This checklist covers the work outside the application repository. Complete the first-release section before opening comments to visitors. The later sections can wait.

## What is already prepared in the repository

- [x] OAuth client metadata at `/oauth-client-metadata.json`
- [x] Production callback at `/atproto/callback/`
- [x] Privacy page linked from the OAuth metadata
- [x] `com.nenadkostic.blog.comment` record Lexicon
- [x] `com.nenadkostic.blog.authComments` permission-set Lexicon
- [x] Automated validation for both Lexicons
- [x] Browser OAuth flow with narrow comment permissions
- [x] Comment composer that writes to the signed-in reader's repository

## First release

### 1. Put the site on its production domain

Owner: Nenad

- [ ] Deploy the current site to `https://nenadkostic.com`.
- [ ] Confirm that HTTPS works without certificate warnings.
- [ ] Confirm these URLs return `200` without redirecting to another hostname:
  - `https://nenadkostic.com/oauth-client-metadata.json`
  - `https://nenadkostic.com/atproto/callback/`
  - `https://nenadkostic.com/bluesky/privacy/`
  - `https://nenadkostic.com/og.png`
- [ ] Confirm the OAuth metadata response has `Content-Type: application/json`.
- [ ] Keep both callback URLs in the metadata:
  - `https://nenadkostic.com/bluesky/post/`
  - `https://nenadkostic.com/atproto/callback/`

Do this first. Production OAuth depends on a public HTTPS metadata document whose `client_id` exactly matches its URL.

### 2. Confirm the DID that owns the Lexicon namespace

Owner: Nenad

- [ ] Resolve `nkostic.bsky.social` and record its current DID.
- [ ] Confirm that you control the recovery keys and email for that AT Protocol identity.
- [ ] Use that DID as the authority for the Lexicons.

The expected DID from the current public profile is `did:plc:tp6jaoyayttyhrwjuiycpurh`. Verify it before adding DNS. Do not rely on the value copied into this checklist.

### 3. Add the Lexicon DNS record in Cloudflare DNS

Owner: Nenad

- [ ] Open the `nenadkostic.com` zone in Cloudflare.
- [ ] Add a TXT record with this name:

```text
_lexicon.blog
```

- [ ] Set its value to the verified DID:

```text
did=did:plc:YOUR_VERIFIED_DID
```

- [ ] Use automatic TTL.
- [ ] Verify the public record resolves at `_lexicon.blog.nenadkostic.com`.

Both current Lexicons share the `com.nenadkostic.blog` authority, so one TXT record covers `comment` and `authComments`.

Source: [Publishing Lexicons](https://atproto.com/guides/publishing-lexicons)

### 4. Publish the Lexicons to your repository

Owner: Nenad

- [ ] Install `goat` on the machine you trust for account administration.
- [ ] Run `goat account login` interactively.
- [ ] Do not place the account password or app password in this repository, shell history, or project logs.
- [ ] From the repository, inspect both files under `lexicons/com/nenadkostic/blog/`.
- [ ] Publish the Lexicons with `goat lex publish`.
- [ ] Save the returned AT URIs and CIDs in the deployment notes.
- [ ] Resolve both published schemas through the AT Protocol network.
- [ ] Treat a published Lexicon as permanent. Publish a new NSID if a breaking schema change becomes necessary.

Sources: [Publishing Lexicons](https://atproto.com/guides/publishing-lexicons), [Lexicon versioning](https://atproto.com/guides/lexicon)

### 5. Create the Cloudflare comment service

Owner: Nenad for resources, Codex for implementation

- [ ] Create a Worker named `nenadkostic-comments`.
- [ ] Add the custom domain `comments-api.nenadkostic.com`.
- [ ] Create a D1 database named `nenadkostic-comments-prod`.
- [ ] Bind it to the Worker as `COMMENTS_DB`.
- [ ] Create a preview D1 database named `nenadkostic-comments-preview`.
- [ ] Keep production and preview data separate.
- [ ] Do not create an R2 bucket yet. Text-only comments do not need it.

The Worker needs these public endpoints:

```text
GET  /v1/comments?subject=<canonical article URI>
POST /v1/comments/verify
```

The browser sends only the returned comment AT URI and CID to the verification endpoint. The Worker resolves the author's DID, finds the author's PDS, fetches the record, validates it, and writes the verified view to D1. It must not trust comment text sent by the browser.

Sources: [Cloudflare D1 setup](https://developers.cloudflare.com/d1/get-started/), [D1 Worker bindings](https://developers.cloudflare.com/d1/worker-api/)

### 6. Apply the first D1 schema

Owner: Codex prepares it, Nenad authorizes the production migration

- [ ] Create a `comments` table with the AT URI as its unique key.
- [ ] Store the CID, author DID, resolved handle, subject URI, text, creation time, indexed time, and moderation state.
- [ ] Add an index on `subject_uri, created_at` for article comment queries.
- [ ] Add an index on `author_did` for moderation and account deletion work.
- [ ] Add a `blocked_dids` table.
- [ ] Add a `reports` table before exposing a report button.
- [ ] Apply the migration to preview.
- [ ] Test it with disposable records.
- [ ] Review the generated SQL.
- [ ] Apply the same migration to production.

### 7. Configure API security

Owner: Nenad for Cloudflare controls, Codex for application checks

- [ ] Allow browser requests only from `https://nenadkostic.com`.
- [ ] Do not use `Access-Control-Allow-Origin: *` on write endpoints.
- [ ] Accept only `https://nenadkostic.com/journal/` subjects in the first release.
- [ ] Accept only `com.nenadkostic.blog.comment` records.
- [ ] Limit comment text to the Lexicon maximum.
- [ ] Make verification idempotent by AT URI and CID.
- [ ] Reject private IP addresses and untrusted schemes during DID and PDS resolution.
- [ ] Add per-IP and per-DID limits to the verification endpoint.
- [ ] Set a small request-body limit.
- [ ] Log rejected verification attempts without logging OAuth tokens.

### 8. Protect moderation routes with Cloudflare Access

Owner: Nenad

- [ ] Configure a Cloudflare Access identity provider you already use.
- [ ] Protect `comments-api.nenadkostic.com/admin/*`.
- [ ] Add an allow policy for your exact email address.
- [ ] Require multi-factor authentication through the identity provider.
- [ ] Do not protect the public `GET /v1/comments` endpoint.
- [ ] Do not protect the public verification endpoint with an interactive Access login.
- [ ] Keep administrative service tokens in Cloudflare secrets, never in project files.

Source: [Cloudflare Access policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)

### 9. Connect and test the complete flow

Owner: Nenad and Codex

- [ ] Point the site at `https://comments-api.nenadkostic.com`.
- [ ] Sign in with `nkostic.bsky.social`.
- [ ] Check that the consent screen requests only the comment collection.
- [ ] Publish one comment on a low-risk test article.
- [ ] Confirm the record exists in your AT Protocol repository.
- [ ] Confirm the Worker fetches the record from your PDS rather than trusting the browser payload.
- [ ] Confirm the D1 row contains the returned AT URI and CID.
- [ ] Confirm the public comments endpoint returns the record.
- [ ] Confirm the comment appears after a page reload and in a signed-out browser.
- [ ] Edit the record and confirm the index updates.
- [ ] Delete the record and confirm the site stops showing it.
- [ ] Repeat sign-in with a second AT Protocol provider if one is available. A Bluesky-hosted account alone does not test federation.

## Before announcing comments publicly

- [ ] Add a visible report action.
- [ ] Add local hide and block controls.
- [ ] Decide whether comments containing links need manual review.
- [ ] Add a short retention policy for reports and request logs.
- [ ] Add an abuse contact address to the privacy page.
- [ ] Add uptime monitoring for the Worker and D1 queries.
- [ ] Add an alert for repeated verification failures.
- [ ] Export the D1 schema and test a restore.
- [ ] Keep the `atprotoComments` feature flag available as a fast kill switch.

## Network synchronization after the first release

The direct verification endpoint covers comments created through this site. It does not discover records created, edited, or deleted elsewhere unless the site receives another notification.

Owner: Nenad for hosting, Codex for implementation

- [ ] Deploy Tap on a small container host or another service that supports a long-running process and persistent storage.
- [ ] Subscribe only to `com.nenadkostic.blog.comment`.
- [ ] Configure Tap to send signed or authenticated webhooks to the Worker.
- [ ] Store the webhook secret in Cloudflare secrets.
- [ ] Backfill existing repositories containing the comment collection.
- [ ] Process create, update, and delete events idempotently.
- [ ] Monitor relay lag and the last indexed revision.
- [ ] Test recovery after Tap has been offline.

Tap handles backfill, signature verification, filtering, and ordered delivery. A Cloudflare Worker remains a good webhook receiver and query API, but Tap itself needs a long-running host.

Source: [The AT Stack and Tap](https://atproto.com/guides/the-at-stack)

## Private drafts and files later

Do this only after public text comments work.

- [ ] Create a private R2 bucket named `nenadkostic-private-content`.
- [ ] Bind it only to the private authoring Worker.
- [ ] Store draft metadata and permissions in D1.
- [ ] Store draft images, documents, CAR exports, and blob backups in R2.
- [ ] Protect authoring routes with Cloudflare Access.
- [ ] Use short-lived signed URLs when a browser needs direct file access.
- [ ] Add lifecycle rules for abandoned uploads.
- [ ] Test restore from a CAR export and R2 blob backup.

AT Protocol repositories remain public. Private drafts belong in D1 and private R2 storage, not in encrypted public records.

Source: [Cloudflare R2 Worker bindings](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)

## Not required for the first release

- Running your own PDS
- Running a full relay
- Accepting image or video comments
- Creating accounts for visitors
- Registering an application in a Bluesky developer console
- Moving existing Markdown articles into AT Protocol records
- Provisioning R2 before files or backups exist

## Values to return after the manual setup

Send these non-secret values back before implementation continues:

- Verified DID for `nkostic.bsky.social`
- Published comment Lexicon AT URI and CID
- Published permission-set AT URI and CID
- Worker public URL
- Production D1 binding name
- Preview D1 binding name
- Cloudflare Access protected admin hostname and path

Do not send account passwords, OAuth tokens, Cloudflare API tokens, cookies, recovery keys, or service-token secrets.
