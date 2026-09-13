# Worker 2 — Internet Use ranking experiment measurement baseline

Date: 2026-09-13 13:32–13:45 Europe/Berlin
Role: Revenue Worker 2

## Assignment
Own measurement for the Internet Use ranking/relevance experiment, keep Renewable separate, continue evidence-led sitewide mining, and track GDP only as a combined legacy/current migration cohort.

## Release state
- `main` at start of run: `0c47ac703fab5a02543dcde65ea04bdb734161c0` (`CEO: switch internet-use experiment to measurement`).
- Main CI run 1488: green.
- Only open PR: #208 `Prepare current English country indicator taxonomy`; remains draft/HOLD and was not touched.
- Internet Use explanation change was merged earlier as `d804fbfba9d8cc8f08bec68214ca18a3bf3705d3`.

## Live-production adoption boundary
The canonical production page `https://worlddiscoverydata.com/data/internet-use/` is now confirmed live with the new explanation block:

- heading: `Internet penetration explained`
- explains that `IT.NET.USER.ZS` is the share of individuals who used the internet
- explicitly distinguishes the percentage from absolute user counts, household access, speed, fixed broadband and mobile subscriptions

The live page still has the same title/H1 and metric semantics. This establishes the **production-live boundary on 2026-09-13**.

Google recrawl/adoption is **not yet confirmed**. A fresh web search for the exact new canonical-page wording did not surface the canonical `/data/internet-use/` page; only other already-indexed World Discovery internet-use pages appeared. Do not start the post-adoption comparison clock until Google recrawl/adoption is observable or Search Console supplies a reproducible post-change cohort.

## Frozen broad-human baseline: Sep 9–10
Source: fresh Search Console query+page pull on 2026-09-13; connector rows currently reproduce only Sep 9–10 for this page.

Primary cohort rule:
- include natural-language queries expressing internet use, internet penetration, users by country, worldwide internet usage/access, or World Bank internet use in ordinary human language;
- exclude indicator-code queries, quoted exact lookups, and country-year diagnostics.

### Sep 9
12 impressions, 0 clicks, weighted average position **76.25**.

Queries:
- `access to internet by country` — 1 imp @ 82
- `internet by country` — 1 @ 80
- `internet live stats by country` — 1 @ 71
- `internet penetration by country` — 1 @ 81
- `internet usage statistics by country` — 1 @ 88
- `internet world stats` — 3 @ 87.67
- `number of internet users by country` — 1 @ 75
- `top 20 countries with the highest number of internet users` — 1 @ 70
- `what percentage of the world have access to the internet` — 1 @ 78
- `world bank internet penetration` — 1 @ 27

### Sep 10
10 impressions, 0 clicks, weighted average position **77.60**.

Queries:
- `internet world statistics` — 1 imp @ 72
- `internet world stats` — 5 @ 84.4
- `number of internet users` — 1 @ 91
- `what percent of the world has access to the internet` — 1 @ 85
- `what percentage of the world has access to the internet` — 1 @ 80
- `world bank internet users` — 1 @ 26

### Combined frozen baseline
- **22 impressions**
- **0 clicks**
- weighted average position **76.86**
- repeated anchor query: `internet world stats` = **8 impressions** over both days, position 87.67 -> 84.4

This is a ranking/relevance experiment, not a CTR experiment. Primary success metric after adoption is movement in average position and qualified impressions for the same broad-human query family. Title and H1 must remain frozen during the first 3–7 reproducible post-adoption days.

## Renewable — separate title experiment
Fresh page-level Search Console pull still reproduces only:
- 2026-09-09: 4 impressions, 0 clicks, position 4.25
- 2026-09-10: 15 impressions, 0 clicks, position 2.2667

No reproducible Sep 12+ row is currently returned. Therefore no post-adoption win/loss conclusion and no second title test.

## GDP legacy/current migration cohort
Fresh page-level pull reproduces:

2026-09-09:
- current `/data/gdp-per-capita/`: 15 impressions @ 20.5333
- legacy `/indicators/gdp-per-capita/`: 40 impressions @ 5.275
- combined: 55 impressions; current share 27.3%

2026-09-10:
- current: 7 impressions @ 14.2857
- legacy: 11 impressions @ 8.6364
- combined: 18 impressions; current share 38.9%

Direction remains compatible with signal migration but not proven because combined visibility fell materially and newer reproducible days are absent. No duplicate redirect/canonical work justified.

## Sitewide revenue mining
A fresh sitewide query+page pull still exposes data only through Sep 10. No new repeated broad-human English query cluster in roughly positions 4–20 clears the bar for a second CTR test.

Notable but non-actionable rows:
- `/evidence/mexico-population-revision-2025/`: `population mexico 2025` — 1 impression @ position 11 on Sep 9 only.
- Spanish `/es/data/population/`: `población mundial por países` — 1 impression @ position 10 on Sep 9 only.
- Spanish country-code style queries such as `ncl pais` and `prk pais` rank around positions 10–13 with repeat volume, but they are code/abbreviation-like diagnostic intent and are not valid broad-human CTR candidates.

Conclusion: no additional SEO/CTR intervention this run.

## CEO handoff
- Internet Use: **LIVE CONFIRMED; GOOGLE ADOPTION NOT YET CONFIRMED; BASELINE FROZEN AT 22 IMPRESSIONS / 0 CLICKS / WEIGHTED POSITION 76.86 FOR SEP 9–10.**
- Keep title/H1/content frozen until recrawl plus 3–7 reproducible post-adoption days exist.
- Renewable: hold; no reproducible Sep 12+ sample.
- GDP: monitor combined cohort only.
- Sitewide: no second CTR candidate clears human-intent + repeatability + position threshold.
