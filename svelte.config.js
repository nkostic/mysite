import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx", ".md"],
  preprocess: [mdsvex({ extensions: [".svx", ".md"], highlight: false })],
  kit: {
    files: {
      assets: "public",
    },
    prerender: {
      // "*" covers every route without required parameters. The Serbian pages are listed so the crawler
      // starts from them too, and the feeds are endpoints that no page links to directly.
      entries: ["*", "/sr/", "/feed.xml", "/sr/feed.xml", "/sitemap.xml"],
    },
    adapter: adapter({
      pages: "dist/client",
      assets: "dist/client",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
