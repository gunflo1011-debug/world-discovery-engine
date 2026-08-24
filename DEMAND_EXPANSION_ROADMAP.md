# World Discovery — Organic Demand & Data Expansion Roadmap

_Last researched: 2026-08-25_

## Purpose

Rank the next defensible public-data families by expected organic acquisition value **without inventing search volume**. This roadmap uses observable search-language/SERP evidence, authoritative-data availability, methodological fit, programmatic scale, differentiation potential and eventual paid export/API value. Search Console query evidence should override this research once enough impressions/queries accumulate.

## Scoring model

Each family is scored 0–5 on:

- **Search plausibility** — direct, recurring country/ranking/comparison language is visibly served in current search results.
- **Official-data readiness** — authoritative cross-country source, usable history and coverage.
- **Defensibility** — ability to add provenance, methodology, revision/vintage/history or analysis value beyond a copied ranking.
- **Programmatic scale** — country, region, ranking, comparison and machine-readable outputs can create distinct useful pages.
- **API/data-product value** — plausible professional reuse, export or revision-history demand.
- **Competition penalty** — 0 = light/fragmented visible competition, 5 = heavily occupied SERP by strong data publishers.

`Priority score = search + official + defensibility + scale + API - competition` (max 25).

Scores are directional research judgments, **not traffic forecasts**.

## Ranked backlog

| Rank | Data family | Example user/search jobs | Search | Official | Defensible | Scale | API | Competition | Priority | Decision / kill reason |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | **GDP per capita — nominal + PPP** | `gdp per capita by country`, `richest countries per person`, `Germany vs France GDP per capita`, `GDP per capita 2024` | 5 | 5 | 4 | 5 | 5 | 5 | **19** | **BUILD CANDIDATE #1**, but only series whose valuation/unit/revision semantics pass the existing fail-closed methodology gate. Do not reuse the blocked real-GDP revision path by assumption. |
| 2 | **Life expectancy at birth** | `life expectancy by country`, `highest life expectancy`, `Japan vs Germany life expectancy`, `life expectancy 2024` | 5 | 5 | 4 | 5 | 3 | 4 | **18** | **BUILD CANDIDATE #2.** Strong direct comparison/ranking intent and current 2024 WDI coverage. Differentiate on history/revisions/provenance, not another static ranking. |
| 3 | **Renewable electricity share / energy mix** | `renewable electricity by country`, `countries with most renewable energy`, `Germany vs France renewable electricity` | 4 | 4 | 5 | 5 | 5 | 3 | **20** | **BUILD CANDIDATE #3** despite lower freshness: high research/B2B reuse value and strong provenance/methodology fit. Current WDI metadata shows annual 1990–2021 coverage, so pages must expose the reference-year limitation prominently. |
| 4 | **Population density** | `population density by country`, `most densely populated countries`, `people per km2 by country` | 5 | 5 | 3 | 5 | 3 | 5 | **16** | Useful acquisition family, but highly commoditized. Build only after top 3 or if Search Console shows direct density demand. |
| 5 | **CO2 emissions per capita / total** | `co2 emissions per capita by country`, `largest emitters`, `country carbon emissions comparison` | 5 | 4 | 5 | 5 | 5 | 5 | **19** | High-value candidate, but source/freshness semantics are more complex than WDI-only families; require explicit source decision (e.g. official/GCP-compatible licensing and territorial-vs-consumption scope) before implementation. |
| 6 | **Fertility rate** | `fertility rate by country`, `lowest birth rate countries`, `fertility Germany vs France` | 4 | 5 | 4 | 5 | 3 | 4 | **17** | Strong demographic intent; lower commercial/API value than GDP/energy. Good adjacent family after life expectancy. |
| 7 | **Urban population share** | `urban population by country`, `most urbanized countries`, `urbanization rate` | 3 | 5 | 4 | 5 | 4 | 3 | **18** | Attractive low-risk WDI expansion with useful development/market-analysis reuse; weaker direct visible query language than top families. |
| 8 | **Tourism arrivals / receipts** | `most visited countries`, `tourism receipts by country`, `tourists by country 2024` | 5 | 3 | 3 | 5 | 3 | 5 | **14** | Strong consumer intent but fragmented/latest source availability and heavy ranking competition. Do not build until an authoritative, reusable, cross-country source/license is locked. |
| 9 | **Electricity access** | `access to electricity by country`, `countries without electricity`, `electricity access rate` | 3 | 5 | 4 | 5 | 4 | 3 | **18** | High official-data quality and policy value; lower broad consumer demand but potentially strong API/research utility. |
| 10 | **Renewable energy consumption** | `renewable energy consumption by country`, `renewable share energy country` | 3 | 4 | 5 | 5 | 5 | 3 | **19** | Strong adjacent energy family; keep behind renewable electricity share to avoid overlapping pages before search evidence proves demand. |

## Top-3 build recommendations

### 1. GDP per capita — nominal + PPP

**Why now:** Search results visibly serve exact `GDP per Capita (2024)` ranking pages, including World Bank-derived 2024 values. The World Bank WDI also exposes `GDP per capita, PPP (current international $)` (`NY.GDP.PCAP.PP.CD`) with ICP/OECD/Eurostat/World Bank provenance.

**Recommended useful products:**

- global ranking by latest common year;
- country profile with nominal and PPP clearly separated;
- `country A vs country B GDP per capita` comparison;
- historical trend and rank changes;
- JSON/CSV export with source/year/unit;
- revision/vintage intelligence **only after series-specific comparability passes**.

**Query templates:**

- `gdp per capita by country {year}`
- `{country} gdp per capita {year}`
- `{country_a} vs {country_b} gdp per capita`
- `gdp per capita ppp by country`
- `highest / lowest gdp per capita countries`

**Kill / fail-closed conditions:** incompatible current-vs-vintage semantics, mixed nominal/constant/PPP units, differing reference years presented as ranking peers, or inability to produce distinct value beyond a generic table.

### 2. Life expectancy

**Why now:** Current search results contain multiple direct `Life Expectancy by Country 2024` rankings. One current publisher explicitly identifies WDI `SP.DYN.LE00.IN` and 217-country coverage through 2024, showing both visible search competition and a clear official-data path.

**Recommended useful products:**

- latest common-year country ranking;
- country history since 1960 where available;
- two-country comparison;
- regional distribution and change since a user-selected year;
- revision/history evidence where reproducible;
- machine-readable JSON/CSV.

**Query templates:**

- `life expectancy by country {year}`
- `{country} life expectancy`
- `highest / lowest life expectancy countries`
- `{country_a} vs {country_b} life expectancy`
- `life expectancy change since {year}`

**Kill / fail-closed conditions:** mixing UN and World Bank estimates without labeling, mismatched years in rankings, or auto-generated health claims beyond descriptive statistics.

### 3. Renewable electricity share

**Why now:** WDI metadata defines `EG.ELC.RNEW.ZS`, annual percentage of total electricity output, with explicit IEA provenance and 1990–2021 reference period. This is less fresh than GDP/life expectancy but has stronger professional reuse and a natural family around energy transition comparisons.

**Recommended useful products:**

- renewable electricity share by country and year;
- regional ranking;
- country-vs-country history;
- change since 2000/2010;
- methodology/provenance page explaining hydro inclusion and reference-year limits;
- JSON/CSV for analysts.

**Query templates:**

- `renewable electricity by country`
- `renewable electricity share {country}`
- `countries with highest renewable electricity`
- `{country_a} vs {country_b} renewable electricity`
- `renewable electricity change since {year}`

**Kill / fail-closed conditions:** implying 2021 data are current in 2026, mixing electricity-output share with total-final-energy consumption, or violating source/license restrictions.

## Evidence notes

Observed current-search evidence used for this ranking includes:

- Worldometer currently surfaces a World-Bank-derived **GDP per Capita (2024)** ranking.
- Current search results include multiple **Life Expectancy by Country 2024** ranking/data products; one explicitly references World Bank WDI `SP.DYN.LE00.IN` through 2024.
- Current search results include multiple **Population Density by Country 2024** rankings, confirming strong but highly competitive ranking intent.
- Current tourism search results include **international tourist arrivals by country 2024** ranking pages and Statista/UN Tourism result coverage, confirming demand but also heavy competition and source complexity.
- CO2 per-capita queries are served by Our World in Data, Statista and other ranking products; definitions vary across fossil/industry, territorial and other scopes, so methodology must be explicit.
- WDI metadata currently documents `EG.ELC.RNEW.ZS` with annual 1990–2021 coverage and CC BY 4.0 on the current World Bank metadata page.

URLs are intentionally omitted from generated product copy; implementation should store canonical source URLs in registry/provenance metadata rather than duplicating research links in page prose.

## Measurement taxonomy

Search Console should eventually replace this directional ranking with observed demand. Group queries into stable labels rather than optimizing one-off keywords.

### Dimensions

- `family`: `gdp_per_capita`, `life_expectancy`, `renewable_electricity`, `population_density`, `co2`, `fertility`, `urbanization`, `tourism`, `electricity_access`, `renewable_energy_consumption`
- `intent`: `country_value`, `global_ranking`, `country_compare`, `history_change`, `methodology`, `download_export`, `api_reuse`, `revision_vintage`
- `year_intent`: explicit year / latest / historical / none
- `geo_scope`: single country / two-country / region / global
- `commercial_signal`: none / export / csv / json / api / bulk / history / revision / alert

### Decision labels

- `EXPAND`: repeated impressions/clicks across a family plus adequate provenance/data coverage.
- `IMPROVE_SERP`: impressions exist but CTR is weak; improve title/answer usefulness before adding pages.
- `DEEPEN_PRODUCT`: clicks plus compare/history/export behavior; prioritize richer analysis over more landing pages.
- `MONETIZATION_SIGNAL`: repeated `api`, `export`, `bulk`, `revision`, `history`, `download` or professional reuse intent; evaluate the existing paid-data gate.
- `KILL_OR_PAUSE`: no measurable query traction after sufficient indexing time, or source/methodology quality cannot support trustworthy expansion.

## Build-order rule

1. Build **one** top family at a time.
2. Require provenance, year/unit clarity, JSON/CSV and distinct comparison/history value before programmatic scaling.
3. Measure Search Console query-family traction after indexing.
4. Let observed demand reprioritize the backlog.
5. Do not mass-generate thin country pages solely because a series exists.

## Bottom line

Current external evidence favors **GDP per capita**, **life expectancy**, and **renewable electricity share** as the next three demand-aware families, with **CO2** close behind but methodologically/source-wise more complex. The roadmap deliberately avoids pretending to know keyword volume; it gives the World Discovery workers a falsifiable order that Search Console can later confirm or overturn.