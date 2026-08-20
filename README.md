# World Discovery Engine

Evidence-driven global data discovery and revision-intelligence platform.

## Product thesis

Most public-data sites expose values, charts, or dashboards. This project focuses on **reproducible discoveries**: stable, citable answers derived deterministically from authoritative public data, with raw inputs, methodology, provenance, update time, and machine-readable output.

The initial differentiating layer is **vintage/revision intelligence**: not only what a dataset says now, but what it said at earlier publication vintages and how those values changed.

## MVP

The MVP will ingest a deliberately small registry of World Development Indicators, preserve publication vintage, normalize observations, detect comparable revisions, and generate evidence records such as:

- first published value vs latest value;
- absolute and percentage revision;
- revision count and direction changes;
- time until a value stabilizes;
- rank changes caused by revisions;
- selected change/outlier discoveries with explicit methodology.

No causal claims are generated automatically.

## Architecture

`source -> indicator registry -> vintage -> observation store -> comparability gate -> revision engine -> discovery validator -> evidence store -> web/API`

Core entities:

- `Source`
- `Indicator`
- `Vintage`
- `Observation`
- `MethodologyVersion`
- `RevisionEvent`
- `Discovery`
- `Evidence`

## Trust rules

1. Every public numeric claim must be reproducible from stored observations.
2. Every evidence page must identify source, vintage, formula/method and update timestamp.
3. A revision comparison is rejected when units or indicator semantics are incompatible.
4. Correlation is never presented as causation.
5. Programmatic pages are published only when they provide distinct user value.
6. Source licensing and attribution are stored with the source/series metadata.

## Search & AI discovery

Public evidence pages are designed for humans first, while remaining easy to retrieve and cite: stable canonical URLs, concise answer blocks, tables, provenance, methodology, update timestamps, structured data, and JSON/CSV representations. Search/AI crawler policy will remain explicit; OAI-SearchBot should not be accidentally blocked when the site becomes public.

## Initial implementation roadmap

1. Define schemas and indicator registry.
2. Build current World Bank/WDI importer.
3. Build historical-vintage importer and immutable snapshot storage.
4. Implement comparability gate and revision calculations.
5. Add deterministic tests with known fixtures.
6. Generate the first evidence records.
7. Build server-rendered evidence pages plus JSON/CSV endpoints.
8. Add sitemap, robots, canonicals, structured data, analytics and performance checks.
9. Publish a small high-quality corpus before scaling URL generation.

## Status

Phase 3 / build started. Repository scaffold is being created; no production deployment or domain is required yet.
