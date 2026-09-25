# Page registry

Every page on the site, its reference URL, and status. **Content is real**, sourced verbatim from wknd.site (headlines, article/trip copy, contributor names, FAQ answers) per explicit user direction — see the note below. Images stay generated placeholders (also an explicit user decision — wknd.site's photos are licensed Adobe Stock assets, not freely reusable).

**Pages are DA documents, not files in this repo** — see `docs/component-registry.md`'s "DA (Document Authoring) deployment" section for the code repo, DA project, and preview/live URLs. The routes below are paths on that deployment.

| Reference URL | Route | Status | Lighthouse (measured against production `.live`) |
|---|---|---|---|
| https://wknd.site/ | / | complete, deployed, real content | P:97-100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/magazine.html | /magazine/ | complete, deployed, real content | P:100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/magazine/western-australia.html | /magazine/western-australia | complete, deployed, real content | P:100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/magazine/arctic-surfing.html | /magazine/arctic-surfing | complete, deployed, real content | not run individually; same template scored as western-australia |
| https://wknd.site/us/en/magazine/san-diego-surf.html | /magazine/san-diego-surf | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/magazine/ski-touring.html | /magazine/ski-touring | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/magazine/guide-la-skateparks.html | /magazine/guide-la-skateparks | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures.html | /adventures/ | complete, deployed, real content | P:99-100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/adventures/climbing-new-zealand.html | /adventures/climbing-new-zealand | complete, deployed, real content | P:100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/adventures/bali-surf-camp.html | /adventures/bali-surf-camp | complete, deployed, real content | not run individually; same template as climbing-new-zealand |
| https://wknd.site/us/en/adventures/beervana-portland.html | /adventures/beervana-portland | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/colorado-rock-climbing.html | /adventures/colorado-rock-climbing | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/cycling-southern-utah.html | /adventures/cycling-southern-utah | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/cycling-tuscany.html | /adventures/cycling-tuscany | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/downhill-skiing-wyoming.html | /adventures/downhill-skiing-wyoming | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/gastronomic-marais-tour.html | /adventures/gastronomic-marais-tour | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/napa-wine-tasting.html | /adventures/napa-wine-tasting | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/riverside-camping-australia.html | /adventures/riverside-camping-australia | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/ski-touring-mont-blanc.html | /adventures/ski-touring-mont-blanc | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/surf-camp-costa-rica.html | /adventures/surf-camp-costa-rica | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/tahoe-skiing.html | /adventures/tahoe-skiing | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/west-coast-cycling.html | /adventures/west-coast-cycling | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/whistler-mountain-biking.html | /adventures/whistler-mountain-biking | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/adventures/yosemite-backpacking.html | /adventures/yosemite-backpacking | complete, deployed, real content | not run individually; same template |
| https://wknd.site/us/en/faqs.html | /faqs | complete, deployed, real content | P:100 A:100 BP:100 SEO:69* |
| https://wknd.site/us/en/about-us.html | /about-us | complete, deployed, real content | P:100 A:100 BP:100 SEO:69* |
| *(platform convention, not reference-specific)* | /404 | complete, deployed | not run |

\* **SEO 69, every page**: the only failing audit is `is-crawlable`. `*.aem.page`/`*.aem.live` serve `X-Robots-Tag: noindex, nofollow` and `Disallow: /` by design (their own robots.txt explains why — avoids duplicate-content penalties against a real production domain). Not a code defect; resolves with a real custom domain.

## Content sourcing (changed mid-project — read this before assuming anything is a placeholder)

The site was originally built with **entirely invented placeholder copy** (per the user's first instruction: "don't clone, use mocks for everything"). Partway through, once real DA authoring was working end-to-end, the user reversed that specifically for text: **"since we are do[ing] authoring, use data instead of mocks."** Confirmed scope via an explicit question: real text everywhere, but images stay placeholders (wknd.site's photos are licensed Adobe Stock assets per the site's own footer disclaimer — not something to reuse without a license).

So as of the current deployment:
- **All headlines, article bodies, trip descriptions, FAQ Q&A, and contributor names are the real wknd.site content**, fetched page-by-page and reproduced verbatim (see `docs/component-registry.md`'s "Real-content sourcing" note for how this was verified against Adobe's own license statement for the site).
- **The page/route set now matches the real site's actual inventory**: 5 real magazine articles (western-australia, arctic-surfing, san-diego-surf, ski-touring, guide-la-skateparks) and all 16 real adventures — not the 6 invented articles / 8 invented adventures from the first pass. The old invented-slug pages (`camper-vans-and-coastlines`, `ridge-line-climbing-weekend`, etc.) were deleted from DA and unpublished, not left alongside the real ones.
- **Images remain original placeholder SVGs**, reused across real content by theme (e.g. `article-skateparks.svg` for the real "Ultimate Guide to LA Skateparks" — same asset, just no longer paired with invented copy).
- The 7 real About Us contributors/guides (Stacey Roswells, Jake Hammer, Ian Provo, Jacob Wester, Sofia Sjöberg, Justin Barr, Kumar Selveraj) reuse the same 7 placeholder portrait images the invented contributors used — only the names/roles changed.
- The footer's real copyright text ("WKND is a fictitious adventure and travel website...") was adapted, not copied verbatim: the original says it's built with "Adobe Experience Manager Core Components" — this project isn't, so that clause was rewritten to accurately describe this build (EDS + DA) instead of leaving a false technical claim.

## Notes

- **Scope reduction**: the reference's 7-country/language selector and `/us/en/...`-style locale routing were not implemented — see `docs/component-registry.md`'s note on `.nav-region`.
- **Bugs found and fixed** (see `docs/component-registry.md`'s DA authoring constraint note for the full root-cause explanation): header/footer CSS wasn't loading at all (JS-only import bug); `hero`'s single-image variant never rendered (missing `data-active`); the mobile nav toggle's expand/collapse logic was inverted; a hero CSS rule collapsed every single-image hero to zero height once pictures had to be div-wrapped for DA; `breadcrumbs`/`meta-list`/`filters`/`byline` all lost their styling because they were authored as native lists/plain text rather than div-row blocks (rebuilt as real blocks); footer social-icon `aria-label`s were being stripped (now set client-side); a heading-level skip (h1→h3) in article bodies; `aria-label` on plain content anchors is *always* stripped by DA regardless of block context (confirmed directly) — the "Read More" CTA's SEO link-text issue was fixed by making the visible text descriptive ("Read Camping in Western Australia"), not by adding an aria-label; plus an earlier color-contrast failure, two touch-target-size failures, and a missing `<h2>` heading-order gap from the very first mock-content pass.
- **Lighthouse CLS noise**: one measurement run showed a spurious CLS regression on two pages when testing against the live CDN over a real network; re-running the exact same audit immediately after returned a perfect score. Treated as lab-data network variance, not a real defect.
