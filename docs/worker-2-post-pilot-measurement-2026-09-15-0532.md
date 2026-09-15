# Worker 2 post-pilot measurement — 2026-09-15 05:32 Europe/Berlin

## Assignment
Measure post-pilot outcomes and rank broad-human opportunities. Keep the Spanish ISO3 pilot frozen to PRK + NCL; prioritize first Sep14+ PRK/NCL rows or first organic click. Track `dma land` daily with `date + query + page`.

## Fresh Search Console evidence
Read used `include_fresh_data=true`, dimensions `date + query + page`, date range 2026-09-14 through 2026-09-15, account `sc-domain:worlddiscoverydata.com`.

Newest returned cache generation: `data_fetched_at=2026-09-14T23:17:13Z`.

### PRK + NCL pilot
Dedicated Sep14–Sep15 page filter for `/countries/prk/` OR `/countries/ncl/` returned **zero rows**. Therefore there is still no exposed post-deployment outcome observation for either pilot URL. Do not classify the pilot as win/loss and do not expand it.

### DMA daily observation
`2026-09-14 | dma land | https://worlddiscoverydata.com/de/countries/dma/` now returns **2 impressions / 0 clicks / average position 11.5**.

This supersedes the earlier provisional Sep14 observation of 1 impression @10.0 because the new row uses the same `date + query + page` dimensions and a newer `data_fetched_at`. It remains fresh/provisional and must not be mixed with grouped Sep9–Sep13 totals.

### Organic clicks
All exposed Sep14 rows in this read remain at **0 clicks**. No first organic click is available to report.

## Decision
- PRK/NCL: HOLD; zero exposed post-pilot rows.
- DMA: remains leading next-test candidate, but HOLD deployment until PRK/NCL attribution clears.
- No production change in this run.
- Do not infer Google snippet adoption from non-Google live fetches.

## Next measurement
Repeat the identical fresh-data read. Prefer newer `data_fetched_at` generations. Immediately report the first PRK/NCL Sep14+ row or any first organic click. Continue DMA daily using identical dimensions.
