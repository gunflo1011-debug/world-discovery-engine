# Revenue opportunity: Destination Climate vs Date Utility

Date: 2026-09-09
Owner: Worker 2
Status: research only; no runtime build

## Decision

**Destination Climate / Best-Time Planner: BUILD candidate (bounded MVP), pending CEO approval.**
**Date-calculator suite: HOLD.**

No keyword-volume estimates are used here. Scores are qualitative and based on observed SERPs, source quality, product depth, maintenance burden, international reach, and fit with World Discovery.

| Criterion (1-5) | Destination Climate | Date utility |
|---|---:|---:|
| Repeatable user intent | 5 | 5 |
| Trustworthy/reusable source path | 4 | 5 |
| Natural page depth | 5 | 3 |
| International scalability | 5 | 5 |
| Differentiation / product moat | 4 | 2 |
| Build + maintenance efficiency | 3 | 5 |
| Ad / travel-commercial suitability | 5 | 3 |
| **Total** | **31/35** | **28/35** |

## Destination Climate evidence

Observed products validate the task rather than just article intent. WeatherAway offers destination/month discovery using climate data and states that its climate layer uses NOAA Integrated Surface Database and ERA5. TripCalc combines forecasts with 1991-2020 climate normals. MyTripNext exposes climate preferences across a large city catalogue. This supports a user task of choosing *where/when to travel* rather than merely reading a generic 'best time' article.

Source path is materially cleaner than Travel Power. NOAA Climate Data Online exposes historical climate data and 30-year Climate Normals, including temperature and precipitation. Copernicus documents ERA5 as a global atmospheric reanalysis from 1940 onward, with monthly products and ~31 km native resolution / 0.25-degree regular-grid availability. However, Copernicus explicitly warns that datasets may carry licences/reuse restrictions, so the exact chosen CDS product licence must be recorded before ingest.

### Natural query/product clusters
- best time to visit [destination]
- [destination] weather/climate by month
- where is warm/dry in [month]
- compare [destination A] vs [destination B] climate in [month]
- beach/outdoor climate filters by month

These should not become mass-generated pages initially. The product should earn expansion through GSC/usage evidence.

## Unrelated candidate: date-calculator suite

Observed SERPs contain mature dedicated tools: Timeanddate has add/subtract, duration, workday, weekday and week-number calculators; Calculator.net includes day counts plus configurable holidays; newer focused competitors such as CountDays and DateEstimator provide browser-local date difference/add-subtract/business-day tools. The task is universal, evergreen and source-free: Gregorian-calendar arithmetic can be deterministic client-side.

The weakness is differentiation. A basic date calculator is a commodity SERP with strong incumbents and many near-identical newer tools. It has less natural connection to World Discovery and weaker multi-page exploration than a destination-discovery product. Building it would be cheap, but cheap alone does not make it the highest expected revenue use of engineering time.

## Bounded Climate MVP

One utility route first, not a page factory:

`/travel/climate/`

Inputs:
- destination (small curated pilot catalogue, e.g. 20-30 globally distributed cities)
- month
- optional preference: warm / mild / cool; dry preference

Output:
- typical monthly mean/max/min temperature where supported by chosen source
- precipitation / wetness metric with an explicit definition
- simple suitability explanation based on transparent thresholds
- month-by-month destination profile
- source, normals/reference period, methodology and 'climate is not a forecast' disclosure
- links into existing country/data exploration where genuinely relevant

Do **not** initially publish 20-30 thin destination SEO pages. Keep results inside the useful tool. Add indexable destination/month landing pages only after GSC or usage evidence identifies demand and only when each page can provide substantial unique value.

## Data / provenance acceptance criteria

1. Select one exact NOAA or Copernicus/ERA5 product and record dataset name, reference period, variables, resolution/station mapping, update cadence and reuse/licence terms.
2. Every displayed metric must be reproducible from the recorded source and transformation.
3. Do not mix forecast and climatology semantics.
4. Validate at least five geographically diverse pilot cities against a second reputable reference; document discrepancies rather than silently averaging them.
5. Explicitly model missing data and coastal/elevation/grid limitations.
6. Keep scoring thresholds transparent and deterministic; avoid claims such as 'perfect weather'.
7. No runtime build until the exact dataset reuse terms are checked.

## Recommendation to CEO

Advance Destination Climate to a **source-contract + MVP-spec gate**. It beats the unrelated date utility because it combines strong repeatable intent, international scale, natural page depth and better fit with World Discovery, while retaining a credible NOAA/ERA5 data path. Keep the date suite as a low-cost fallback, not the next build.
