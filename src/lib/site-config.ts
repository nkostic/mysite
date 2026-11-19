export const siteConfig = {
  features: {
    blueskyPage: true,
    blueskyPostsInJournal: false,
    // Keep off until the production steps in docs/infra-checklist.md are done (OAuth metadata, Lexicon DNS).
    atprotoComments: false,
  },
} as const;
