# World Discovery — 14-day search & traffic baseline

Baseline window: **2026-09-05 through 2026-09-19**.

Purpose: observe Search Console, indexing, live-site and repository evidence before broad SEO changes. During this window, only confirmed P0/P1 production or indexing blockers should change the public website. Each unavoidable website change must be logged with time, affected URLs and expected effect.

## Baseline entry — 2026-09-05 22:00 CEST

### Google Search Console

- Earliest non-zero daily search-performance row visible in the current connector pull is 2026-08-25.
- 2026-08-25 through 2026-09-03: **2,761 impressions, 3 clicks, 0.109% aggregate CTR, 36.90 impressions-weighted average position**.
- 2026-09-04 is currently fresh/provisional: **82 impressions, 0 clicks, average position 82.11**. No 2026-09-05 row was available yet at this observation time.
- 2026-08-29 through 2026-09-04 page signal: `https://worlddiscoverydata.com/data/gdp-per-capita/` had **589 impressions, 0 clicks, average position 7.99**. This is the strongest initial CTR/search-intent watch candidate; do not change it during baseline unless a technical defect is confirmed.
- Same window geography signal: United States had **1,209 impressions, 0 clicks, average position 16.63**. Treat as the largest initial geographic ranking opportunity, not yet as proof of a specific cause.
- Same window device signal: desktop **2,337 impressions / 1 click / 0.04% CTR / position 34.72**; mobile **80 impressions / 2 clicks / 2.5% CTR / position 26.56**; tablet 1 impression. Desktop represented about **96.65%** of measured impressions in this window. Sample sizes are still too small for a causal conclusion.
- Query rows are currently noisy and include several low-intent or apparently unrelated terms. Relevant early terms include variants of `world bank data`, `worldbank data`, `us population data`, and `2024 vs 2023 internet growth`. Query-level clicks can be privacy-filtered and must not be reconciled mechanically against site-wide clicks.
- Search Appearance returned no rows for the current observation window.

### Indexing / sitemap / crawl signals

- Search Console sitemap: `https://worlddiscoverydata.com/sitemap.xml`.
- Last submitted: **2026-08-24 18:42:18 UTC**.
- Last downloaded by Google: **2026-09-05 17:55:45 UTC**.
- Search Console reports **1,500 submitted URLs, 0 errors, 0 warnings**.
- Repository `site/robots.txt` allows crawling and points to the canonical sitemap.
- The checked-in `site/sitemap.xml` is a seed sitemap; `scripts/add-wdi-pages-to-sitemap.mjs` expands it at build time with current verified `/data/` indicator pages, country pages and `/compare/`, explaining why Search Console can report substantially more submitted URLs than the checked-in seed file contains.
- URL Inspection fields exist in the connected Search Console schema, but a direct inspection request for the GDP-per-capita URL was not accepted by the connector in this run. Coverage/canonical conclusions must therefore come from later successful URL inspection or other verifiable evidence, not inference.

### Repository / deployment / live-site evidence

- No open pull requests were found at this observation time.
- Latest observed GitHub Pages deployment for commit `0c4e4da3078d150c11d13db19d4dce14cc16d416` (`data: refresh official WDI catalog`) completed successfully on 2026-09-05.
- Recent CI on main was green.
- Live `https://worlddiscoverydata.com/data/gdp-per-capita/` is a substantive current page with 2025 same-year data, 186-country comparison, ranking, year/history controls and World Bank WDI provenance.
- Legacy repository page `site/indicators/gdp-per-capita/index.html` still self-canonicalizes to `/indicators/gdp-per-capita/` and contains obsolete copy saying the country snapshot is not yet published. Search Console also records impressions for both `/data/gdp-per-capita/` and `/indicators/gdp-per-capita/`. This is a **technical consolidation watch item** because two materially different URLs can represent the same indicator intent. Do not change during baseline until live behavior and Google canonical/indexing evidence are confirmed; escalate immediately if the legacy URL is confirmed indexable/live with stale content and no intentional retirement behavior.

### Initial hypotheses / watchlist

1. **GDP per capita CTR opportunity — high signal, cause unconfirmed.** 589 impressions at average position 7.99 with 0 clicks is the strongest early page-level opportunity. Possible causes include query mismatch, weak SERP snippet relative to competitors, mixed old/new URL signals, or noisy impressions. Require repeated evidence before editing.
2. **United States ranking opportunity — medium/high signal.** 1,209 impressions at average position 16.63 and 0 clicks suggests considerable exposure just outside the first page for at least part of the US query mix. Identify the exact pages/queries driving it before action.
3. **Legacy `/indicators/` vs current `/data/` consolidation — medium/high technical concern.** Current repository evidence shows a self-canonical legacy GDP-per-capita page while the new data page is already receiving far more impressions. Confirm live/indexing state before deciding whether canonical/noindex/redirect/sitemap retirement is required.
4. **Desktop CTR gap — medium signal.** Desktop accounts for almost all measured impressions but almost no clicks, while mobile CTR is much higher on a tiny sample. Track for persistence rather than changing design/snippets now.
5. **Sitemap health — currently healthy.** Google downloaded the sitemap today with no reported errors or warnings; no P0 sitemap fix is indicated.

### Change log

- **Public website changes:** none.
- **Measurement-only repository change:** created this baseline file. No SEO/content/URL/UI behavior intentionally changed.
