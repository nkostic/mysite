import type { ParamMatcher } from "@sveltejs/kit";

// English is served from the site root. Only the non-default locale appears in the URL.
export const match: ParamMatcher = (param) => param === "sr";
