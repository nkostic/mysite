import { page } from "$app/state";
import { localeFromPathname, localizePath, messages, type Locale } from "./index";

/** Reactive view of the current locale, derived from the URL so every route (including English-only ones) agrees. */
export const i18n = {
  get locale(): Locale {
    return localeFromPathname(page.url.pathname);
  },
  get t() {
    return messages[this.locale];
  },
  path(path: string): string {
    return localizePath(this.locale, path);
  },
};
