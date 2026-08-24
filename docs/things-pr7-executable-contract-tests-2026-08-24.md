# Things PR #7 — executable correction contract

Date: 2026-08-24  
Status: `SPEC_READY__IMPLEMENTATION_WAITING_INTEGRATION_ORDER`  
Scope: specification only; no PR, application, database, hosted environment, user, or participant change.

## Purpose and fixed boundaries

This contract translates the three accepted PR #7 gaps into deterministic tests. It is the complete correction scope required before UI/RPC wiring for the Karlsruhe concierge test.

The implementation must keep the existing safe intake fields and all existing 20 tests. It must not accept or derive IMEI, serial number, credentials, password/passcode, full or street address, house number, latitude, longitude, GPS, identity documents, payment data, or contact details. Exact contact exchange remains a separate per-match, bilateral opt-in.

The untrusted owner payload must never be allowed to set `variantId`, `possessionStatus`, `marketState`, `verified`, or `marketEligible`. Supabase authorization and ownership checks remain server-side; a client-supplied identifier or status is not authoritative.

## Contract stages

The implementation may use different names, but it must preserve these three separately testable stages:

1. `validateIntake(payload, submittedOn)` validates owner-entered fields without changing eligibility.
2. `resolveCatalogVariant(validated, catalogSnapshot)` returns exactly one authenticated catalog `variantId` or fails closed.
3. `evaluateCandidate(resolved, buyerIntent, operatorGate, asOfDate)` returns a decision and stable reason codes without mutating any record.

All clocks and catalog snapshots are injected fixtures. Tests must not depend on the wall clock, network, or a live database.

## Gap 1 — canonical catalog identity

### Minimal semantics

- Keep `phoneModel` and `storageGb` as owner-facing inputs.
- The catalog resolver reads only an authenticated catalog snapshot with rows shaped for the test as `{ variantId, canonicalModel, storageGb, market }`.
- Matching normalization is limited to Unicode NFKC, trimming, collapsing internal whitespace, and locale-independent case folding. No fuzzy, substring, popularity, or “closest model” match is permitted.
- A candidate row must match normalized `canonicalModel`, exact integer `storageGb`, and the configured catalog market `DE`.
- Exactly one row produces `RESOLVED` and the catalog-owned `variantId`.
- Zero rows produce `UNKNOWN_CATALOG_VARIANT`.
- More than one row produces `AMBIGUOUS_CATALOG_VARIANT`.
- `variantId` is derived output only. If it or any equivalent catalog-ID field appears in the owner payload, existing unknown-field rejection applies.
- The resolved output carries the catalog's canonical model label and storage, not a rewritten owner guess.

### Deterministic tests

Use catalog fixtures:

- `v13-128`: “Apple iPhone 13”, 128, DE
- `v13-256`: “Apple iPhone 13”, 256, DE

1. **G1-POS-UNIQUE:** Given `phoneModel = "  apple   iphone 13 "` and `storageGb = 128`, resolution returns `RESOLVED`, `variantId = v13-128`, canonical model “Apple iPhone 13”, and storage 128.
2. **G1-NEG-STORAGE:** Given the same model and storage 512, resolution returns only `UNKNOWN_CATALOG_VARIANT`; it must not fall back to 128 or 256.
3. **G1-NEG-AMBIGUOUS:** Given two DE catalog rows with the same normalized model and storage but different IDs, resolution returns only `AMBIGUOUS_CATALOG_VARIANT`; it must not select the first row.
4. **G1-NEG-ID-INJECTION:** Given an otherwise valid owner payload containing `variantId = "v13-128"`, intake validation returns `UNKNOWN_FIELD` before catalog resolution.

## Gap 2 — bounded availability and anonymous-profile consent

### Minimal fields and semantics

Add only:

- `availableFromDate`: required ISO calendar date `YYYY-MM-DD`
- `availableUntilDate`: required ISO calendar date `YYYY-MM-DD`
- `profileDisclosureConsent`: required boolean

Validation uses an injected `submittedOn` date:

- both dates must be real ISO dates;
- `availableFromDate >= submittedOn`;
- `availableUntilDate >= availableFromDate`;
- `availableUntilDate <= submittedOn + 30 calendar days`.

A false consent is a valid private intake but makes the item ineligible for candidate matching with `PROFILE_DISCLOSURE_NOT_GRANTED`. It must not be silently changed to true.

Availability overlap is inclusive:

`ownerStart <= buyerExpiresOn AND buyerStartsOn <= ownerEnd`

For an active intent, `buyerStartsOn` is the later of the intent creation date and injected `asOfDate`; `buyerExpiresOn` is the intent expiry date. No overlap returns `NO_AVAILABILITY_OVERLAP`.

Consent covers only disclosure of the anonymous device profile (canonical model, storage, condition facts, price floor, coarse region, and availability window) to a matching professional buyer. It does not authorize contact sharing, publication, advertising, or sale.

### Deterministic tests

Use `submittedOn = 2026-08-24` and an intent active from 2026-08-25 through 2026-09-02.

1. **G2-POS-OVERLAP:** Owner window 2026-08-24 through 2026-08-31 plus consent `true` passes validation and the temporal/consent gate.
2. **G2-NEG-REVERSED:** Owner window 2026-08-30 through 2026-08-29 returns `INVALID_AVAILABILITY_RANGE`.
3. **G2-NEG-TOO-LONG:** Owner window ending 2026-09-24 returns `AVAILABILITY_WINDOW_EXCEEDS_30_DAYS`.
4. **G2-NEG-NO-OVERLAP:** Owner window 2026-09-03 through 2026-09-10 is a valid intake but candidate evaluation returns `NO_AVAILABILITY_OVERLAP`.
5. **G2-NEG-NO-CONSENT:** The overlapping window with consent `false` remains private and candidate evaluation returns `PROFILE_DISCLOSURE_NOT_GRANTED`; no contact field is emitted.

## Gap 3 — deterministic match facts and operator-controlled eligibility

### Minimal field and derived-value semantics

Add only one new device fact:

`networkLockStatus: "UNKNOWN" | "UNLOCKED" | "LOCKED"`

Do not infer carrier/network lock from the existing `NETWORK` defect code; that code denotes a device fault. Persist the tri-state without converting `UNKNOWN` to unlocked. If the database adapter uses a nullable boolean, the only permitted mapping is `UNKNOWN -> null`, `UNLOCKED -> false`, `LOCKED -> true`.

Derive the current command/RPC facts as follows:

- `displayState = DAMAGED` iff defects include `DISPLAY`; otherwise `INTACT`.
- `housingState = DAMAGED` iff defects include `HOUSING`; otherwise `LIKE_NEW -> CLEAN`, `GOOD -> LIGHT_WEAR`, and `FAIR | DAMAGED -> HEAVY_WEAR`.
- `camerasWorking = false` iff defects include `CAMERA`; otherwise true.
- `biometricsWorking = false` iff defects include `BIOMETRICS`; otherwise true.
- `batteryHealthPercent` remains the supplied integer or `null`; missing never means 100.
- `otherDefect = true` iff defects contain any of `BATTERY`, `BUTTONS`, `CHARGING`, `AUDIO`, `NETWORK`, or `OTHER`.
- `priceCompatible = minimumPriceCents <= buyerIntent.maxPriceCents`.
- Exact resolved `variantId` equality is mandatory.

Technical compatibility is fail-closed:

- If the buyer has `minBatteryPercent`, owner battery must be known and greater than or equal to it; otherwise return `BATTERY_UNKNOWN` or `BATTERY_BELOW_MINIMUM`.
- If the buyer requires intact display, `displayState` must be `INTACT`.
- If the buyer requires biometrics, `biometricsWorking` must be true.
- During this concierge alpha, `LOCKED` is ineligible with `NETWORK_LOCKED`; `UNKNOWN` requires operator review and is not an automatic candidate, returning `NETWORK_LOCK_UNKNOWN`.

Owner `ownershipConfirmed = true` and `activationLockReady = true` remain attestations only. They must never write or derive `possessionStatus = VERIFIED` or `marketState = MARKET_ELIGIBLE`. Final candidate eligibility additionally requires trusted server-side `operatorGate = { possessionStatus: VERIFIED, marketState: MARKET_ELIGIBLE }`. Any other value returns `OPERATOR_GATE_NOT_MET`.

Candidate evaluation is pure/read-only and returns `{ eligible: boolean, reasons: stable_reason_codes[] }`; it does not promote state.

### Deterministic tests

1. **G3-POS-DERIVATION:** `condition = GOOD`, defects `[DISPLAY, CAMERA, BUTTONS]`, known battery 86, and network `UNLOCKED` derive exactly `displayState=DAMAGED`, `housingState=LIGHT_WEAR`, `camerasWorking=false`, `biometricsWorking=true`, `batteryHealthPercent=86`, and `otherDefect=true`.
2. **G3-POS-CANDIDATE:** Same resolved variant, known battery 86 against minimum 80, intact display, working biometrics, floor 30,000 against max 32,000, overlapping availability, consent true, network `UNLOCKED`, and trusted `VERIFIED/MARKET_ELIGIBLE` returns `eligible=true` with no reasons.
3. **G3-NEG-BATTERY-UNKNOWN:** Missing battery against buyer minimum 80 returns `eligible=false` with `BATTERY_UNKNOWN`; it must not pass through null comparison behavior.
4. **G3-NEG-NETWORK:** `LOCKED` returns `NETWORK_LOCKED`; `UNKNOWN` returns `NETWORK_LOCK_UNKNOWN`. Neither is automatically eligible.
5. **G3-NEG-OPERATOR-GATE:** A fully compatible owner-attested intake with `UNVERIFIED/PRIVATE` returns only `OPERATOR_GATE_NOT_MET`; no status changes occur.
6. **G3-NEG-PRICE:** Floor 32,001 against max 32,000 returns `PRICE_FLOOR_ABOVE_MAXIMUM`.
7. **G3-NEG-VARIANT:** Different resolved variant IDs return `VARIANT_MISMATCH`, even when model display strings appear equal.

## Mandatory privacy and authority regression

Run the existing sensitive-field rejection as a table-driven test covering every forbidden alias already in PR #7. Add assertions that these new aliases are also rejected wherever applicable: `catalogVariantId`, `possessionStatus`, `marketState`, `verified`, `marketEligible`, `contactEmail`, and `contactPhone`.

The evaluator must be tested with a non-owner client context and must not accept client-provided operator-gate values as trusted input. In the eventual Supabase implementation, trusted eligibility is read server-side under existing ownership/authorization boundaries; no service-role or secret key belongs in the mobile client.

## Acceptance gate

The correction is ready for independent review only when:

- all 16 named cases above pass deterministically;
- all existing 20 PR #7 safety tests still pass unchanged;
- an unknown or ambiguous catalog row, missing battery evidence, missing consent, unknown/locked network state, or unverified/private operator state can never produce `eligible=true`;
- no forbidden field, precise location, contact data, or privileged status enters the owner payload or derived profile;
- the change does not modify hosted Supabase, merge a PR, contact a participant, or widen the three accepted gaps.

This scope is designed to avoid manual interpretation at match time and preserve the operating ceilings of at most 10 operator minutes per EUR 5 match and 58 minutes per month per EUR 29 buyer seat.
