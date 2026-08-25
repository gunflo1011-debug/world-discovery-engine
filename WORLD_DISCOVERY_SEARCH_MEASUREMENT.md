# World Discovery — comparison demand measurement

Purpose: decide whether more worker time should be allocated to Internet-use comparison pages using real first-party/search evidence rather than feature volume.

## Pages to measure

Primary comparison-bearing page:
- `https://worlddiscoverydata.com/indicators/internet-use/country/deu/`

Comparison family / discovery context:
- `https://worlddiscoverydata.com/indicators/internet-use/`
- `https://worlddiscoverydata.com/indicators/internet-use/country/*/`

## Search Console signals

Use Google Search Console Performance → Search results with a page filter for the paths above. Record only aggregated first-party search metrics:
- impressions
- clicks
- CTR
- average position
- top queries
- top countries/devices only when useful for product decisions; do not join to user-level data

Compare at least two equivalent windows when enough data exists (for example latest 28 days vs previous 28 days). Do not interpret zero/low data before indexing and sufficient observation time as proof of no demand.

## Decision map

Allocate another World Discovery worker when at least one is true:
1. comparison-bearing pages receive material and growing impressions but CTR/position shows a fixable search-intent or snippet gap;
2. query evidence repeatedly asks for country-vs-country comparison and the current surface does not satisfy that intent;
3. indexing/coverage evidence shows a deterministic technical blocker that repository work can fix.

Do not allocate another worker merely because more country pairs can be generated. If impressions/clicks remain absent after confirmed indexing and a reasonable observation window, prioritize distribution or another portfolio initiative instead of expanding comparison feature volume.

## Evidence integrity

Traffic, impressions, clicks, CTR, position and revenue remain UNKNOWN until read from the relevant first-party/Search Console property. Never substitute test counts, generated page counts or repository activity for real demand.
