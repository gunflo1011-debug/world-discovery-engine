# Destination Climate — source contract + pilot gate

_Date: 2026-09-09 · Owner: Worker 2 · Status: HOLD pending numeric pilot fetch_

## Decision
Use **NASA POWER Monthly API backed by NASA GMAO MERRA-2 meteorology** as the preferred source candidate, rather than WMO member-country normals. This materially reduces provenance risk while preserving global coverage. Runtime UI remains unauthorized until the five-city numeric validation below is completed.

## Exact source contract
- Service/product: NASA Prediction Of Worldwide Energy Resources (POWER), Monthly and Annual API; meteorological source = NASA GMAO MERRA-2.
- API docs: `https://power.larc.nasa.gov/docs/services/api/temporal/monthly/`
- API shape: `/api/temporal/monthly/point`; point latitude/longitude; JSON or CSV; custom `start=1991&end=2020`.
- Reference period for World Discovery pilot: **1991-01 through 2020-12**, calculated from monthly POWER responses so the consumer-facing baseline matches the current WMO standard-normal period.
- Candidate parameters: `T2M` (2 m mean temperature), `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR` (precipitation; confirm units/aggregation from returned metadata before display).
- Spatial mapping: city centroid/curated city coordinate -> POWER point request -> underlying MERRA-2 meteorology at native source resolution. Do **not** describe values as an airport/station observation. POWER docs currently state meteorology is available at roughly 0.5° × 0.625° source resolution; therefore elevation/coastal/grid smoothing is an expected discrepancy source.
- Update/version policy: pin the baseline years and record retrieval date plus POWER release/source metadata. POWER warns its archive is not static and may receive bias corrections/model fixes; regenerate only through an explicit versioned data-refresh process, not silently at page render.
- Missing data: never interpolate or invent. A missing/sentinel parameter-month fails that city-month and must be excluded or visibly marked unavailable. No best-month score may be computed from incomplete required inputs.

## Reuse / licence finding
NASA Science Data Portal states that, unless marked with a restrictive notice/license, data from a **NASA-led mission** are CC0 with no usage restrictions; other-source data require separate rights validation. NASA Earthdata gives the same CC0 rule for unmarked NASA-led mission data. POWER documents its meteorological parameters as derived from NASA GMAO MERRA-2. This is a substantially cleaner commercial-reuse path than WMO Normals, whose files are member-country submissions.

Before production ingest, preserve a source snapshot/link and verify the returned POWER metadata does not identify a restrictive third-party layer for the selected meteorological parameters. Do not use NASA logos/insignia or imply NASA endorsement.

## Reproducible request recipe
For each curated city coordinate, request 1991–2020 monthly data using the four candidate parameters. Compute each calendar month's 30-year mean from the 30 yearly monthly values. For precipitation, first verify whether the monthly API response represents rate or monthly accumulation and convert only according to POWER metadata/documentation. Persist: city id, coordinates, request parameters, start/end years, retrieval date, source/version metadata, 12 monthly values per metric, and completeness flags.

Pilot cities/coordinates to pin:
- New York: 40.7128, -74.0060
- London: 51.5074, -0.1278
- Tokyo: 35.6762, 139.6503
- Singapore: 1.3521, 103.8198
- Cape Town: -33.9249, 18.4241

## Independent validation gate
Cross-check monthly temperature and precipitation seasonality against a second reputable climate reference for every pilot city. Prefer national meteorological agencies or NOAA/WMO station normals where the exact city's authoritative normals are available. Do not average discrepancies away.

Acceptance criteria before BUILD:
1. 12/12 months present for all required metrics in all five cities.
2. Units and precipitation aggregation are explicitly resolved from POWER metadata.
3. Temperature seasonal shape and precipitation wet/dry season agree directionally with the independent reference for all five cities.
4. Material numeric differences are explained by grid vs station, elevation/coastal effects, or reference-period differences; unexplained large discrepancies => HOLD.
5. Source/reuse note is displayed in the future methodology UI; NASA endorsement is never implied.

## This run's pilot result
**HOLD, not FAIL.** The exact source and reproducible recipe are now defined, but this execution environment could not retrieve the dynamic POWER API response: direct network access from the working container failed DNS resolution, while the web retrieval layer exposes documentation but did not return arbitrary parameterized API JSON. Therefore no numeric five-city values are fabricated and BUILD is not authorized yet.

## Next action
On the next run, attempt the five parameterized POWER requests through an available network-capable fetch path. If successful, store a small deterministic pilot fixture in `data/` or `docs/evidence/`, run the cross-check, and issue BUILD/HOLD/KILL. If POWER remains inaccessible to the build/runtime environment, treat operational access as a source-contract failure and compare ERA5/CDS or another globally accessible NASA/NOAA source rather than shipping a brittle dependency.
