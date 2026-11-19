import { en, type Messages } from "./en";
import { sr } from "./sr";

export const locales = ["en", "sr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const SITE_ORIGIN = "https://nenadkostic.com";

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string; intl: string }> = {
  en: { label: "English", htmlLang: "en", ogLocale: "en_CA", intl: "en-US" },
  sr: { label: "Srpski", htmlLang: "sr-Latn", ogLocale: "sr_RS", intl: "sr-Latn" },
};

export const messages: Record<Locale, Messages> = { en, sr };

export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);

/** Prefixes a site path with the locale. English has no prefix, so existing URLs keep working. */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/sr" || pathname.startsWith("/sr/") ? "sr" : defaultLocale;
}

/** Removes the locale prefix, returning the language-neutral path. */
export function stripLocale(pathname: string): string {
  if (pathname === "/sr") return "/";
  return pathname.startsWith("/sr/") ? pathname.slice(3) : pathname;
}

/** Formats an ISO date or date-time as a short calendar date in the locale's conventions. */
export function formatDate(locale: Locale, iso: string): string {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: dateOnly ? "UTC" : "America/Edmonton",
  }).format(new Date(iso));
}

/** Picks the CLDR plural form for a count, e.g. `plural("sr", 3, { one, few, other })`. */
export function plural(locale: Locale, count: number, forms: { one: string; few?: string; other: string }): string {
  const category = new Intl.PluralRules(localeMeta[locale].intl).select(count);
  if (category === "one") return forms.one;
  if (category === "few") return forms.few ?? forms.other;
  return forms.other;
}
