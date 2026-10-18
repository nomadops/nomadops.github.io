# nomadops.io

The marketing site for [nomadops](https://nomadops.io/): operations for teams that don't have an operations team.

Built with Eleventy 3 and Nunjucks, no client-side JavaScript, deployed to GitHub Pages from `main`. Content lives in `src/pages/*.md` as front matter; the design system is vendored in `design-system/`. See `CLAUDE.md` for the conventions.

```sh
npm ci
npm run build && npm run check
```
