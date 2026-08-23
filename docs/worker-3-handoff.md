# Worker 3 handoff — citation-ready AI discovery

## New implementation

Worker 3 strengthened the existing AI-discovery layer instead of adding another parallel index. `scripts/build-ai-discovery.mjs` now makes `/ai-index.json` and `/llms.txt` materially more useful for Search/GEO/AI retrieval by carrying citation-ready provenance from already verified source data.

Changes:

- `/ai-index.json` schema is now `1.1`;
- each REAL revision-evidence record now exposes an explicit `citation` object with recommended human and machine citation targets plus indicator/entity/reference-year identity;
- each CURRENT_VERIFIED Internet Use country observation now exposes an explicit citation object containing publisher, dataset, World Bank WDI surface, metadata URL, retrieval URL/date, licence and required attribution;
- Internet Use records now expose the indicator name in addition to the code;
- the Internet Use collection now links its country machine index explicitly;
- `generatedFrom` now links the human `/sources/` provenance hub;
- `/llms.txt` now has a dedicated Citation and provenance section, a country-index link, explicit metadata/retrieval links and the exact ITU attribution carried by the verified source snapshot;
- validation is stricter: indicator definition/name/unit, dataset/surface, attribution and retrieval date must exist before AI discovery can be generated.

No source observations, rankings, revision calculations, GDP gate, sitemap or robots behavior changed. The Internet Use scope remains a verified same-year subset, not a complete global ranking and not a historical revision product. Real-GDP revisions remain fail-closed.

## New commits

- `cfa2f190ce9320072305b0e93871ca3df0079e93` — enrich AI discovery with citation-ready provenance
- `088dff88f71e2420c6dab1376d30532fd36219dd` — test citation-ready AI discovery contract

## Direct test only

Run once:

`node --test test/ai-discovery.test.js`

The direct regression test now verifies:

- AI manifest schema `1.1` and existing trust policy;
- REAL evidence count and citation targets stay aligned with `/evidence/index.json`;
- CURRENT_VERIFIED Internet Use country records stay aligned with source value/year/entity;
- citation publisher/dataset/surface/metadata/retrieval/licence/attribution match `site/indicators/internet-use/data.json` exactly;
- country machine index is exposed;
- `/sources/`, evidence index, Internet Use dataset, country index and AI manifest are all discoverable from `llms.txt`;
- current ITU attribution and metadata URL survive generation.

Worker 3 did not run full CI, Pages, live-site or mobile verification.

## Changed routes / outputs

Generated machine outputs changed:

- `/ai-index.json` — schema `1.1`, citation-ready provenance fields
- `/llms.txt` — citation/provenance guidance and country-index discovery

Builder/test changed:

- `scripts/build-ai-discovery.mjs`
- `test/ai-discovery.test.js`

No human route or source dataset changed in this run.

## Worker 4 release gate

Run `node --test test/ai-discovery.test.js` once and then execute the normal build/release gate. Confirm generated `/ai-index.json` reports schema `1.1`, its citation fields match the verified source payloads, and `/llms.txt` contains the sources hub, country index and current ITU attribution. Do not broaden this into a separate full Worker-3 release audit; Worker 4 remains integration/release owner.