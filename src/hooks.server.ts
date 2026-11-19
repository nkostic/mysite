import type { Handle } from "@sveltejs/kit";
import { localeFromPathname, localeMeta } from "$lib/i18n";

// Sets <html lang> in the prerendered HTML so Serbian pages are announced correctly.
export const handle: Handle = ({ event, resolve }) => {
  const lang = localeMeta[localeFromPathname(event.url.pathname)].htmlLang;
  return resolve(event, { transformPageChunk: ({ html }) => html.replace("%lang%", lang) });
};
