import { readFile } from "node:fs/promises";
import { Lexicons, parseLexiconDoc } from "@atproto/lexicon";

const paths = [
  "lexicons/com/nenadkostic/blog/comment.json",
  "lexicons/com/nenadkostic/blog/authComments.json",
];

const documents = await Promise.all(
  paths.map(async (path) => parseLexiconDoc(JSON.parse(await readFile(path, "utf8")))),
);
const lexicons = new Lexicons(documents);

lexicons.assertValidRecord("com.nenadkostic.blog.comment", {
  $type: "com.nenadkostic.blog.comment",
  subject: "https://nenadkostic.com/journal/example/",
  text: "Schema validation example.",
  createdAt: new Date().toISOString(),
});

console.log(`Validated ${documents.map((document) => document.id).join(", ")}`);
