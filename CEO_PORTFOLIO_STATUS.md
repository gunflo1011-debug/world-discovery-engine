# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 21:38 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown outcomes stay UNKNOWN.

## Current evidence snapshot
- **Things / Asset Market Alpha:** latest evidenced build-path main commit before worker QA is `963c2c11f5ac433d89d5e8abb23955b4f3b47f8a`. Worker 2 has now added static two-user privacy acceptance coverage in commits `3311a2d3b1a6cc39475a4c7f837a3c34cdbc0b89` and `9626f6960e18d4072e0c12ac42bd427290f691e9`; no workflow was intentionally started.
- **Things build readiness:** `mobile/package-lock.json` remains absent; deterministic APK build remains blocked until the owner-approved self-hosted `generate-lockfile` path is run and the lockfile reviewed/committed.
- **Things privacy:** core schema has FORCE RLS on `items` and `condition_snapshots`, owner-only SELECT/INSERT policies, and no anon private-row grant. App auth has normal signup/signin/logout/session restore. Worker 2 now provides an exact A/B runtime matrix, but live two-account hosted isolation remains UNPROVEN until executed through normal accounts.
- **Android+iOS parity:** Expo/React Native remains the shared-codebase strategy; platform-specific work should be limited to packaging/signing/native edges.
- **World Discovery:** provenance-hardening remains in place; Google reprocessing is external/lagging evidence.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.

## Absolute cost control
GitHub-Actions-Budget genutzt: Nein. CEO/Workers must not start GitHub-hosted Actions, paid runners, manual workflows, or any action that could consume the owner's $1 Actions budget. Builds/CI requiring paid GitHub capacity are owner-triggered only in conversation. Free code/commits/branches/PRs/static checks remain allowed. Avoid workflow-trigger fanout where controllable.

## Worker allocation — one free package each

### CEO Worker 1 → Things: reproducible dependency/build-input gate
**Goal:** make the Android build inputs deterministic before any owner-triggered build.
**Execution:** inspect `mobile/package.json` + lockfile state -> produce/validate lockfile using free/local-compatible reasoning/code changes only -> verify workflow no longer assumes Linux-only commands -> document exact local checks.
**DoD:** lockfile/build-input state is committed or exact blocker documented; `npm ci` preconditions are satisfied by repository contents; no workflow is triggered.
**Worker 1 handoff (21:31):** `mobile/package-lock.json` is absent. Owner-approved next action: run manual `android-alpha-apk` with `task=generate-lockfile` on the self-hosted Windows runner, retrieve/review it, then commit as `mobile/package-lock.json`. Do not run `build-apk` yet.
**Economic value:** reduces build retries and shortens time to a usable APK.

### CEO Worker 2 → Things: multi-user Auth/RLS acceptance specification
**Goal:** make the real two-user privacy test executable with minimal owner time and no paid CI.
**Execution:** inspect auth/data paths and migrations -> derive A/B account isolation test matrix -> identify safe disposable-data setup/cleanup -> add free static/test coverage where possible without hosted mutations requiring owner approval.
**DoD:** exact pass/fail matrix covers signup/login/logout, persistence, A cannot read B, B cannot read A, anon cannot read private rows; code/static gaps fixed or explicitly listed; no credentials exposed.
**Worker 2 handoff (21:38):** DONE repository-side. Commit `3311a2d3` adds `mobile/scripts/check-two-user-rls-acceptance.mjs`, which statically gates normal auth, session restore, FORCE RLS, owner-only item/condition policies, anonymous grant reset, privileged-key refusal, and hosted-smoke cross-owner leakage detection. Commit `9626f696` adds `CEO_WORKER2_TWO_USER_ACCEPTANCE.md` with exact A1-A5/B1-B4/ANON pass/fail matrix, disposable-data rules, redacted evidence fields, and explicit STOP on cross-account leakage. Runtime two-user PASS is still not claimed. Cleanup remains intentionally non-privileged: current client has no safe owner-delete command, so disposable rows stay in disposable accounts rather than bypassing RLS for cleanup.
**Economic value:** prevents launch-blocking privacy defects and makes scarce device-test time deterministic.
**Handoff:** Worker 3 should consume `CEO_WORKER2_TWO_USER_ACCEPTANCE.md`; final privacy PASS requires the live A/B matrix through normal app/auth clients.

### CEO Worker 3 → Things: owner-ready Android acceptance packet
**Goal:** minimize steps between owner-approved build and meaningful device feedback.
**Execution:** consume Worker 1/2 handoffs -> maintain install/test checklist -> map Capture → Inventory → Value → Sell → persistence/relaunch → account switch -> define bug evidence fields and expected outcomes.
**DoD:** one current packet tied to exact commit, with build artifact placeholder, install path, two-account recipe, expected outcomes, known limitations; no claim of physical-device success before evidence.
**Economic value:** converts the scarce build event into maximum product-learning value.
**Handoff:** incorporate Worker 2 commits `3311a2d3` / `9626f696` and preserve the rule that static RLS evidence is not live two-user evidence.

### CEO Worker 4 → World Discovery: source-backed Dataset quality + useful-page differentiation
**Goal:** turn Google's evidenced Dataset issues into durable quality improvements while avoiding thin/duplicate content.
**Execution:** verify provenance guards -> inspect representative Dataset generators/pages -> strengthen source-backed information gain/internal linking -> add deterministic free tests.
**DoD:** no fabricated creator/license; representative generated Dataset metadata is source-backed; quality checks cover required fields; at least one concrete information-gain/internal-link improvement is committed or exact blocker documented; no paid workflow triggered.

## Largest blocker
Things still lacks end-to-end evidence of a fresh installable APK plus live two-account device behavior. Build input is blocked by the missing lockfile; privacy runtime evidence is now specified precisely but not yet executed.

## Next priority
Worker 1 waits on owner-approved self-hosted lockfile generation; Worker 3 consumes Worker 2's exact A/B matrix into the device packet; Worker 2 should not duplicate runtime claims until two normal accounts and a current build are available.

**Nutzeraktion:** Run the existing `android-alpha-apk` manual workflow with `task=generate-lockfile` on the connected self-hosted Windows runner; do not run `build-apk` yet.