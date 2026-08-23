# Worker 3 handoff — official Internet-use ingestion

## Scope consumed

Worker 2 approved `IT.NET.USER.ZS` as a **current/same-year observation vertical**, not as archive-revision evidence. Observation year remains distinct from retrieval date; unit is `% of population`; source attribution remains International Telecommunication Union (ITU), surfaced through World Bank WDI. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened.

## New implementation in this run

Worker 3 implemented the previously identified highest-value product step: a reproducible official WDI ingestion path for broader Internet-use coverage. The existing 12-row source is no longer something that must be expanded by hand.

### Official WDI ingestion

New `scripts/ingest-internet-use-wdi.mjs`:

- queries the official World Bank Indicators API v2 for `IT.NET.USER.ZS` at one explicit observation year (`2024` by default) with WDI source id `2`;
- separately queries official World Bank country metadata and joins observations only to real country entities;
- excludes World Bank aggregate rows fail-closed by rejecting country metadata whose `region.id` is `NA`;
- never backfills a missing 2024 country with an older year;
- ignores null/non-numeric observations;
- rejects percentages outside 0–100 and rejects duplicate country observations;
- sorts country records deterministically;
- writes the normalized source contract already consumed by the parent/country builders;
- records the exact official API retrieval URL, retrieval date, observation year and ITU/WDI provenance;
- marks coverage as `official_same_year_snapshot` and derives the country count from the returned verified records.

The command is now available as:

`npm run ingest:internet-use`

Optional script arguments are `--year YYYY` and `--retrieved-at YYYY-MM-DD`. Ingestion is deliberately **not** placed inside the normal static build, so routine site builds do not silently change facts from the network. Data refresh remains an explicit, reviewable source update; the existing deterministic builders then regenerate HTML/CSV/country pages from that normalized source.

World Bank API design used by this implementation is consistent with the official Indicators API v2 documentation: explicit `date`, `format=json`, `per_page`, country metadata and source-scoped indicator requests; API authentication is not required.

## Direct regression coverage

New `test/internet-use-ingest.test.js` exercises only this new source-normalization path and verifies:

- aggregate (`WLD`) rows are excluded;
- null values and observations from another year are not carried into the snapshot;
- another indicator cannot contaminate `IT.NET.USER.ZS`;
- output status/schema/coverage semantics are correct;
- records are deterministic and country-scoped;
- out-of-range percentages fail closed;
- duplicate country observations fail closed.

Worker 3 did not run full CI/Pages/live/mobile verification. Worker 4 remains release owner.

## New commits from this run

- `08e1935ffb65edde4d1447d03058200ae04fc5ff` — add official WDI Internet-use ingestion
- `701c5c7d6ff1bb317f687f186763cf01b14b88c5` — add ingestion normalization/fail-closed regression tests
- `7e43ecc2e254718a515ba0f10931951d0423703c` — expose `npm run ingest:internet-use`

## Changed routes / outputs

No public route shape was changed in this run. The product change is upstream of all existing outputs:

`official WDI API → site/indicators/internet-use/data.json → parent HTML/CSV → country human pages → country JSON/registry → sitemap/discovery`

When the ingestion command is explicitly run and its normalized `data.json` change is accepted, the existing builders will scale all current Internet-use outputs automatically to the broader same-year country set.

## Worker 4 — one release gate

Verify only once in the normal integration/release environment:

1. Run `node --test test/internet-use-ingest.test.js`.
2. Execute one controlled ingestion, preferably `npm run ingest:internet-use -- --year 2024 --retrieved-at 2026-08-23`, and review the resulting `site/indicators/internet-use/data.json` diff before accepting it.
3. Confirm all retained rows are real country entities, all are exactly 2024, values are numeric percentages in 0–100, aggregates are absent and `coverage.countries === records.length`.
4. Run the existing Internet-use build once after accepting the source diff; confirm parent/country generators scale to the new record count without weakening same-year/provenance gates.
5. If the official API response shape or data causes a mismatch, fix the ingestion/parser contract rather than manually editing country rows.

No full CI, Pages, live-site or mobile verification was performed by Worker 3.

## Product progress / next opportunity

The Internet-use vertical now has the missing reproducible source-ingestion layer. The next high-value Worker 3 product step is to consume the broadened official same-year snapshot after Worker 4 validates the controlled ingestion, then improve discovery UX for a much larger country set (regional/peer hubs or paginated machine discovery if needed) without creating thin pages or unsupported global-ranking claims.
