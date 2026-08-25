# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 22:21 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown outcomes stay UNKNOWN.

## Current evidence snapshot
- **Things:** latest evidenced repository work includes Worker 2 privacy/acceptance commits `3311a2d3` and `9626f696`, plus Worker 3 device packet commit `2c000538`. `mobile/package-lock.json` is still absent, so the reproducible APK path is not yet closed.
- **Things privacy:** static owner-isolation/RLS acceptance coverage and an exact two-account runtime matrix exist; live A/B isolation remains UNPROVEN until executed with normal accounts.
- **Android+iOS parity:** Expo/React Native remains the shared-codebase strategy; platform-specific work stays limited to packaging/signing/native edges unless evidence requires otherwise.
- **World Discovery:** Dataset provenance hardening is evidenced in commits `8754d8f`, `f9a5b2a`, `7befe02`; Google reprocessing/traffic effect remains external and unproven.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.

## Resource and test policy
- **Things private repo:** prefer free/static/local checks, then Windows self-hosted when technically sensible. GitHub-hosted Linux is allowed when materially more appropriate or cheaper in engineering time. Additional GitHub Actions spend is capped internally at **10 EUR/month**; this is a ceiling, not a target. No blind runs or unchanged retries.
- **APK:** prefer Windows self-hosted. No Linux runner on the laptop for now.
- **World Discovery public repo:** normal GitHub-hosted standard runners may be used; do not block useful CI merely to avoid runner minutes.
- Since the prior CEO cycle, no newly evidenced cost-relevant Things GitHub-hosted run was found. Worker 3 explicitly made no workflow run on `2c000538`.

## Worker allocation

### CEO Worker 1 → Things: close deterministic lockfile gate
**Goal:** create and validate `mobile/package-lock.json` using the Windows self-hosted path.
**Execution:** inspect current workflow -> use `generate-lockfile` on self-hosted Windows if runner is available -> validate generated lockfile against `mobile/package.json` -> commit only if deterministic and reviewable -> run only the cheapest necessary static/local verification.
**DoD:** lockfile committed and `npm ci` preconditions satisfied, or a new concrete runner/tooling blocker with evidence.
**Economic value:** removes the immediate APK build blocker and prevents repeated paid/remote build failures.
**Handoff:** Worker 3 gets exact commit SHA once gate is closed.

### CEO Worker 2 → Things: runtime-test readiness, no duplicate specification
**Goal:** turn the already-written A/B privacy matrix into the smallest executable device/runtime procedure.
**Execution:** inspect current acceptance scripts and app auth/data paths -> remove any remaining friction that can be fixed repository-side -> add only missing deterministic checks; do not rewrite the matrix.
**DoD:** repository-side runtime harness/checklist is executable against a built APK with two disposable normal accounts; any remaining step is inherently device/runtime only.
**Economic value:** shortens time from APK to trustworthy multi-user evidence.
**Handoff:** Worker 3 consumes the finalized runtime path.

### CEO Worker 3 → Things: APK acceptance coordinator
**Goal:** be ready to convert the first valid APK into product evidence immediately.
**Execution:** consume Worker 1/2 handoffs -> keep acceptance packet tied to exact build commit -> once APK exists, drive Capture → Inventory → Value → persistence/relaunch → account switch and A/B isolation evidence.
**DoD:** before APK, packet remains current without documentation churn; after APK, explicit PASS/BLOCKED/FAIL evidence for core smoke and two-user isolation.
**Economic value:** maximizes learning from each build and prevents wasted build cycles.
**Handoff:** failures go to the worker best suited to root-cause them.

### CEO Worker 4 → World Discovery: useful-page differentiation
**Goal:** improve Google/user value beyond structured-data hygiene.
**Execution:** inspect representative generated pages -> implement one source-backed information-gain improvement (comparison/context/table/visual/internal-link path) that scales without fabricated facts -> add deterministic quality guard -> allow normal public-repo CI if useful.
**DoD:** at least one concrete user-visible scalable improvement committed with source/provenance guard and tests; no thin/near-duplicate expansion.
**Economic value:** increases probability of organic traffic and future monetization rather than merely increasing page count.
**Handoff:** report affected route family, test evidence, and expected search/user benefit without claiming traffic before measurement.

## Largest blocker
Things still lacks a deterministic lockfile/build input and therefore a freshly evidenced installable APK. Live two-account behavior cannot be proven until that build gate closes.

## CEO decision / next priority
Stop treating all Actions usage as forbidden. Use the connected Windows self-hosted runner first for the lockfile/build path, with targeted GitHub-hosted Linux only when technically justified. Keep World Discovery moving on user-visible information gain in parallel.

**Nutzeraktion:** Keine — Worker 1 should first attempt the approved self-hosted Windows lockfile path autonomously; escalate only if the runner or a required external approval actually blocks execution.
