# Worker 1 — SERP baseline and CTR test candidate

Date: 2026-09-08

## Scope
CEO assignment: preserve PR #198 post-deploy measurement window, pull freshest finalized Google Search Console evidence for exact official-data long tails, audit title/meta/H1 on the strongest existing `/data/*` pages, and prepare one narrowly scoped meta-description experiment without shipping it yet.

## Freshest finalized GSC baseline
Search Console currently returns finalized rows through 2026-09-06; no 2026-09-07 rows were returned in this run. Representative exact-query rows ranking positions 2–10:

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

The important pattern is not volume yet; it is repeated page-one relevance for exact official-data intent with zero clicks. Broader generic queries remain much weaker, so a controlled snippet test is preferable to new page creation.

## Current title/meta/H1 audit
Canonical generator: `scripts/build-wdi-data-browser.mjs`.

Current reusable fields:
- Title template: `${item.name} by country (${item.year}) — World Discovery` in source; live enrichment currently surfaces titles such as `Population ages 0-14 (% of total) by Country (2025) | World Bank Data`.
- Meta description template in generator: `${item.name}: compare ${records.length} countries using the latest well-covered same-year World Bank WDI snapshot (${item.year}). Browse values, coverage, source and historical data.`
- H1: exact indicator name only, e.g. `Population ages 0-14 (% of total)`.
- The indicator code is visible in the hero eyebrow and PR #198 now adds an `Exact country & year lookup` section, but the reusable base meta description does not mention the official code or country/year lookup intent.

## One test-ready CTR hypothesis
**Candidate: `/data/population-age-0-14/` only for the first controlled test.** It has repeated exact `SP.POP.0014.TO.ZS + country + 2023` page-one impressions across Egypt, Ethiopia and Nigeria, making it the cleanest pre-change family for a snippet experiment.

Keep title, URL, canonical and H1 unchanged. Test only the meta description.

**Current template-derived intent:**
`Population ages 0-14 (% of total): compare 217 countries using the latest well-covered same-year World Bank WDI snapshot (2025). Browse values, coverage, source and historical data.`

**Proposed experiment candidate:**
`World Bank SP.POP.0014.TO.ZS data by country and year. Find the exact Population ages 0–14 share for Egypt, Ethiopia, Nigeria and 200+ countries, with official historical values.`

Rationale: matches the observed code + country + year query language, communicates that the page can answer exact values after PR #198, and avoids changing ranking-critical title/H1 at the same time.

## Decision
Do **not** ship this meta change yet. PR #198 was only deployed on 2026-09-08, while the freshest finalized GSC data ends on 2026-09-06. Therefore there is not yet a valid post-deploy measurement window. Re-check after several finalized post-2026-09-08 days and only then run the single-page meta experiment if the exact-query family continues receiving page-one impressions with weak CTR.
