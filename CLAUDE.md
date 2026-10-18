# nomadops.io

Informational marketing site. Eleventy 3, Nunjucks, zero client-side JavaScript. Deployed to GitHub Pages from `_site/`.

## Where things live
- `src/pages/*.md` — one file per page. Content is **front matter**: a `sections` list, each with a `type` and its fields. The Markdown body is optional prose appended after the sections.
- `src/_includes/sections/<type>.njk` — HTML for each section type. `lib/markdown.js` — Markdown for each section type (feeds `/llms-full.txt`). **Add a section type in both places**; `npm run check` verifies.
- `src/_data/site.json` — nav, footer, CTA, form action, meta.
- `src/css/site.css` — component rules. **Tokens (colors, fonts, radii, spacing) are not here** — they are in `design-system/tokens/` and imported.
- The build inlines `site.css` and every local file it `@import`s into a `<style>` tag in each page (`lib/css.js`). No stylesheet requests, no remote `@import`. Fonts are self-hosted in `design-system/assets/fonts/`.
- `design-system/` — the design system (see `design-system/readme.md` and `design-system/SKILL.md`). React components there are for prototyping new sections; the site itself uses the Nunjucks twins. Keep class names aligned.

## Rules
- Lowercase `nomadops` always. Sentence case. Headings are full sentences ending with a period. "We" → "you / your team / your app". No emoji, no exclamation marks.
- No `<script>` tags. Forms post to sendfly; validation is CSS `:user-invalid` only.
- New colors or type sizes go in `design-system/tokens/`, not in `site.css`.
- GitHub Actions: only first-party actions (`actions/*`, `aws-actions/*`, `pulumi/*`). Anything else is a CLI command in a `run:` step. No third-party actions, however convenient.
- Infrastructure lives in `infra/` as Pulumi, applied by the Infra workflow (`preview` on pull requests, `up` on `main`); `infra/bootstrap` (the state bucket) is the one stack applied by hand. Deploys move built artifacts into existing resources; they never create resources.
- After content edits run `npm run build && npm run check` and read `_site/llms-full.txt` once to confirm it reads well.

## Common tasks
- Change copy: edit the field in `src/pages/<page>.md`.
- Add an agent: append to the `agents` section items in `src/pages/index.md` and the `mini-agents` list in `src/pages/services.md`.
- New page: copy `src/pages/about.md`, set `title`, `permalink`, `order`, pick sections; add to `site.json` nav if needed.
- New section type: prototype it in `design-system/components` (React) → write `src/_includes/sections/<type>.njk` → add the case in `lib/markdown.js`.
