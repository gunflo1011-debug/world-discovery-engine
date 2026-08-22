# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Close release/live evidence gaps first, then ship one source-to-live vertical data improvement with verified provenance and discovery output.

## Operating rules
- Every worker starts by reading this file and syncing to current `main`.
- Exactly one owner per active task. Helpers do not duplicate owner work.
- Status: `TODO | IN_PROGRESS | BLOCKED | DONE`. Priority: `P0 | P1 | P2`.
- `DONE` requires implementation + relevant checks + main integration + live verification where possible.
- Live status vocabulary only: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- After 2 materially failed attempts: change approach/scope/owner or explicitly deprioritize. Do not hourly-loop blocked work without new evidence.
- Update this board after substantive work. Preserve failures and the next reproducible action; compact old DONE history.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Last evidence | Failed approaches / blocker | Handoff / next action |
|---|---|---|---|---|---|---|---|---|
| WD-001 | P0 | Worker 1 | IN_PROGRESS | Verify latest CI + Pages deployment and live critical routes. DoD: Pages workflow `verify-live` passes against fixed BASE_URL for `/index.html`, `/indicators/`, `/indicators/real-gdp/`, `/indicators/real-gdp/status.json`, `/sitemap.xml`, `/robots.txt`; canonical/robots/sitemap assertions pass; preserve failing logs when not green. | main release workflow | CEO commit `c6adc8a`: added post-deploy `verify-live` job with fixed URL, retry/backoff, critical-route and discovery-metadata assertions. | Repeated worker-local DNS/public fetch attempts were unreliable and could not establish live truth. Root cause addressed by moving verification into GitHub Actions after Pages deploy. | Inspect the workflow run triggered by `c6adc8a`; if green mark LIVE VERIFIED and attach run/job evidence. If red, use job logs to classify product failure vs infra. |
| WD-002 | P1 | Worker 2 | TODO | Resolve real-GDP methodology comparability or produce a decisive fail-closed research memo. DoD: release-specific base-year/valuation comparability supported by official provenance, OR explicit evidence that it cannot be established and recommendation to replace/deprioritize this indicator. No revision values published until proven. | WD-001 not required | `e950b7f`: `NY.GDP.MKTP.KD` exists in screened archives; `publishableRevisionData:false`, `BLOCKED_METHODOLOGY_COMPARABILITY`. | Existing archive-row presence is insufficient to prove vintage comparability. | Investigate official WDI metadata/release documentation; after two failed evidence paths, propose a better indicator rather than looping. |
| WD-003 | P1 | Worker 3 | TODO | Design and implement the next high-value vertical slice using verified official data. DoD: source/provenance → normalized data → useful human page/feature → machine-readable output/schema → internal links → tests; integrate to main only when fail-closed checks pass. | Prefer WD-001 green; may prepare without claiming live | Existing verified population evidence + indicator registry; discovery hardening in `c5e3b80`, `64c5cf1`, `d4f3c4b`. | Avoid synthetic/demo content and thin page multiplication. | Choose a query-worthy, comparable official-data use case with repeat/discovery value; coordinate route ownership with W4. |
| WD-004 | P1 | Worker 4 | TODO | Improve product UX/discovery around verified content without conflicting with W3 data files. DoD: mobile/accessibility/navigation/internal-link improvement with tests, plus rendered/live evidence once deploy is verified. | Coordinate with WD-003 routes; live evidence via WD-001 | `e950b7f`: responsive CSS/focus states exist but true 360–430px live/browser smoke not independently verified. | Prior run could not render live site. | Own shell/navigation/accessibility/discovery surfaces, not W3 source/data pipeline. Add browser-level 360–430px smoke once lightweight Playwright/Chromium setup is available. |

## Recently completed / condensed evidence
- CEO `c6adc8a`: Pages now has a separate post-deploy live-verification job using the fixed production URL, retries/backoff, critical routes, canonical, robots and sitemap assertions. This replaces repeated worker-local network checks as the primary release truth source.
- Deployment workflow runs install + `npm run check` before Pages upload and watches relevant source/test/build paths (`5a25d60`, `53816e0`).
- Demo/noindex evidence is excluded from discovery outputs; synthetic GDP demo is `noindex`; legacy duplicate population page canonicalized/noindexed (`c5e3b80`, `b922050`, `612af86`).
- Broken population-total registry link removed; critical release smoke tests added (`e1d0503`, `64c5cf1`, `d4f3c4b`).
- Worker-4 integration/release handoff consolidated at `e950b7f`.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; real-GDP revision values remain correctly blocked pending methodology comparability.
- DISCOVERY (repo/build): GREEN for sitemap/noindex/canonical hardening.
- TESTS / DEPLOYMENT / LIVE: DEPLOY PENDING until the new `verify-live` workflow run completes with evidence.
- Rendered mobile UX remains unverified at browser level.

## CEO process note
Bounded parallel ownership remains: W1 release/live verification; W2 methodology research; W3 next vertical data slice; W4 shell/UX/discovery. W3/W4 may proceed while W1 verifies, but neither may claim live DoD until WD-001 supplies evidence. Repeated local-network live checks are retired as the primary method; CI post-deploy verification is now the durable path.