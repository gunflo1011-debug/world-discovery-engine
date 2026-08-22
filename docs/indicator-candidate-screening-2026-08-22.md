# Indicator candidate screening — 2026-08-22

Task: WD-007 (Worker 2)

## Decision

**Nominate `IT.NET.USER.ZS` — Individuals using the Internet (% of population) — as the next current-state vertical.**

This is a **GO for a verified current/latest-value product slice**, not a GO for cross-vintage revision claims. The WDI archive caveat established during WD-002 still applies: current metadata cannot independently prove the release-specific definition of an archived series. Therefore any archive-to-archive revision feature remains fail-closed until release-specific historical methodology is available.

## Why this candidate

- Query-worthy user question: “What percentage of people use the internet in country X?” and country/ranking comparisons are easy to understand.
- Official WDI metadata identifies the source as the International Telecommunication Union (ITU), World Telecommunication/ICT Indicators Database.
- Unit is `% of population`, periodicity is annual, and the current WDI metadata defines an internet user as an individual who used the Internet from any location in the last 3 months.
- The WDI metadata exposes a CC BY-4.0 license for this indicator and explicitly asks third-party users to cite ITU.
- It complements the already-verified population family without duplicating it and creates a useful digital-development vertical.

Authoritative metadata inspected:
- https://databank.worldbank.org/metadataglossary/world-development-indicators/series/IT.NET.USER.ZS/~/~/home

## Candidate comparison

| Candidate | User value | Current metadata clarity | Cross-vintage decision | Product decision |
|---|---|---|---|---|
| `IT.NET.USER.ZS` Individuals using the Internet (% of population) | High: intuitive digital-adoption comparison | Strong: %, annual, ITU source, explicit definition and license | **NO-GO for revision claims** without release-specific historical metadata | **GO for current/latest verified vertical** |
| `SP.DYN.LE00.IN` Life expectancy at birth, total (years) | High: intuitive health comparison | Strong definition, but derived from multiple demographic sources and modeled/interpolated series | **NO-GO for revision claims** without release-specific historical metadata; revisions can reflect source/model updates | HOLD behind internet-use vertical |
| `NY.GDP.MKTP.KD.ZG` GDP growth (annual %) | High economic interest | Familiar metric, but belongs to the GDP constant-price family whose historical methodology is already known to be risky | **NO-GO** for the tested archive-revision concept absent release-specific methodology | REJECT as next slice; do not reopen GDP loop |

Life-expectancy metadata inspected:
- https://databank.worldbank.org/metadataglossary/world-development-indicators/series/SP.DYN.LE00.IN

## Provenance / licensing requirements for Worker 3

For `IT.NET.USER.ZS`, the vertical must fail closed unless the build captures and publishes:

1. indicator code and exact human label;
2. source attribution to ITU as exposed by WDI;
3. WDI retrieval URL/date and observation reference year;
4. unit `% of population`;
5. license/attribution note (CC BY-4.0; cite ITU);
6. explicit distinction between observation year and retrieval/build time;
7. machine-readable JSON/CSV generated from the same normalized record as the human page;
8. no archive-revision language or `REAL`/revision-ready flag unless a separate comparability gate is later proven.

## Suggested vertical slice

Build one useful, non-thin feature around **Internet use by country**: latest available verified observation, observation year, source/provenance, and a small comparison/ranking experience that never mixes different observation years without making that fact visible. Country pages should link back to the indicator overview and machine output. Reuse the existing evidence/discovery contracts rather than inventing a second data path.

## Handoff constraints

- Do not treat identical indicator codes across WDI archives as proof of historical methodological comparability.
- Do not publish archive-to-archive revision deltas for any of these three candidates from current metadata alone.
- Do not spend another cycle cosmetically refining the fail-closed Real-GDP page unless new release-specific authoritative evidence appears.
- Before public release, Worker 3 should verify the actual current WDI observations used by the slice and run the normal provenance/discovery/live gates.
