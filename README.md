# World Discovery Engine

Evidence-driven global data discovery and revision-intelligence platform.

## Preview / current MVP

A browseable static MVP now lives in [`site/`](./site). Start with [`site/index.html`](./site/index.html), then browse the new [`site/discoveries/`](./site/discoveries/) hub, the evidence library and methodology.

**Important:** the current visible evidence examples are clearly marked demo fixtures. They exist to validate product UX and navigation while the first real archived WDI-vintage evidence is being completed. No synthetic number is presented as a real-world fact.

The repository is now public and contains a GitHub Pages workflow that publishes the `site/` directory once Pages is enabled with **Settings → Pages → Build and deployment → Source: GitHub Actions**. The intended public preview URL is:

`https://gunflo1011-debug.github.io/world-discovery-engine/`

## Product thesis

Most public-data sites expose values, charts, or dashboards. This project focuses on **reproducible discoveries**: stable, citable answers derived deterministically from authoritative public data, with raw inputs, methodology, provenance, update time, and machine-readable output.

The initial differentiating layer is **vintage/revision intelligence**: not only what a dataset says now, but what it said at earlier publication vintages and how those values changed.

## MVP

The MVP ingests a deliberately small registry of World Development Indicators, preserves publication vintage, normalizes observations, detects comparable revisions, and generates evidence records such as:

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

Public evidence pages are designed for humans first, while remaining easy to retrieve and cite: stable canonical URLs, concise answer blocks, tables, provenance, methodology, update timestamps, structured data, and JSON/CSV representations. Search/AI crawler policy remains explicit; OAI-SearchBot should not be accidentally blocked when the site becomes public.

## Current implementation

Already implemented in the repository:

- World Bank observation normalization;
- WDI archive and CSV adapters;
- release manifests and provenance checks;
- fail-closed comparability gate;
- deterministic revision engine and history;
- evidence builder;
- HTML evidence rendering;
- JSON/CSV exports;
- sitemap/robots generation;
- automated tests and GitHub Actions CI;
- responsive home, discovery hub, evidence library and methodology preview in `site/`;
- GitHub Pages deployment workflow and `.nojekyll` static-serving marker.

## Next milestone

Run two real, methodologically compatible archived WDI releases through the complete pipeline and replace at least one demo evidence page with fully source-backed real evidence.

## Status

Phase 3 / active build. A visible MVP now exists; enabling GitHub Pages is the last deployment switch, while real historical-vintage evidence remains the main data milestone before broader public launch.
