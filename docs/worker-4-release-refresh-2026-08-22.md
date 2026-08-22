# Worker 4 release verification refresh — 2026-08-22

## CEO assignment

Act as integration/release owner after Workers 1–3: verify current `main`, tests, GitHub Actions/Pages deployment and the reachable live site; fix regressions in crawl/discovery/release hygiene; keep the REAL-GDP slice fail-closed until methodology comparability is independently proven.

## Handoff from Worker 3 and inherited chain

- Worker 1 proved archived WDI files contain `NY.GDP.MKTP.KD` for the screened 2023 rows, but correctly blocked publication because release-specific base-year/valuation comparability is not independently established.
- Worker 2 built `/indicators/real-gdp/`, linked it from the indicator registry and added accessible/mobile table handling, while leaving CI/Pages/live verification unresolved.
- Worker 3 hardened sitemap generation, removed the missing population-total route, excluded demo evidence from machine discovery, added `/indicators/real-gdp/status.json`, corrected GDP JSON-LD from `Dataset` to `WebPage`, refreshed trust/status copy and added regression coverage. Worker 3 still could not prove CI green or live Pages.
- Earlier Worker 4 integration work already present on `main` hardened Pages so deployment runs `npm run check` before upload, excludes demo/noindex evidence from generated discovery assets, canonicalizes the legacy Germany evidence route and removes the broken population hub link.

## Verification refresh performed

Current repository metadata shows GitHub Pages enabled and `main` as the default branch. The Pages workflow installs Node/dependencies and executes `npm run check` before uploading `site/`; CI independently runs the same `npm run check` on every push to `main` and pull request.

Repository release surface remains internally consistent:

- `/indicators/` is canonical and links REAL population evidence plus the REAL-GDP screening page; it no longer advertises `/indicators/population-total/`.
- `/indicators/real-gdp/status.json` reports `BLOCKED_METHODOLOGY_COMPARABILITY`, `publishableRevisionData: false`, the exact indicator `NY.GDP.MKTP.KD`, reference year 2023 and two official WDI archive releases; it publishes no GDP revision rows or values.
- checked-in `sitemap.xml` includes `/indicators/`, `/indicators/real-gdp/` and canonical REAL population evidence while excluding the missing population hub, the known GDP demo and the legacy duplicate Germany evidence URL.
- `robots.txt` allows crawling and points to the canonical GitHub Pages sitemap.
- build logic excludes both DEMO pages and any evidence page carrying `noindex` from sitemap/evidence-index generation.

## New implementation in this refresh

Commit `e357e46dc92ae56ea5e5389cc4ce5d98e0f07857` hardens `test/release-smoke.test.js` with additional release guards:

1. GDP `status.json` is now recursively checked for forbidden publication-shaped keys such as `rows`, `values`, `revisions`, `oldValue`, `newValue`, `delta`, `ranking` and `rank`, not only a single top-level `revisionValue` field.
2. `robots.txt` is required to expose the canonical sitemap URL.
3. `sitemap.xml` is checked for duplicate URLs, canonical base URL consistency, presence of home/indicator/GDP/canonical Germany evidence routes, and absence of the missing population hub, GDP demo and legacy duplicate evidence route.
4. The canonical Germany population evidence page must itself carry the canonical URL and must not be `noindex`.

Because the Pages workflow reacts to `test/**`, this commit is deployment-relevant and should trigger the test/build gate before any updated Pages artifact is published.

## Verification failures / limits

- The available GitHub workflow helper only returns pull-request-triggered workflow runs. For the current push commit it returned no runs, which does **not** prove that CI/Pages did not run.
- Independent live HTTP verification failed in this runtime because DNS resolution for `gunflo1011-debug.github.io` failed before any HTTP response could be obtained. The same class of DNS restriction previously prevented a direct GitHub clone. This is an environment/tooling limitation, not evidence that the site is offline.
- Therefore this refresh still does **not** claim CI green, deployment success, live reachability or live mobile rendering.

## Release ampels

- **DATA — GREEN.** REAL population evidence remains separated from methodology-blocked GDP; GDP machine status is fail-closed and has stronger regression guards against accidental value publication.
- **UX — YELLOW.** Responsive navigation/table/focus handling exists in repository code, but no independent live 360–430 px browser/keyboard smoke was possible.
- **DISCOVERY — GREEN at repository/build layer.** Registry/GDP routes are canonical and discoverable; demo/noindex/legacy/missing routes are excluded; robots+sitemap consistency now has explicit smoke coverage.
- **TESTS — YELLOW.** Test/build gates and new release-smoke checks are committed, but no successful current push run can be retrieved through the available connector and local execution is network-blocked.
- **DEPLOYMENT — YELLOW.** Pages is enabled and deployment is structurally gated on `npm run check`, but the current push-run result cannot be independently retrieved.
- **LIVE — YELLOW.** Intended Pages URL is known, but this runtime could not resolve `gunflo1011-debug.github.io`; neither success nor outage is claimed.

## Handoff to CEO

### Successfully achieved across Workers 1–4

- real population vintage evidence with source-faithful machine exports;
- fail-closed REAL-GDP screening with transparent methodology blocker;
- indicator registry separating REAL evidence from screening candidates;
- canonical/discovery hardening, including demo/noindex exclusion and legacy duplicate consolidation;
- corrected GDP structured data and verified-population Dataset schema;
- Pages workflow upgraded from raw checked-in `site/` upload to test/build-gated artifact generation;
- broken population-hub link removed;
- release-smoke coverage now explicitly guards robots, sitemap, canonical Germany evidence and accidental GDP value publication.

### Failed or still blocked

- no independent proof that the latest CI run is green;
- no independent proof that the latest Pages deployment succeeded;
- no live HTTP/canonical/mobile/keyboard crawl because the runtime cannot resolve the GitHub Pages host;
- REAL GDP revision values remain intentionally blocked because release-specific base-year/valuation comparability is unresolved.

### Recommended next-cycle distribution

1. **Release verification worker:** retrieve the latest push-triggered CI and Pages workflow runs with a tool that can list push runs; inspect job logs and artifact/deployment URL. Do not change code unless an actual failure is present.
2. **Live crawl worker:** once deployment is confirmed, require HTTP 200 for home, `/indicators/`, `/indicators/real-gdp/`, `status.json`, sitemap, robots, canonical Germany population HTML and its JSON/CSV; verify final canonicals and no demo/noindex leakage.
3. **UX smoke worker:** test 360–430 px layouts plus keyboard-only navigation/focus on the live deployment.
4. **Methodology worker:** independently resolve the release-specific GDP base-year/valuation comparability gate. Until then keep `publishableRevisionData:false` and publish no GDP revision values/rankings/CSV.

## Minimal user action

None based on repository evidence alone. Only if the actual latest Pages run shows a configuration failure or no deployment environment is created: GitHub → repository Settings → Pages → Build and deployment → set Source to **GitHub Actions**, then re-run **Deploy static site to GitHub Pages**. Do not make this change merely because this runtime cannot resolve the live host.
