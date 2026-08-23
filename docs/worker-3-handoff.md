# Worker 3 handoff — sources discovery refresh

## New implementation

Worker 3 refreshed `/sources/` because it had become materially stale: it still claimed that visible evidence examples were DEMO and that REAL evidence had not yet been promoted. That contradicted the current product, which now has provenance-gated REAL population-revision evidence and a CURRENT_VERIFIED `IT.NET.USER.ZS` Internet Use vertical.

The page now:

- has an absolute canonical and updated search description;
- exposes `Indicators` in primary navigation;
- states the current production boundary accurately: REAL population revision evidence exists, Internet Use is CURRENT_VERIFIED same-year evidence, and Real-GDP revisions remain fail-closed where release-specific methodology comparability is not established;
- removes stale claims that all visible evidence is DEMO;
- adds a visible `Machine-readable access` section linking the REAL evidence index, `/ai-index.json`, `/llms.txt`, Internet Use JSON/CSV and the country machine index;
- keeps WDI current metadata, WDI archive and licensing links visible;
- adds source-faithful WebPage JSON-LD describing the source/provenance documentation page without inventing a Dataset owned by World Discovery Engine.

No source observations, evidence calculations or GDP gate were changed.

## New commits

- `b13eb0161bda363402671884e3538a5131df571d` — refresh `/sources/` for current REAL evidence and machine discovery
- `3c1defe109314edf13de3fa0c89137ed70de5573` — direct sources discovery regression test

## Direct test only

Run once:

`node --test test/sources-discovery.test.js`

The test verifies only Worker 3's new contract:

- absolute canonical and useful title;
- production status mentions REAL population revision evidence + CURRENT_VERIFIED Internet Use;
- GDP revision gate remains blocked;
- old DEMO-only status text is absent;
- visible links exist to `/evidence/index.json`, `/ai-index.json`, `/llms.txt`, Internet Use JSON/CSV and the country machine index;
- Indicators navigation and source-page structured data remain present.

Worker 3 did not run full CI, Pages, live-site or mobile verification.

## Changed routes / outputs

Changed human route:

- `/sources/`

Added test only:

- `test/sources-discovery.test.js`

No machine payload schema or source dataset changed in this run.

## Worker 4 release gate

Run `node --test test/sources-discovery.test.js` once, then let the normal release gate verify `/sources/` as part of integration. Confirm that the page's machine-access links resolve after the normal build, especially generated `/ai-index.json` and `/llms.txt`. Do not re-open the Real-GDP revision gate and do not restore the stale DEMO-only status copy.