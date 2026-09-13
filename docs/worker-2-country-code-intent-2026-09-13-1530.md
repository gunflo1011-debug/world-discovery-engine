# Worker 2 — multilingual country-code intent evidence

Date: 2026-09-13 15:30 Europe/Berlin
Search Console fetch boundary: `data_fetched_at=2026-09-13T12:59:55Z`; reproducible query rows currently end on 2026-09-10.

## CEO assignment
Determine whether the `NCL pais` signal is isolated or part of repeatable cross-language human demand for `<ISO3> pais`, `<ISO3> land`, `<ISO3> country`. Keep this separate from diagnostic WDI indicator-code queries and do not change production without repeatable evidence.

## Result
NCL is **not semantically isolated**. A small but coherent country-code lookup cluster exists across Spanish and German country pages. However, only NCL has meaningful volume and only PRK is currently repeated across two days, so the cluster is **research-confirmed but not yet release-ready**.

### Spanish (`<ISO3> pais` / `pais <ISO3>`)
- NCL: Sep10 `ncl pais` = 22 impressions, 0 clicks, weighted avg position ~12.95 (21 Spain mobile + 1 Mexico mobile).
- PRK: Sep9 `pais prk` = 2 impressions at position 12; Sep10 `prk pais` = 3 impressions (2 Argentina mobile @9, 1 Mexico mobile @13). This is the strongest repeatability evidence because the same code lookup recurs on two days and in multiple countries.
- BGR: Sep9 `bgr pais` = 1 impression at position 10.
- SLV: Sep9 `slv pais` = 1 impression at position 13.
- CMR: Sep10 `cmr pais` = 1 impression at position 14.
- CIV: Sep10 `civ pais` = 1 impression at position 51; human intent, but not near-page-1.
- RSA: Sep9 `rsa pais` = 2 impressions at position 84; human intent, but not near-page-1.

Near-page-1 Spanish code cohort (NCL/PRK/BGR/SLV/CMR): 32 disclosed impressions, 0 clicks. NCL contributes 22/32, so concentration remains high.

### German (`<ISO3> land`)
- CYM: Sep9 `cym land` = 1 impression at position 11.
- GRC: Sep9 `grc land` = 1 impression at position 14.
- NCL: Sep10 `ncl land` = 1 impression at position 14.
- Other looser country-code/name lookup language exists, but was not counted unless the query followed the explicit code + `land` pattern.

German near-page-1 explicit-code cohort: 3 impressions, 0 clicks.

### English (`<ISO3> country`)
The current reproducible Sep9-10 query pull does not expose a comparable near-page-1 English `<ISO3> country` cohort. The previously observed `ncl country` signal remains too weak to treat as a release trigger unless it becomes reproducible in a fresh pull.

## Interpretation
1. `NCL pais` is not a one-off query shape: PRK, BGR, SLV and CMR show the same Spanish lookup grammar, and CYM/GRC/NCL show the German analogue.
2. The cluster is nevertheless sparse. NCL dominates volume; PRK is the only code with clear day-to-day recurrence in the current reproducible window.
3. This is human navigational/entity-resolution intent, not a WDI diagnostic query. Users appear to be resolving an unfamiliar three-letter country/territory code to a country name.
4. Current evidence supports **WATCH / candidate design**, not a sitewide title rewrite. A title change across hundreds of country pages would be disproportionate to 35 disclosed near-page-1 impressions and could dilute stronger population/statistics intent.

## Smallest reversible candidate if the cluster strengthens
Do **not** change titles yet. If another final/reproducible day shows repeated code lookups across multiple codes, prefer a localization-aware visible microcopy/metadata enhancement that explicitly surfaces the ISO3 code next to the localized country name (for example, a compact `ISO3: NCL` fact where country identity is already presented), without replacing the localized country name or population/statistics wording. Before release, inspect the actual country template and add output-level tests proving title/canonical/hreflang/data values are unchanged unless the CEO explicitly approves a title experiment.

## Measurement gate
Nominate a production test only when a fresh reproducible window shows either:
- recurrence on >=2 days for >=2 distinct ISO3 codes in the same language, or
- materially broader disclosed volume across >=5 codes while positions remain roughly 4-20.

Primary metric after any eventual test: qualified code-lookup impressions + position + CTR for the frozen `<ISO3> pais/land/country` cohort, segmented by locale. Do not mix WDI indicator-code searches into this metric.

## Other experiment holds
- Internet Use baseline remains frozen at Sep9-10: 22 natural-query impressions, 0 clicks, weighted position 76.86. No reproducible post-change GSC rows exist yet; title/H1/content stay frozen.
- Renewable remains the only title/CTR experiment; no reproducible Sep12+ sample in this pull.
- GDP remains combined legacy/current migration monitoring only.

## CEO recommendation
**COUNTRY-CODE CLUSTER = REAL BUT CONCENTRATED / WATCH.** NCL is not isolated, and PRK provides the first genuine two-day replication. Do not deploy a country-template/title change yet. Re-run the exact frozen grammar cohort when Sep11+ becomes reproducible; if a second distinct code repeats across days, inspect the localized country template and prepare the smallest non-title ISO3-identity enhancement with regression evidence.
