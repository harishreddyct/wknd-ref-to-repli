# Component registry

Source of truth for what's built and where it's used. Check before creating anything — see `.claude/skills/reference-site-replication/references/naming-rules.md`.

**Scope note on all rows below**: the reference (wknd.site) is classic AEM, not Edge Delivery Services — no `data-block-name` or other reliable component-name attributes were exposed in the fetched markup. Every "Implementation" name below is Claude's own semantic naming, not a name recovered from the reference. Colors, exact spacing and the font stack are also Claude's own choices (semantic placeholders), not values read from the reference's computed styles — no browser/computed-style access to the live site was available in this environment, only a markdown-converted read of each page's rendered content and links.

| Reference (as observed) | Implementation | Used On | Variants | JS | Images | LCP Risk | CLS Risk | Status |
|---|---|---|---|---|---|---|---|---|
| Primary nav + language selector + sign in | `header` | all pages | — | minimal (menu toggle) | No | Low | Low | complete |
| Footer nav + social row + copyright | `footer` | all pages | — | minimal (icon decoration) | No | Low | Low | complete |
| Hero carousel (home) / page banner (listing pages) / trip photo carousel (adventure detail) | `hero` | /, /adventures, /magazine, /faqs, all adventure detail pages | `hero-static` (1 slide), `hero-carousel` (2+ slides) | minimal (carousel controls only; static variant has none) | Yes | High — always the LCP candidate where present | Medium (carousel swaps slide visibility, no layout shift since inactive slides are `display:none` at fixed aspect ratio) | complete |
| Article card / Adventure card (same responsibility observed on both content types: image + title + description + link) | `cards` | /, /magazine, /adventures, all detail pages | `default` (grid), `feature` (single large horizontal card), `list` (single-column, horizontal at desktop), `locked` (members-only teaser) | none | Yes | Low–Medium (grid can appear below the fold) | Low | complete |
| Adventures category filter buttons | `filters` | /adventures | — | minimal (client-side show/hide by `data-category`, set by a `cards` block in the same section) | No | n/a | Low | complete |
| Contributors / WKND Guides team grid | `team` | /about-us | `guides` (3-column at desktop vs. default 4-column) | none | Yes | Low | Low | complete |
| Overview / Itinerary / What to Bring tabs (adventure detail) | `tabs` | all adventure detail pages | — | minimal (ARIA tablist: click + arrow-key switching — this one genuinely needs JS, see `eds-performance-seo.md`'s JS section) | No | n/a | Low | complete |
| "WKND Adventures" text CTA banner (no image, brand-colored background) | *(not a block — `section-metadata` style `cta-banner` + default content; a text-only single-use banner doesn't need a component, see naming-rules.md)* | / | — | none | No | n/a | Low | complete |
| Breadcrumbs ("Magazine > Article Title") | `breadcrumbs` | all detail pages | — | none (decorate() only rebuilds the `<ol>` from authored rows — see note below) | No | n/a | Low | complete |
| Sequential FAQ headings/answers (no accordion observed on the reference) | *(not a block — plain headings/paragraphs, `section-metadata` style `narrow`)* | /faqs | — | none | No | n/a | Low | complete |
| Trip metadata (Activity/Type/Duration/Group Size/Difficulty/Price) | `meta-list` | all adventure detail pages | — | none (decorate() only rebuilds the `<ul>` — see note below) | No | n/a | Low | complete |
| Byline ("By {name} — {role}") | `byline` | all magazine articles | — | none (decorate() only rebuilds the `<p>` — see note below) | No | n/a | Low | complete |

## DA (Document Authoring) deployment

This project is deployed as a real Adobe Edge Delivery Services site, not just a local static build:

- **Code**: `https://github.com/harishreddyct/wknd-ref-to-repli` (private repo), synced by AEM Code Sync.
- **Content**: authored at `https://da.live/#/harishreddyct/wknd-ref-to-repli`, pushed programmatically via the `admin.da.live` source API (no DA API/MCP tool was available in this environment, so content was authored as local HTML files matching DA's document shape, then PUT via `curl`/a small Node script — see `docs/page-registry.md`).
- **Preview**: `https://main--wknd-ref-to-repli--harishreddyct.aem.page/`
- **Live**: `https://main--wknd-ref-to-repli--harishreddyct.aem.live/`

### The DA authoring round-trip constraint (important — affects every future block)

Confirmed by direct, repeated testing against the live project (not documentation): **DA's authoring round-trip only preserves a custom class name, or any non-standard attribute (`aria-label` included), on an element when that element is part of a genuine div-row/div-cell ("table block") shape** — i.e. the block's wrapper div contains one or more row-divs, and each row's actual content is wrapped in at least one more div (a "cell"). Concretely:

- `<div class="hero"><div><picture>…</picture></div></div>` → survives (row > cell).
- `<div class="hero"><div><picture>…</picture><div>text</div></div></div>` (bare `<picture>` alongside a cell div, not itself wrapped) → the bare picture is **dropped**, only the div survives.
- `<div class="breadcrumbs"><ol><li>…</li></ol></div>` (a native list, no row/cell divs at all) → the **whole wrapper class is discarded**, leaving a bare `<ol>`.
- `<div class="filters">Climbing, Cycling…</div>` (plain text, no rows) → same: class discarded.
- `<a href="#" aria-label="…">` sitting bare in otherwise-plain content → the `aria-label` itself is stripped, independent of any class.
- **Update, confirmed later**: `aria-label` (and other non-standard attributes) on an `<a>` is stripped **unconditionally, even inside a fully correct div-row/div-cell block** — e.g. a hero slide's CTA link lost its `aria-label` despite the hero block itself surviving perfectly. Only `href` (and presumably `title`) reliably survive on anchors. Don't rely on an authored `aria-label` for link accessible-name/SEO purposes anywhere in this project; either make the *visible* link text descriptive (what fixed the SEO `link-text` audit on the "Read More" CTA — changed to "Read {article title}") or set the attribute programmatically in the block's `decorate()` after fetch (what `footer.js` does for its social-icon labels).

This is **not** about whether a matching `blocks/{name}/` folder exists in the code repo — creating the folder alone did not fix it; the authored HTML shape is what matters. Every block in this project that isn't naturally row-shaped (`breadcrumbs`, `meta-list`, `filters`, `byline`) had to be re-authored as one-row-per-item with a div-wrapped cell, and its `decorate()` rewritten to reconstruct the real semantic element (`<ol>`, `<ul>`, `<p>`) client-side — see `blocks/breadcrumbs/breadcrumbs.js` for the reference implementation and rationale, and apply the same shape to any new non-grid block content authored here in the future.

A second-order consequence: `decorateButtons()` (in `scripts/aem.js`) treats any link that's the lone child of a cell div as a CTA button. Since breadcrumb links now live in exactly that shape, `breadcrumbs.js` explicitly strips the `button`/`primary`/`secondary` classes back off before use — don't remove that without checking the rendered output.

## Notes

- **Social icons** — the reference's footer links to Facebook/Twitter/Instagram. Per explicit user decision, these are rendered as one generic, non-brand-specific glyph (`icons/social.svg`) rather than the platforms' trademarked logos. Alt/aria text still names the intent ("Follow…") without claiming a specific platform mark.
- **WKND wordmark** — rendered as plain text ("WKND Adventures"), not as any specific logotype/graphic mark recovered from the reference. No logo artwork was reproduced.
- **Language/region selector** — the reference exposes 7 country/language combinations with real per-locale routing (`/us/en/…`, `/ca/fr/…`, etc.). This project scopes that down to a single visual-only region indicator in the header (`.nav-region`, no functional dropdown or i18n routing) — implementing real multi-locale routing was judged out of scope for a mock structural replication. Flagged here and in the final report, not decided silently.
- **`cards` vs `team`** — both are "image + text + link" at a glance, but kept as two components: `cards` always uses a landscape (4:3) content-preview image and left-aligned text; `team` always uses a circular portrait and centered text. Per naming-rules.md, a real structural/behavioral difference stays two components rather than being forced into one with a `shape` prop that would need to override half the layout.
- **Content sourcing changed mid-project — see `docs/page-registry.md`'s "Content sourcing" section.** Text (headlines, article/trip copy, contributor names, FAQ answers) is now the real wknd.site content, fetched verbatim, per an explicit later user instruction reversing the original "use mocks for everything" direction. Images remain original generated placeholders — that half of the original decision stands, confirmed explicitly again when the content decision changed (wknd.site's photos are licensed Adobe Stock assets per the site's own footer disclaimer).
- **Bugs found during validation, local build** (visual/interaction/Lighthouse pass against the static local site): `scripts/scripts.js`'s `loadHeader`/`loadFooter` weren't loading `header.css`/`footer.css` at all (only the JS), `blocks/hero/hero.js`'s static (single-slide) variant never set the `data-active` attribute its own CSS requires to render, and the mobile nav's expand/collapse toggle in `blocks/header/header.js` had inverted logic.
- **Bugs found during validation, DA deployment** (after pushing content through the real authoring pipeline — see the constraint note above): `hero.css`'s `.hero-slide > div:last-child` rule (meant for the text-overlay cell) also matched a lone image-only cell once every `<picture>` had to be div-wrapped, collapsing every single-image hero to zero height — fixed with `:not(:first-child)`; `breadcrumbs`/`meta-list`/`filters`/`byline` all lost their wrapper class because they were authored as native lists/plain text instead of row/cell divs (rebuilt as real blocks, see above); the footer's social-icon `aria-label`s were stripped for the same reason (now set programmatically in `footer.js` instead of relying on the authored attribute). None of these were visible from static code review — only from actually pushing content through DA and rendering the deployed pages.
