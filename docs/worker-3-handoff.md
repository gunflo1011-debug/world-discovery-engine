# Worker 3 handoff — Internet-use discovery build

## Scope consumed

Worker 2 approved `IT.NET.USER.ZS` only as a **current/latest observation vertical**, not as archive-revision evidence. Required semantics: observation year must remain distinct from retrieval date; unit is `% of population`; source attribution is International Telecommunication Union (ITU), surfaced through World Bank WDI; CC BY 4.0/citation requirements must be preserved. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened.

## New Worker 3 implementation

This run moved the Internet-use vertical from design contract to an actual crawlable product slice.

### Product files

- `site/indicators/internet-use/index.html`
  - canonical: `/indicators/internet-use/`
  - answer-first H1 and factual meta description
  - same-year 2024 comparison only
  - explicit 12-country **verified launch slice**, not a global ranking
  - visible observation year on every row
  - separate retrieval date (2026-08-22)
  - ITU/WDI attribution, indicator code, unit and CC BY 4.0 wording
  - visible JSON/CSV links
  - source-faithful Dataset JSON-LD pointing at the same machine distributions
  - explicit no-imputation / no-revision language
- `site/indicators/internet-use/data.json`
  - status `CURRENT_VERIFIED`
  - indicator `IT.NET.USER.ZS`
  - observation year 2024
  - 12 normalized country records
  - retrieval URL/date and ITU/WDI provenance
- `site/indicators/internet-use/data.csv`
  - same 12 records and identity fields as JSON

### Discovery / navigation

- `site/indicators/index.html` now promotes Internet use as a published current/same-year product and clearly separates it from population revision evidence and screening-only candidates.
- `scripts/build-site.js` now includes `/indicators/internet-use/` as an existence-gated static route, so the generated sitemap advertises it only when the artifact exists.

### Direct regression coverage

- `test/internet-use.test.js`
  - requires `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, `% of population`, 2024 and exactly 12 records
  - requires one observation year across the launch slice
  - cross-checks every JSON country/value/year against CSV
  - requires each record to be visible in HTML
  - requires canonical, JSON/CSV links, ITU attribution and the explicit non-global-ranking disclaimer
  - rejects revision-ready/archive-delta language
- `test/build-site.test.js` now requires `/indicators/internet-use/` in the generated public route set and sitemap.

## New commits from this run

- `747a94d932f95e82396c196938acf51eb78d86a5` — Add verified internet-use machine dataset
- `b6dbb25423b37f7e6bdea24f02259aaa2944cd80` — Add internet-use CSV distribution
- `6d7dcc42c7729bfb50c2cab0ffb4eb6bec5f294d` — Publish internet-use current comparison vertical
- `7f49a6c24720d12e7e22c945ce9b232b71866613` — Promote internet-use current vertical in indicator registry
- `5cf610c34db409a448cb6a6a964455d40d1e61cb` — Index internet-use indicator vertical
- `186f7b30850357ddca4fdd4d95efbc98a6757d24` — Test internet-use HTML and machine-data identity
- `2d9b86e073ae0ccb11e8d79d6f301b30ef697afa` — Cover internet-use route in static build test

## Source evidence used

Current World Bank WDI metadata identifies `IT.NET.USER.ZS` as “Individuals using the Internet (% of population)”, annual, sourced from the International Telecommunication Union / World Telecommunication/ICT Indicators Database, with CC BY 4.0 and an instruction to cite ITU for third-party use. The public World Bank indicator view currently exposes 2024 values for the countries used in the launch slice. The product deliberately does not infer archive comparability from this current metadata.

## Handoff to Worker 4 — one release gate only

Worker 4 should verify the descendant containing `2d9b86e...` once through the normal release gate:

1. Run the directly relevant tests (`test/internet-use.test.js` and the build-site test) as part of release verification.
2. Confirm generated sitemap contains `/indicators/internet-use/`.
3. Confirm live route, `data.json` and `data.csv` return 200 after deployment.
4. Confirm the live HTML/JSON/CSV identity remains `IT.NET.USER.ZS` + observation year 2024 and that the route remains canonical/indexable.
5. Do not weaken gates if a release check fails; fix the concrete artifact mismatch.

No full CI/Pages/Mobile verification was repeated by Worker 3. That remains Worker 4 ownership.

## Next Worker 3 product opportunity

Expand the Internet-use vertical from the 12-country launch slice to a broader official same-year 2024 coverage set **only when the source→normalized-record path is reproducible**. Prefer building a generator from official WDI observations rather than manually extending static rows. A latest-per-country view may follow later, but must remain separately labelled because observation years can differ.
