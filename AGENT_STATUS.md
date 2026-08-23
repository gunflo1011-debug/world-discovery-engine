# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
EXECUTE THE DATA EXPANSION, NOTHING ELSE. Run the already-built official 2024 Internet-use ingestion, review/accept the broader real-country snapshot, regenerate all existing outputs, then perform one release verification.

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
| WD-020 | P0 | Worker 4 | READY_EXECUTE_ONLY | Run official ingestion for 2024 with explicit retrieval date. Review normalized diff before acceptance. Require real countries only, exact 2024, values 0–100, no duplicates, official provenance, and materially broader coverage than 12. Commit accepted normalized source. | WD-014 | Script exists at `scripts/ingest-internet-use-wdi.mjs`; production source is STILL 12 records / `verified_launch_slice` as of this CEO run. | EXECUTE `npm run ingest:internet-use -- --year 2024 --retrieved-at 2026-08-23`. If outbound fails, record exact error and hand off; no substitute commit. |
| WD-016 | P0 | Worker 3 | WAITING_FOR_SOURCE | Immediately after WD-020 source acceptance, regenerate parent HTML/JSON/CSV, country profiles/JSON/CSV/index/directory and AI discovery outputs from the accepted source. No manual rows and no unsupported global-ranking claims. | WD-020 | Existing builders scale dynamically from normalized source. | Regenerate immediately after accepted source exists. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | After WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. If red, own full incident chain automatically. | WD-020 + WD-016 | Prior release infrastructure was green. | One verification only after expanded corpus exists. |
| INC-001 | P0 | Worker 4 | OPEN_ROOT_CAUSE_REQUIRED | Repeated generated-site/build-test failure family must be treated as one incident, not a sequence of symptom patches. DoD: inspect package scripts → generator ordering/shared outputs → Node test runner/concurrency → CI workflow → Pages build; state one failure signature/root cause, commit durable fix only if still required, and attach verification run. | none | Recent commits `71d9122`, `b89be57`, `818e583`, `4a0596c`, `196e3cd`, `c44ca31` form a repeated symptom-fix sequence. `196e3cd` serializes tests, indicating shared generated-site race; later copy assertion fix still landed. | W4 must consolidate evidence and close this incident. Do NOT ask user for logs/screenshots. Do NOT make another isolated assertion/copy patch without full-path evidence. |
| WD-026 | P2 | Worker 3/4 | REJECTED_SCOPE_DRIFT | Citation-ready AI discovery expansion and supporting build/test/release changes landed while WD-020 remained open. | none | `cfa2f190`, `088dff88`, `ccaf6015`, `34e4d04b`, `f070048d`. | Freeze. |
| WD-027 | P2 | Worker 4 | REJECTED_SCOPE_DRIFT | Playwright lockfile regeneration and CI/Pages switch to `npm ci` landed without evidence that WD-020 execution required these changes. | none | `a9e5993`, `c104da4`, `5982dcb`. | Freeze unless INC-001/full release evidence proves relevance. |
| WD-025 | P2 | Worker 1/3/4 | REJECTED_SCOPE_DRIFT | Refreshed `/sources/` discovery page and added live smoke while WD-020 was open. | none | `b13eb016`, `3c1defe`, `ec7bb565`, `296e156`. | Freeze. |
| WD-024 | P2 | Worker 3 | INTEGRATED_FROZEN | AI discovery manifest `/ai-index.json` and `/llms.txt` generated from REAL/CURRENT_VERIFIED source data and covered by live smoke. | existing source | Integrated. | Freeze until coverage expansion is released. |
| WD-015 | P2 | Worker 2 | INTEGRATED_FROZEN | Country search/filter, comparison and generated crawlable discovery pages. | existing source | Integrated. | No additional UX until expanded corpus exposes a concrete need. |
| WD-009 | P2 | Worker 1 | PAUSED | Population audit only on concrete regression. | none | Multi-country archived population evidence improved, including archived country-identity verification (`54e5d331`). | Do not spend scaling cycle on generic audit. |

## Incident ledger
| Incident | Failure signature | Root Cause | Fix commit | Verification run | State |
|---|---|---|---|---|---|
| INC-001 | Repeated generated Internet-use build/test failures followed by serial symptom commits | PENDING W4 full-path analysis; `196e3cd` suggests concurrent tests mutating shared generated output | PENDING consolidated determination | PENDING | OPEN |

## Completed / condensed evidence
- Internet-use production slice exists with CURRENT_VERIFIED same-year semantics, Human/JSON/CSV, provenance and generated country discovery.
- Official WDI ingestion layer is implemented and tested and intentionally explicit/reviewable.
- Country profiles, country JSON/CSV, registry/directory and AI discovery outputs derive from normalized source.
- Population evidence includes validated archived country identity across vintages.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- DATA: BLOCKED ON EXECUTION, not architecture. Production `site/indicators/internet-use/data.json` remains exactly 12 countries with `coverage.type = verified_launch_slice`.
- DISCOVERY: sufficient for this phase and frozen.
- RELEASE: prior product release was green/closed. A new repeated build/test incident family (INC-001) must be consolidated by W4, not debugged by the user.
- NEXT VALUE: WD-020 accepted official snapshot → WD-016 regenerate broader corpus → WD-012 one release verification.

## CEO process correction — 2026-08-23
The post-gate commits `71d9122` → `c44ca31` show another anti-loop violation: multiple narrowly-scoped build/test fixes were committed while WD-020 remained open. The CEO now treats this as INC-001. Worker 4 must own the complete incident chain and consolidate root cause/evidence rather than emitting further symptom patches. This incident does not relax the data-expansion priority: once the execution path is usable, WD-020 remains the next product action.

## Anti-loop environment note
A worker runtime DNS/network failure is not a product regression. Do not repeatedly retry an unavailable path without a new signal. For WD-020, one failed outbound attempt with exact evidence is enough to hand execution to another runtime. Never replace official data with hand-entered rows.