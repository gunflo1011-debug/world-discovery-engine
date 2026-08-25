# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 19:21 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown outcomes stay UNKNOWN.

## Current evidence snapshot
- **Things / Asset Market Alpha — P0 tonight.** Current main is `8160d75d2759874907a0a578bd612d668c091474` (2026-08-25). CI on that commit completed successfully. The mobile client is Expo/React Native and already exposes both `android` and `ios` scripts from one package/codebase, so future Android+iOS parity is structurally feasible.
- **Things Android APK path exists but is not yet evidenced as delivered tonight.** `.github/workflows/android-alpha-apk.yml` builds an Android APK with EAS local build, checks client secrets/config/dependencies/typecheck, runs the mobile flow tests, requires `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`, uploads `things-android-alpha-apk`, and performs an APK zip-integrity check. Current evidence does NOT yet prove a fresh successful APK artifact from the latest main.
- **Things owner isolation is implemented in schema.** `public.items` has `owner_id -> auth.users`, forced RLS, authenticated-only grants, owner-only SELECT and INSERT policies using `auth.uid()`. `condition_snapshots` is likewise owner-gated through the owning item. This is strong static evidence, but a live two-account hosted test is still required before claiming multi-user isolation proven.
- **Things product surface is materially developed.** Mobile scripts cover capture, inventory/value, value-to-sell, sale-start, SOLD state, owned-inventory lifecycle, activation funnel and real-app wiring. Real hosted Auth + two-account isolation + persistence + fresh APK install remain the acceptance gate for tonight.
- **World Discovery — maintain one focused worker.** Search Console access is proven read-only. Owner screenshots now additionally show Google has processed useful structured-data signals: 31 HTTPS pages, 26 valid breadcrumbs, datasets split 26 valid / 27 invalid, with dataset issues including missing `description`, missing `license`, missing `creator`, and invalid object type for `license`. Indexing data is still processing; observed search clicks remain 0 in the shown period. This creates a concrete quality task rather than a reason to bulk-publish more pages.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.

## Active allocation — 3 Things / 1 World Discovery until Android test gate closes

### CEO Worker 1 → Things — P0: Fresh installable Android APK
**Main goal:** produce a current installable Android artifact from latest main without embedding privileged secrets.
**Execution chain:** inspect latest Android workflow/config -> verify only public Supabase URL + anon key are injected -> run secret/config/dependency/type checks and all mobile flow tests -> build EAS Android APK -> integrity-check artifact -> upload clearly named artifact -> record exact run/artifact/install path.
**DoD:** successful workflow on current main; downloadable `things-android-alpha-apk`; APK integrity check passes; no service-role/private secret in client or logs; exact commit/run/artifact recorded.
**Economic impact:** converts code progress into a testable product today, shortening feedback time and de-risking adoption work.
**Handoff:** APK artifact/run + commit + install notes to CEO/Worker 3.

### CEO Worker 2 → Things — P0: Hosted Auth + two-user RLS/persistence proof
**Main goal:** prove real multi-user behavior against the configured Supabase project.
**Execution chain:** verify sign-up/sign-in/sign-out client path -> create/use two disposable test accounts through normal Auth -> Account A creates an item + condition -> verify A can re-read after session/app restart path -> Account B signs in -> prove B cannot select A's private item/condition -> B creates own item -> switch back to A and prove separation -> clean up only disposable test data if safe and supported.
**DoD:** evidence for registration/login/logout, two distinct authenticated users, persistence, A→B and B→A isolation, and no anon access to private owner data; failures documented rather than masked.
**Economic impact:** privacy/data-isolation is a launch prerequisite; proving it prevents trust-destroying cross-user leakage.
**Handoff:** redacted test IDs/results and exact commands/steps to CEO/Worker 3; never expose credentials/tokens.

### CEO Worker 3 → Things — P0: Device-ready acceptance packet
**Main goal:** make the artifact immediately usable for tonight's owner test and close the real MVP path.
**Execution chain:** consume Worker 1 APK + Worker 2 hosted proof -> fresh-install smoke path -> registration/login/logout -> Capture -> Inventory -> Value -> Sell-start -> persistence/relaunch -> account switch -> error/offline/retry sanity -> produce concise tester instructions and known-issues list. Do not claim physical-device success without evidence.
**DoD:** one short test packet containing APK source, install steps, two-account test recipe, expected outcomes for core flows, known limitations and exact bug-report fields; all automated/static checks linked to current commit.
**Economic impact:** maximizes useful owner feedback tonight and turns defects into actionable release evidence.
**Handoff:** final owner-facing install/test packet to CEO.

### CEO Worker 4 → World Discovery — P0: Fix Google's dataset structured-data defects at source
**Main goal:** increase Google eligibility/understanding without adding thin content.
**Execution chain:** locate Dataset JSON-LD generator -> map Search Console defects -> ensure every eligible Dataset has substantive `description`, valid `creator`, valid `license` representation and source-backed metadata -> add deterministic structured-data tests across generated dataset pages -> build/CI -> verify representative live output after deploy. Preserve breadcrumbs and existing valid markup.
**DoD:** generated Dataset markup passes repo tests for required/appropriate fields; missing description/creator/license and invalid license object-type defects are fixed in source; no fabricated attribution/license; deploy/CI evidence recorded. Search Console validation may lag and must not be claimed complete until Google reprocesses.
**Economic impact:** improves machine-readable quality and rich-result eligibility while reinforcing trust; higher value than blind page-count growth while clicks are still zero/unknown.
**Handoff:** commit, test command, representative URLs/markup and Google-validation follow-up to CEO.

## Android + iOS parity after tonight's Android acceptance
The mobile package already has shared Expo/React Native Android and iOS scripts. After the Android acceptance gate closes, preserve one shared codebase/backend/business logic/test suite. Add CI parity checks for both platforms where feasible, minimize/document platform-specific branches, and prepare iOS build/TestFlight readiness. Do not purchase Apple Developer membership, sign paid agreements, or publish to stores without explicit owner approval.

## Allocation rationale
The owner's explicit near-term objective is a real Android multi-user test tonight. Three Things workers now attack independent critical-path risks: artifact delivery, hosted auth/isolation, and device acceptance. A fourth Things worker would create more overlap than value. World Discovery retains one worker because Google has supplied concrete structured-data defects that can be fixed directly; broad new page generation remains lower-value while organic demand is still unproven.

## Search Console operating rule
Use Search Console as read-only, no-paid-cloud evidence. Current owner screenshots: 31 HTTPS; 26 valid breadcrumbs; Dataset 26 valid / 27 invalid; observed clicks 0; indexing processing. Fix concrete quality defects, then allow Google time to recrawl/reprocess. When performance rows exist, prioritize high-impression weak-CTR, positions 4–20 and sustained trends. Never fabricate traffic/rankings and never expose service-account material.

## Next priority / capital decision
**0 EUR new spend.** First close the Things Android acceptance gate using existing GitHub/Supabase/Expo infrastructure and fix World Discovery's evidenced markup defects. Paid Apple membership/store steps wait for explicit approval.

## Controls / blockers
- Do not claim a fresh APK exists until a successful latest-main Android workflow/artifact is evidenced.
- Static RLS is present, but live two-account isolation is not yet proven in this evidence snapshot.
- No payments, store publication, production-data deletion, privileged-secret exposure, or irreversible hosted mutations without explicit approval.

**Nutzeraktion: Keine aktuell.** The next user action should be the APK installation/test only after the artifact and hosted multi-user gate are evidenced.