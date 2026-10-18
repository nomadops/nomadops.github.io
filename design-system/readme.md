# nomadops Design System

Extracted from **nomadops.io** — the site of nomadops, a small nomadic team of infrastructure engineers who now develop DevOps and SRE agents (HeyPenny, InspectorGadget, Atlas), build MCP servers and operations panels into client apps, and help teams improve their "agentic DevOps and SRE posture". Mascot: a backpacking Corgi (illustrations by inmadesign).

## Sources
- Live site: https://nomadops.io/ (index.html, services.html, about.html)
- Repo: https://github.com/nomadops/nomadops.github.io — **branch `gh-pages`** (the default and deployed branch; `main` holds an obsolete Bootstrap-era site and must be ignored). Key files: `css/site.css` (all styles, tokens on `:root`), `js/site.js` (approval demo + form validation), `images/`.
- No framework. Hand-written CSS with custom properties; Google Fonts.

## Products represented
One surface: the **nomadops.io marketing site**, three pages sharing one header/footer: Home (hero with approval demo, tool strip, what-we-do cards, agents, MCP feature, panels feature, principles, who-we-are, contact), Services (five service articles, three steps, CTA band), About (page hero with portrait, Q&A grid, friends & vendors).

## CONTENT FUNDAMENTALS
- Brand name is always lowercase **nomadops**, even at sentence start.
- "We" speaking to "you" / "your team" / "your app". Plain declarative sentences, mostly short. No marketing superlatives, no exclamation marks except none. Sentence case everywhere, including headings and buttons.
- Headings are full sentences with a period: "DevOps and SRE agents your team can trust." "Agents propose. People approve." "Start small, then widen."
- Eyebrows are short mono uppercase labels: "Agentic DevOps · SRE · MCP servers", "What we do", "Our agents", "How we keep agents safe". The middle dot `·` separates items.
- Cards are numbered "01 · Agents", "02 · MCP" … in mono.
- Agent names are CamelCase product names: HeyPenny (fixer), InspectorGadget (debugger), Atlas (pipelines). Each gets a one-line role in mono ("General-purpose fixer agent") and a summary that starts with the name as subject: "HeyPenny fixes what breaks."
- Bulleted lists use → arrows, each item a terse noun phrase or imperative ("Fixes failed CI runs", "Read tools for health, logs, deploys and queues").
- Safety is the recurring theme: "within limits you set", "a person approves it", "Nothing changes in production until a person says yes."
- Technical terms in mono look like code: `get_health`, `your-app.list_deploys`, `sre · production`. Tool/vendor names in official casing (Terraform, Pulumi, MCP, CI/CD).
- Links: "All services →", "Meet our agents →", "More about us →" (text + arrow span). CTAs: "Start a project", "Let's talk", "Send message", "Contact us", "Approve", "Replay".
- Form errors are plain instructions: "Enter your name.", "Enter an email address, for example name@company.com."
- No emoji.

## VISUAL FOUNDATIONS
**Palette.** Two worlds. Dark "ink" bands (`#0e1418`, raised `#162028`, lines `#2a3640`/`#3a4650`, text `#f3f4f1` / muted `#c9d0cc` / subtle `#8a979f`) for header, hero, agents, principles, CTA band and footer. Light bands on a warm off-white ground `#f3f4f1` with white `#ffffff` paper cards, tint `#f7f8f6`, chip `#edefec`, hairline `#d9ddd9`, text `#0e1418` / muted `#47535b`. One accent, orange `#e8862e` (hover `#f09a4a`), used on dark; on light the darker `#9a4a0c` is used for text (eyebrows, labels, arrows, link hover). Status: ok green `#2e8b76` (`#7cc9b5` on ink), warn `#c2410c`, fail on ink `#ff9b8a`, error red `#b42318` on `#fef3f2`.

**Type.** Space Grotesk 700 for all headings and the brand wordmark (tight tracking: −0.02 to −0.03em on big sizes, line-height 1.04–1.25). IBM Plex Sans 400/500/600 for body at 17px/1.6. IBM Plex Mono 400/500 for eyebrows, labels, pills, badges, logs, tool strip, tags, flow steps, contact links and agent roles. `font-size-adjust` keeps fallback metrics stable. `text-wrap: balance` on headings, `pretty` on paragraphs.

**Layout.** 1200px container, fluid gutters `clamp(16px,4vw,24px)`. Sections pad `clamp(64px,10vw,96px)`. Full-width alternating bands: dark → light ground → white "band" with hairline top/bottom borders. Flex-wrap two-column "feature" rows (copy 1 1 460px, media 1 1 420px) that reverse on alternate sections. Grids via `repeat(auto-fit, minmax(min(100%, 260px|300px), 1fr))`, 20px gap. Header is in-flow (not sticky).

**Surfaces.** Light card: white, 1px `#d9ddd9`, radius 10px, 28px padding, no shadow. Dark card ("agent", "terminal"): `#162028`, 1px `#2a3640`, radius 12px, 32px padding. No shadows anywhere; depth is done with borders and tonal steps. Mock UI figures (terminal log, MCP tool list, ops panel) are built from real markup inside bordered frames with a head/foot bar.

**Buttons.** 48px min height (44px small), 24px/16px horizontal padding, radius 6px, weight 600. Primary: orange fill, ink text, hover lighter orange. Ghost (on dark): transparent, border `#3a4650`, hover border `#8a979f`. Dark (on light): ink fill, hover `#24313a`. No press/scale effects; hover changes color only.

**Forms.** Label 15px/600 above input; input 48px min, 12px 14px padding, 1px `#7e8a85` border, radius 6px; textarea 140px min. Focus: border turns ink + 3px focus outline. Invalid (after interaction): `#fef3f2` background, red border, error line with a 16px circle-i icon.

**Pills & badges.** Pill: mono 13px, 3px 10px, 1px `#2a3640` border, full radius, subtle text. Badge: mono 12px; "needs approval" variant is solid orange with ink text. Tag chips (light): `#edefec` fill, hairline border, 6px 12px.

**Motion.** Essentially none. `scroll-behavior: smooth` only when motion is allowed. Approval demo swaps two states instantly (`hidden`). No transitions declared.

**Focus.** `:focus-visible` 3px solid outline, `#9a4a0c` on light and orange on dark, 2px offset.

**Imagery.** Flat cartoon Corgi mascot only: round logo 44px/36px in header/footer, 200×300 full-body in "Who we are", 220px round portrait with 4px orange ring on About. No photos, no gradients, no textures, no blur.

**Dots.** 8px status dots: fail `#ff9b8a`, accent orange, ok `#2e8b76`, warn `#c2410c`.

## ICONOGRAPHY
- Minimal inline SVG line icons, 24px, `stroke-width 2`, round caps/joins, `currentColor`: wrench (HeyPenny), magnifier (InspectorGadget), three-node pipeline (Atlas). Flow chevrons and the error circle-i are 16px of the same style. These are copied into `assets/icons/` as `agent-fixer.svg`, `agent-debugger.svg`, `agent-pipelines.svg`, `chevron-right.svg`, `error-circle.svg`.
- Unicode glyphs in mono act as icons: `→` (list arrows, steps, "more" links), `✗` fail, `✓` ok, `·` separator.
- Legacy social SVGs (upwork, github, fiverr, twitter, terraform, slack) remain in `assets/icons/` but the live site uses text links instead.
- No icon font, no emoji.

## Index
- `styles.css` → `tokens/fonts.css`, `tokens/colors.css`, `tokens/typography.css`, `tokens/layout.css`.
- `assets/images/` — `corgi-logo-96.webp` (header/footer), `corgi-round-md.webp` (About portrait), `corgi-mascot-illustration-transparent-medium.webp` (Who we are), `corgi-front-square.png` (og image), `corgi-desk-medium.webp`, `bw-logo*` silhouettes, `digital-nomad-two-color.svg` (unused illustration in repo).
- `assets/icons/` — agent + UI line icons, legacy social marks.
- `guidelines/` — foundation specimen cards.
- `components/core/` — Button, Eyebrow, SectionHead, Arrows, Pill, Badge, Tag, Dot, Card, AgentCard, Terminal, McpToolList, OpsPanel, Flow, Principle, Field, ContactForm, Header, Footer, ToolStrip, Service, Steps, CtaBand, QA, Friend.
- `ui_kits/website/` — click-through recreation (Home / Services / About).
- `ds-loader.js` — resolves the compiled component bundle, falling back to in-browser transpile of `components/core/*.jsx`.
- `MIGRATION.md` — plan for rebuilding nomadops.io on Eleventy with this design system vendored in the repo and `/llms-full.txt` for crawlers.
- `site-starter/` — drop-in Eleventy project (config, Nunjucks layouts and section templates, content as front matter in `src/pages/*.md`, `lib/markdown.js` → `llms-full.txt`, `CLAUDE.md`, Pages workflow). Not part of the design system itself.
- `site-preview/` — the static HTML the starter emits (Home, Services, About, `llms-full.txt`), zero JS.
- `SKILL.md`, `github.md`.
