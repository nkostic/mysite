import { redirect } from "@sveltejs/kit";
import { slugs } from "$lib/posts";
import type { EntryGenerator, PageLoad } from "./$types";

// Legacy URLs from earlier versions of the site. Cloudflare serves real 301s from public/_redirects;
// this route is the fallback for hosts that ignore that file.
const aliases: Record<string, string> = {
  "turborepo-with-svelte": "turborepo-sveltekit",
  "my-web-dev-tools-recommendations-for-2022": "my-developer-tools-recomedations-2022",
};

export const prerender = true;
export const entries: EntryGenerator = () => [...slugs, ...Object.keys(aliases)].map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  const target = aliases[params.slug] ?? params.slug;
  if (slugs.includes(target)) redirect(308, `/journal/${target}/`);
  redirect(308, "/journal/");
};
