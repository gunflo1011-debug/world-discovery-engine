# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
RELEASE THE ACCEPTED 182-COUNTRY EXPANSION, NOTHING ELSE. The official 2024 Internet-use snapshot is accepted; regenerate every existing output and perform one release verification.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- NO MANUAL USER DEBUGGING: Worker 4 owns incidents end-to-end: logs/annotations/diff/relevant files → failure signature → root cause → fix commit → re-run evidence → close/open status. User action is allowed only for a genuine external permission/secret/account/irreversible-action block.
- Exactly one owner per task. No duplicate audits.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch. After two real unsuccessful fixes, change approach/owner or CEO intervenes directly.
- No re-run without code/config change unless evidence shows a transient infrastructure failure.
- A green closed blocker is not a recurring task.
- P0 WIP LIMIT = 1: WD-020 → WD-016 → WD-012 is the only allowed product chain until broader official 2024 coverage is live.
- HARD EXECUTION GATE: while WD-020 is open, no worker may commit auxiliary formats, manifests, directories, source-page refreshes, wording, SEO/discovery helpers, unrelated tests, dependency/lockfile churn, CI/Pages refactors, or release refactors unless a concrete WD-020 execution failure proves that exact change is required.
- If Worker 4 cannot execute the official ingestion because its runtime lacks outbound World Bank access, it must record one exact failure and hand execution to the next runtime/worker with outbound access. It must not substitute another feature.
- CEO rejects auxiliary commits before WD-020 completion as process failure; useful-but-off-priority work does not count as cycle progress.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P1 | Worker 1 | DONE | Deterministic official WDI ingestion for `IT.NET.USER.ZS`: explicit same-year fetch, country-metadata join, aggregate exclusion, invalid/null/mixed-year rejection, deterministic normalized artifact, explicit provenance, no automatic build-time overwrite. | none | `08e1935`, `701c5c7`, `7e43ecc`, `7338e5d`. | Frozen. Do not redesign. |
| WD-020 | P0 | CEO | DONE_ACCEPTED | Run official ingestion for 2024 with explicit retrieval date. Review normalized diff before acceptance. Require real countries only, exact 2024, values 0–100, no duplicates, official provenance, and materially broader coverage than 12. Commit accepted normalized source. | WD-014 | CEO runtime executed the unchanged ingestor on 2026-08-23. Accepted 182 official non-aggregate country observations; all are exactly 2024, unique by code, numeric and within 0–100. Coverage is `official_same_year_snapshot`; retrieval URL is the official World Bank Indicators API. | Hand accepted source to WD-016/WD-012 release chain. |
| WD-016 | P0 | CEO → Worker 4 | LOCALLY_VERIFIED_WAITING_RELEASE | Regenerate parent HTML/JSON/CSV, country profiles/JSON/CSV/index/directory and AI discovery outputs from the accepted source. No manual rows and no unsupported global-ranking claims. | WD-020 | Local deterministic build produced 182 parent records, 182 country profiles/JSON/CSV, 182 sitemap country routes and AI discovery coverage. Full Node suite: 43/43 green. Scaling exposed and fixed a test-only CSV parser bug for quoted country names. | GitHub CI performs the canonical regeneration from the accepted source, then Worker 4 verifies live outputs once. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | After WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. If red, own full incident chain automatically. | WD-020 + WD-016 | Prior release infrastructure was green. | One verification only after expanded corpus exists. |
| INC-001 | P0 | Worker 4 | ROOT_CAUSE_IDENTIFIED_WAITING_VERIFICATION | Repeated generated-site/build-test failure family must be treated as one incident, not a sequence of symptom patches. DoD: inspect package scripts → generator ordering/shared outputs → Node test runner/concurrency → CI workflow → Pages build; state one failure signature/root cause, commit durable fix only if still required, and attach verification run. | none | Full-path review: multiple Node tests execute builders that mutate the same checked-in `site/` outputs; prior parallel Node test execution therefore allowed nondeterministic inter-test mutation. `196e3cd` serializes generated-site tests. Adjacent commits `71d9122`, `b89be57`, `818e583`, `4a0596c`, `c44ca31` address separate deterministic generator/string-contract brittleness and are not evidence that the race persisted after serialization. | Do not add another mini-patch. Keep `--test-concurrency=1`; if the same race signature reappears, change subsystem approach to isolated temporary build roots rather than more timing/regex fixes. Close only after one observed green verification run. |
| WD-026 | P2 | Worker 3/4 | REJECTED_SCOPE_DRIFT | Citation-ready AI discovery expansion and supporting build/test/release changes landed while WD-020 remained open. | none | `cfa2f190`, `088dff88`, `ccaf6015`, `34e4d04b`, `f070048d`. | Freeze. |
| WD-027 | P2 | Worker 4 | REJECTED_SCOPE_DRIFT | Playwright lockfile regeneration and CI/Pages switch to `npm ci` landed without evidence that WD-020 execution required these changes. | none | `a9e5993`, `c104da4`, `5982dcb`. | Freeze unless INC-001/full release evidence proves relevance. |
| WD-025 | P2 | Worker 1/3/4 | REJECTED_SCOPE_DRIFT | Refreshed `/sources/` discovery page and added live smoke while WD-020 was open. | none | `b13eb016`, `3c1defe`, `ec7bb565`, `296e156`. | Freeze. |
| WD-024 | P2 | Worker 3 | INTEGRATED_FROZEN | AI discovery manifest `/ai-index.json` and `/llms.txt` generated from REAL/CURRENT_VERIFIED source data and covered by live smoke. | existing source | Integrated. | Freeze until coverage expansion is released. |
| WD-015 | P2 | Worker 2 | INTEGRATED_FROZEN | Country search/filter, comparison and generated crawlable discovery pages. | existing source | Integrated. | No additional UX until expanded corpus exposes a concrete need. |
| WD-009 | P2 | Worker 1 | PAUSED | Population audit only on concrete regression. | none | Multi-country archived population evidence improved, including archived country-identity verification (`54e5d331`). | Do not spend scaling cycle on generic audit. |

## Incident ledger
| Incident | Failure signature | Root Cause | Fix commit | Verification run | State |
|---|---|---|---|---|---|
| INC-001 | Generated-site tests intermittently observe/mutate shared `site/` artifacts while other builder-driven tests are also running | Node tests invoke Internet-use builders against the same repository `site/` tree; parallel test execution made generated outputs a shared mutable resource. The deterministic generator/string mismatches in `71d9122`/`b89be57`/`818e583`/`4a0596c`/`c44ca31` are adjacent but distinct failures, not one continuing race. | `196e3cd` (`node --test --test-concurrency=1`) is the durable race mitigation; no further timing patch justified without a repeated race signature. | PENDING one observed green full release run after the next required product build; current connector cannot prove push/Pages runs and local GitHub DNS is unavailable. | ROOT_CAUSE_IDENTIFIED_WAITING_VERIFICATION |

## Completed / condensed evidence
- Internet-use production slice exists with CURRENT_VERIFIED same-year semantics, Human/JSON/CSV, provenance and generated country discovery.
- Official WDI ingestion layer is implemented and tested and intentionally explicit/reviewable.
- Country profiles, country JSON/CSV, registry/directory and AI discovery outputs derive from normalized source.
- Population evidence includes validated archived country identity across vintages.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- DATA: WD-020 ACCEPTED. `site/indicators/internet-use/data.json` now contains 182 official, non-aggregate 2024 observations with `coverage.type = official_same_year_snapshot` and official API provenance.
- WD-020 OUTBOUND INCIDENT (2026-08-23): the earlier Worker 4 runtime could not resolve GitHub or World Bank. CEO handed execution to a runtime with outbound access, ran the existing ingestor unchanged, and removed the blocker without substituting data.
- DISCOVERY: sufficient for this phase and frozen.
- RELEASE: prior product release was green/closed. INC-001 now has a consolidated root-cause determination; closure waits for one observed green full release after the next required product build rather than another standalone re-run.
- NEXT VALUE: commit accepted snapshot and release-order regression guard → GitHub CI regenerates the broader corpus → Worker 4 performs WD-012 once and verifies commit-exact live evidence.

## CEO process correction — 2026-08-23
The post-gate commits `71d9122` → `c44ca31` show another anti-loop violation: multiple narrowly-scoped build/test fixes were committed while WD-020 remained open. Worker 4 must own the complete incident chain and consolidate root cause/evidence rather than emitting further symptom patches. W4's consolidated review attributes the nondeterministic generated-artifact failure family to parallel tests mutating shared `site/` outputs; `196e3cd` serializes those tests. The later copy/assertion changes are separate deterministic contract fixes, so they do not by themselves prove the race mitigation failed. This incident does not relax the data-expansion priority.

## Anti-loop environment note
A worker runtime DNS/network failure is not a product regression. Do not repeatedly retry an unavailable path without a new signal. For WD-020, one failed outbound attempt with exact evidence is enough to hand execution to another runtime. Never replace official data with hand-entered rows.
