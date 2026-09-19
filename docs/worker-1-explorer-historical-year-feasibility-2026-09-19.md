# Worker 1 — Explorer historical-year feasibility (2026-09-19)

## Verdict
**HISTORICAL-YEAR-NEXT, but not from the current Explorer snapshot assets alone.**

The Explorer currently loads `site/data/wdi/<slug>/data.json`. Those files are deliberately one verified same-year snapshot per indicator (`observationYear` + one `records[]` value/year per country), so they cannot support a truthful historical selector by themselves.

A real historical series already exists in-repo for **Internet use** at `site/indicators/internet-use/history.json`: `CURRENT_VERIFIED_HISTORY`, 1990–2024, 182 countries, null years kept missing and never interpolated. This proves the data contract and UI concept can be implemented without fake/backfilled observations, but equivalent history assets do not yet exist for all nine Explorer indicators.

## Required comparison rule
For selected X/Y/size indicators and year Y:
1. Load an explicit historical series for each indicator.
2. For each indicator, select only observations whose `year === Y`.
3. Inner-join the three year-specific maps by ISO3 country code.
4. Keep a country only when all three values are finite for exactly Y.
5. Never carry forward/backfill a value from another year and never substitute each indicator's latest year.
6. The year control should offer only years with a non-empty three-way intersection; preferably display matched-country count per year and disable unusable years.
7. KPI/source copy must display the exact selected common year and matched-country count.

This is stricter than the current latest-snapshot behavior and avoids mixed-year scatter points.

## Smallest reversible implementation path
1. **Data first:** add a history asset contract alongside each Explorer indicator, e.g. `site/data/wdi/<slug>/history.json`, generated from the official World Bank WDI API. Reuse the Internet-use history principles: explicit observation years, nulls omitted/kept missing, no interpolation/backfill, source/retrieval metadata.
2. Pilot only 2–3 indicators first (GDP per capita, Internet use, Population), because they are the default X/Y/size combination. Do not expose a year selector until all three pilot history assets validate.
3. Add a small loader/cache for history assets and compute `commonYears = intersection(year sets for X,Y,size)`; on year selection, inner-join exact-year ISO3 records.
4. Keep the existing latest-snapshot mode as the default/fallback. Historical mode should be removable without changing the existing snapshot JSON contract.
5. Add tests: selected-year equality for every rendered row; no mixed-year values; no interpolation; empty intersection handled explicitly; source/year label matches selected year.
6. After pilot QA, extend the same generator/contract to the remaining six indicators before claiming universal historical selection.

## Existing evidence
- Current Explorer lists nine slugs and loads only `../data/wdi/${slug}/data.json`.
- GDP-per-capita snapshot is `observationYear: 2025` and describes itself as `latest_well_covered_same_year_snapshot`, with no country backfilled from another year.
- Internet-use history is already a verified 1990–2024 series for 182 countries with an explicit no-interpolation rule.

## Product implication
Historical-year selection is feasible and valuable, but **not a front-end-only change**. The safe next step is a real-data history pipeline for the default three indicators, followed by exact-year intersection logic. Adding a selector before those assets exist would recreate the misleading-control problem just removed from production.
