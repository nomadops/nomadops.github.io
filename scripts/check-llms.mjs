// Fails the build if any page section type has no Markdown renderer.
import { readdirSync } from "node:fs";
import { markdownTypes } from "../lib/markdown.js";
const types = new Set(readdirSync("src/_includes/sections").map((f) => f.replace(".njk", "")));
const missing = [...types].filter((t) => !markdownTypes.includes(t));
if (missing.length) { console.error("No Markdown renderer for section types:", missing.join(", ")); process.exit(1); }
console.log("llms-full.txt covers all", types.size, "section types.");
