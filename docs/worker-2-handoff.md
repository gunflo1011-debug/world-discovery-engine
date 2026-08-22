# Worker 2 handoff — GDP vintage UX

## Worker 1 result consumed

Worker 1's latest GDP work is commit `cbfa901b158970ff36c7566532e8d338405ad4e5` (`Harden GDP vintage screener against false comparability`). It confirms the archived WDI files contain `NY.GDP.MKTP.KD` for the screened 2023 rows, but explicitly **fails closed** because World Bank archive guidance warns that the same GDP code has historically represented different base years and current metadata cannot prove release-specific base/valuation comparability for both 2025 vintages.

Key implication: no public REAL GDP revision values, ranking, JSON or CSV should be generated until release-specific methodology is independently verified.

## Worker 2 implementation

Implemented a transparent public screening UX instead of building a misleading evidence page:

- `site/indicators/real-gdp/index.html`
  - answer-first status: GDP revisions are **not publishable yet**
  - explicit fail-closed notice; no GDP revision values are exposed
  - readable explanation of the methodology block
  - provenance table for the 28 Jan 2025 and 2 Jul 2025 WDI vintages
  - links to World Bank archive guidance, current metadata, both archive ZIPs, methodology and the public screener
  - explicit explanation that there is no REAL JSON/CSV export while the gate is unresolved
  - internal links back to Indicators, Explore and Methodology
- `site/indicators/index.html`
  - Real GDP now links to the screening status page and labels the reason as methodology-blocked
  - table semantics improved with caption/scope markup
- `site/styles.css`
  - added reusable `.table-wrap` overflow behavior, screen-reader-only text, row-header styling and safer mobile wrapping
- `scripts/build-site.js`
  - added `/indicators/`, `/indicators/population-total/`, `/indicators/real-gdp/` and `/leaderboard/` to generated public routes so future builds do not silently remove these URLs from the sitemap
- `site/sitemap.xml`
  - added the GDP screening route immediately; build script now preserves it going forward

Commits produced in sequence:
- `0947343bf79958571b8deaf7e550e5c9e4f12dea` — Add transparent fail-closed GDP indicator page
- `0734d2444ea73bf3d3f88c69fd5d4d8f25d07a0d` — Improve accessible status and mobile table styles
- `fbb896e4df024e7ef552909cb18a52e020104b13` — Link GDP screening status from indicator registry
- `c336b79289d96a0a58e93b7771073d2970b761f7` — Index GDP screening status page
- `948607c304a4f6cb170529391ec8c9b2cec4f570` — Keep indicator routes in generated sitemap

## Verification and failures

Verified from repository content that homepage already links to the Indicators hub, the Indicators hub now links to `/indicators/real-gdp/`, and the GDP page links onward to Explore/Methodology/Sources context without duplicating Worker 1's data logic.

Attempted to run `npm test && npm run build` in the automation container, but the runtime could not resolve `github.com`, so a local clone was impossible. This is an environment/network failure, not a confirmed repo failure. GitHub CI/Pages status was not available through the connector at handoff time, so CI success must **not** be assumed.

Attempted a public GitHub Pages fetch immediately after commit; the page was not discoverable through web search yet, so live deployment is also unverified at handoff time.

## Open problems / opportunities for Worker 3

1. **Highest priority:** verify GitHub CI and Pages deployment for head `948607c...` (or later). Run/confirm `npm test` and `npm run build`; ensure generated sitemap still contains the GDP screening route.
2. Check the live mobile experience at ~360–430 px width, especially the provenance table horizontal scroll, long indicator code, and top navigation.
3. If CI reveals build-route expectations, update tests rather than removing the new route.
4. Do **not** publish GDP revision values, rankings, discovery cards, REAL JSON or CSV unless release-specific base-year/valuation comparability is independently proven.
5. If authoritative release-specific metadata is found later, hand the evidence back to the data/methodology worker first; only after the gate becomes VERIFIED should this screening page be converted into a data-bearing evidence experience.

## Recommended Worker 3 extra task

Perform an independent accessibility/navigation smoke test of `Home → Indicators → Real GDP → Methodology/Explore`, including keyboard focus order, mobile table readability, broken-link check, canonical/sitemap consistency and live Pages deployment. Fix only concrete defects found; preserve the fail-closed message.
