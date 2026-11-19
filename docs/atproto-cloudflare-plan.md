# AT Protocol and Cloudflare plan

The manual setup and release gates are tracked in [the infrastructure checklist](./infra-checklist.md).

## The useful version of this idea

The blog should have two stores with different promises.

Public articles can live as custom records in an AT Protocol repository. Each record gets an AT URI, a content hash, a signed repository commit, and a standard CAR export. A later site could rebuild the archive from those records without reading this repository.

Comments belong in the commenter's repository. A reader signs in with an existing AT Protocol handle and grants this site permission to create `com.nenadkostic.blog.comment` records. The reader does not create an account on this site. The comment record points to the article URI, and the Cloudflare service keeps a query index for displaying the conversation.

Private drafts should not live in that repository. AT Protocol repositories are designed for public, verifiable data. The protocol documentation recommends against adding private content by simply encrypting public records. Store drafts in Cloudflare D1 and attachments in a private R2 bucket. Put the authoring routes behind Cloudflare Access.

Sources: [AT Protocol repositories](https://atproto.com/specs/repository), [AT Protocol overview](https://atproto.com/specs/atp), [Cloudflare Access policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)

## Proposed public record

The first custom Lexicon can be `com.nenadkostic.blog.post`. Its authority follows the `nenadkostic.com` domain.

```json
{
  "lexicon": 1,
  "id": "com.nenadkostic.blog.post",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["title", "slug", "body", "createdAt"],
        "properties": {
          "title": { "type": "string", "maxLength": 180 },
          "slug": { "type": "string", "maxLength": 180 },
          "summary": { "type": "string", "maxLength": 500 },
          "body": { "type": "string", "maxLength": 100000 },
          "format": { "type": "string", "knownValues": ["markdown"] },
          "createdAt": { "type": "string", "format": "datetime" },
          "updatedAt": { "type": "string", "format": "datetime" },
          "cover": { "type": "blob", "accept": ["image/*"], "maxSize": 10000000 }
        }
      }
    }
  }
}
```

This is a starting schema, not a published contract. We should validate field sizes and evolution rules with the AT Protocol tooling before publishing it. Lexicons can be published as AT records and resolved through a DNS TXT record for the namespace.

Source: [Publishing Lexicons](https://atproto.com/guides/publishing-lexicons)

## Proposed comment record

The comment Lexicon can be `com.nenadkostic.blog.comment`. The subject is a URI so it can point to either a future AT Protocol article record or one of the existing HTTPS article URLs.

```json
{
  "$type": "com.nenadkostic.blog.comment",
  "subject": "https://nenadkostic.com/journal/example/",
  "text": "A comment stored in my own AT Protocol repository.",
  "createdAt": "2026-08-27T18:00:00.000Z"
}
```

Threaded replies can add an optional `parent` AT URI. The first version should keep comments text-only. Media would require a separate blob permission and would make moderation more expensive.

The OAuth client should request only the custom collection it needs:

```text
atproto repo:com.nenadkostic.blog.comment?action=create&action=update&action=delete
```

This lets a reader create, edit, and delete this site's comment records without granting access to Bluesky posts or unrelated records. A published permission set can give the authorization screen a clearer description.

Sources: [AT Protocol permissions](https://atproto.com/specs/permission), [custom permission sets](https://atproto.com/guides/permission-sets)

## Cloudflare layout

```text
Reader with any AT Protocol handle
    |
    v
OAuth with reader's PDS ----> comment saved in reader's repository
                                      |
                                      v
Svelte site ----> Cloudflare Worker AppView ----> verify record with reader's PDS
                         |
                         v
                    D1 comment index

Relay or Tap ----> backfill, edits, and deletions ----> D1 comment index

Author
    |
    v
Cloudflare Access ----> private authoring Worker
                              |            |
                              v            v
                         D1 drafts     private R2 files
                              |
                         publish action
                              |
                              v
                    OAuth write to AT repository
```

### Worker

The Worker is the API edge. For comments, it accepts the AT URI returned after a successful record write. It resolves the author's DID, fetches the record from that person's PDS, validates the record and article subject, then adds it to D1. This notification path makes a new comment appear without waiting for a network indexer.

The Worker must never trust comment text sent directly by the browser. The signed record fetched from the author's PDS is the source. A Tap or relay consumer later catches missed writes, edits, and deletions. AT Protocol describes AppViews as the services that index records and assemble application views.

Source: [The AT Stack](https://atproto.com/guides/the-at-stack)

### D1

D1 stores private drafts, revision history, publication state, and query indexes for public articles and comments. It is not the authoritative copy of a published article or comment. The author's AT Protocol repository remains authoritative.

The comment index needs the comment AT URI, CID, author DID, resolved handle, article subject, text, creation time, update time, and moderation state. A hidden comment stays in its author's repository but does not appear on this site.

### R2

Use one private R2 bucket for draft attachments and backups. Public article media can remain as AT Protocol blobs on the PDS. R2 can also keep periodic CAR exports and blob backups. R2 objects are private unless a Worker, custom domain, Access policy, or signed URL exposes them.

Sources: [Cloudflare D1](https://developers.cloudflare.com/d1/), [Cloudflare R2 objects](https://developers.cloudflare.com/r2/objects/), [protecting R2 with Access](https://developers.cloudflare.com/r2/tutorials/cloudflare-access/), [AT Protocol blobs](https://atproto.com/specs/blob)

## Should the PDS itself run on Cloudflare?

Not first.

The official PDS distribution targets a Linux host with Docker and persistent local storage. Cloudflare Containers can run Linux images, but moving the PDS database, repository blocks, and blob lifecycle into Durable Objects and R2 is a real server port. It is much larger than adding an AT Protocol data source to this blog.

The practical first version keeps an existing PDS as the authority. Cloudflare runs the AppView, private authoring service, search index, media cache, and backups. This exercises custom Lexicons, OAuth permissions, record creation, blobs, CAR exports, and reconstruction without making account hosting the first problem.

An experimental Cloudflare-native PDS can follow. A Durable Object would serialize writes for one DID and store repository metadata in SQLite. R2 would store content-addressed blocks and blobs. The Worker would implement the required XRPC, OAuth, identity, repository, and sync endpoints. That is a separate project with protocol conformance and migration tests.

Sources: [official PDS distribution](https://github.com/bluesky-social/pds), [Cloudflare Containers](https://developers.cloudflare.com/containers/get-started/), [Durable Object storage](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/), [AT Protocol sync](https://atproto.com/specs/sync)

## Build order

1. Define and validate `com.nenadkostic.blog.comment`.
2. Publish its permission set and DNS authority record.
3. Extend OAuth metadata with permission for the comment collection.
4. Use the reusable composer to create a test comment in the signed-in reader's repository.
5. Add a Worker endpoint that verifies the returned AT URI and indexes the record in D1.
6. Render indexed comments below both Markdown articles and future AT Protocol articles.
7. Add edit, delete, report, rate limiting, and site-level hiding.
8. Add Tap or relay ingestion for backfill and deletion tracking.
9. Define and validate `com.nenadkostic.blog.post`.
10. Publish one article record to the author's PDS through OAuth.
11. Add CAR and blob backups to private R2, then prove that a clean site can rebuild from them.
12. Decide whether a Cloudflare-native PDS still has enough learning value to justify the larger build.

## Moderation and identity details

An AT Protocol identity does not guarantee a Bluesky profile or avatar. The comment UI should always support a handle and DID without an image. It can show a Bluesky avatar when the author has an `app.bsky.actor.profile` record, but that is an optional view.

Signing records does not stop spam. The AppView still needs per-DID and per-IP rate limits, blocked-DID rules, link limits, reporting, and a local hidden state. The site can refuse to display a record without deleting it from the author's repository.

If the author edits or deletes a comment in another AT Protocol client, the index must process that repository change. The direct verification endpoint gives fast publishing. Tap or relay ingestion supplies eventual consistency.

## Cost at personal-site scale

This should fit inside the included usage for quite a while. As of August 2026, R2 includes 10 GB-month of Standard storage, one million Class A operations, and ten million Class B operations each month. D1 includes 5 GB on both listed plans, with daily operation limits on the free plan. Workers Paid starts at $5 USD per month and includes higher Workers and Durable Objects usage.

Pricing changes, so check the source pages before provisioning anything.

Sources: [Workers and R2 pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
