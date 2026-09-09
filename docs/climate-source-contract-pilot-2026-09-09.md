# Destination Climate — source contract + pilot gate

_Date: 2026-09-09 · Owner: Worker 2 · Status: HOLD pending numeric pilot fetch_

## Decision
Use **NASA POWER Custom Climatology backed by NASA GMAO MERRA-2 meteorology** as the preferred source candidate. Prefer a static build-time ingest over runtime API dependence. Runtime UI remains unauthorized until the five-city numeric validation below is completed.

## Exact source contract
- Service/product: NASA Prediction Of Worldwide Energy Resources (POWER), Custom Climatology API; meteorological source = NASA GMAO MERRA-2.
- API shape: `/api/temporal/climatology/point`; point latitude/longitude; JSON; custom `start=1991&end=2020`.
- Reference period: **1991–2020**.
- Candidate parameters: `T2M` and `PRECTOTCORR`; add min/max only after their climatology semantics are confirmed from returned metadata.
- Spatial mapping: curated city coordinate -> POWER point request -> gridded meteorology. Do **not** describe values as airport/station observations.
- Update/version policy: pin baseline years, retrieval date and returned POWER/source metadata. Regenerate only through an explicit versioned refresh process.
- Missing data: never interpolate or invent. Missing/sentinel parameter-month fails that metric/month and no best-month score may be computed from incomplete required inputs.

## Reuse / licence finding
NASA's public data guidance provides a substantially cleaner reuse path than member-country normals for NASA-led data, while third-party layers require their own rights validation. POWER documents meteorological parameters as derived from NASA GMAO MERRA-2. Before production ingest, preserve the source link/snapshot and verify returned metadata does not identify a restrictive third-party layer. Do not use NASA logos/insignia or imply NASA endorsement.

## Reproducible request recipe
For each curated city coordinate, request the 1991–2020 custom climatology using required parameters. Treat the returned 12 calendar-month values as the source product rather than downloading 360 monthly observations and re-aggregating them ourselves. For precipitation, **do not infer or convert** until the returned parameter metadata explicitly establishes the unit and aggregation semantics. Persist: city id, coordinates, request parameters, start/end years, retrieval date, returned source/version metadata, 12 monthly values per metric and completeness flags.

Pilot cities/coordinates:
- New York: 40.7128, -74.0060
- London: 51.5074, -0.1278
- Tokyo: 35.6762, 139.6503
- Singapore: 1.3521, 103.8198
- Cape Town: -33.9249, 18.4241

## Independent validation gate
Cross-check temperature and precipitation seasonality against a second reputable climate reference for every pilot city. Prefer national meteorological agencies or NOAA/WMO station normals where authoritative normals are available. Do not average discrepancies away.

Acceptance criteria before BUILD:
1. 12/12 months present for all required metrics in all five cities.
2. Units and precipitation aggregation explicitly resolved from returned POWER metadata.
3. Temperature seasonal shape and precipitation wet/dry season agree directionally with the independent reference for all five cities.
4. Material numeric differences are explained by grid vs station, elevation/coastal effects or reference-period differences; unexplained large discrepancies => HOLD.
5. Source/reuse note appears in future methodology UI; NASA endorsement is never implied.

## Operational evidence — 2026-09-09
A fresh direct executable request to `power.larc.nasa.gov` still fails at DNS resolution in the current worker container (`Temporary failure in name resolution`) before HTTP is reached. In parallel, NASA POWER's public website, parameter dictionary and current 2026 project material remain web-accessible; POWER describes API service endpoints, climatology as a supported temporal level, global meteorological data and large-scale external API use. This combination points to a worker-environment network limitation rather than evidence that POWER itself is unavailable. It does **not**, however, satisfy the build-time accessibility gate.

No numeric climate values have been fabricated. The five-city fixture, returned metadata and cross-validation therefore remain incomplete.

## Current gate decision
**HOLD.** Provenance and architecture are promising, but BUILD remains unauthorized until an actual network-capable/build-capable path retrieves all five payloads and their metadata. If a production-capable build path cannot access POWER, treat that as an operational source-contract failure and evaluate ERA5/CDS or another clean accessible source rather than shipping a brittle dependency.
