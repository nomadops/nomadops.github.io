// Bundles src/css/site.css and every local file it @imports into one string, for a <style> tag in <head>.
// This removes the render-blocking @import chain (site.css → design-system/styles.css → tokens/*.css).
// Relative url()s are rewritten to site paths, so fonts and images still resolve once the CSS is inlined.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

// Site path → file on disk: src/ first (src/css/x → /css/x), then the repo root (design-system/x → /design-system/x).
const toFile = (sitePath) => [path.join("src", sitePath), path.join(".", sitePath)].find(existsSync);
const toSitePath = (file) => "/" + path.relative(file.startsWith("src" + path.sep) ? "src" : ".", file).split(path.sep).join("/");

const importRe = /@import\s+(?:url\(\s*)?["']?([^"')\s]+)["']?\s*\)?\s*;/g;
const urlRe = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;

function bundle(file, seen) {
  if (seen.has(file)) return "";
  seen.add(file);
  const dir = path.dirname(file);
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  return css
    .replace(importRe, (_, ref) => {
      if (/^[a-z]+:/i.test(ref)) throw new Error(`${file}: remote @import "${ref}" cannot be inlined. Self-host it in design-system/.`);
      const target = ref.startsWith("/") ? toFile(ref) : path.join(dir, ref);
      if (!target || !existsSync(target)) throw new Error(`${file}: @import "${ref}" not found.`);
      return bundle(target, seen);
    })
    .replace(urlRe, (match, q, ref) => {
      if (/^([a-z]+:|\/|#)/i.test(ref)) return match;
      return `url("${path.posix.normalize(path.posix.join(path.posix.dirname(toSitePath(file)), ref))}")`;
    });
}

export function siteCss(entry = "src/css/site.css") {
  return bundle(entry, new Set()).replace(/\n\s*\n/g, "\n").trim();
}
