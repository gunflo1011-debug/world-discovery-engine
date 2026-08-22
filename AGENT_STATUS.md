# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Turn the now-working release path into commit-exact, browser-verifiable release evidence while expanding one genuinely useful verified data vertical and improving mobile information density.

## Operating rules
- Every worker syncs `main`, then reads this file before work.
- Exactly one owner per active task. Status: `TODO | IN_PROGRESS | BLOCKED | DONE`; priority `P0 | P1 | P2`.
- DONE requires implementation, checks, main integration, and live evidence for live-relevant changes.
- Live vocabulary only: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- After two materially failed attempts, change approach/scope/owner. Preserve evidence and next reproducible action.
- CI post-deploy verification is primary live truth; worker-local DNS failure is not a product failure.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-005 | P0 | Worker 4 | IN_PROGRESS | Add automated 360–430px browser smoke. DoD: Chromium/Playwright (or equally reproducible free browser runner) checks homepage + core evidence route for horizontal overflow, nav usability, uncaught console/page errors; failure uploads screenshot/log artifact. | Pages workflow | Manual real-device screenshots on 2026-08-22 show clean mobile rendering; prior local render attempts were unreliable. | Implement browser-level CI evidence; do not duplicate curl live checks. |
| WD-002 | P1 | Worker 2 | TODO | Resolve real-GDP methodology comparability or decisively fail closed. DoD: official release-specific evidence proving comparability, OR documented inability + replacement/deprioritization recommendation. | none | GDP archive presence exists; revision publication remains `BLOCKED_METHODOLOGY_COMPARABILITY`. | Research official WDI metadata/release docs; after two failed evidence paths choose a better indicator. |
| WD-003 | P1 | Worker 3 | IN_PROGRESS | Ship next high-value verified vertical slice. DoD: official source/provenance → normalization → useful human feature/page → machine-readable output → internal links/schema → tests → live evidence. | release path | Commits `3bc47f4`, `aced4b6`, `1bd73ac` enrich/test machine-readable evidence discovery index. | Continue from enriched discovery index into a query-worthy verified data use case; avoid thin page multiplication. |
| WD-006 | P1 | Worker 1 | TODO | Release/discovery QA for current main. DoD: verify new commit-exact marker converges live, critical routes/discovery metadata pass, and inspect machine index links for broken/noindex leakage. | CEO `8a30244` | Prior workflow #76 was green and manual mobile screenshots confirmed rendered production. | Use CI evidence for exact deployed SHA; report run URL/log evidence and broken-link findings only. |

## Recently completed / condensed evidence
- WD-001 DONE: workflow #76 green after fail-closed test-contract fixes (`62aeaed`, `cb44b1e`); production rendered successfully on a real mobile device.
- CEO `8a30244`: deployment now stamps `site/release-sha.txt`; post-deploy CI retries until the live marker exactly equals `GITHUB_SHA`, preventing stale HTTP-200 responses from being misclassified as current release evidence.
- CEO earlier release hardening: fixed production URL, retry/backoff, critical routes, canonical, robots and sitemap assertions.
- Worker 3 `3bc47f4` + `aced4b6` + `1bd73ac`: enriched and tested machine-readable evidence discovery index/handoff.
- Verified population evidence remains the production data family; demo/noindex evidence is excluded from discovery; duplicate/legacy routes are canonicalized/noindexed.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; real-GDP revision values correctly fail closed pending methodology comparability.
- DISCOVERY: machine-readable evidence index improved on current main; must remain free of demo/noindex leakage.
- MOBILE: manual real-device rendering evidence GREEN; automated browser smoke still open as WD-005.
- CI/DEPLOY/LIVE: prior release `cb44b1e` was LIVE VERIFIED. Current main after CEO release-marker commit `8a30244` is DEPLOY PENDING until commit-exact `verify-live` passes.

## CEO process note
Recurring ambiguity between “HTTP 200” and “the intended commit is actually live” is now treated as an engineering defect, not a manual-check task. `release-sha.txt` makes live evidence commit-exact. Worker 1 verifies release/discovery; Worker 2 owns GDP evidence; Worker 3 owns vertical data/product expansion; Worker 4 owns browser/mobile release evidence.