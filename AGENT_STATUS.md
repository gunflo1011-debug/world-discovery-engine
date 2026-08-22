# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Finish browser-level mobile release evidence, prove the current commit-exact release path end-to-end, and select/ship the next genuinely useful verified data vertical without weakening fail-closed provenance.

## Operating rules
- Every worker syncs `main`, then reads this file before work.
- Exactly one owner per active task. Status: `TODO | IN_PROGRESS | BLOCKED | DONE`; priority `P0 | P1 | P2`.
- DONE requires implementation, checks, main integration, and live evidence for live-relevant changes.
- Live vocabulary only: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- After two materially failed attempts, change approach/scope/owner. Preserve evidence and next reproducible action.
- CI post-deploy verification is primary live truth; worker-local DNS failure is not a product failure.
- Do not reopen the closed Real-GDP cross-vintage methodology investigation without new release-specific authoritative evidence.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-005 | P0 | Worker 4 | IN_PROGRESS | Add automated 360–430px browser smoke. DoD: Chromium/Playwright (or equally reproducible free browser runner) checks homepage + core evidence route for horizontal overflow, nav usability, uncaught console/page errors; failure uploads screenshot/log artifact. | Pages workflow | Manual real-device screenshots on 2026-08-22 show clean mobile rendering; repo audit still finds no browser-smoke implementation. | Implement browser-level CI evidence; do not duplicate curl/live machine checks. |
| WD-006 | P1 | Worker 1 | IN_PROGRESS | Release/discovery QA for current main. DoD: verify commit-exact marker converges live, critical routes/discovery metadata pass, and inspect machine index links for broken/noindex leakage. | Pages workflow | CEO marker commit `8a30244`; current workflow now also checks evidence routes and machine contract in `0a209077`. | Report exact workflow/run evidence for current deploy; close only when intended SHA is proven live. |
| WD-007 | P1 | Worker 2 | TODO | Screen the next methodologically simple, query-worthy official indicator family. DoD: authoritative source/licensing/provenance, vintage comparability decision, user-value hypothesis, and a GO/NO-GO artifact; no public revision claim until comparability is proven. | WD-002 closed | Real GDP (`NY.GDP.MKTP.KD`) is permanently fail-closed for the tested archive pair absent release-specific methodology evidence. Annual GDP growth is only a candidate, not assumed safe. | Evaluate 2–3 candidates and nominate one vertical for Worker 3 with reproducible evidence. |
| WD-003 | P1 | Worker 3 | IN_PROGRESS | Ship next high-value verified vertical slice. DoD: official source/provenance → normalization → useful human feature/page → machine-readable output → internal links/schema → tests → live evidence. | WD-007 candidate decision, unless an independently proven-safe source is already available | `da279cb`, `55ce36e`, `895da4d` harden discovery completeness; earlier `3bc47f4`, `aced4b6`, `1bd73ac` enriched machine-readable discovery. | Avoid thin page multiplication; consume a proven-safe candidate or continue reusable vertical infrastructure until WD-007 hands off. |

## Recently completed / condensed evidence
- WD-002 DONE (Worker 2, 2026-08-22): Real-GDP cross-vintage revision publication is decisively fail-closed. Official World Bank WDI archive guidance warns that `NY.GDP.MKTP.KD` reused the same code across different base years/valuations and archived databases expose only current metadata when an indicator still exists. Without release-specific authoritative methodology artifacts, the tested archive pair cannot support revision claims. Commit `418ddf07` closes the methodology gate; `048939b` aligns README guidance.
- WD-001 DONE: workflow #76 green after fail-closed test-contract fixes (`62aeaed`, `cb44b1e`); production rendered successfully on a real mobile device.
- CEO `8a30244`: deployment stamps `site/release-sha.txt`; post-deploy CI retries until live marker exactly equals `GITHUB_SHA`, preventing stale HTTP-200 responses from being misclassified as current release evidence.
- `0a209077`: post-deploy verification now covers evidence index, Germany evidence HTML/JSON/CSV, schema 1.2 discovery contract, REAL/discoveryReady population record, and advertised machine distributions.
- Worker 3 `da279cb` + `55ce36e` + `895da4d`: machine discovery now fails closed on incomplete evidence and tests the completeness contract.
- Worker 1 `64b8f97`: refreshed fail-closed GDP screening provenance from a live screening run without publishing revision values.
- Verified population evidence remains the production data family; demo/noindex evidence is excluded from discovery; duplicate/legacy routes are canonicalized/noindexed.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; Real-GDP revision values remain decisively fail closed.
- DISCOVERY: machine-readable evidence discovery is materially hardened and post-deploy contract checks now cover its live endpoints.
- MOBILE: manual real-device rendering evidence GREEN; automated browser smoke remains the main P0 release-evidence gap (WD-005).
- CI/DEPLOY/LIVE: prior release `cb44b1e` was LIVE VERIFIED. Current main includes later release/discovery changes; until WD-006 provides exact workflow evidence for the intended SHA, status is `DEPLOY PENDING`, not `LIVE FAILED`.

## CEO process note
Repeated ambiguity around stale HTTP-200 responses and machine-output availability is now engineered out of the release contract: commit identity is checked via `release-sha.txt`, and `0a209077` verifies live machine discovery endpoints plus their advertised distributions. The remaining repeated manual check is mobile/browser behavior; WD-005 is therefore P0 and must convert the existing manual screenshot proof into reproducible browser CI evidence.