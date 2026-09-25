# AGENTS.md

Conventions for anyone (human or agent) working in this repo.

## What this project is

A vanilla Edge Delivery Services (EDS) style site: plain HTML, CSS and JS, no build step, no framework. It's a mocked structural/visual replication of wknd.site — an Adobe demo travel & adventure publisher — built with entirely original placeholder copy and generated placeholder imagery. Do not add real content or assets scraped from the live reference; see `docs/page-registry.md` for what's a deliberate placeholder.

## Structure

- `scripts/aem.js` — the core decoration/loading library. Treat as vendored; don't hand-edit block-loading behavior here without a strong reason.
- `scripts/scripts.js` — page-level decoration entry point (loaded eagerly): section/block metadata, header/footer loading, LCP handling.
- `scripts/delayed.js` — deferred, non-critical JS loaded after the page is interactive.
- `styles/styles.css` — global mobile-first styles needed for first paint.
- `styles/fonts.css` — `@font-face` declarations, loaded separately so font loading can be deferred/optimized independently.
- `styles/lazy-styles.css` — below-the-fold styling, fetched by `scripts.js` rather than linked in `<head>`.
- `blocks/{name}/{name}.js` + `{name}.css` — one folder per block. A block is authored in content as `<div class="{name}">…</div>`; `scripts.js` decorates it, which loads the matching JS/CSS.
- `icons/` — small UI SVGs (social, chevrons, search, menu). Content photography lives in `images/`, never mixed into this folder.
- `images/` — placeholder content photography (all generated SVG placeholders — see `docs/page-registry.md`).
- `fonts/` — vendored webfont files (currently empty; see `fonts/README.md`).
- `docs/` — component and page registries; the source of truth for what's built and where it's used. Check both before adding or changing a component.
- `tools/` — local dev tooling only (Lighthouse runner, visual-diff runner). Excluded from publishing via `.hlxignore`.
- Page routes are plain `.html` files at the matching path (e.g. `/adventures/index.html` → `/adventures/`), each containing pre-decoration block markup exactly as EDS pages are authored.
- `nav.plain.html` / `footer.plain.html` — shared header/footer content fragments, fetched by the `header`/`footer` blocks.

## Breakpoints

Mobile-first, four states, fixed across the whole project — do not introduce others:

- base (unscoped, mobile)
- `min-width: 768px`
- `min-width: 960px`
- `min-width: 1200px`

## Conventions

- No component-scoped frameworks. If a block needs interactivity, write scoped vanilla JS in that block's own `{name}.js`.
- Prefer semantic HTML and CSS-only interaction (`:hover`, `:focus-within`, `<details>`) over JS wherever it can do the same job.
- Every block gets a row in `docs/component-registry.md`; every page gets a row in `docs/page-registry.md`. Update both as you go.
- Run `npm run lint` before considering a change done.
