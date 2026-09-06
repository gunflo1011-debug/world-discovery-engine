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

## Baseline refresh — 2026-09-06 00:00 CEST

- Fresh daily KPIs are unchanged from the prior pull: **2026-09-04: 477 impressions / 0 clicks / avg position 39.52**; **2026-09-05: 163 impressions / 1 click / avg position 24.84**. No new finalized day is available.
- Query-level decomposition adds useful evidence despite unchanged totals. Examples already ranking on the first page include `vanuatu population growth rate 2023 under 25` → `/countries/vut/` at positions **3 and 5** in two countries; `papua new guinea population growth rate 2023 under 25` → `/countries/png/` at position **8**; and several exact World Bank indicator-code queries (`SP.POP.0014.TO.ZS`, `SH.XPD.CHEX.GD.ZS`) → matching `/data/` pages at positions **4–10**.
- These are all visible as **non-branded** rows. Current evidence therefore favors a hypothesis that World Discovery is first earning visibility on highly specific factual/source-oriented queries before broad head terms.
- Sitemap remains unchanged and healthy: **1,500 submitted, 0 errors, 0 warnings; last downloaded 2026-09-05 17:55:45 UTC**.
- Repository has no newer product/code change after the baseline documentation refresh; no P0/P1 production issue was identified in this run.
- **Public website changes:** none. **Measurement-only change:** this baseline refresh appended.

## Baseline refresh — 2026-09-06 00:58 CEST

- Fresh Search Console daily KPIs are still unchanged: **2026-09-04: 477 impressions / 0 clicks / avg position 39.52**; **2026-09-05: 163 impressions / 1 click / avg position 24.84**. Finalized Search Analytics still ends at **2026-09-03**.
- Sitemap signal remains healthy and unchanged when queried on its actual submission date: **1,500 submitted URLs, 0 errors, 0 warnings; last downloaded 2026-09-05 17:55:45 UTC**. A multi-day sitemap query can sum repeated sitemap rows, so sitemap counts must be read from the submission row rather than treated as a time-series total.
- No open pull requests are present. No new product/code commit has landed since the measurement-only baseline refresh.
- New repository health evidence: scheduled **Search Console connectivity** and **Cloudflare analytics** workflows on main both completed successfully shortly before this check. This reduces concern about telemetry/connectivity failure but is not user-traffic evidence.
- Live home and `/data/gdp-per-capita/` remained reachable through the external web check. No confirmed P0/P1 live-site failure was observed. Direct low-level HTTP probing from the execution container was unavailable because that environment could not resolve the domain; this is an execution-environment limitation, not evidence of a production DNS outage.
- **Public website changes:** none. **Measurement-only change:** this baseline health-check note appended.

## Baseline refresh — 2026-09-06 02:00 CEST

- Fresh Search Console daily KPIs remain unchanged: **2026-09-04: 477 impressions / 0 clicks / avg position 39.52**; **2026-09-05: 163 impressions / 1 click / avg position 24.84**. No 2026-09-06 row is available yet, so no intraday movement is inferred.
- Sitemap remains healthy and unchanged: **1,500 submitted URLs, 0 errors, 0 warnings; last downloaded 2026-09-05 17:55:45 UTC**.
- No open pull requests and no new product/code commit were observed; only measurement-documentation commits have landed since the last product refresh.
- Rotating live check: home, `/countries/`, `/data/gdp-per-capita/` and `/compare/` are reachable. An initial direct external open of `/compare/` returned an extraction error, but following the live homepage's Compare link rendered the page successfully; treat this as a tooling/rendering artifact, not a production failure.
- No confirmed P0/P1 issue. **Public website changes:** none. **Measurement-only change:** this baseline refresh appended.

## Baseline refresh — 2026-09-06 04:59 CEST

- Fresh Search Console revised **2026-09-05** materially upward to **275 impressions / 5 clicks / 1.82% CTR / avg position 32.80**. This supersedes the earlier provisional 163/1 snapshot and is another direct demonstration that Fresh data must not be treated as final. No 2026-09-06 row is available yet.
- Page-level click attribution on Sep 05: `/` **1/1**, `/evidence/` **1/2**, `/indicators/internet-use/country/bgd/` **1/7**, `/indicators/internet-use/country/irn/` **1/2**, `/indicators/internet-use/country/kgz/` **1/1**. The three internet-use country pages are therefore the clearest repeated content-family click signal so far.
- Device split on Sep 05: desktop **265 impressions / 3 clicks / 1.13% CTR / pos 32.11**; mobile **10 / 2 / 20% / pos 51.2**. Mobile CTR is based on only ten impressions and is not actionable yet.
- Country split on Sep 05: Vietnam **5 impressions / 3 clicks / 60% CTR / pos 9.0**; Germany **13 / 2 / 15.38% / pos 51.69**. United States generated **166 impressions / 0 clicks / pos 20.06**, a notable but still one-day provisional opportunity signal.
- Visible query rows remain entirely non-branded in this pull. Specific factual/source-oriented queries continue to achieve first-page positions, while broad country-population head terms are mostly still far back. This further supports the working hypothesis that early traction is coming from narrow long-tail informational intent rather than broad terms.
- Several `/data/` pages still show first-page visibility without clicks on Sep 05, including population-age-0-14 **16 impressions / pos 5.63**, gdp-growth **9 / 2.67**, inflation **9 / 6.33**, health-expenditure-share-of-gdp **8 / 6.63**, renewable-energy-consumption **7 / 5.71**, death-rate **5 / 3.8**, and co2-emissions-per-capita **5 / 5.8**. Continue observing persistence before any CTR/content edits.
- Legacy `/indicators/gdp-per-capita/` remains visible (**3 impressions / pos 5.33** on Sep 05). The live `/data/gdp-per-capita/` page is healthy and substantive. Direct external extraction of the legacy URL again returned an internal extraction error; because similar tool/rendering artifacts have occurred before, this is not classified as a production failure without independent confirmation.
- Sitemap query in this connector run unexpectedly returned a null/zero row instead of the prior valid sitemap record. Treat this as connector-read anomaly; do not overwrite the last verified sitemap state (**1,500 submitted, 0 errors, 0 warnings, last downloaded 2026-09-05 17:55:45 UTC**) unless a subsequent valid read contradicts it.
- Repository remains measurement-only since the previous run: no open pull requests; latest commits before this refresh were baseline documentation commits. Live home and `/data/gdp-per-capita/` are reachable.
- No confirmed P0/P1 issue. **Public website changes:** none. **Measurement-only change:** this baseline refresh appended.
