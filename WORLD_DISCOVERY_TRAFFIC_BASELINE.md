# World Discovery — 14-day search & traffic baseline

Baseline window: **2026-09-05 through 2026-09-19**.

Purpose: observe Search Console, indexing, live-site and repository evidence before broad SEO changes. During this window, only confirmed P0/P1 production or indexing blockers should change the public website. Each unavoidable website change must be logged with time, affected URLs and expected effect.

## Baseline entry — 2026-09-05 22:00 CEST

### Google Search Console

- Earliest non-zero daily search-performance row visible in the current connector pull is 2026-08-25.
- 2026-08-25 through 2026-09-03: **2,761 impressions, 3 clicks, 0.109% aggregate CTR, 36.90 impressions-weighted average position**.
- Initial pull had incomplete 2026-09-04 fresh data; later same-evening refresh materially revised it upward. Fresh data must therefore be treated as provisional and never compared as if finalized.
- 2026-08-29 through 2026-09-04 page signal: `https://worlddiscoverydata.com/data/gdp-per-capita/` had **589 impressions, 0 clicks, average position 7.99** in the earlier observation. This remains a watch candidate; do not change it during baseline unless a technical defect is confirmed.
- Same initial window geography signal: United States had **1,209 impressions, 0 clicks, average position 16.63**. Treat as a ranking opportunity, not yet as proof of a cause.
- Same initial window device signal: desktop **2,337 impressions / 1 click / 0.04% CTR / position 34.72**; mobile **80 impressions / 2 clicks / 2.5% CTR / position 26.56**; tablet 1 impression. Sample sizes remain too small for a causal conclusion.
- Search Appearance returned no rows in the initial observation window.

### Indexing / sitemap / crawl signals

- Search Console sitemap: `https://worlddiscoverydata.com/sitemap.xml`.
- Last submitted: **2026-08-24 18:42:18 UTC**.
- Last downloaded by Google: **2026-09-05 17:55:45 UTC**.
- Search Console reports **1,500 submitted URLs, 0 errors, 0 warnings**.
- Repository `site/robots.txt` allows crawling and points to the canonical sitemap.
- The checked-in `site/sitemap.xml` is a seed sitemap; `scripts/add-wdi-pages-to-sitemap.mjs` expands it at build time with current verified `/data/` indicator pages, country pages and `/compare/`.
- Coverage / URL Inspection is not exposed as a usable read in the current connector tool surface. Do not infer coverage/canonical decisions from unavailable API data.

### Repository / deployment / live-site evidence

- No open pull requests were found at the initial observation time.
- Latest observed GitHub Pages deployment for commit `0c4e4da3078d150c11d13db19d4dce14cc16d416` completed successfully on 2026-09-05; recent CI on main was green.
- Live `/data/gdp-per-capita/` is substantive with current data, country comparison, ranking, history controls and World Bank WDI provenance.
- Legacy repository page `site/indicators/gdp-per-capita/index.html` self-canonicalizes to `/indicators/gdp-per-capita/` and contains obsolete copy. Search Console records impressions for both `/data/gdp-per-capita/` and `/indicators/gdp-per-capita/`. This remains a consolidation watch item.

## Baseline refresh — 2026-09-05 22:57 CEST

### Fresh Search Console signal

- A new connector refresh with `include_fresh_data=true` now reports **2026-09-04: 477 impressions, 0 clicks, avg position 39.52** and **2026-09-05 so far: 163 impressions, 1 click, avg position 24.84**. The earlier 82-impression Sep-04 snapshot was therefore incomplete fresh data, demonstrating why intraday values must not be treated as finalized.
- The Sep-05 click is attributed at page level to `https://worlddiscoverydata.com/indicators/internet-use/country/bgd/`: **1 click / 6 impressions / 16.67% CTR / avg position 3.83** across Sep 4–5 page rows. This is a useful first concrete long-tail success signal, but too small to optimize around yet.
- Sep-05 query/page rows are overwhelmingly **non-branded**. Visible examples include `papua new guinea population growth rate 2023 world bank` → `/countries/png/` at position 10 and `netherlands population 2023 female life expectancy` → `/countries/nld/` at position 11. This supports the hypothesis that detailed country/data pages can acquire specific informational long-tail visibility.
- Several `/data/` pages have small but notable Sep 4–5 first-page samples with zero clicks: inflation **42 impressions / pos 7.38**, renewable-energy-consumption **18 / 3.50**, agricultural-land-share **11 / 3.64**, infant-mortality **11 / 4.73**, health-expenditure-share-of-gdp **11 / 6.73**, gdp-growth **10 / 3.70**. Samples are provisional and too small for snippet edits during baseline.
- Legacy/current GDP split remains visible in fresh page rows: `/indicators/gdp-per-capita/` **3 impressions / pos 5.33** versus `/data/gdp-per-capita/` **5 impressions / pos 19.8** across Sep 4–5. This strengthens the consolidation concern but still does not establish Google's selected canonical.
- Evidence URL duplication is also now visible: `/evidence/japan-population-revision-2025/` and the same path with `/index.html` both receive impressions. Add to technical consolidation watchlist; no change during baseline absent stronger evidence.

### Change log

- **Public website changes:** none.
- **Measurement-only repository changes:** baseline file created and refreshed. No SEO/content/URL/UI behavior intentionally changed.

### Current watchlist

1. **Fresh-data volatility — confirmed operational lesson.** Never interpret partial current-day / recently refreshed GSC values as finalized trend changes.
2. **Long-tail country/indicator visibility — emerging positive signal.** Specific non-brand informational queries are already producing first-page positions, and Bangladesh internet-use produced the current fresh click.
3. **CTR opportunity across `/data/` pages — emerging, not actionable yet.** Several indicators show first-page positions but zero clicks on small samples; track persistence and query intent before editing snippets.
4. **Legacy `/indicators/` vs `/data/` consolidation — strengthened technical concern.** Both GDP URLs continue to receive impressions.
5. **`/index.html` evidence duplication — new technical watch item.** Confirm recurrence and canonical behavior before deciding whether a redirect/canonical cleanup qualifies as necessary.
6. **Sitemap health — currently healthy.** No P0 sitemap action indicated.
