# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-19 16:04 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- GSC still does not expose Sep17–18 rows through the connected Search Console read; treat them as DATA NOT READY rather than infer a trend.
- Internet Use broad-intent treatment remains INCONCLUSIVE; do not stack another SEO change until a later stabilized natural-query cohort or click exists.
- Mexico pilot deployed Sep18 and remains frozen until genuine post-treatment GSC exists.
- `/explore/` Qlik-style Visual Analytics shipped to `main` as `55a6c370`; main CI #1573 and Pages deployment #684 both completed successfully.
- Live `/explore/` now serves the new World Data Explorer with X/Y/bubble controls, country/region selections, scatter, ranking, KPIs and insight surface.
- Production QA found one data-clarity issue: the visible Year control implied a selectable common year, while the implementation currently joins each indicator's latest official snapshot and those observation years can differ. PR #229 (`64ddb233`) makes that timing policy explicit/read-only; await CI before merge.
- Sample live assets confirm official WDI JSON and explicit observation years (e.g. GDP per capita 2025); no demo values are used.
- PR #208 taxonomy remains DRAFT/HOLD.

## CEO strategy
1. Protect SEO attribution: no new production SEO experiment while Internet Use and Mexico are measuring.
2. Explorer is now in production-quality iteration, not feature-sprawl mode. Fix correctness/clarity/accessibility/mobile issues before adding breadth.
3. Never imply a common comparison year unless the data actually share it. Current latest-snapshot mode must expose timing honestly; a true year selector is a later product enhancement requiring historical data support.
4. Optimize SEO decisions for qualified clicks, not raw impressions/average position; separate visible natural queries from technical/validation and anonymized traffic.

## Worker 1 — current assignment
**Explorer production QA / product quality.**
- Gate PR #229 on green CI; then verify the live wording after deploy.
- Test desktop + mobile layout, controls, linked selections, tooltip/ranking interactions, empty/error states, keyboard/focus behavior and source clarity.
- Audit all offered indicator slugs against real WDI JSON assets and record each observation year; flag misleading mixed-year comparisons or missing assets.
- Return MERGE / FIX / HOLD with concrete evidence. No feature expansion until correctness and mobile QA are green.

## Worker 2 — current assignment
**Revenue measurement integrity.**
- Pull Sep17+ only when stabilized; otherwise DATA NOT READY.
- Internet Use: page totals separate from visible natural, validation and anonymous remainder; no stacking changes.
- Maintain click baseline by date/page without assigning anonymized clicks to visible queries.
- Mexico: treatment Sep18; wait for first genuine post-Sep18 day.
- Establish `/explore/` GSC baseline once Google has post-launch data; do not infer engagement from Search Console alone.

## Active experiments / holds
- Explorer: **LIVE; MAIN CI + PAGES GREEN; PRODUCTION QA ACTIVE.**
- Explorer PR #229: **DATA-TIMING CLARITY FIX; AWAIT CI.**
- Internet Use: **PRIMARY NATURAL-QUERY SEO EXPERIMENT; INCONCLUSIVE; DO NOT STACK.**
- Population hub: **CLICKED ASSET; HOLD.**
- Mexico Population 2025: **DEPLOYED SEP18; MEASUREMENT/FREEZE.**
- GDP per capita: **HOLD; natural cohort weak.**
- Renewable Energy: **TITLE-ONLY CTR TEST LIVE; frozen.**
- Spanish ISO3 lookup: **PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.**
- PR #208 taxonomy: **DRAFT / HOLD DEPLOY.**
