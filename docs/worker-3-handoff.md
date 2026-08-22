# Worker 3 handoff — Internet-use discovery build

## Scope consumed

Worker 2 approved `IT.NET.USER.ZS` only as a **current/latest observation vertical**, not as archive-revision evidence. Observation year remains distinct from retrieval date; unit is `% of population`; source attribution remains International Telecommunication Union (ITU), surfaced through World Bank WDI. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened.

## New implementation in this run

Worker 3 strengthened the existing Internet-use country profiles for GEO/AI retrieval by giving every generated human page its own source-faithful machine-readable observation endpoint. No new external values or claims were added.

### Country-level machine evidence

Updated `scripts/build-internet-use-countries.mjs` now:

- continues to consume only the existing `CURRENT_VERIFIED` `site/indicators/internet-use/data.json` source;
- strengthens provenance validation before country generation;
- generates `/indicators/internet-use/country/{iso3-lower}/data.json` beside every country page;
- makes that country JSON self-contained with indicator identity, country identity, exact observation year/value, source publisher/dataset/metadata/retrieval URL, retrieval date, license/attribution and explicit scope flags;
- explicitly encodes `completeGlobalRanking: false` and `historicalRevisionProduct: false` so machine consumers cannot infer unsupported scope;
- adds a visible `Country JSON` link and `<link rel="alternate" type="application/json">` on each human profile;
- upgrades `/indicators/internet-use/country/index.json` to schema `1.1` and adds provenance plus a `machineDataUrl` for every country record;
- preserves the existing source-faithful `WebPage` + `PropertyValue` JSON-LD, peer links, parent links and no-revision/non-global-ranking wording.

The result is a tighter chain for each country:

`parent verified dataset → country human page → country-scoped machine JSON → explicit provenance/scope`.

This avoids forcing AI/retrieval clients to download and disambiguate the full multi-country dataset when answering a country-specific question.

## Direct regression coverage

Updated `test/internet-use-countries.test.js` now checks, for every verified source record:

- country registry schema `1.1`, CURRENT_VERIFIED status and source provenance;
- exact `machineDataUrl` in the registry;
- generated country `data.json` existence and parseability;
- exact indicator/country/value/year identity between source data and country machine endpoint;
- publisher, metadata URL, retrieval URL/date and license provenance;
- explicit no-global-ranking/no-historical-revision machine scope;
- human canonical, JSON alternate link, visible Country JSON link, WebPage/PropertyValue JSON-LD and parent-table navigation.

Worker 3 did not run full CI/Pages/live/mobile verification. Worker 4 remains release owner.

## New commits from this run

- `07c21a35dff74720f911a7a6c705e5c6d2d3d925` — add country-level machine-readable Internet-use evidence
- `e6c0a4cdeefcd33ed37396f0b5c2233ae158c03b` — test country-level machine evidence and provenance

## Changed routes / outputs

- `/indicators/internet-use/country/{iso3-lower}/` — adds visible country JSON discovery plus an application/json alternate link
- `/indicators/internet-use/country/{iso3-lower}/data.json` — **new** generated country-scoped machine-readable observation for every verified record
- `/indicators/internet-use/country/index.json` — schema `1.1`, provenance block, per-record `machineDataUrl`

The existing sitemap behavior is unchanged: country human pages remain the crawlable indexed routes; machine JSON is discoverable from the pages/registry rather than added as standalone sitemap URLs.

## Worker 4 — one release gate

Verify only once in the normal integration/release environment:

1. Run `node --test test/internet-use-countries.test.js` (plus `test/internet-use.test.js` only if the parent generator needs regression confirmation).
2. Run the normal site build once and confirm every generated country directory contains both `index.html` and `data.json`.
3. Spot-check one country page → visible `Country JSON` → machine payload and confirm indicator, entity, year and value match.
4. Confirm `/indicators/internet-use/country/index.json` is schema `1.1` and each `machineDataUrl` resolves to its matching generated country payload.
5. Do not weaken same-year, provenance or scope gates if a mismatch appears; fix the concrete generator/output mismatch.

No full CI, Pages, live-site or mobile verification was performed by Worker 3.

## Product progress / next opportunity

The Internet-use vertical now has both crawlable long-tail human pages and country-specific machine endpoints generated from one verified source. The highest-value next Worker 3 build remains **reproducible broader same-year coverage from an official WDI ingestion step**. Do not manually expand the 12 source rows. Once ingestion is deterministic, the existing parent page, country profiles, registry and country JSON endpoints scale automatically with the verified record count.
