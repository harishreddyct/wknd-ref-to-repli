# AGENTS.md

Conventions for anyone (human or agent) working in this repo.

## What this project is

A vanilla Edge Delivery Services (EDS) style site: plain HTML, CSS and JS, no build step, no framework. It's a mocked structural/visual replication of wknd.site — an Adobe demo travel & adventure publisher — built with entirely original placeholder copy and generated placeholder imagery. Do not add real content or assets scraped from the live reference; see `docs/page-registry.md` for what's a deliberate placeholder.

**This repo is code only.** Actual page content isn't stored as files here — it's authored in Document Authoring (DA) at `da.live/#/harishreddyct/wknd-ref-to-repli` and served through `main--wknd-ref-to-repli--harishreddyct.aem.page` (preview) / `.aem.live` (production). Never add page-content `.html` files (a home page, an article, etc.) back into this repo — if a page needs new copy, author it in DA. What belongs here is exactly what's listed below: blocks, scripts, styles, icons, and placeholder assets.

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
- Page routes (`/`, `/adventures/`, `/adventures/{slug}`, etc.) and the `nav`/`footer` content fragments the `header`/`footer` blocks fetch (`/nav.plain.html`, `/footer.plain.html`) are all DA documents, not files in this repo — see "What this project is" above.

## The DA authoring round-trip constraint (read before authoring any new block content)

DA's authoring round-trip only preserves a custom class name — or any non-standard attribute, `aria-label` included — on content that is shaped as genuine div-rows with div-cells (the "table block" convention: a wrapper div containing row divs, each row's content wrapped in at least one more div). Confirmed by direct testing against this live project, not from documentation:

- A native `<ol>`/`<ul>` list, or plain text, sitting directly inside a block's wrapper div loses that wrapper's class entirely on the authoring round-trip.
- A bare (non-div-wrapped) element sitting in a row next to a real cell div — e.g. an unwrapped `<picture>` beside a `<div>text</div>` — gets silently dropped; only the div-wrapped sibling survives.
- This is **not** about whether a matching `blocks/{name}/` folder exists in the code repo — the folder alone doesn't fix it. The authored HTML shape is what matters.

`breadcrumbs`, `meta-list`, `filters`, and `byline` all had to be rebuilt this way (one row per item/fact, each wrapped in a cell div) with their `decorate()` reconstructing the real semantic element (`<ol>`, `<ul>`, `<p>`) client-side — see `blocks/breadcrumbs/breadcrumbs.js` for the reference implementation. Follow the same shape for any new non-grid block content. Full write-up: `docs/component-registry.md`.

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
