import { defaultLocale, formatDate, localizePath, type Locale } from "$lib/i18n";

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  displayDate: string;
  summary: string;
  tags: string[];
  url: string;
};

type Translation = { title: string; summary: string; tags: string[] };
type PostSource = { slug: string; date: string; translations: Record<Locale, Translation> };

// Newest first. Every article has an English and a Serbian version in src/lib/content/posts/.
const sources: PostSource[] = [
  {
    slug: "neo",
    date: "2025-09-21",
    translations: {
      en: {
        title: "Neo Financial",
        summary: "Joining Neo Financial as a Staff Software Developer and returning to the Canadian startup world.",
        tags: ["Career", "Fintech"],
      },
      sr: {
        title: "Neo Financial",
        summary: "Prelazim u Neo Financial kao Staff Software Developer i vraćam se u kanadski startap svet.",
        tags: ["Karijera", "Fintech"],
      },
    },
  },
  {
    slug: "lumenalta",
    date: "2024-04-09",
    translations: {
      en: {
        title: "Joining Lumenalta",
        summary: "Leaving the Vidflex team, joining Lumenalta, and getting ready for a new challenge.",
        tags: ["Career", "Remote work"],
      },
      sr: {
        title: "Prelazak u Lumenaltu",
        summary: "Napuštam Vidflex tim, prelazim u Lumenaltu i spremam se za novi izazov.",
        tags: ["Karijera", "Rad na daljinu"],
      },
    },
  },
  {
    slug: "the-best-of-2023",
    date: "2023-12-30",
    translations: {
      en: {
        title: "The best of 2023",
        summary: "Svelte, TypeScript, browsers, AI, and the tools that made a wild year memorable.",
        tags: ["Web", "Tools", "Year in review"],
      },
      sr: {
        title: "Najbolje iz 2023.",
        summary: "Svelte, TypeScript, pregledači, veštačka inteligencija i alati zbog kojih će ova ludačka godina ostati u sećanju.",
        tags: ["Web", "Alati", "Pregled godine"],
      },
    },
  },
  {
    slug: "turborepo-sveltekit",
    date: "2022-04-17",
    translations: {
      en: {
        title: "Turborepo with Svelte",
        summary: "A small monorepo with two SvelteKit sites, a shared component package, and remote build caching.",
        tags: ["Svelte", "Tooling"],
      },
      sr: {
        title: "Turborepo sa Svelteom",
        summary: "Mali monorepo sa dva SvelteKit sajta, zajedničkim paketom komponenti i udaljenim keširanjem build-a.",
        tags: ["Svelte", "Alati"],
      },
    },
  },
  {
    slug: "my-developer-tools-recomedations-2022",
    date: "2022-02-02",
    translations: {
      en: {
        title: "My web development tools for 2022",
        summary: "The development tools I picked up in 2021 and kept using in 2022.",
        tags: ["Web", "Tools"],
      },
      sr: {
        title: "Moji alati za web razvoj u 2022.",
        summary: "Razvojni alati koje sam usvojio u 2021. i nastavio da koristim u 2022.",
        tags: ["Web", "Alati"],
      },
    },
  },
  {
    slug: "new-site",
    date: "2021-07-15",
    translations: {
      en: {
        title: "A new site",
        summary: "How I rebuilt this site with SvelteKit, Tailwind CSS, MDsveX, and Cloudflare Workers.",
        tags: ["Svelte", "Web", "Meta"],
      },
      sr: {
        title: "Novi sajt",
        summary: "Kako sam ponovo napravio ovaj sajt pomoću SvelteKita, Tailwind CSS-a, MDsveX-a i Cloudflare Workersa.",
        tags: ["Svelte", "Web", "Meta"],
      },
    },
  },
  {
    slug: "new-beginnings",
    date: "2020-07-12",
    translations: {
      en: {
        title: "New beginnings",
        summary: "Moving to Calgary, joining the Vidflex team, and living an hour from the Rockies.",
        tags: ["Career", "Calgary"],
      },
      sr: {
        title: "Novi počeci",
        summary: "Selidba u Calgary, prelazak u Vidflex tim i život sat vremena od Stenovitih planina.",
        tags: ["Karijera", "Calgary"],
      },
    },
  },
];

export const slugs = sources.map((source) => source.slug);

export function getPosts(locale: Locale = defaultLocale): Post[] {
  return sources.map((source) => {
    const translation = source.translations[locale];
    return {
      slug: source.slug,
      locale,
      date: source.date,
      displayDate: formatDate(locale, source.date),
      url: localizePath(locale, `/journal/${source.slug}/`),
      ...translation,
    };
  });
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return getPosts(locale).find((post) => post.slug === slug);
}
