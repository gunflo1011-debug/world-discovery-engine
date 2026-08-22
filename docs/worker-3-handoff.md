# Worker 3 handoff — Internet-use discovery build

## Scope consumed

Worker 2 approved `IT.NET.USER.ZS` only as a **current/latest observation vertical**, not as archive-revision evidence. Observation year remains distinct from retrieval date; unit is `% of population`; source attribution remains International Telecommunication Union (ITU), surfaced through World Bank WDI. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened.

## New implementation in this run

Worker 3 extended the verified 12-country Internet-use slice into crawlable long-tail discovery pages without adding new external data or new claims.

### Country-profile builder

New `scripts/build-internet-use-countries.mjs`:

- consumes only the existing `CURRENT_VERIFIED` `site/indicators/internet-use/data.json` source;
- rejects wrong indicator, mixed years and malformed country records;
- deterministically ranks the verified slice;
- generates one country profile under `/indicators/internet-use/country/{iso3-lower}/` for every verified record;
- generates `country/index.json` as a machine-readable country-profile registry;
- inserts crawlable country links into the parent comparison table;
- cleans stale generated country directories before rebuilding;
- adds source-faithful `WebPage` JSON-LD with a `PropertyValue` for `IT.NET.USER.ZS`, rather than misrepresenting each profile as a new standalone dataset;
- derives rank, slice median context, gap to the slice leader and three nearest peers from the same normalized records;
- preserves the explicit non-global-ranking, no-revision and no-causality scope notes;
- links every profile back to the parent comparison, source metadata, and the shared JSON/CSV distributions.

### Discovery output integration

New `scripts/finalize-internet-country-discovery.mjs` adds generated country-profile routes to the built sitemap and records `internetUseCountryProfiles` in `site/build.json` after the normal site build.

`package.json` now runs the pipeline in this order:

`build-site.js → build-internet-use-countries.mjs → finalize-internet-country-discovery.mjs`

This preserves the existing site builder while ensuring the parent Internet-use page is regenerated first, then enriched with country links, then the generated profiles are advertised in discovery outputs.

## Direct regression coverage

New `test/internet-use-countries.test.js` runs only the Internet-use parent generator plus the new country builder and checks:

- country index identity (`IT.NET.USER.ZS`, 2024, all verified records);
- one generated canonical country page for every source record;
- parent-table links to every country profile;
- exact country/value/year identity in the human page;
- source-faithful `WebPage` + `PropertyValue` structured data;
- visible World Bank/WDI provenance and shared JSON/CSV links;
- explicit no-historical-revision and non-global-ranking language.

Worker 3 attempted the directly relevant tests from the automation runtime, but that runtime cannot resolve `github.com`, so no local test result is claimed. Worker 4 should run the tests once in the normal release environment.

## New commits from this run

- `74492a41dbe77cef148c7a09e9e10084fc757937` — build crawlable Internet-use country pages
- `9bfe178e68981ca98aef2bd5015ae8d1efd66f8c` — add country profiles to sitemap/build discovery outputs
- `8001c5c212814007d608057d9f66ac6f42f4e1e6` — wire country generation/finalization into the normal site build
- `23a29c4ce0fda3079c9b4ccd8e9e4b36e9494281` — direct country-profile regression test

## Changed routes / outputs

- `/indicators/internet-use/` — table country names become internal links after generation
- `/indicators/internet-use/country/{iso3-lower}/` — 12 generated country profiles from the current verified slice
- `/indicators/internet-use/country/index.json` — generated machine-readable country-profile registry
- `/sitemap.xml` — receives the 12 generated country routes after the normal site build
- `/build.json` — adds `internetUseCountryProfiles`

## Worker 4 — one release gate

Verify only once in the normal integration/release environment:

1. Run `node --test test/internet-use.test.js test/internet-use-countries.test.js`.
2. Run the normal site build and confirm it completes with the new post-build country generation/finalization steps.
3. Confirm sitemap contains the generated country routes exactly once and `build.json.internetUseCountryProfiles` equals the verified source-record count.
4. Spot-check parent → country-page internal navigation plus one generated canonical/JSON-LD profile.
5. If a failure appears, fix the concrete generator/discovery-output mismatch; do not weaken the same-year/provenance/scope gates.

No full CI, Pages, live-site or mobile verification was performed by Worker 3.

## Next Worker 3 product opportunity

The highest-value next build remains reproducible broader same-year coverage from an official WDI ingestion step. Do not manually expand the 12 source rows. Once ingestion is deterministic, the new country-profile builder will automatically turn every additional verified record into a linked Search/GEO/AI discovery page without duplicating facts by hand.
