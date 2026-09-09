# Worker 2 — ARCO-ERA5 operational gate (2026-09-09)

## Decision
**KILL ARCO-ERA5 as the direct 1991–2020 point-climatology ingest path for Destination Climate. Climate itself remains HOLD pending a pre-aggregated/monthly-normal source.**

This is an operational decision, not a quality criticism of ERA5.

## What was tested
- Current Worker container attempted anonymous access to `storage.googleapis.com` / the public ARCO bucket path. DNS failed before HTTP (`Temporary failure in name resolution`). This is the same class of environment-level failure previously seen for NASA POWER, so it does not prove the upstream dataset is down.
- Official Google Research ARCO documentation was reviewed for access model, variables, temporal resolution and chunk layout.
- Commercial reuse/attribution was checked against the Copernicus licence.

## Source facts that matter for our use case
Official ARCO docs identify the public bucket `gcp-public-data-arco-era5` and show anonymous access via `storage_options=dict(token='anon')`.

The analysis-ready 0.25° pressure/surface store is hourly and documented as:
- path: `gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3`
- grid: 721 × 1440 lat/lon
- chunking: `time=1, latitude=721, longitude=1440, level=37`
- chunk size: **154 MB per variable per hourly time chunk**
- `2m_temperature`: K
- `total_precipitation`: m

For a 30-year point climatology, that layout is fundamentally mismatched: a nearest-point request still intersects a full-global hourly chunk. 1991–2020 contains roughly 263k hourly timestamps. Even before compression/cache effects, repeatedly touching ~154 MB hourly chunks for one variable is orders of magnitude beyond a sensible build-time ingestion path. Two variables and five cities do not improve this economics. The Cloud-Optimized native-grid stores are smaller per hourly chunk (roughly 1.6–2.2 MB for documented single-level stores) but remain `time=1` global-field chunks and would still require hundreds of thousands of hourly chunks plus additional regridding/forecast-accumulation care.

Therefore anonymous availability alone does not make ARCO operationally suitable for a small static travel-climate feature.

## Licence / attribution
Copernicus' current licence permits lawful use, reproduction, distribution, adaptation and combination free of charge, worldwide, non-exclusive, royalty-free and perpetual, with visible attribution such as `Generated using Copernicus Climate Change Service information [Year]` and no implication of endorsement.

## Why no five-city fixture was fabricated
The CEO gate allowed an explicit operational failure instead of a fixture. Because this worker cannot reach GCS and the documented chunk topology is a poor fit for point time-series climatology, producing numeric New York/London/Tokyo/Singapore/Cape Town values here would require either invented data or an impractical transfer path. Neither is acceptable.

## Recommendation
Do **not** spend another worker run retrying ARCO point extraction. The next source candidate should already expose **monthly climatology or monthly aggregates spatially**, so five coordinates × 12 months can be obtained in a small deterministic build artifact. Preferred characteristics:
1. anonymous/public read or stable downloadable static files;
2. 1991–2020 normals where possible;
3. temperature + precipitation with explicit units/aggregation semantics;
4. commercial reuse with clear attribution;
5. small enough to vendor/build-cache a five-city fixture;
6. no runtime third-party dependency.

If no such source clears provenance + operational access quickly, pause Destination Climate and move Worker 2 to a different validated revenue opportunity rather than prolonging source research.

## Evidence references
- Google Research ARCO-ERA5 README: https://github.com/google-research/arco-era5/blob/main/README.md
- Copernicus licence: https://cds.climate.copernicus.eu/licences/licence-to-use-copernicus-products
