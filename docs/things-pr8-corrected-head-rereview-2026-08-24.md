# Things PR #8 — corrected-head independent re-review

Date: 2026-08-24  
Reviewed head: `1ee5572ff8a85775d9eed0d50b6a3d5dcb0bd29a`  
Base: `main@46d93fe4a129e321da1a192d49c5ee2afcb663d4`  
Verdict: `CHANGES_REQUIRED__3_REMAINING_DEFECTS`

Scope was read-only. No PR, branch, hosted Supabase project, schema, user data, participant, or publication was changed.

## Closed since the first review

- **Prior defect-note semantics:** closed in code and exercised by green contract tests. `defectNote` is accepted only with `OTHER`, normalized, and bounded to 3–200 characters.
- **Expired active-intent case:** closed for `asOfDate > expiresOn` with stable `BUYER_INTENT_EXPIRED`; the regression passed.
- **Secret-scanner self-match:** closed. The scanner passed while continuing to scan every other eligible client file.
- The exact 16 named matrix cases remain present. The dedicated suite executed 23/23 green in mobile CI.
- Branch boundary remains clean: no stale PR #3 wholesale merge, hosted schema write, secret, participant action, or PR #6 security-file weakening.

## Defect 1 — `TRUSTED_SERVER` remains caller-spoofable

Severity: P0 authority boundary.

The updated `OperatorGate` adds `provenance: "TRUSTED_SERVER"`, but this is still a plain runtime string accepted by the exported mobile-domain function. A caller can fabricate all three values:

`{ possessionStatus: "VERIFIED", marketState: "MARKET_ELIGIBLE", provenance: "TRUSTED_SERVER" }`

The new negative test omits provenance; it proves only that a missing string fails, not that an untrusted caller cannot supply the string. The positive test fabricates the exact passing object locally. This does not satisfy the required server-origin/non-owner regression.

Required correction:

1. Keep pure technical compatibility separate from final authorization.
2. Final `MARKET_ELIGIBLE/VERIFIED` evaluation must occur in a server-side/RPC boundary that reads trusted state under existing authorization, or accept an opaque capability that is impossible for untrusted JavaScript to construct.
3. Mobile code may display a technical compatibility result but must not issue final eligibility.
4. Test that a caller supplying the complete three-string object still cannot obtain final eligibility; test the trusted server/RPC path separately without a service-role key in the client.

## Defect 2 — invalid buyer date ranges can still match

Severity: P0 behavioral correctness.

The prior review required deterministic validation of buyer/as-of dates and rejection when `startsOn > expiresOn`. The corrected code checks only expiry relative to `asOfDate`.

Concrete currently matchable invalid fixture:

- owner availability: 2026-08-24 through 2026-09-10,
- buyer `startsOn = 2026-09-05`,
- buyer `expiresOn = 2026-09-02`,
- `asOfDate = 2026-08-25`,
- all other compatibility inputs pass.

The current overlap expression can pass despite a reversed buyer interval. Invalid date strings are also compared lexically rather than rejected.

Required correction:

1. Validate `startsOn`, `expiresOn`, and `asOfDate` as real ISO date-only values.
2. Return stable `INVALID_BUYER_INTENT_RANGE` when `startsOn > expiresOn`.
3. Keep `BUYER_INTENT_EXPIRED` for a valid but expired intent.
4. Add both negative tests and retain inclusive overlap only for a valid active interval.

## Defect 3 — required full evidence remains incomplete/red

Severity: P0 release evidence.

The dedicated contract suite is green, but the acceptance contract required the original 20 PR #7 safety tests unchanged plus all new cases and complete mobile/backend workflows.

Current exact evidence:

- [mobile-alpha-ci 32757266034](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32757266034): secret scan, 23 contract tests and Expo compatibility passed; full TypeScript failed because `PASSWORD_RECOVERY_SUCCEEDED` is not an `AlphaEventName`. Configuration and Android export were skipped.
- [backend-security-gate 32757266018](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32757266018): clean reset passed; pgTAP failed because the `add_private_device` battery argument still needs the already-proven explicit `smallint` cast. Lint and concurrency were skipped.
- The original `mobile/tests/smartphone-intake.test.cjs` 20-test suite is not present unchanged on PR #8; selected semantics were folded into the 23-case replacement suite.

Required correction:

1. Port/run the original 20 PR #7 tests unchanged alongside the contract suite.
2. Apply only the two narrow, already-proven compatibility corrections: remove the unsupported telemetry event and restore the explicit pgTAP `smallint` cast. Do not merge stale PR #3 wholesale.
3. Obtain a fresh head where mobile reaches TypeScript, configuration and Android export, and backend reaches pgTAP, lint and concurrency, all green.

## Acceptance gate

Return `ACCEPT` only when all three remaining defects are closed, the original 20 tests and expanded contract suite are green, both full workflows are green on the exact reviewed head, and PR #8 remains draft/unmerged with no hosted or participant action.
