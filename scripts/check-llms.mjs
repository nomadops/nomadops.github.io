// Fails the build if any page section type has no Markdown renderer.
import { readFileSync, readdirSync } from "node:fs";
import { sectionsToMarkdown } from "../lib/markdown.js";
const types = new Set(readdirSync("src/_includes/sections").map((f) => f.replace(".njk", "")));
let missing = [];
for (const t of types) { const out = sectionsToMarkdown([{ type: t, title: "x", lead: "x", items: [], links: [], flow: [] }]); if (!out) missing.push(t); }
if (missing.length) { console.error("No Markdown renderer for section types:", missing.join(", ")); process.exit(1); }
console.log("llms-full.txt covers all", types.size, "section types.");
