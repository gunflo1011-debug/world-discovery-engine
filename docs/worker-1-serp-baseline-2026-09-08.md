# Worker 1 — SERP baseline and CTR test candidate

Date: 2026-09-08

## Scope
CEO assignment: preserve PR #198 post-deploy measurement window, compare clicked landing pages against high-impression zero-click `/data/*` pages, inspect whether GDP per capita's large impression count represents a genuine page-one CTR opportunity, and keep exactly one held snippet experiment.

## Freshest finalized GSC baseline
Search Console remains finalized through 2026-09-06. Sep 1-6 site total previously established by the CEO: 8 clicks / 3,720 impressions (~0.22% CTR).

### A. Landing pages already producing organic clicks
| Page | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| `/` | 2 | 7 | 28.57% | 3.71 |
| `/countries/irq/` | 2 | 4 | 50.00% | 102.00* |
| `/evidence/` | 1 | 4 | 25.00% | 3.50 |
| `/indicators/internet-use/country/bgd/` | 1 | 9 | 11.11% | 3.22 |
| `/indicators/internet-use/country/irn/` | 1 | 7 | 14.29% | 6.57 |
| `/indicators/internet-use/country/kgz/` | 1 | 3 | 33.33% | 7.00 |
| `/status/` | 1 | 6 | 16.67% | 5.00 |

`*` The Iraq country page's aggregate position is anomalous despite two clicks, so it should not be used as a template ranking benchmark without query-level inspection.

Most useful positive signal: three Internet Use country profiles independently convert small page-one impression sets into clicks. This supports continued investment in the quality and internal discoverability of that existing template family rather than mass page creation.

### B. Highest-impression `/data/*` pages with zero clicks
| Priority | Page | Clicks | Impressions | CTR | Avg position | Interpretation |
|---:|---|---:|---:|---:|---:|---|
| 1 | `/data/gdp-per-capita/` | 0 | 606 | 0% | 8.66 | Large aggregate visibility, but query evidence below shows the visible generic queries are mostly low-ranking; do not assume 606 impressions are all a CTR problem. |
| 2 | `/data/population-age-0-14/` | 0 | 168 | 0% | 5.71 | Strongest clean controlled CTR candidate: repeated exact WDI-code + country + year page-one queries. |
| 3 | `/data/inflation/` | 0 | 135 | 0% | 7.41 | Meaningful page-one aggregate visibility; retain as later candidate after first experiment. |
| 4 | `/data/unemployment/` | 0 | 90 | 0% | 8.22 | Page-one aggregate visibility; PR #198 exact lookup now live. |
| 5 | `/data/population-growth/` | 0 | 86 | 0% | 6.29 | Strong aggregate position but no controlled snippet change yet. |
| 6 | `/data/death-rate/` | 0 | 55 | 0% | 10.56 | Mixed aggregate position, though individual exact queries have ranked as high as position 2. |
| 7 | `/data/health-expenditure-share-of-gdp/` | 0 | 41 | 0% | 6.54 | Smaller but clean exact-code long-tail evidence exists. |

## GDP per capita — is 606 impressions really a page-one CTR opportunity?
Query-level GSC for `/data/gdp-per-capita/` during Sep 1-6 exposes only 13 impressions across visible query rows, versus 606 impressions at page level. Therefore the vast majority of page-level impressions are not available in the returned query breakdown (consistent with Search Console privacy/aggregation limits), and their intent cannot be safely inferred.

Visible query rows:
- `"ny.gdp.pcap.cd" "egypt, arab rep." "2023"` — 2 impressions, 0 clicks, avg position 9.5.
- `average gdp per capita` — 2 impressions, avg position 71.
- `countries ranked by gdp per capita` — 1 impression, position 75.
- `gdp per capita` — 2 impressions, position 78.
- `gdp per capita by country` — 1 impression, position 65.
- Other visible generic variants such as `gdp per kapita`, `per capita income by countries`, `per capita income world`, and `what is the current gdp per capita` rank roughly positions 52–74.

Conclusion: the page-level average position of 8.66 looks attractive, but the visible generic-intent rows are mostly far off page one. Because 593 of 606 impressions are not represented in the visible query breakdown, we do not have enough evidence to classify GDP per capita as a pure snippet/CTR problem. It should **not** displace Population Age 0–14 as the first controlled CTR experiment.

## Representative exact-query baseline
| Date | Page | Query | Impressions | Clicks | CTR | Avg position |
|---|---|---|---:|---:|---:|---:|
| 2026-09-05 | `/data/death-rate/` | `china crude death rate 2021 per 1000` | 2 | 0 | 0% | 2.0 |
| 2026-09-05 | `/data/death-rate/` | `indonesia crude death rate 2021 per 1000` | 2 | 0 | 0% | 2.0 |
| 2026-09-05 | `/data/population-age-0-14/` | `"egypt, arab rep." "2023" "sp.pop.0014.to.zs"` | 1 | 0 | 0% | 3.0 |
| 2026-09-05 | `/data/population-age-0-14/` | `"ethiopia" "2023" "sp.pop.0014.to.zs"` | 1 | 0 | 0% | 4.0 |
| 2026-09-05 | `/data/population-age-0-14/` | `"nigeria" "sp.pop.0014.to.zs" "2023"` | 3 | 0 | 0% | 8.33 |
| 2026-09-06 | `/data/health-expenditure-share-of-gdp/` | `"congo, dem. rep." "2021" "sh.xpd.chex.gd.zs"` | 2 | 0 | 0% | 9.0 |
| 2026-09-04 | `/data/inflation/` | `world bank inflation, consumer prices (annual %) 2022 fp.cpi.totl.zg "libya"` | 1 | 0 | 0% | 7.0 |
| 2026-09-06 | `/data/gdp-per-capita/` | `"ny.gdp.pcap.cd" "egypt, arab rep." "2023"` | 1 | 0 | 0% | 9.0 |
| 2026-09-06 | `/data/death-rate/` | `united states crude death rate 2021 per 1000 world bank` | 1 | 0 | 0% | 10.0 |

## One held CTR hypothesis
**Candidate: `/data/population-age-0-14/` only for the first controlled test.** It has repeated exact `SP.POP.0014.TO.ZS + country + 2023` page-one impressions across Egypt, Ethiopia and Nigeria.

Keep title, URL, canonical and H1 unchanged. Test only the meta description after the PR #198 measurement window matures.

**Proposed experiment candidate:**
`World Bank SP.POP.0014.TO.ZS data by country and year. Find the exact Population ages 0–14 share for Egypt, Ethiopia, Nigeria and 200+ countries, with official historical values.`

## Recommendation
Do **not** ship a production change yet. PR #198 deployed on 2026-09-08, while finalized GSC data still ends on 2026-09-06. The next controlled CTR experiment should remain Population Age 0–14 once several finalized post-Sep-8 days exist. GDP per capita stays a research candidate, not experiment #2, because its 606 page-level impressions cannot currently be mapped to enough visible high-intent/page-one queries.