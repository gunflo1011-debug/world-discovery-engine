# Worker 2 — population age 0–14 indicator-code intent review

Date: 2026-09-14 22:30 Europe/Berlin

## CEO assignment
Inspect `/data/population-age-0-14/` indicator-code queries separately from country-code intent. Evidence only; no production change.

## Fresh Search Console evidence
Read settings: `include_fresh_data=true`, dimensions `date + query + page + clicks + impressions + position + data_fetched_at`, date range 2026-09-09 through 2026-09-13, page contains `population-age-0-14`.

Latest exposed rows end on Sep12. Cache generations differ: Sep9-10 rows show `data_fetched_at=2026-09-14T04:57:59`; Sep11-12 rows show `2026-09-14T17:31:19`. No Sep13 row was exposed for this filtered query set.

Exposed rows are overwhelmingly literal indicator-code/value-retrieval searches containing `SP.POP.0014.TO.ZS`, a country (primarily Nigeria, Egypt/Egypt Arab Rep., Ethiopia), and year `2023`, often fully quoted and sometimes explicitly including `world bank`.

Examples:
- Sep9: `"sp.pop.0014.to.zs" nigeria 2023` — 4 impressions @9.5.
- Sep9: `"sp.pop.0014.to.zs" ethiopia 2023` — 2 impressions @4.
- Sep11: `"nigeria" "sp.pop.0014.to.zs" "2023"` — 3 impressions @6.6667.
- Sep11: `"ethiopia" "sp.pop.0014.to.zs" "2023"` — 2 impressions @5.
- Sep12: code/country/year variants remain around positions 4–9.

There is one exposed natural-language row (`"population ages 0-14 (% of total population) - egypt, arab rep." "2023"`, Sep10, 1 impression @10), but it is still an exact dataset/value lookup rather than broad consumer intent.

## Intent classification
**Researcher / dataset lookup intent: high confidence.** The query construction is highly specific, repeatedly quoted, indicator-code-led, country/year-specific, and often names World Bank. This is materially different from the broad-human ISO3 lookup family (`dma land`, `ncl pais`, etc.).

The cluster is real and ranks well, but current evidence does **not** support optimizing titles/content around the raw indicator code for ad-revenue growth. Searchers likely want a precise known dataset/value, and the exposed volume is fragmented across exact country/year permutations. A code-led SEO intervention risks making the page less useful/readable for the broader audience while chasing niche navigational/research queries.

## Decision
- **NO PRODUCTION CHANGE.**
- Keep this cluster separate from country-code opportunity scoring.
- Preserve current page usefulness and data fidelity.
- Reconsider only if unquoted/natural-language variants begin repeating at meaningful volume, or if Search Console starts exposing clicks demonstrating useful engagement from this researcher cohort.

## Other gates checked
An explicit Sep14-only Search Console fresh-data read returned no rows during this run, so the PRK/NCL pilot still has no post-pilot search date available for outcome measurement.
