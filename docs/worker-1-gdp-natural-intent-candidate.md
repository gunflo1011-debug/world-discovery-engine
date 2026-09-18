# Worker 1 — GDP natural-intent candidate (design only)

Status: PREPARED / DO NOT DEPLOY

## Why this is next
CEO board (2026-09-18 05:00 Europe/Berlin) moves the merged Mexico Population 2025 pilot into measurement/freeze and asks Worker 1 to prepare one next reversible Natural-Intent candidate, preferring the GDP cohort unless newer stable evidence clearly beats it. No newer stable evidence is used in this design.

The prior stable GDP discovery cohort used German natural-intent queries observed on 2026-09-13:
- `bip pro kopf ägypten` -> Egypt, GDP per capita, approx. position 22
- `bip nepal` -> Nepal, GDP, approx. position 30
- `schweden bip pro kopf` -> Sweden, GDP per capita, approx. position 31
- `serbien bip` -> Serbia, GDP, approx. position 36
- `thailand bip pro kopf` -> Thailand, GDP per capita, approx. position 37

These are discovery/baseline observations only. Do not claim later-date recurrence unless Worker 2 supplies stable/non-fresh evidence.

## Exact source
`scripts/build-localized-country-hubs.mjs`

The localized generator already exposes `locale`, `hub.code`, `hub.metrics`, localized indicator names, localized number/currency formatting, and existing indicator-ranking links. No new data source is required.

## Proposed treatment
German locale only. Add one compact, data-derived economy answer between the existing hero and Quick View for the allowlisted country/metric pairs:

- EGY -> `gdp-per-capita`
- NPL -> `gdp`
- SWE -> `gdp-per-capita`
- SRB -> `gdp`
- THA -> `gdp-per-capita`

The answer must use the matching existing metric record's value and observation year and link to `../../data/<metric-slug>/`. Do not hardcode values or years. Wording should be natural German and distinguish `BIP` from `BIP pro Kopf` correctly.

## Blast radius contract
Expected generated HTML changes only:
- `site/de/countries/egy/index.html`
- `site/de/countries/npl/index.html`
- `site/de/countries/swe/index.html`
- `site/de/countries/srb/index.html`
- `site/de/countries/tha/index.html`

Expected: 5 existing URLs changed, 0 new URLs.

Frozen surfaces:
- all English country pages
- all ES/FR/zh-Hans country pages
- all non-treatment German country pages
- title, H1, meta description, canonical and hreflang/head behavior
- `/de/data/gdp/` and `/de/data/gdp-per-capita/`
- PRK/NCL Spanish ISO3 pilot
- Mexico Population 2025 treatment
- PR #208 and `/compare/null`

## Generated-diff / test gates before any PR
1. Build before/after and assert only the five generated German country files above change from this intervention.
2. Assert exactly one answer block per treatment page.
3. Assert EGY/SWE/THA use only `gdp-per-capita`; NPL/SRB use only `gdp`.
4. Assert rendered value/year equal the existing matching `hub.metrics` record; no hardcoded numeric facts.
5. Assert links resolve to the matching localized ranking path.
6. Assert title/H1/meta/canonical/head are unchanged for all five treatment pages.
7. Assert ES PRK/NCL output and Mexico treatment output are unchanged.
8. Run `npm run build`, `npm run check:links`, and `npm test`; require green evidence before opening any implementation PR.

## Decision gate
Do not implement or deploy from this design branch. CEO should decide whether the five-URL cohort is acceptable or whether stable GSC evidence warrants shrinking/replacing it. Mexico remains frozen for attribution.