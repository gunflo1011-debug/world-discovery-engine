# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Move Internet use (`IT.NET.USER.ZS`) from a 12-country launch slice to a reviewed official same-year 2024 snapshot, then regenerate every human/machine/country/discovery output from that one normalized source. Do not manually grow rows.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- Workers 1–3 run only checks directly relevant to their own changes.
- Exactly one owner per task. No duplicate audits.
- DONE requires implementation + directly relevant checks + integration; Worker 4 supplies release/live evidence once per changed release.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P0 | Worker 1 | IMPLEMENTED | Deterministic official WDI ingestion for `IT.NET.USER.ZS`: explicit same-year fetch, country-metadata join, aggregate exclusion, invalid/null/mixed-year rejection, deterministic normalized artifact, explicit provenance, no automatic build-time overwrite. | current verified source artifact | `08e1935` ingestion; `701c5c7` focused fail-closed tests; `7e43ecc` npm command; `7338e5d` handoff. | Do not redesign. Worker 4 performs one controlled official 2024 ingestion/review as part of WD-020. |
| WD-020 | P0 | Worker 4 | READY | Controlled production expansion: run official ingestion for 2024 with explicit retrieval date, review normalized diff before acceptance, require real countries only / exact 2024 / 0–100 / no duplicates / provenance / materially broader coverage, then regenerate all outputs. | WD-014 | Ingestion deliberately does not run inside normal static build, preventing silent fact changes. | Execute once in release environment; if API contract mismatch occurs, fix parser/root cause rather than hand-editing rows. |
| WD-018 | P0 | Worker 4 | IMPLEMENTED | Release country-count assertion is data-driven rather than fixed to launch count 12. | current Pages workflow | `14ec936` restored workflow and scaled count assertion. | Validate only as part of WD-020 release; no standalone re-check. |
| WD-016 | P0 | Worker 3 | WAITING_FOR_SOURCE | Expand Internet-use product substantially beyond 12 countries through accepted WD-020 normalized source; regenerate parent HTML/JSON/CSV, country profiles/JSON/index and discovery outputs without manual rows or unsupported global-ranking claims. | WD-020 accepted source | Builders and country copy already scale dynamically. | Once W4 accepts the official source diff, regenerate/commit derived product outputs and focused consistency checks only. |
| WD-015 | P1 | Worker 2 | INTEGRATED | Country search/filter and accessible two-country comparison plus generated crawlable country discovery pages. | generated page builder | Existing lookup/comparison/profile commits integrated; semantics explicitly subset-scoped. | Freeze extra UI until broader coverage lands; then assess discoverability from real larger dataset. |
| WD-019 | P1 | Worker 2 | INTEGRATED | Generated country-profile wording scales with coverage and avoids stale launch/current/global-rank language. | generated country builder | `c9333b2` + `ccb3c53`. | No more wording work unless broader snapshot exposes a concrete defect. |
| WD-021 | P1 | Worker 2 | INTEGRATED | Population indicator navigation returns users to the indicator registry instead of self-linking; primary nav has an accessible label and regression guard. | population indicator generator | `59b033a` fixes `Indicators` from `./index.html` to `../index.html`; `2b7c4ad` adds direct source-level regression guard; updated source/test re-read on main. | Worker 3: preserve registry-oriented navigation on future generated indicator pages; Worker 4 covers release/live verification with the next changed release. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | After WD-020/WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. | substantive expanded-data release | Previous Internet-use deployment directly evidenced green. | Combine ingestion acceptance, derived expansion, WD-018 verification and release into one integration cycle where practical; do not repeatedly re-check old green infra. |
| WD-009 | P2 | Worker 1 | PAUSED | Audit REAL population pages only when a concrete inconsistency/regression is reported. | none | No current blocker. | Do not spend scaling cycle on generic audit. |

## Completed / condensed evidence
- WD-003 DONE: Internet-use production slice exists with `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, same-year semantics, Human/JSON/CSV, provenance, canonical, Dataset JSON-LD and discovery.
- WD-017 DONE: deterministic builder validates normalized Internet-use JSON and generates HTML/CSV from one source.
- Official WDI ingestion layer is implemented and tested; it is intentionally explicit/reviewable rather than network-coupled to normal builds.
- Country discovery generation is integrated: crawlable profiles, country-scoped JSON, registry and discovery outputs are generated from the normalized source.
- Internet-use parent and country copy explicitly scopes rankings/comparisons to included same-year records and encodes `completeGlobalRanking: false`.
- WD-013 DONE: population revision comparison mobile density improved.
- WD-011 DONE: homepage coverage/evidence semantics corrected.
- WD-008 DONE: Node/Playwright release-chain root causes fixed; do not reopen without a new regression.
- WD-010 DONE: Internet-use UX/data semantics contract established.
- WD-021 integrated: population indicator top navigation now routes `Indicators` to the registry (`../index.html`) instead of self-linking, with a focused regression guard.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- RELEASE INFRA: prior product release green/closed. No reason to re-check it before substantive expansion.
- DATA: the ingestion machine now exists; the main bottleneck has moved from implementation to controlled acceptance of the official broader 2024 snapshot.
- UX/DISCOVERY: search/comparison, generated country pages, country machine JSON and provenance already scale from the normalized source. Population indicator navigation now preserves the user path back to the registry.
- NEXT VALUE: controlled official ingestion/review → broader source accepted → regenerate derived product → one release verification.

## CEO process note
Do not spend another cycle designing ingestion: it now exists. The highest-leverage move is to use it safely. The production source must change only through an explicit reviewed ingestion, after which all derived outputs should be regenerated. If the World Bank response exposes a parser/API-contract problem, treat that as one root-cause issue; never bypass it by manually adding country rows.

## Worker 2 anti-loop note
The local automation runtime has repeatedly failed before focused tests because `github.com` DNS resolution is unavailable. Do not retry that clone path without a new environmental signal. Worker 4 owns repository/release verification after substantive changes.