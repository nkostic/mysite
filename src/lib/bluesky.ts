import type { Post } from "$lib/posts";

export const BLUESKY_HANDLE = "nkostic.bsky.social";
export const BLUESKY_PROFILE_URL = `https://bsky.app/profile/${BLUESKY_HANDLE}`;
const AUTHOR_FEED_URL = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${BLUESKY_HANDLE}&limit=100&filter=posts_no_replies`;

export type BlueskyPost = {
  kind: "bluesky";
  id: string;
  cid: string;
  date: string;
  displayDate: string;
  text: string;
  url: string;
  localUrl: string;
  images: BlueskyImage[];
  external?: BlueskyExternal;
  video?: BlueskyVideo;
  author: BlueskyAuthor;
  counts: BlueskyCounts;
};

export type BlueskyImage = { thumb: string; fullsize: string; alt: string; width?: number; height?: number };
export type BlueskyExternal = { uri: string; title: string; description: string; thumb?: string };
export type BlueskyVideo = { playlist: string; thumbnail?: string; alt?: string };
export type BlueskyAuthor = { handle: string; displayName: string; avatar?: string };
export type BlueskyCounts = { replies: number; reposts: number; likes: number; quotes: number; bookmarks: number };
export type BlueskyReply = BlueskyPost & { depth: number };
export type BlueskyThread = { post: BlueskyPost; replies: BlueskyReply[] };
export type BlueskyLike = { did: string; handle: string; displayName: string; avatar?: string };

export type ArticleEntry = Post & { kind: "article" };
export type JournalEntry = ArticleEntry | BlueskyPost;

type PostView = {
  uri?: string;
  cid?: string;
  indexedAt?: string;
  author?: { handle?: string; displayName?: string; avatar?: string };
  record?: { createdAt?: string; text?: string };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  quoteCount?: number;
  bookmarkCount?: number;
  embed?: {
    $type?: string;
    images?: Array<{ thumb?: string; fullsize?: string; alt?: string; aspectRatio?: { width?: number; height?: number } }>;
    items?: Array<{ thumbnail?: string; fullsize?: string; alt?: string; aspectRatio?: { width?: number; height?: number } }>;
    external?: { uri?: string; title?: string; description?: string; thumb?: string };
    playlist?: string;
    thumbnail?: string;
    alt?: string;
  };
};

type AuthorFeedResponse = {
  feed?: Array<{
    reason?: unknown;
    post?: PostView;
  }>;
};

type ThreadNode = { post?: PostView; replies?: ThreadNode[] };
type ThreadResponse = { thread?: ThreadNode };
type LikesResponse = {
  cursor?: string;
  likes?: Array<{
    actor?: { did?: string; handle?: string; displayName?: string; avatar?: string };
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Edmonton",
});

export const articleEntries = (articles: Post[]): ArticleEntry[] =>
  articles.map((post) => ({ ...post, kind: "article" }));

export const sortJournalEntries = (entries: JournalEntry[]) =>
  [...entries].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

function normalizePost(post?: PostView): BlueskyPost | undefined {
  const text = post?.record?.text?.trim();
  const date = post?.record?.createdAt ?? post?.indexedAt;
  const uri = post?.uri;
  const handle = post?.author?.handle ?? BLUESKY_HANDLE;
  const cid = post?.cid;
  if (!text || !date || !uri || !cid) return undefined;

  const rkey = uri.split("/").at(-1);
  if (!rkey) return undefined;

  const embed = post.embed;
  const imageViews: Array<{
    thumb?: string;
    thumbnail?: string;
    fullsize?: string;
    alt?: string;
    aspectRatio?: { width?: number; height?: number };
  }> = embed?.images ?? embed?.items ?? [];
  const images = imageViews.flatMap((image) => {
    const thumb = image.thumb ?? image.thumbnail;
    if (!thumb || !image.fullsize) return [];
    return [{
      thumb,
      fullsize: image.fullsize,
      alt: image.alt ?? "",
      width: image.aspectRatio?.width,
      height: image.aspectRatio?.height,
    }];
  });
  const external = embed?.external?.uri && embed.external.title
    ? {
        uri: embed.external.uri,
        title: embed.external.title,
        description: embed.external.description ?? "",
        thumb: embed.external.thumb,
      }
    : undefined;
  const video = embed?.playlist
    ? { playlist: embed.playlist, thumbnail: embed.thumbnail, alt: embed.alt }
    : undefined;

  return {
    kind: "bluesky",
    id: uri,
    cid,
    date,
    displayDate: dateFormatter.format(new Date(date)),
    text,
    url: `https://bsky.app/profile/${handle}/post/${rkey}`,
    localUrl: `/bluesky/post/?uri=${encodeURIComponent(uri)}`,
    images,
    external,
    video,
    author: {
      handle,
      displayName: post.author?.displayName ?? handle,
      avatar: post.author?.avatar,
    },
    counts: {
      replies: post.replyCount ?? 0,
      reposts: post.repostCount ?? 0,
      likes: post.likeCount ?? 0,
      quotes: post.quoteCount ?? 0,
      bookmarks: post.bookmarkCount ?? 0,
    },
  };
}

export async function fetchBlueskyPosts(): Promise<BlueskyPost[]> {
  const response = await fetch(AUTHOR_FEED_URL);
  if (!response.ok) throw new Error("Bluesky posts are temporarily unavailable.");

  const payload = (await response.json()) as AuthorFeedResponse;
  return (payload.feed ?? []).flatMap((item) => {
    if (item.reason) return [];
    const post = normalizePost(item.post);
    return post ? [post] : [];
  });
}

export async function fetchBlueskyThread(uri: string): Promise<BlueskyThread> {
  if (!uri.startsWith("at://")) throw new Error("This Bluesky post link is not valid.");
  const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=6&parentHeight=0`);
  if (!response.ok) throw new Error("This Bluesky post is temporarily unavailable.");

  const payload = (await response.json()) as ThreadResponse;
  const post = normalizePost(payload.thread?.post);
  if (!post) throw new Error("This Bluesky post could not be found.");

  const replies: BlueskyReply[] = [];
  const collectReplies = (nodes: ThreadNode[] | undefined, depth: number) => {
    for (const node of nodes ?? []) {
      const reply = normalizePost(node.post);
      if (reply) replies.push({ ...reply, depth });
      collectReplies(node.replies, depth + 1);
    }
  };
  collectReplies(payload.thread?.replies, 0);

  return { post, replies };
}

export async function fetchBlueskyLikes(uri: string): Promise<BlueskyLike[]> {
  if (!uri.startsWith("at://")) throw new Error("This Bluesky post link is not valid.");

  const likes: BlueskyLike[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL("https://public.api.bsky.app/xrpc/app.bsky.feed.getLikes");
    url.searchParams.set("uri", uri);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Likes are temporarily unavailable.");
    const payload = (await response.json()) as LikesResponse;
    likes.push(...(payload.likes ?? []).flatMap((like) => {
      const actor = like.actor;
      if (!actor?.did || !actor.handle) return [];
      return [{
        did: actor.did,
        handle: actor.handle,
        displayName: actor.displayName?.trim() || actor.handle,
        avatar: actor.avatar,
      }];
    }));
    cursor = payload.cursor;
  } while (cursor && likes.length < 500);

  return likes;
}
