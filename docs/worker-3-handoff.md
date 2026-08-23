# Worker 3 handoff — source-faithful AI discovery manifest

## New implementation

Worker 3 added a build-generated AI discovery layer for the existing REAL evidence corpus and the `IT.NET.USER.ZS` CURRENT_VERIFIED vertical. No source data changed and GDP revision work remains fail-closed.

New `scripts/build-ai-discovery.mjs` runs after the existing full build and produces:

- `/llms.txt` — concise human-readable retrieval guidance for AI systems, with trust rules, primary machine-readable collections, verified Internet-use country profiles, JSON/CSV links and citation guidance;
- `/ai-index.json` — structured machine manifest combining only `REAL` + `discoveryReady=true` revision evidence and `CURRENT_VERIFIED` Internet-use observations.

The builder is fail-closed:

- evidence input must be machine-index schema `1.2`;
- every exported evidence record must be `REAL`, `discoveryReady=true`, have indicator/entity/reference-year identity and both JSON/CSV URLs;
- Internet-use input must remain `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, same-year and source/licence complete;
- the manifest explicitly carries the scope boundary that Internet-use is a verified same-year subset, not a complete global ranking or historical revision product;
- Real-GDP revision status is explicitly `blocked` pending release-specific methodology comparability evidence.

The normal `npm run build` now calls the AI-discovery builder after the existing country/discovery finalization step. A focused `npm run build:ai-discovery` command is also available.

## New commits

- `b675e7d62d86088750298224323dbba51185c441` — build source-faithful AI discovery manifest (`llms.txt` + `ai-index.json`)
- `dac9c1d9844d621871f122e5e5bb0e3a9e57ab01` — direct regression test for AI discovery outputs
- `224feedd2b8aa34a6f36a0fba368e7b68aa3a7e3` — wire AI discovery into the full build and add focused build command

## Direct test only

Run once:

`node --test test/ai-discovery.test.js`

The test runs only `scripts/build-ai-discovery.mjs` and verifies:

- manifest exports only REAL evidence;
- evidence count/identity matches `/evidence/index.json`;
- Internet-use country identity/value/year matches the CURRENT_VERIFIED source;
- every country has Human + JSON + CSV URLs;
- `llms.txt` preserves trust/scope/GDP-block rules and exposes the primary machine-readable endpoints.

Worker 3 attempted only this direct test locally, but the automation runtime could not resolve `github.com` while cloning the repository, so no local test result is claimed. No full CI, Pages, live-site or mobile verification was run.

## Changed routes / outputs

Two root-level machine/discovery outputs are added by the build:

- `/llms.txt`
- `/ai-index.json`

No existing route or source dataset was changed.

## Worker 4 release gate

Verify once that `node --test test/ai-discovery.test.js` passes and that a normal `npm run build` leaves `/llms.txt` and `/ai-index.json` present after all downstream build steps. In the release/live gate, confirm both return HTTP 200 and that `ai-index.json` contains only REAL revision evidence + CURRENT_VERIFIED Internet-use observations. Do not weaken the fail-closed checks if a stale/non-verified record is rejected.
