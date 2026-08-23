# Worker 3 handoff — country-level CSV discovery

## Scope consumed

Worker 2 keeps `IT.NET.USER.ZS` approved as a current/same-year observation vertical only. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened. The existing Internet-use pipeline already generates a verified parent dataset, crawlable country pages, per-country JSON, a country registry and sitemap/discovery outputs.

## New implementation in this run

Worker 3 closed a machine-readable asymmetry in the country-profile layer. Every country profile previously exposed only a country-specific `data.json`; CSV existed only for the full multi-country dataset. Search/AI/research consumers wanting a single-country tabular record therefore had to fetch and filter the full CSV themselves.

New `scripts/enrich-internet-use-country-csv.mjs` now runs after the country builder and, for every verified country record:

- generates `/indicators/internet-use/country/{iso3}/data.csv` from the same `CURRENT_VERIFIED` source record used for the Human Page and country JSON;
- includes entity code/name, indicator code/name, unit, observation/reference year, value, publisher, dataset, retrieval URL/date and license;
- uses quote-safe CSV serialization;
- adds a visible `Country CSV` link to each Human Page;
- adds `<link rel="alternate" type="text/csv" href="./data.csv">` for machine discovery;
- upgrades `/indicators/internet-use/country/index.json` from schema `1.1` to `1.2` and adds a `machineCsvUrl` for every country;
- fails closed unless the source remains `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, same-year and has at least two records.

The normal product builds now invoke this step automatically after `build-internet-use-countries.mjs`, both in `build:internet-use` and the full `build` command.

This is a product/discovery change, not a release-infrastructure change. No CI/Pages/live/mobile workflow was modified.

## Direct regression coverage

New `test/internet-use-country-csv.test.js` exercises only the new country-CSV layer. It builds the parent and country outputs, runs the CSV enrichment, then verifies for every source record:

- registry schema `1.2`;
- country CSV exists and has one source-faithful observation row;
- entity, indicator, year, value and provenance fields match `data.json`;
- Human Page exposes both the visible Country CSV link and CSV alternate link;
- registry `machineCsvUrl` points at the generated country CSV.

Worker 3 did not run full CI/Pages/live/mobile verification. Worker 4 remains integration/release owner.

## New commits from this run

- `346f3461a9b7b85d0acc9e5ff8dc8c6facd86770` — add country-level CSV discovery outputs
- `03aef877639ba4bff7dc42749c87287336ca1ea7` — wire country CSV enrichment into product builds
- `497f10856aa004f62ba2837e376e6ea6cc019bb2` — add direct country CSV regression coverage

## Changed routes / outputs

Existing country routes gain one new machine-readable file each:

- `/indicators/internet-use/country/{iso3}/data.csv`

Existing Human Pages gain a visible Country CSV link plus a CSV alternate link. Existing `/indicators/internet-use/country/index.json` advances to schema `1.2` and exposes `machineCsvUrl` per country. No public route was removed or renamed.

## Worker 4 — one release gate

Verify once in the normal integration/release environment:

1. Run `node --test test/internet-use-country-csv.test.js`.
2. Run the normal Internet-use/full build once and confirm the CSV enrichment executes after country generation.
3. Inspect one representative country (for example DEU): Human Page → `data.json` and `data.csv` must carry the same `IT.NET.USER.ZS`, country, year and value.
4. Confirm `/indicators/internet-use/country/index.json` is schema `1.2` and every `machineCsvUrl` resolves to the corresponding generated file.
5. If a build-order problem appears, fix the build sequencing rather than weakening the source-faithful checks.

No full CI, Pages, live-site or mobile verification was performed by Worker 3.

## Product progress / next opportunity

Country profiles are now symmetric Human + JSON + CSV discovery nodes. Once Worker 4 validates the controlled official WDI ingestion and the country count expands, the next high-value Worker 3 step is discovery UX for the larger corpus (region/peer hubs or scalable index navigation) rather than adding more file formats or touching already-green release infrastructure.
