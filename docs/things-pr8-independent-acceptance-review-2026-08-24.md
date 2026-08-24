# Things PR #8 — independent acceptance review

Date: 2026-08-24  
Reviewed head: `9f8961ab7332707ec568e4f4dbcaf542b4d64654`  
Base: `main@46d93fe4a129e321da1a192d49c5ee2afcb663d4`  
Verdict: `CHANGES_REQUIRED__3_DEFECTS`

Scope was read-only. No PR, branch, hosted Supabase project, schema, user data, participant, or publication was changed.

## Boundary review

PASS:

- PR #8 is six commits ahead of exact current main and remains draft/open/mergeable/unmerged.
- Changed paths are limited to mobile CI wiring, package/test configuration, the smartphone intake domain/tests, and status documentation.
- No stale PR #3 wholesale merge or history is present.
- No Supabase migration, hosted schema, secret, service-role key, participant contact, UI publication, or payment action is present.
- PR #6 database/RPC files are not duplicated or weakened.
- Owner payload rejects catalog IDs and privileged status fields by name.
- Sensitive device-ID, credential, and precise-location field names remain rejected.

Evidence blocker:

- [mobile-alpha-ci 32751369620](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32751369620) failed at the pre-existing client-secret scanner, so the new contract suite and all later mobile checks were skipped.
- [backend-security-gate 32751369646](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32751369646) rebuilt the database but failed at pgTAP, so lint and concurrency were skipped.
- Therefore the cases below are static code/test alignment only, not executed green evidence.

## Sixteen-case matrix

| Case | Static result | Evidence |
|---|---|---|
| G1-POS-UNIQUE | MATCH | exact normalized model + storage + DE market returns catalog-owned ID |
| G1-NEG-STORAGE | MATCH | no fallback across storage |
| G1-NEG-AMBIGUOUS | MATCH | more than one row fails closed |
| G1-NEG-ID-INJECTION | MATCH | payload ID rejected |
| G2-POS-OVERLAP | MATCH | consented inclusive overlap evaluates eligible under other passing gates |
| G2-NEG-REVERSED | MATCH | reversed owner dates rejected |
| G2-NEG-TOO-LONG | MATCH | end beyond submitted date +30 rejected |
| G2-NEG-NO-OVERLAP | MATCH | valid private intake, candidate rejected |
| G2-NEG-NO-CONSENT | MATCH | valid private intake, candidate rejected |
| G3-POS-DERIVATION | MATCH | display/housing/camera/biometrics/battery/other mappings asserted |
| G3-POS-CANDIDATE | CONDITIONAL | expected output asserted, but trusted-gate provenance is not enforced |
| G3-NEG-BATTERY-UNKNOWN | MATCH | null battery fails buyer minimum |
| G3-NEG-NETWORK | MATCH | LOCKED and UNKNOWN remain distinct and ineligible |
| G3-NEG-OPERATOR-GATE | CONDITIONAL | non-passing values reject, but caller can fabricate passing values |
| G3-NEG-PRICE | MATCH | floor above maximum rejected |
| G3-NEG-VARIANT | MATCH | exact catalog ID equality required |

## Defect 1 — prior safe intake contract was not preserved

Severity: P0 acceptance regression.

PR #8 replaces the PR #7 intake implementation with a shorter validator and does not port the existing 20-test safety suite unchanged. Specifically, `defectNote` is now accepted whenever it is a string, without:

- requiring `OTHER`,
- rejecting a note when `OTHER` is absent,
- enforcing the prior 3–200 character bound,
- normalizing internal whitespace.

An arbitrarily long note on a non-`OTHER` intake currently validates. This violates the executable specification's explicit requirement that all existing 20 PR #7 safety tests remain green.

Required correction and tests:

1. Restore the PR #7 `defectNote` semantics.
2. Port and run the full existing 20-test suite unchanged alongside the 16 named cases.
3. Negative assertion: `defects=[]` plus `defectNote="scratch"` returns `UNEXPECTED_DEFECT_NOTE`.
4. Negative assertions: `defects=[OTHER]` with fewer than 3 or more than 200 normalized characters returns `DEFECT_NOTE_REQUIRED`.

## Defect 2 — privileged operator gate is caller-spoofable

Severity: P0 authority boundary.

`evaluateCandidate(..., g: OperatorGate, ...)` accepts a plain caller-created object. The positive test itself fabricates:

`{ possessionStatus: "VERIFIED", marketState: "MARKET_ELIGIBLE" }`

There is no trusted server context, ownership/non-owner context, opaque verified type, or server-side fetch boundary. Any mobile caller can therefore obtain `eligible=true` locally by supplying passing strings. Although this does not itself write the database, it violates the mandatory authority regression and creates an unsafe contract for later wiring.

Required correction and tests:

1. Do not accept raw operator statuses from the untrusted intake/caller boundary.
2. Split technical candidate evaluation from final server authorization, or require an opaque trusted result constructible only by the server adapter.
3. Add the specified non-owner/untrusted-context test proving client-provided `VERIFIED/MARKET_ELIGIBLE` cannot satisfy final eligibility.
4. Final persisted eligibility must still be derived from server-read `item_market_state` under existing authorization; no mobile service-role/secret key.

## Defect 3 — an expired buyer intent can still match

Severity: P0 economic/behavioral correctness.

The overlap calculation sets `buyerStart = max(startsOn, asOfDate)` but never rejects `asOfDate > expiresOn`. With an owner window spanning both dates, an already expired intent can return `eligible=true`.

Concrete failing fixture:

- owner availability: 2026-08-24 through 2026-09-10,
- buyer intent: starts 2026-08-25, expires 2026-09-02,
- `asOfDate = 2026-09-03`,
- every other compatibility and trusted gate passes.

Current comparison permits the match because owner start is before expiry and `asOfDate` is before owner end. The expected result is `BUYER_INTENT_EXPIRED` and `eligible=false`.

Required correction and tests:

1. Validate buyer/as-of dates deterministically.
2. Reject `asOfDate > expiresOn` before overlap evaluation with stable reason `BUYER_INTENT_EXPIRED`.
3. Reject `startsOn > expiresOn` as an invalid trusted intent fixture.
4. Preserve inclusive overlap for active intents only.

## Acceptance after correction

Return `ACCEPT` only when:

- all three defects are closed;
- the original 20 PR #7 tests and the 16 named contract cases execute green;
- the new untrusted-operator and expired-intent regressions execute green;
- mobile CI reaches and completes the contract, Expo, TypeScript, configuration, and Android-export steps;
- backend clean replay, pgTAP, lint, and concurrency are green;
- changed-file scope still excludes stale PR #3, hosted writes, secrets, schema changes, contact data, exact location, and participant action.

Until then PR #8 must remain draft and unmerged.
