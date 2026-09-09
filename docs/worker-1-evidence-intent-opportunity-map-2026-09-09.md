# Worker 1 — Evidence-Intent Opportunity Map (2026-09-09)

## Scope and measurement status
- Source: finalized Search Console rows for 2026-09-01 through 2026-09-06.
- `/data/population-age-0-14/` still has no finalized Sep-9+ rows, so PR #198 remains measurement-HOLD and no `/data/*` production change is authorized from this analysis.
- Goal: identify existing pages/query patterns already reaching positions 1-20, distinguish precise source/evidence intent from broad head terms, and choose one reversible follow-up experiment after PR #198 closes.

## Strongest observed evidence-intent clusters

### 1. Population age 0–14 — strongest repeated code/country/year pattern
Page: `/data/population-age-0-14/`
- Egypt + `SP.POP.0014.TO.ZS` + 2023: repeated positions 3–5.
- Ethiopia + `SP.POP.0014.TO.ZS` + 2023: repeated positions 4–5.
- Nigeria + `SP.POP.0014.TO.ZS` + 2023: repeated positions roughly 5–11.
- These are exact source/indicator/year lookups, not generic demographic head terms.

### 2. Unemployment — repeated historical code lookups
Page: `/data/unemployment/`
- Pakistan + 2004 + `SL.UEM.TOTL.ZS`: repeated positions 3–8.
- Bangladesh + 2004 + `SL.UEM.TOTL.ZS`: repeated position 10.
- India + `SL.UEM.TOTL.ZS` + 2023: position 9.

### 3. Crude death rate — natural-language evidence intent without indicator code
Page: `/data/death-rate/`
- China crude death rate 2021 per 1,000: position 2.
- Indonesia crude death rate 2021 per 1,000: position 2.
- Brazil 2019–2021 crude death rate per 1,000: position 3.
- `crude death rate 2021 by country world bank`: position 8.
- United States + 2021 + World Bank: position 10.
- This is strategically important because it broadens the wedge beyond literal indicator-code searches.

### 4. Health expenditure share of GDP — code/country/year
Page: `/data/health-expenditure-share-of-gdp/`
- DR Congo + `SH.XPD.CHEX.GD.ZS` + 2021: repeated positions 7–10.
- COD + indicator code + 2021: position 5.
- Uganda + indicator code + 2021: position 8.

### 5. Inflation — precise World Bank historical lookup
Page: `/data/inflation/`
- Libya + 2022 + `FP.CPI.TOTL.ZG`: position 7.
- Macao SAR, China + 2022 + indicator code: position 5.

### 6. GDP / population growth — sparse but confirming examples
- `/data/gdp-growth/`: Macao + 2021 + `NY.GDP.MKTP.KD.ZG`, position 10.
- `/data/gdp-per-capita/`: Egypt + 2023 + `NY.GDP.PCAP.CD`, position 9.5.
- `/data/population-growth/`: USA + 2023 + `SP.POP.GROW`, position 7.
- `/data/population/`: `Yemen population 2025 world bank`, position 4.

### 7. Internet-use country pages — evidence intent can rank on country-specific URLs
Page family: `/indicators/internet-use/country/*/`
- Austria + `IT.NET.USER.ZS` + 2023: positions 2, 3 and 7 across query variants.
- A Serbia-value query surfaced on the Turkey URL at position 4, which is a relevance/mapping anomaly worth auditing later rather than scaling blindly.

### 8. Country pages — isolated natural-language long-tail wins
- Rwanda: `current population of rwanda`, position 4.
- Iceland: `iceland current population`, position 7.
- Botswana: `botswana population growth rate 2024`, position 10.
- Papua New Guinea: `population growth rate 2023`, roughly positions 7.7–10.
- Vanuatu under-25/growth queries: positions roughly 4.7–10.
- These are isolated signals; broad country-population head terms for larger markets still mostly rank around positions 70–100.

## Head-term contrast
Broad queries such as `Greece population`, `Thailand population`, `Argentina population`, `Finland population`, `Pakistan population`, and similar generic country-population searches are currently mostly deep in the SERP (commonly positions ~80–97 in the same finalized window). Generic indicator heads such as `fertility rate by country`, `gdp per capita`, `internet world stats`, and `death rate by country` are also generally far weaker than the precise evidence-intent variants.

## Strategic inference
Google is currently granting World Discovery materially stronger visibility when the search requires a verifiable value tied to a specific source, indicator, country and/or year. The strongest next SEO wedge is therefore not generic “country facts” expansion. It is improving existing indicator pages so they answer precise historical/source-transparent lookups exceptionally well, while preserving useful natural-language wording.

## Recommended next reversible SEO experiment — after PR #198 measurement closes
**Experiment: Exact-value answer block on `/data/death-rate/` only.**

Why this page:
1. It already ranks positions 2–10 for several natural-language country/year queries without relying on users typing the World Bank indicator code.
2. That makes it a better test of scalable user intent than code-only queries.
3. The current site pattern already supports country/year lookup UX on data pages, so the change can be narrowly scoped and reversible.

Proposed change after CEO authorization / PR #198 close:
- Add a compact server-rendered answer block that explicitly states the selected country, year, exact crude death-rate value, unit (`per 1,000 people`), World Bank WDI source and indicator code.
- Preserve the full ranking/table and existing provenance.
- Do not create new indexable country/year URLs for the experiment.
- Do not mass-edit other indicator pages until this single-page test is measured.

Success criteria:
- Compare a preserved pre-change GSC baseline versus at least two stable post-change finalized days, using impressions, clicks/CTR, average position and query mix.
- Focus on natural-language country/year/source queries, not only literal indicator-code lookups.
- Roll back or stop scaling if visibility shifts toward irrelevant queries or if no measurable improvement appears after an adequate observation window.

## Production health at analysis time
- `main`: `138a2792db55b445c08e97f0c51b8030b723955f` before this documentation commit.
- Open PRs: 0.
- CI run 1275 on that head: success.
- Live homepage reachable on 2026-09-09 and still exposes the intended 30-indicator / 153,722-observation catalog and explicit WDI provenance.
