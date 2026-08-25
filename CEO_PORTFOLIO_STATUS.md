# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 21:21 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown outcomes stay UNKNOWN.

## Current evidence snapshot
- **Things / Asset Market Alpha:** latest evidenced main commit is `963c2c11f5ac433d89d5e8abb23955b4f3b47f8a` (`Run Android APK workflow on self-hosted Windows runner`, 2026-08-25 21:13 Europe/Berlin). The owner then demonstrated the self-hosted Windows runner connected and `Listening for Jobs`; the manually triggered `android-alpha-apk` run was accepted by that runner. No autonomous paid/GitHub-hosted build is authorized.
- **Things build readiness:** the Android workflow is manual and has build/lockfile modes. The remaining acceptance work is to make dependency resolution reproducible, run free static/local checks, preserve public-only Supabase client configuration, and prepare the exact owner-triggered build/test handoff. A fresh installable APK is not claimed here.
- **Things privacy:** schema evidence previously showed owner-scoped RLS; live two-account hosted isolation remains an acceptance gate and must not be claimed proven without runtime evidence.
- **Android+iOS parity:** Expo/React Native remains the shared-codebase strategy; platform-specific work should be limited to packaging/signing/native edges.
- **World Discovery:** latest evidenced commits are `8754d8f`, `f9a5b2a`, `7befe02` at 21:02 Europe/Berlin, hardening Dataset creator provenance and remediation evidence. Earlier same-day commits added deterministic Dataset structured-data quality gates and normalization without fabricating licenses. Google reprocessing remains external/lagging evidence, not a completed outcome.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.

## Absolute cost control
GitHub-Actions-Budget genutzt: Nein. CEO/Workers must not start GitHub-hosted Actions, paid runners, manual workflows, or any action that could consume the owner's $1 Actions budget. Builds/CI requiring paid GitHub capacity are owner-triggered only in conversation. Free code/commits/branches/PRs/static checks remain allowed. Avoid workflow-trigger fanout where controllable.

## Worker allocation — one free package each

### CEO Worker 1 → Things: reproducible dependency/build-input gate
**Goal:** make the Android build inputs deterministic before any owner-triggered build.
**Execution:** inspect `mobile/package.json` + lockfile state -> produce/validate lockfile using free/local-compatible reasoning/code changes only -> verify workflow no longer assumes Linux-only commands -> document exact local checks.
**DoD:** lockfile/build-input state is committed or exact blocker documented; `npm ci` preconditions are satisfied by repository contents; no workflow is triggered.
**Economic value:** reduces paid-build retries and shortens time to a usable APK.
**Handoff:** commit + free verification commands + residual build-only unknowns to Worker 3.

### CEO Worker 2 → Things: multi-user Auth/RLS acceptance specification
**Goal:** make the real two-user privacy test executable with minimal owner time and no paid CI.
**Execution:** inspect auth/data paths and migrations -> derive A/B account isolation test matrix -> identify safe disposable-data setup/cleanup -> add free static/test coverage where possible without hosted mutations requiring owner approval.
**DoD:** exact pass/fail matrix covers signup/login/logout, persistence, A cannot read B, B cannot read A, anon cannot read private rows; code/static gaps fixed or explicitly listed; no credentials exposed.
**Economic value:** prevents launch-blocking privacy defects.
**Handoff:** concise test matrix + relevant commits to Worker 3.

### CEO Worker 3 → Things: owner-ready Android acceptance packet
**Goal:** minimize steps between owner-approved build and meaningful device feedback.
**Execution:** consume Worker 1/2 handoffs -> maintain install/test checklist -> map Capture → Inventory → Value → Sell → persistence/relaunch → account switch -> define bug evidence fields and expected outcomes.
**DoD:** one current packet tied to exact commit, with build artifact placeholder, install path, two-account recipe, expected outcomes, known limitations; no claim of physical-device success before evidence.
**Economic value:** converts the scarce build event into maximum product-learning value.
**Handoff:** owner-facing acceptance packet to CEO.

### CEO Worker 4 → World Discovery: source-backed Dataset quality + useful-page differentiation
**Goal:** turn Google's evidenced Dataset issues into durable quality improvements while avoiding thin/duplicate content.
**Execution:** verify provenance guards from `8754d8f`/`f9a5b2a`/`7befe02` -> inspect representative Dataset generators/pages -> strengthen substantive descriptions, methodology/source context, internal links and useful tables/visualization hooks only where source-backed -> add deterministic free tests.
**DoD:** no fabricated creator/license; representative generated Dataset metadata is source-backed; quality checks cover required fields; at least one concrete information-gain/internal-link improvement is committed or exact blocker documented; no paid workflow triggered.
**Economic value:** improves search eligibility, trust and user usefulness rather than merely increasing page count.
**Handoff:** commits + representative routes + remaining Google reprocessing follow-up to CEO.

## CEO own work
- Reconciled the stale status file with current repository evidence: Things is now at `963c2c1`, not `8160d75`; the build path is self-hosted Windows/manual, not an autonomous EAS/GitHub-hosted build claim.
- Replaced the old worker instruction to run/upload an APK with a strict no-paid-Actions operating model.
- Recorded the latest World Discovery provenance-hardening commits and preserved the rule that Google reprocessing cannot be claimed early.

## Largest blocker
Things still lacks end-to-end evidence of a fresh installable APK plus live two-account device behavior. The correct next move is not more autonomous CI; it is to eliminate every free/static uncertainty before the next owner-approved build.

## Next priority
Worker 1 closes deterministic build inputs; Worker 2 closes the acceptance specification; Worker 3 consolidates both into the device packet; Worker 4 adds source-backed information gain to World Discovery while preserving provenance safeguards.

**Nutzeraktion: Keine.** No paid/hosted build should be started autonomously.