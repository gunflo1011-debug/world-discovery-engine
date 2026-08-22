# World Discovery Engine

Evidence-driven global data discovery and revision-intelligence platform.

## Preview / current MVP

A browseable static MVP lives in [`site/`](./site). Start with [`site/index.html`](./site/index.html), then browse the indicator registry, evidence library, discoveries and methodology.

The repository now contains **real archived WDI vintage evidence** for population revisions alongside clearly marked demo fixtures used for product/UX testing. Demo fixtures are not intended to be preferred for indexing, and synthetic numbers must never be presented as real-world facts.

The public GitHub Pages site is intended at:

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

Core entities: `Source`, `Indicator`, `Vintage`, `Observation`, `MethodologyVersion`, `RevisionEvent`, `Discovery`, `Evidence`.

## Trust rules

1. Every public numeric claim must be reproducible from stored observations.
2. Every evidence page must identify source, vintage, formula/method and update timestamp where available.
3. A revision comparison is rejected when units or indicator semantics are incompatible.
4. Correlation is never presented as causation.
5. Programmatic pages are published only when they provide distinct user value.
6. Source licensing and attribution are stored with the source/series metadata.
7. Methodology-blocked indicators may expose screening/provenance status, but not unverified revision values.

## Search & AI discovery

Public evidence pages are designed for humans first while remaining easy to retrieve and cite: stable canonical URLs, concise answer blocks, provenance, methodology and machine-readable JSON/CSV where the evidence gate has passed. Blocked indicator screens may expose machine-readable status JSON without exposing unverified values. Sitemap generation excludes demo evidence and absent static routes.

## Current implementation

Implemented in the repository:

- World Bank observation normalization;
- WDI archive and CSV adapters;
- release manifests and provenance checks;
- fail-closed comparability gate;
- deterministic revision engine and history;
- evidence builder;
- HTML evidence rendering;
- JSON/CSV exports for verified evidence;
- sitemap/robots generation;
- automated tests and GitHub Actions CI configuration;
- responsive home, discovery, evidence, indicator and methodology pages;
- GitHub Pages deployment workflow and `.nojekyll` static-serving marker;
- real population-revision evidence from two archived 2025 WDI vintages;
- fail-closed real-GDP screening that withholds revision values until release-specific methodology comparability is independently verified.

## Next milestone

Harden the verified indicator/evidence slices for search, citation and machine retrieval; independently resolve the real-GDP release-specific methodology gate before any GDP revision values are published; continue replacing demo fixtures with source-backed evidence.

## Status

Active build. Real WDI vintage evidence is now present; broader public scaling remains gated on source/methodology verification, quality controls and reproducible deployment checks.
