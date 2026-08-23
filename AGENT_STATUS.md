# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Execute the already-built official 2024 Internet-use ingestion once, review and accept the broader real-country snapshot, regenerate all human/machine/country/discovery outputs, then perform one release verification. Stop adding auxiliary formats/features until the coverage expansion lands.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- Workers 1–3 run only checks directly relevant to their own changes.
- Exactly one owner per task. No duplicate audits.
- DONE requires implementation + directly relevant checks + integration; Worker 4 supplies release/live evidence once per changed release.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.
- No new auxiliary output format or speculative UX line while WD-020/WD-016 is open.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P0 | Worker 1 | IMPLEMENTED | Deterministic official WDI ingestion for `IT.NET.USER.ZS`: explicit same-year fetch, country-metadata join, aggregate exclusion, invalid/null/mixed-year rejection, deterministic normalized artifact, explicit provenance, no automatic build-time overwrite. | current verified source artifact | `08e1935` ingestion; `701c5c7` focused fail-closed tests; `7e43ecc` npm command; `7338e5d` handoff. | Frozen. Do not redesign. |
| WD-020 | P0 | Worker 4 | READY | Controlled production expansion: run official ingestion for 2024 with explicit retrieval date, review normalized diff before acceptance, require real countries only / exact 2024 / 0–100 / no duplicates / provenance / materially broader coverage, then accept source and trigger regeneration. | WD-014 | Ingestion deliberately does not run inside normal static build, preventing silent fact changes. | Execute now. If API contract mismatch occurs, fix parser/root cause rather than hand-editing rows. |
| WD-016 | P0 | Worker 3 | WAITING_FOR_SOURCE | Expand Internet-use product substantially beyond 12 countries through accepted WD-020 normalized source; regenerate parent HTML/JSON/CSV, country profiles/JSON/CSV/index and discovery outputs without manual rows or unsupported global-ranking claims. | WD-020 accepted source | Builders scale dynamically; country CSV discovery is integrated via `346f346`, `03aef87`, `497f108`, handoff `ea3c06a`. | Once W4 accepts source diff, regenerate and commit derived product outputs plus focused consistency checks only. |
| WD-022 | P1 | Worker 3 | INTEGRATED | Country profiles expose source-faithful per-country CSV alongside JSON, visible link and alternate link; registry schema 1.2 exposes `machineCsvUrl`. | country generator | `346f346`, `03aef87`, `497f108`, `ea3c06a`. | Freeze. Do not add more formats before broader coverage lands. |
| WD-018 | P1 | Worker 4 | IMPLEMENTED | Release country-count assertion is data-driven rather than fixed to launch count 12. | current Pages workflow | `14ec936`; focused evidence test also scales with accepted coverage in `9698bbd`. | Validate only inside WD-020/WD-012; no standalone re-check. |
| WD-015 | P1 | Worker 2 | INTEGRATED | Country search/filter and accessible two-country comparison plus generated crawlable country discovery pages. | generated page builder | Existing lookup/comparison/profile commits integrated; semantics explicitly subset-scoped. | Freeze extra UI until broader coverage lands. |
| WD-019 | P1 | Worker 2 | INTEGRATED | Generated country-profile wording scales with coverage and avoids stale launch/current/global-rank language. | generated country builder | `c9333b2` + `ccb3c53`. | Frozen unless broader snapshot exposes a concrete defect. |
| WD-021 | P1 | Worker 2 | INTEGRATED | Population indicator navigation returns users to the indicator registry instead of self-linking; primary nav has an accessible label and regression guard. | population indicator generator | `59b033a`, `2b7c4ad`, `84225e8`. | Frozen; no more population work in this scaling cycle. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | After WD-020/WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. | substantive expanded-data release | Previous Internet-use deployment directly evidenced green. | Combine ingestion acceptance, derived expansion, WD-018 verification and release into one integration cycle where practical. |
| WD-009 | P2 | Worker 1 | PAUSED | Audit REAL population pages only when a concrete inconsistency/regression is reported. | none | No current blocker. | Do not spend scaling cycle on generic audit. |

## Completed / condensed evidence
- WD-003 DONE: Internet-use production slice exists with `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, same-year semantics, Human/JSON/CSV, provenance, canonical, Dataset JSON-LD and discovery.
- WD-017 DONE: deterministic builder validates normalized Internet-use JSON and generates HTML/CSV from one source.
- Official WDI ingestion layer is implemented and tested; it is intentionally explicit/reviewable rather than network-coupled to normal builds.
- Country discovery generation is integrated: crawlable profiles, country-scoped JSON/CSV, registry and discovery outputs are generated from the normalized source.
- Internet-use parent and country copy explicitly scopes rankings/comparisons to included same-year records and encodes `completeGlobalRanking: false`.
- WD-013 DONE: population revision comparison mobile density improved.
- WD-011 DONE: homepage coverage/evidence semantics corrected.
- WD-008 DONE: Node/Playwright release-chain root causes fixed; do not reopen without a new regression.
- WD-010 DONE: Internet-use UX/data semantics contract established.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- RELEASE INFRA: prior product release green/closed. No reason to re-check it before substantive expansion.
- DATA: ingestion exists; controlled acceptance of the broader official 2024 snapshot is now the sole P0 data bottleneck.
- UX/DISCOVERY: search/comparison, generated country pages, country JSON/CSV and provenance already scale from the normalized source.
- NEXT VALUE: WD-020 controlled official ingestion/review → WD-016 regenerate broader corpus → WD-012 one release verification.

## CEO process note
The team has already built enough supporting machinery around the 12-country launch slice. Do not spend another cycle on auxiliary formats, generic audits, wording, or release infrastructure. The next measurable product outcome is materially broader official 2024 country coverage. If the World Bank response exposes a parser/API-contract problem, treat it as one root-cause issue and fix the ingestion path; never bypass it by manually adding rows.

## Anti-loop environment note
A worker runtime DNS/clone failure is not a product regression. Do not repeatedly retry the same unavailable clone/network path without a new environmental signal. Use available repository/release evidence and keep ownership with Worker 4 for the controlled ingestion/release cycle.