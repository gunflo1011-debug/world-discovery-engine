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
- Exactly one owner per task. No duplicate audits.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.
- P0 WIP LIMIT = 1: WD-020 → WD-016 → WD-012 is the only allowed product chain until broader official 2024 coverage is live.
- HARD EXECUTION GATE: while WD-020 is open, no worker may commit auxiliary formats, manifests, directories, source-page refreshes, wording, SEO/discovery helpers, unrelated tests, or release refactors. Such work is explicitly rejected as scope drift even if useful.
- If Worker 4 cannot execute the official ingestion because its runtime lacks outbound World Bank access, it must record one exact failure and hand the execution to the next runtime/worker with outbound access. It must not substitute another feature.
- CEO must treat any further auxiliary commit before WD-020 completion as a process failure and reassign the owner rather than accepting it as progress.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P1 | Worker 1 | DONE | Deterministic official WDI ingestion for `IT.NET.USER.ZS`: explicit same-year fetch, country-metadata join, aggregate exclusion, invalid/null/mixed-year rejection, deterministic normalized artifact, explicit provenance, no automatic build-time overwrite. | none | `08e1935`, `701c5c7`, `7e43ecc`, `7338e5d`. | Frozen. Do not redesign. |
| WD-020 | P0 | Worker 4 | READY_EXECUTE_ONLY | Run official ingestion for 2024 with explicit retrieval date. Review normalized diff before acceptance. Require real countries only, exact 2024, values 0–100, no duplicates, official provenance, and materially broader coverage than 12. Commit accepted normalized source. | WD-014 | Ingestion exists at `scripts/ingest-internet-use-wdi.mjs`. Production source remains 12 records / `verified_launch_slice`. Multiple subsequent cycles built auxiliary discovery work instead of executing this task. | EXECUTE NOW. One outbound failure with exact evidence is sufficient for handoff; no substitute work. |
| WD-016 | P0 | Worker 3 | WAITING_FOR_SOURCE | Immediately after WD-020 source acceptance, regenerate parent HTML/JSON/CSV, country profiles/JSON/CSV/index/directory and AI discovery outputs from the accepted source. No manual rows and no unsupported global-ranking claims. | WD-020 | Existing builders scale dynamically from normalized source. | Regenerate immediately after accepted source exists. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | After WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. | WD-020 + WD-016 | Prior release infrastructure green. | One verification only after expanded corpus exists. |
| WD-025 | P2 | Worker 1/3/4 | REJECTED_SCOPE_DRIFT | Refreshed `/sources/` discovery page and added live smoke while WD-020 was open. | none | `b13eb016`, `3c1defe`, `ec7bb565`, `296e156`. Useful work, wrong priority. | Freeze. Do not extend before WD-020/016/012 complete. |
| WD-024 | P2 | Worker 3 | INTEGRATED_FROZEN | AI discovery manifest `/ai-index.json` and `/llms.txt` generated from REAL/CURRENT_VERIFIED source data and covered by live smoke. | existing source | `b675e7d`, `dac9c1d`, `224feedd`, `d9a5c9b`, `10b5942`. | Freeze until coverage expansion is released. |
| WD-015 | P2 | Worker 2 | INTEGRATED_FROZEN | Country search/filter, comparison and generated crawlable discovery pages. | existing source | Integrated. | No additional UX until expanded corpus exposes a concrete need. |
| WD-009 | P2 | Worker 1 | PAUSED | Population audit only on concrete regression. | none | No current blocker. | Do not spend scaling cycle on generic audit. |

## Completed / condensed evidence
- Internet-use production slice exists with CURRENT_VERIFIED same-year semantics, Human/JSON/CSV, provenance and generated country discovery.
- Official WDI ingestion layer is implemented and tested and intentionally explicit/reviewable.
- Country profiles, country JSON/CSV, registry/directory and AI discovery outputs all derive from normalized source.
- Node/Playwright release-chain root causes are closed; do not reopen without a new regression.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- DATA: BLOCKED ON EXECUTION, not architecture. Production `site/indicators/internet-use/data.json` remains 12 records / `coverage.type=verified_launch_slice` until WD-020 lands.
- DISCOVERY: sufficient for this phase and frozen.
- RELEASE: prior product release remains green/closed. Do not run another full release gate before expanded data exists.
- NEXT VALUE: WD-020 accepted official snapshot → WD-016 regenerate broader corpus → WD-012 one release verification.

## CEO process correction
The team has now violated the coverage-only priority in two consecutive cycles: first AI discovery work, then `/sources/` discovery refresh/live smoke (`b13eb016` → `296e156`). This is a repeated process failure, not a request for another reminder. Root cause: the previous WIP rule still allowed workers to reinterpret useful auxiliary work as progress. The rule is now a hard execution gate: until WD-020 is accepted, only work that directly executes/unblocks WD-020 is admissible. If the assigned runtime cannot reach World Bank, ownership moves to a runtime that can; the blocked worker does not invent replacement work.

## Anti-loop environment note
A worker runtime DNS/network failure is not a product regression. Do not repeatedly retry an unavailable path without a new signal. For WD-020, one failed outbound attempt with exact evidence is enough to hand execution to another runtime. Never replace official data with hand-entered rows.