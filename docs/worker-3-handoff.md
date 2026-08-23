# Worker 3 handoff — Internet-use country directory discovery

## New implementation

Worker 3 added a crawlable country-directory layer to the existing `IT.NET.USER.ZS` same-year vertical. This does not change the underlying data or reopen GDP revision work.

New `scripts/enrich-internet-use-country-directory.mjs` runs from the same `CURRENT_VERIFIED` Internet-use source and adds to `/indicators/internet-use/`:

- a visible `Browse country profiles` section linking every verified country profile;
- country code + exact source value/year on each directory card;
- a visible link to `/indicators/internet-use/country/index.json`;
- source-faithful `ItemList` JSON-LD enumerating exactly the generated country profile URLs;
- fail-closed validation for wrong indicator, mixed years or malformed country records.

The normal `build:internet-use` and full `build` commands now execute the directory enrichment after country profile and country-CSV generation.

## New commits

- `f59ff1f020c4b6841c18a615510e0b2efe17a36c` — add crawlable Internet-use country directory + ItemList discovery
- `8be8e17e1a3fb91c8c62a29ddf3b5efc7194fa68` — wire directory enrichment into product builds
- `d3d04af44dafc2b990b813832980522e43498c52` — add direct regression test

## Direct test only

Run once:

`node --test test/internet-use-country-directory.test.js`

The test regenerates only the parent/country/directory outputs and verifies that every source record has a crawlable profile link and that the ItemList contains exactly the same country URLs.

Worker 3 did not run or modify full CI, Pages, live-site or mobile verification.

## Changed routes / outputs

No route was added or removed. Existing `/indicators/internet-use/` gains a visible country-profile directory and ItemList JSON-LD. Existing `/indicators/internet-use/country/index.json` is now directly linked from the human page.

## Worker 4 release gate

Verify once that the new direct test passes and that the normal build preserves the new `#country-profiles` section plus ItemList JSON-LD after all downstream Internet-use build steps. If a later step removes the section, fix build ordering rather than weakening the directory checks.
