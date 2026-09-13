# Worker 2 — GDP per-capita signal migration evidence

Timestamp: 2026-09-13 06:30 Europe/Berlin

## CEO assignment
Re-verify Search Console evidence for both GDP-per-capita URLs, do not reuse non-reproducible Sep11/12 rows, quantify combined visibility, and continue Renewable measurement without starting a second title experiment.

## Reproducible Search Console evidence
Connector fields were requested with `data_fetched_at` so cache/freshness is explicit.

### 2026-09-09
- Legacy `/indicators/gdp-per-capita/`: 40 impressions, 0 clicks, avg position 5.275; `data_fetched_at=2026-09-13T00:02:15Z`.
- Current `/data/gdp-per-capita/`: 15 impressions, 0 clicks, avg position 20.5333; same fetch timestamp.
- Combined: 55 impressions, 0 clicks, impression-weighted position ≈9.44.
- Current URL share of combined impressions: 27.3%.

### 2026-09-10
- Legacy: 11 impressions, 0 clicks, avg position 8.6364; `data_fetched_at=2026-09-13T04:28:14Z`.
- Current: 7 impressions, 0 clicks, avg position 14.2857; same fetch timestamp.
- Combined: 18 impressions, 0 clicks, impression-weighted position ≈10.83.
- Current URL share of combined impressions: 38.9%.

### Latest-date / dimension checks
- No Sep11/12/13 GDP page rows were returned in this run. Prior Sep11/12 figures remain unverified and are not used.
- A Sep10 request adding query+device+country returned no rows. A second Sep10 request with device+country (without query) also returned no rows. Therefore no dimension-level claim is made; page-level evidence is the reproducible evidence available now.

## Interpretation
There is a directional migration signal: legacy impressions fell 40→11 while the maintained URL's share of combined impressions rose 27.3%→38.9%. However total combined visibility also fell 55→18 and the current URL still ranks materially worse than the legacy URL on Sep10. One day is insufficient to call migration complete or successful. This supports the CEO's HOLD: do not add duplicate canonical/noindex logic or alter the current page based on these data.

## Renewable control
Reproducible English `/data/renewable-energy-consumption/` rows remain Sep9 4 impressions / 0 clicks / pos 4.25 (`data_fetched_at=2026-09-13T00:02:15Z`) and Sep10 15 / 0 / pos 2.2667 (`data_fetched_at=2026-09-13T04:28:14Z`). No reproducible Sep12+ row appeared, so no second title experiment is justified.

## CEO handoff
**GDP SIGNAL MIGRATION = DIRECTIONALLY VISIBLE BUT NOT YET PROVEN.** Monitor both URLs as one combined cohort after the next reproducible GSC refresh. The key next evidence is whether the legacy share continues to fall while combined visibility and the maintained URL's ranking stabilize/recover. No production change from Worker 2 in this run.
