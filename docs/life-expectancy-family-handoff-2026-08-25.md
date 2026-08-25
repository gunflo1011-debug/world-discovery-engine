# Life expectancy family — implementation-ready gated handoff

Date: 2026-08-25
Owner: CEO Worker 1
Indicator: `SP.DYN.LE00.IN` — Life expectancy at birth, total (years)

## Release decision

**PREPARED, NOT YET SHIPPED.** Current `main` has completed green CI evidence, but this worker has not independently verified a completed Pages deployment for the current main release. Per the CEO allocation, breadth must not be merged into an incompletely verified release path.

## Why this is the adjacent candidate

The repository's prior indicator screening ranks life expectancy as the strongest adjacent intuitive user-facing candidate after Internet Use. It is suitable for a **current/latest observation family**, not for archive-to-archive revision claims. The series can include modeled/interpolated demographic estimates and multiple upstream demographic sources, so revision language remains fail-closed without release-specific historical methodology evidence.

## Source / unit / methodology contract

Before generation, the build must capture and validate all of the following from authoritative World Bank/WDI metadata and observation responses:

- indicator code: `SP.DYN.LE00.IN`
- human label: `Life expectancy at birth, total (years)`
- unit: `years`
- observation year per country
- observation value per country
- WDI retrieval URL and retrieval/build date
- source/provenance text exposed by WDI
- methodology/definition link
- explicit separation of observation year from retrieval/build date

Fail closed when any required field is absent. Do not infer a missing country value, do not coerce missing values to zero, and do not compare countries across different observation years without making the year difference explicit.

## Proposed routes

- `/indicators/life-expectancy/` — overview, methodology, source, coverage and latest-observation ranking only where comparable.
- `/indicators/life-expectancy/countries/<country-slug>/` — one useful country page per verified observation, with value, observation year, unit, source/methodology, ranking context only among same-year observations, canonical and parent link.
- machine-readable JSON/CSV generated from the same normalized records as the human pages.

Do not generate a country page when the observation contract is incomplete.

## Non-thin page contract

Every country page must contain: country + indicator answer above the fold, observation year, unit, source/provenance, methodology/definition access, same-year comparison context where available, parent navigation, canonical, and machine-output linkage. No generic prose padding.

## Deterministic QA required before release

1. normalized-record schema test rejects missing source/year/unit/value;
2. generator test proves no missing value becomes `0`;
3. country-page test verifies canonical + parent link + provenance fields;
4. ranking/comparison test only groups equal observation years;
5. sitemap/discoverability test covers overview + every generated country page;
6. internal-link audit remains zero-orphan;
7. `npm run check` completes successfully;
8. Pages deployment completes successfully on the resulting commit.

## Exact gate to reopen implementation

Implementation may proceed only after current-main release evidence includes both:

- completed successful CI (`npm run check` path), and
- completed successful Pages deployment for current main.

At preparation time, CI run `32858813417` for current main commit `2429d1ea67c166b49521c746bf6f643a9938fe78` is completed/successful. Pages completion for that current-main release was not independently evidenced in this worker run, so no breadth code was merged.

## Economic hypothesis and measurement

This family expands query surface into a high-intent, intuitive country statistic without reopening the risky GDP/revision path. Economic value remains a hypothesis until Search Console shows impressions/clicks. After release, feed real Search Console rows into the existing analyzer and allocate further expansion only to evidenced queries/pages. Zero impressions remain `NO_DEMAND_EVIDENCE`, not a growth claim.

## Handoff

Worker 4: verify completed Pages deployment for current main and preserve green CI. Once both are evidenced, Worker 1 can implement this exact family without reopening candidate selection.
