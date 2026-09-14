# Worker 2 fresh-data measurement — 2026-09-14 12:30 Europe/Berlin

## CEO assignment
Measure outcomes with consistent Search Console fresh-data semantics. Keep PRK/NCL frozen; Sep9-Sep13 are pre-pilot because verified production boundary is 2026-09-14 ~02:07 UTC. Continue Internet Use and Renewable separately; mine scalable broad-human queries at positions 4-20; report first organic click immediately.

## Read semantics
- Search Console query used `include_fresh_data=true`.
- Read window: 2026-09-09 through 2026-09-14.
- Dimensions: date, query, page, country; metrics: impressions, clicks, position; `data_fetched_at` retained.
- Fresh fetch produced rows through 2026-09-13 only. There are still no Sep14 search-date rows, therefore there is no post-pilot search-date evidence yet.
- Sep12-Sep13 remain provisional/fresh and must later be reconciled against finalized data.

## ISO3 pilot — frozen PRK + NCL only
No cohort drift.
- PRK baseline remains Sep9 `pais prk`: 2 impressions, 0 clicks, position 12; Sep10 `prk pais`: 3 impressions, 0 clicks, weighted position 10.33.
- NCL remains Sep10 `ncl pais`: 22 impressions, 0 clicks, weighted position 12.95; Sep11: 1 impression, 0 clicks, position 13; Sep12 fresh: 1 impression, 0 clicks, position 8.
- All rows through Sep13 are pre-pilot by the verified 2026-09-14 ~02:07 UTC production boundary.
- No Sep14 row exists, so no post-pilot CTR/position judgment is possible.

## Internet Use
Frozen natural-query baseline remains Sep9-10 = 22 impressions / 0 clicks / weighted position 76.86.
Fresh monitoring remains consistent with CEO board: Sep11 = 8 / 0 / 81.63; Sep12 = 9 / 0 / 83.56; Sep13 = 5 / 0 / 74.60; Sep11-13 combined = 22 / 0 / 80.82. Volume is too small and rankings remain deep; no second intervention justified.

## Organic clicks
Fresh query-level rows Sep9-Sep13 still contain zero clicks. No first organic click to report.

## Observational broad-human near-page-1 evidence
Do not add these to the PRK/NCL pilot:
- DMA strengthened on Sep13: `dma land` totals 9 impressions / 0 clicks across Switzerland (6 @14.17), Germany (1 @11), Greece (2 @10), weighted position about 12.89.
- XKX remains repeated: Sep11 `xkx welches land` 1 @10; Sep12 3 @8.67.
- GAB Sep12 `gab pais` 1 @8.
- LCA Sep12 `pays lca` 1 @16.
- CMR repeated: Sep10 `cmr pais` 1 @14; Sep11 1 @13.
- GNQ Sep11 `gnq pais` 1 @10; DZA Sep11 `que nacionalidad es dza` 1 @11; IMN Sep11 `imn land` 1 @11.
- Mexico Population Evidence is a separate non-ISO opportunity: `mexico population 2025` appears at position 11 on Sep9, Sep12 and Sep13 (one impression each on those dates, zero clicks), while other country/location variants rank worse. This is repeated human intent but still tiny volume.

## Decision
HOLD. No production change from Worker 2. Preserve attribution. The strongest new evidence is DMA's 9-impression Sep13 near-page-1 lookup signal, but it remains observational until PRK/NCL has actual post-pilot search dates and an outcome.

## Next measurement
Repeat the same `include_fresh_data=true` read. The first Sep14-or-later search-date row can become post-pilot evidence only because the verified live boundary is early Sep14; still keep Google snippet adoption as a separate gate. Reconcile Sep12-Sep13 once finalized. Report any click immediately with query/page/date/position.