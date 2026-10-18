// nomadops.io — Eleventy 3 config. No client-side JavaScript is emitted.
import { sectionsToMarkdown } from "./lib/markdown.js";
import { siteCss } from "./lib/css.js";

export default function (eleventyConfig) {
  // Static passthrough: images, CSS, favicon, and the design-system tokens and fonts the CSS uses.
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/images": "images", "src/favicon.ico": "favicon.ico", "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "design-system/styles.css": "design-system/styles.css", "design-system/tokens": "design-system/tokens", "design-system/assets/fonts": "design-system/assets/fonts" });

  // All local CSS, bundled into one string for a <style> tag in <head> (see lib/css.js).
  eleventyConfig.addShortcode("siteCss", () => siteCss());
  eleventyConfig.addWatchTarget("design-system/");

  // Pages: every Markdown file in src/pages.
  eleventyConfig.addCollection("pages", (api) => api.getFilteredByGlob("src/pages/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)));

  // Front-matter sections → Markdown text (used by llms-full.txt).
  eleventyConfig.addFilter("sectionsToMarkdown", sectionsToMarkdown);
  eleventyConfig.addFilter("isoDate", (d) => new Date(d || Date.now()).toISOString().slice(0, 10));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
