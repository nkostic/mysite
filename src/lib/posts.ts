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
type PostSource = {
  slug: string;
  date: string;
  /** Articles on this branch that are not translated yet only appear in the locales listed here. */
  translations: { en: Translation } & Partial<Record<Locale, Translation>>;
  /** Hand-built route outside src/lib/content/posts. */
  custom?: boolean;
};

// Newest first. Articles are English-only until a `<slug>.sr.md` file and an `sr` translation are added.
const sources: PostSource[] = [
  {
    slug: "accessibility-from-the-first-component",
    date: "2026-08-25",
    translations: {
      en: {
        title: "Accessibility from the first component",
        summary: "How different organizations can build accessibility into product planning, shared components, testing, and daily engineering work.",
        tags: ["Accessibility", "Design systems", "Engineering"],
      },
    },
  },
  {
    slug: "adding-bluesky-with-atproto",
    date: "2026-08-22T13:00:00-06:00",
    translations: {
      en: {
        title: "Adding Bluesky to this site with the AT Protocol",
        summary: "How I used the public AT Protocol API to mix Bluesky posts into this journal without authentication or a backend.",
        tags: ["AT Protocol", "Bluesky", "Svelte"],
      },
    },
  },
  {
    slug: "ai-tools-in-2026",
    date: "2026-08-22",
    translations: {
      en: {
        title: "AI tools in 2026",
        summary: "My current mix of coding agents, editors, terminals, connected services, and the growing work of maintaining the setup itself.",
        tags: ["AI", "Tools", "Development"],
      },
    },
  },
  {
    slug: "questrade-principal-engineer",
    date: "2026-07-08",
    custom: true,
    translations: {
      en: {
        title: "A new chapter at Questrade",
        summary: "Joining Questrade as a Principal Engineer to work on financial software and help engineering teams make sound technical decisions.",
        tags: ["Career", "Engineering leadership", "Fintech"],
      },
    },
  },
  {
    slug: "react-native-expo-one-stack",
    date: "2026-03-08",
    translations: {
      en: {
        title: "React Native and Expo, one stack that travels well",
        summary: "A year with React Native and Expo for mobile and web, plus a small-app stack built with Clerk and Convex.",
        tags: ["React Native", "Expo", "Mobile"],
      },
    },
  },
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
    slug: "working-with-aws-mediatailor",
    date: "2025-04-11",
    translations: {
      en: {
        title: "Working with AWS MediaTailor",
        summary: "How SCTE-35 markers, MediaTailor, and a Go ad decision service on ECS put ads into a video stream.",
        tags: ["AWS", "Go", "Video"],
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

/** Slugs rendered from Markdown by the journal [slug] route. */
export const slugs = sources.filter((source) => !source.custom).map((source) => source.slug);

export function getPosts(locale: Locale = defaultLocale): Post[] {
  return sources.flatMap((source) => {
    const translation = source.translations[locale];
    if (!translation) return [];
    return [{
      slug: source.slug,
      locale,
      date: source.date,
      displayDate: formatDate(locale, source.date),
      url: localizePath(locale, `/journal/${source.slug}/`),
      ...translation,
    }];
  });
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return getPosts(locale).find((post) => post.slug === slug);
}
