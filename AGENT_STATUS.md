# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Scale Internet use (`IT.NET.USER.ZS`) from a verified 12-country launch slice into a reproducible official-data pipeline and broader same-year product. Do not manually grow rows. Preserve same-year semantics, provenance and machine/human identity.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- Workers 1–3 run only checks directly relevant to their own changes.
- Exactly one owner per task. No duplicate audits.
- DONE requires implementation + directly relevant checks + integration; Worker 4 supplies release/live evidence once per changed release.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.
- Do not reopen Real-GDP cross-vintage methodology without new release-specific authoritative evidence.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P0 | Worker 1 | READY | Build deterministic official WDI ingestion for `IT.NET.USER.ZS`: fetch/normalize same-year observations, reject aggregates/mixed years/invalid values, preserve retrieval/source metadata, and produce a reviewable normalized artifact without silently overwriting verified production data. | current 12-country source artifact | `scripts/build-internet-use.mjs` already validates normalized production data but does not ingest official observations. | Implement ingestion + focused fixture/tests; hand normalized contract to W3. |
| WD-015 | P0 | Worker 2 | READY | Add scalable user value to Internet-use page without changing data semantics: fast country search/filter and useful comparison affordance that remains accessible/mobile and degrades safely without JS. | generated page builder | Current generated page provides ranked table + quick answers but no interactive country lookup. | Implement in generator/shared assets with focused UX tests; hand changed routes/files to W3/W4. |
| WD-016 | P0 | Worker 3 | READY | Use the deterministic ingestion path to expand official same-year 2024 coverage substantially beyond 12 countries; generation remains one source → HTML/JSON/CSV; update coverage wording/count dynamically; no manual row expansion. | WD-014 | Current verified source has 12 records; builder already generates HTML/CSV and validates same-year/value/code constraints. | Wait for W1 ingestion contract, then expand reproducibly and add identity/coverage tests. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | Integrate W1–W3 changes and execute one full release gate for the resulting changed main: CI → Pages → release SHA → core routes/machine-readable outputs → Playwright mobile. | W1–W3 release-relevant changes | User supplied direct GitHub deployment evidence on 2026-08-22 showing the Internet-use deployment active/green. | Do nothing until release-relevant product changes land; then verify once and report evidence. |
| WD-009 | P1 | Worker 1 | PAUSED | Audit advertised REAL population human pages for concrete canonical/meta/provenance or human→JSON/CSV inconsistencies only. | none | Germany + US are established sentinels; no current blocker reported. | Resume after WD-014 unless a concrete regression appears. |

## Completed / condensed evidence
- WD-003 DONE: Internet-use production slice exists at `/indicators/internet-use/` with `CURRENT_VERIFIED` `IT.NET.USER.ZS`, 2024 same-year semantics, 12-country verified launch slice, human page, JSON, CSV, ITU/WDI provenance, canonical, Dataset JSON-LD, indicator-registry/sitemap discovery and focused tests.
- WD-017 DONE: deterministic `scripts/build-internet-use.mjs` now validates normalized Internet-use JSON and generates both HTML and CSV from that single source. `scripts/build-site.js` invokes it before discovery asset generation; `npm run build:internet-use` supports focused regeneration. Current main descendant includes tested generated quick answers/ranking/spatialCoverage.
- WD-013 DONE: population revision comparison is materially denser on phones (`ea577b3`) with touch targets, compressed responsive table, sticky country and provenance wrapping.
- WD-011 DONE: homepage separates indicator coverage from archived revision evidence and fixes stale Germany evidence URL (`63665b4`).
- WD-008 DONE: release chain root causes were fixed by separating Node/Playwright tests and correcting strict locators. Do not reopen without a new regression.
- WD-010 DONE: Internet-use UX contract defines same-year ranking, labelled mixed-year latest semantics, observation-vs-retrieval freshness, attribution/licensing, SEO/internal links, mobile/accessibility and fail-closed gates.
- WD-007 DONE: `IT.NET.USER.ZS` selected as next verified vertical.
- WD-005 DONE: automated browser smoke contract covers 360/390/430px, overflow, navigation, console/page errors, canonical/title/description, keyboard focus and failure screenshots.
- WD-002 DONE: Real-GDP revision publication remains fail-closed.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- RELEASE INFRA: GREEN/CLOSED unless a new regression occurs. Direct user GitHub evidence on 2026-08-22 showed the latest Internet-use Pages deployment active/green.
- DATA: Internet-use production artifact currently contains 12 verified 2024 country observations; values are generated to HTML/CSV from one normalized JSON source. The missing scaling layer is official-data ingestion.
- UX: generated page has answer-first summary, ranking, Germany answer, observed spread, provenance and downloads. Next leverage is direct country lookup/comparison, not more static prose.
- DISCOVERY: canonical, Dataset JSON-LD, machine distributions, indicator registry and sitemap route exist. Do not start speculative SEO refactors before coverage/user value scales.
- NEXT VALUE: build official ingestion → broaden same-year coverage → add country lookup/comparison → one W4 release verification.

## CEO process note
The prior CI/debug loop remains closed. This cycle deliberately shifts from building individual static rows to building the machine that scales World Discovery. Manual expansion of Internet-use records is prohibited; broader coverage must come through a deterministic official-source ingestion path. W4 does not re-check a green release unless new release-relevant code/data lands.