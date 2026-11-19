import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";

const { PUBLIC_ALGOLIA_APP_ID: appId, PUBLIC_ALGOLIA_INDEX_NAME: indexName, ALGOLIA_ADMIN_KEY: adminKey } = process.env;

if (!appId || !indexName || !adminKey) {
  throw new Error("Set PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_INDEX_NAME, and ALGOLIA_ADMIN_KEY before indexing.");
}

// English articles are `<slug>.md` and live in the base index. Other locales are `<slug>.<locale>.md` and
// live in `<index>_<locale>`, which is what src/lib/search.ts queries.
const contentDirectory = new URL("../src/lib/content/posts/", import.meta.url);
const files = (await readdir(contentDirectory)).filter((file) => file.endsWith(".md"));

const byIndex = new Map();
for (const file of files) {
  const [slug, locale = "en"] = basename(file, ".md").split(".");
  const source = await readFile(join(contentDirectory.pathname, file), "utf8");
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/u)?.[1] ?? "";
  const title = frontmatter.match(/^title:\s*(.+)$/mu)?.[1]?.trim() ?? slug;
  const date = frontmatter.match(/^date:\s*(.+)$/mu)?.[1]?.trim() ?? "";
  const content = source
    .replace(/^---[\s\S]*?---/u, "")
    .replace(/<script[\s\S]*?<\/script>/gu, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/!?(?:\[([^\]]*)\])\([^)]*\)/gu, "$1")
    .replace(/[#*_`>]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  const index = locale === "en" ? indexName : `${indexName}_${locale}`;
  const records = byIndex.get(index) ?? [];
  records.push({ objectID: slug, slug, locale, title, date, content, url: `${locale === "en" ? "" : `/${locale}`}/journal/${slug}/` });
  byIndex.set(index, records);
}

for (const [index, records] of byIndex) {
  const response = await fetch(`https://${appId}.algolia.net/1/indexes/${encodeURIComponent(index)}/batch`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-algolia-application-id": appId, "x-algolia-api-key": adminKey },
    body: JSON.stringify({ requests: records.map((body) => ({ action: "updateObject", body })) }),
  });
  if (!response.ok) throw new Error(`Algolia indexing failed for ${index} (${response.status}): ${await response.text()}`);
  console.log(`Queued ${records.length} records for Algolia index ${index}.`);
}
