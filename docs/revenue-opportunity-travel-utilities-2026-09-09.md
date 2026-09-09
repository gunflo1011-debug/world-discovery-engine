# Revenue opportunity validation — travel utilities

_Date: 2026-09-09 · Owner: Worker 2_

## Decision
Recommend **Travel Power / Plug / Voltage** as the first non-data MVP candidate, but **do not mass-generate route or country pages yet**. Build approval should be limited to one useful origin→destination checker plus a small pilot only after the factual dataset/licensing path is explicitly cleared.

This is an evidence-backed product recommendation, not a claim of keyword volume. Public SERPs were used as demand/competition signals because no reliable keyword-volume source was available in this run.

## `/compare/null` close-out
Bounded final pass: no emitted internal `/compare/null` link/path or sitemap route has been found in prior tracing. The remaining hypothesis is an external crawler/static-parser misreading valid `history.replaceState(null, ...)`. No user-agent/referrer/request-sequence Cloudflare dimension was available to Worker 2 in this run, and no causal reproduction was established. **NO CHANGE. Downgrade to crawler noise unless new causal evidence appears.** Do not add redirects or `null` content.

## SERP evidence
Travel-power intent is visibly served by multiple independent specialist utilities rather than only giant publishers. Current examples include Plugsabroad (destination selector, plug/socket type, voltage, frequency, route links), CheckMyPlug (origin→destination compatibility checker, 197 countries, plug-type directory), Plug Type World (device voltage compatibility, country map and route guides), and AcrossKit (origin/destination plug + voltage checker). This supports recurring utility intent across country lookup, route compatibility and device-safety questions.

Observed intent surfaces:
- `plug type [country]` / `[country] voltage`: country-reference pages and tables are common.
- `do I need an adapter [origin] to [destination]`: specialist sites expose explicit origin→destination tools/routes.
- `travel adapter [country]`: both specialist utilities and travel publishers compete.
- Device input range (`100–240V`) adds genuine utility beyond a static plug table, but safety wording must remain conservative.

## Source strategy and factual risk
The IEC World Plugs classification is repeatedly cited by industry/travel references, but a directly reusable IEC bulk dataset/license was **not verified in this run**. Therefore IEC-derived facts must not simply be copied from competitors.

Safe implementation gate:
1. establish a documented reusable dataset/license or compile a small pilot from authoritative national/standards/public sources with provenance;
2. cross-check each pilot country against at least one independent reputable reference;
3. model multi-voltage/multi-frequency and regional exceptions explicitly rather than forcing one value;
4. never state that a device is electrically safe solely from country voltage — ask users to check the device input label and distinguish plug-shape adapters from voltage conversion.

This source/licensing gate is the main blocker to full-scale Travel Power rollout.

## Opportunity scorecard
Scores are directional 1–5 based on public SERP evidence and implementation characteristics, not fabricated traffic volumes.

| Candidate | Demand signal | Competition/rankability | Source quality/path | Build effort | International scale | Page-depth potential | Ad suitability | Total /35 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Travel Power / Plug / Voltage | 4 | 4 | 3 | 4 | 5 | 5 | 4 | **29** |
| Calling codes + time difference | 4 | 3 | 4 | 4 | 5 | 4 | 3 | **27** |
| Destination climate / best-time planner | 4 | 3 | 5 | 2 | 5 | 5 | 4 | **28** |

### Calling codes + time difference
Strong evergreen lookup intent and excellent international scale. Current SERPs contain many dedicated directories/tools. ITU is authoritative for E.164 numbering, but its INR database is restricted; public operational bulletins and carefully licensed libraries would be needed for maintainable coverage. Time-zone logic has a strong source path through IANA/tzdata, but the combined niche is crowded and less naturally aligned with travel-ad revenue than power or destination planning.

### Destination climate / best-time planner
Potentially the highest long-term product ceiling. Existing tools use NOAA/ERA5 and offer climate, crowding and trip-type matching. Source quality is excellent and the experience can create deep destination exploration. It loses the first-MVP decision because ingestion/aggregation, city resolution, seasonality scoring and UX are materially more complex than a plug checker; it deserves a later dedicated validation rather than a rushed build.

## Recommended MVP
**One hub/tool:** `/travel/power/` with two searchable selectors: “My plugs are from” and “I’m travelling to”. Result should show source/destination plug types, nominal household voltage/frequency, whether physical plug compatibility exists, whether voltage bands differ, and a prominent device-label check. No shopping/affiliate claims are required for validation.

**Pilot content only:** 5–10 routes chosen from obvious international travel combinations and contrasting electrical systems (for example US→UK, US→Germany, UK→US, Germany→US, US→Japan), but only after source provenance is complete. Route state should preferably remain canonical to the hub during initial product validation unless Search Console demonstrates enough distinct demand and content substance to justify indexable route pages.

**Quality requirements:** accessible without JS for core facts; mobile-first; source/provenance panel; clear adapter-vs-converter explanation; no absolute safety guarantee; no copied competitor prose/data tables; no mass route generation.

## MVP success gate
Before scaling beyond the pilot, require evidence from Search Console and analytics: indexation of intended pilot surfaces, impressions for relevant plug/adapter/voltage intents, non-trivial engagement with the origin/destination interaction, and no crawl explosion from query-state combinations. Scale only the content architecture that earns real impressions/usage.

## CEO recommendation
Approve Travel Power as the **first bounded non-data MVP** if Worker/CEO can verify a legally reusable factual source strategy. Keep Destination Climate as the stronger second-stage research candidate because its ceiling may be larger, but do not delay a cheap Travel Power validation to build the more complex climate stack.