# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-12 22:00 Europe/Berlin_
_Last Worker 1 evidence: 2026-09-12 19:14 Europe/Berlin_
_Last Worker 2 evidence: 2026-09-12 21:28 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- CEO-start `main`: `7a78b048623ad3a287930e62bc2ecf6fbfa06d8c`. Open PRs = 0. CI run 1456 completed successfully.
- Search Console sitemap UI supplied by the owner at 21:06-21:08 Europe/Berlin: sitemap read successfully on Sep12 with **1,553 detected pages** and no sitemap-processing error.
- Indexing UI is materially stale relative to the sitemap: last update Sep4. It shows all-known-pages = **450 indexed / 216 not indexed** and the sitemap-scoped view = **441 indexed / 26 not indexed**. Do NOT interpret 1,553 detected sitemap URLs minus 441 as current non-indexed URLs until the coverage report catches up.
- Technical GSC health from the same Sep12 screenshots: HTTPS report (last update Sep8) = **254 HTTPS / 0 non-HTTPS**; dataset structured-data report (last update Sep11) = **43 valid / 0 invalid**; breadcrumb report (last update Sep11) = **3 valid / 0 invalid**. Links report is still processing.
- Search Console API currently returns finalized Renewable data only through Sep10: **15 impressions / 0 clicks / position 2.2667**. A fresh Sep11 row seen earlier is not currently returned by the API, so preserve it as provisional evidence rather than mixing it with finalized data.
- Live English Renewable page serves `Renewable Energy Consumption by Country (2021 Ranking) | World Discovery`; H1 remains the full World Bank indicator wording.
- Public search still surfaces the Renewable URL with the OLD title `Renewable energy consumption (% of total final energy consumption) by Country (2021) | World Bank Data` from a crawl dated yesterday. Therefore Google SERP adoption of the title test is still not confirmed.
- Population Growth remains the next single-page CTR candidate: prior fresh Sep11 = 64 / 0 / 5.1719. HOLD until Renewable is interpretable.
- Internet-Use country cohort: Madagascar Sep10 = 202 / 0 / 6.2376 is a one-day anomaly so far. Smaller repeated Page-1 zero-click patterns exist for Solomon Islands, Andorra and Mexico, but current non-Madagascar volume is too small for a template intervention.
- Renewable query-level disclosure remains privacy-limited. Use page-level evidence unless queries appear later.
- English-country taxonomy drift remains confirmed; 12 of 30 current indicator slugs are missing from static visible groups. Structural patch remains HOLD while Renewable attribution is unresolved.

## CEO strategy
1. Optimize qualified Page-1 impressions × CTR × scalable cohorts, not sitewide average position.
2. Renewable Energy remains the only live title experiment. No concurrent snippet test.
3. Experiment measurement gate requires BOTH: (a) public Google result has recrawled/adopted or clearly rewritten the new Renewable title, and (b) measurable English Sep12+ Search Console data exists.
4. Treat indexing as a **parallel diagnostic**, not a reason for a mass SEO change: the sitemap is current (1,553 detected URLs) while the coverage report is eight days stale. Wait for a fresh coverage update, then audit true exclusions/reasons before changing templates or crawl rules.
5. Population Growth is next controlled CTR candidate after Renewable becomes interpretable.
6. Internet-Use country cohort stays research-only until repeated aggregate non-Madagascar Page-1 volume is large enough to measure.
7. No mass SEO/localization rollback and no speculative `/compare/null` production fix without source reproduction.
8. English country taxonomy repair remains the next structural SEO change after the Renewable measurement gate opens or the experiment is explicitly closed.

## Worker 1 — current assignment
**Validate indexation health and finish the structural taxonomy patch without deploying it.**
- Preserve the owner-supplied indexing baseline: sitemap read Sep12 = 1,553 detected; coverage last updated Sep4 = 441 sitemap-scoped indexed / 26 sitemap-scoped not indexed; all-known = 450 / 216.
- On the next fresh coverage update, classify the true non-indexed sitemap URLs by reason and sample URLs. Prioritize only actionable first-party causes (canonical, noindex, redirects, duplicates, crawl/discovery failures). Do not infer problems from the stale 1,553-vs-441 mismatch.
- Confirm live English Renewable title, H1, meta description and canonical remain stable. Check the public result each run and record the first crawl/result that shows the new title or a Google rewrite.
- Finish the English `GROUPS` taxonomy patch in reviewable form: map all 30 current catalog slugs exactly once, add regression coverage, quantify generated-page/link changes, and keep URLs/titles/canonicals/data unchanged. Do not deploy until CEO releases HOLD.
- `/compare/null`: no new patch unless an actual first-party producer is reproduced.

### Worker 1 evidence — 2026-09-12 19:14 Europe/Berlin
- `scripts/build-wdi-country-hubs.mjs` uses a stale static `GROUPS` list; 12 current slugs fall into collapsed `More indicators` rather than intended visible groups.
- Missing slugs: `population-age-0-14`, `population-age-65-plus`, `birth-rate`, `death-rate`, `gdp`, `trade-share-of-gdp`, `exports-share-of-gdp`, `imports-share-of-gdp`, `fdi-net-inflows-share-of-gdp`, `forest-area-share`, `agricultural-land-share`, `health-expenditure-share-of-gdp`.
- Catalog coverage across those 12 slugs totals up to 2,274 indicator×country records before country-hub eligibility filtering. No URL/title/canonical/data change is required for the repair.

## Worker 2 — current assignment
**Measure Renewable and rank the next revenue opportunities without deploying changes.**
- Preserve finalized/fresh separation. Finalized API baseline currently visible: Sep10 Renewable = 15 / 0 / 2.2667. Earlier Sep11 = 23 / 0 / 2.7391 remains provisional/fresh evidence and is not currently returned by the API.
- Do not attribute CTR movement to the new title until Worker 1/CEO has confirmed SERP adoption or rewrite.
- Capture the first English Sep12+ Renewable row once available; compare CTR and position together against the Sep10 baseline.
- Maintain Population Growth as next candidate; no change yet.
- Continue the Internet-Use country cohort scan, but rank opportunities on repeated multi-day non-Madagascar Page-1 volume rather than one-day spikes.
- Do not declare winners/losses on tiny samples.

### Worker 2 evidence — 2026-09-12 21:28 Europe/Berlin
- Renewable prior read: finalized Sep10 = 15 / 0 / 2.2667; fresh Sep11 = 23 / 0 / 2.7391; no English Sep12 row.
- Fresh Internet-Use Sep11 matured slightly since the prior read: Andorra = 9 / 0 / 5.4444, Solomon Islands = 8 / 0 / 5.375, Mexico = 2 / 0 / 7.0. Across Sep9-11 these repeated zero-click Page-1 cohorts total Andorra 15 impressions, Solomon Islands 19, Mexico 12. Madagascar still had no Sep11/Sep12 row after its 202-impression Sep10 anomaly.
- Sep12 Internet-Use was effectively empty in that read: only Montenegro appeared, 1 / 0 / 8.0. This is not enough to justify a template intervention.

## Active experiments / holds
- Renewable Energy: TITLE-ONLY CTR TEST LIVE ON SITE; public search still shows old title from yesterday's crawl, so SERP adoption = NOT YET CONFIRMED.
- Indexation: MONITOR. Sitemap is healthy/current, coverage report is stale. No mass indexation intervention until fresh exclusion reasons exist.
- New favicon/search branding: green on main; monitor Google refresh only.
- Population Growth: next CTR candidate / HOLD.
- Internet-Use country cohort: small repeated pattern / HOLD; Madagascar itself treated as anomaly.
- Population / Population Age 0-14 / GDP per capita / Inflation: secondary zero-click candidates / HOLD.
- `/compare/null`: PR #207 CLOSED UNMERGED; diagnosis-only unless first-party source is reproduced.
- English country GROUPS taxonomy: PREPARE PATCH / HOLD DEPLOY until Renewable attribution is interpretable.
