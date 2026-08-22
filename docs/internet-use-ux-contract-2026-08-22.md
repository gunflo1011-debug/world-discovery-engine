# Internet-use current/latest vertical — product & UX contract

Task: WD-010 (Worker 2)  
Indicator: `IT.NET.USER.ZS` — Individuals using the Internet (% of population)

## Product question

Answer quickly and accurately: **What share of people use the internet in a country, what observation year does that value refer to, and how does it compare with other countries on a genuinely comparable basis?**

This is a current/latest observation product, not a revision product. No archive-to-archive delta, `REAL`, or revision-ready language is permitted without a separate historical comparability gate.

## Answer-first overview

The indicator overview should lead with a plain-language answer and then evidence:

1. latest verified observations available to this build;
2. the observation year beside every value;
3. source attribution: International Telecommunication Union (ITU), surfaced through World Development Indicators (WDI);
4. unit: `% of population`;
5. retrieval/build date separately from observation year;
6. direct links to machine-readable JSON and CSV generated from the same normalized records.

Do not use “current” or “today” for an observation merely because it was retrieved recently.

## Comparison and ranking semantics

A ranking must never silently mix different observation years.

Preferred default: **common-year ranking**. Select the newest year that meets the product's explicit coverage threshold and rank only observations from that same year. Show the year in the heading, e.g. `Internet use by country — 2024 observations`.

If a latest-per-country view is also useful, label it explicitly `Latest available observation by country` and show an `Observation year` column directly beside every value. It must not be described as a same-year ranking. Sorting is acceptable, but the page must warn that values can refer to different years.

No imputation or carry-forward should be introduced merely to increase ranking coverage. Missing values remain missing.

## Human page acceptance criteria

The overview is publishable only if it has:

- H1 phrased for the user question, not pipeline jargon;
- concise definition of what the percentage means;
- common-year comparison/ranking with visible year and coverage count, when sufficient coverage exists;
- latest-per-country view only if mixed-year semantics are unmistakable;
- country, value, observation year and source/provenance accessible without hover;
- table caption and semantic column headers; numeric cells readable by screen readers;
- horizontally scrollable table wrapper on narrow screens without page-level horizontal overflow;
- keyboard-focusable scroll region when horizontal scrolling is required;
- useful empty/fail-closed state if official observations or required provenance are unavailable;
- direct `Methodology`, `JSON`, `CSV`, `Indicators`, and relevant country/evidence links;
- no unsupported precision: format percentages consistently while machine output preserves source precision.

## Country-page acceptance criteria

Where country pages are produced, each page must show:

- country name and percentage as the primary answer;
- observation year immediately adjacent to the value;
- explicit distinction between observation year and retrieval/build timestamp;
- indicator code and unit;
- ITU/WDI source attribution and license note;
- link back to the Internet-use indicator overview;
- links to the exact JSON/CSV representation for that published record or documented machine endpoint;
- canonical URL, useful title/description, and internal links to related verified evidence.

Do not create thin country pages solely for index count. A page must provide evidence/provenance and a useful comparison/context path.

## Source, provenance and license wording

Required factual attribution in the UI or adjacent provenance block:

`Source: International Telecommunication Union (ITU), World Telecommunication/ICT Indicators Database, surfaced via World Bank World Development Indicators (WDI).`

Also expose the WDI retrieval URL/date used by the pipeline, indicator code, observation year, unit, and the license/attribution requirement captured by the candidate screening. The product must cite ITU and preserve the CC BY 4.0 requirement documented by current WDI metadata.

Retrieval date is provenance, **not freshness of the underlying observation**.

## SEO / discovery contract

Primary intent targets should remain natural and answerable by the page, for example:

- `internet users percentage by country`
- `internet use by country`
- `percentage of population using the internet in [country]`

The overview title/description should mention `internet use`, `country`, `% of population`, and the common observation year when one is used. Country pages should use the actual country and observation year rather than generic boilerplate.

Structured data and machine discovery must point to the same normalized records as the human page. JSON/CSV must not contain values, years, or source semantics that differ from HTML.

Internal-link targets:

- Home → Indicators → Internet use;
- Internet-use overview → relevant verified country/evidence pages;
- country/evidence pages → Internet-use overview;
- overview/country pages → Methodology and machine outputs.

Do not advertise URLs in sitemap/navigation until the build has produced the corresponding verified artifact.

## Mobile and accessibility release criteria

At 360, 390 and 430 px:

- no page-level horizontal overflow;
- primary answer, observation year and source remain readable without zoom;
- navigation remains present and operable;
- tables may scroll inside their own labelled region;
- focus indicator is visible for links, controls and scrollable table region;
- no information is encoded by color alone;
- browser console/page errors fail the release smoke.

Add the Internet-use overview and at least one representative verified country page to the existing Playwright post-deploy smoke once those routes exist.

## Fail-closed conditions

Do not publish the vertical as verified if any of these are missing or inconsistent:

- official observation value or observation year;
- exact indicator identity;
- ITU/WDI attribution;
- unit;
- retrieval provenance;
- required license wording/attribution;
- semantic identity across HTML/JSON/CSV;
- required build/test/live gates.

Never infer archive comparability from an identical indicator code/name.

## Implementation handoff to Worker 3

Reuse the existing normalized evidence/discovery pipeline. Do not create a second source of truth for HTML vs JSON/CSV. First ingest and validate official current WDI observations; then choose the newest sufficiently covered common observation year for the default ranking. Keep latest-per-country data as a separately labelled view if useful. Wire internal links/schema/tests only after the verified artifacts exist, then pass through the commit-exact Pages + Playwright live gate.