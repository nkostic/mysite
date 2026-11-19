import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";

export const ATPROTO_COMMENT_COLLECTION = "com.nenadkostic.blog.comment";
export const ATPROTO_COMMENT_SCOPE = `atproto repo:${ATPROTO_COMMENT_COLLECTION}?action=create&action=update&action=delete`;
export const ATPROTO_COMMENT_CALLBACK_PATH = "/atproto/callback/";
export const ATPROTO_RETURN_PATH_KEY = "nk-atproto-return-path";

function loopbackClientId(callbackPath: string) {
  const hostname = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
  const address = hostname === "::1" ? `[${hostname}]` : hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  const callbackUrl = `http://${address}${port}${callbackPath}`;
  return `http://localhost?redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

export function atprotoCallbackUrl(): Exclude<ReturnType<BrowserOAuthClient["findRedirectUrl"]>, undefined> {
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (!isLocal) return `https://nenadkostic.com${ATPROTO_COMMENT_CALLBACK_PATH}`;

  const hostname = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
  const address = hostname === "::1" ? `[${hostname}]` : hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  return `http://${address}${port}${ATPROTO_COMMENT_CALLBACK_PATH}` as Exclude<ReturnType<BrowserOAuthClient["findRedirectUrl"]>, undefined>;
}

export async function loadAtprotoClient(): Promise<BrowserOAuthClient> {
  const { BrowserOAuthClient } = await import("@atproto/oauth-client-browser");
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const clientId = isLocal
    ? loopbackClientId(ATPROTO_COMMENT_CALLBACK_PATH)
    : "https://nenadkostic.com/oauth-client-metadata.json";

  return BrowserOAuthClient.load({ clientId, handleResolver: "https://bsky.social/" });
}
