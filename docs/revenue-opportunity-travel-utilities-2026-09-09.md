# Revenue opportunity validation — travel utilities

_Date: 2026-09-09 · Owner: Worker 2_

## Decision
**HOLD Travel Power runtime build.** Demand/product fit remains attractive, but the source-provenance gate is not yet clean enough for a five-country production dataset. Authoritative public pages can verify several electrical facts, but this run did not establish a single clearly reusable/open source for plug-type + nominal-voltage + frequency coverage across US, UK, Germany, Japan and Australia. Do not copy IEC/competitor tables.

## Provenance findings
- **US voltage/frequency:** U.S. Department of Energy `Electricity 101` states 110–120 V / 60 Hz and explains standard 120 V plugs. Federal-government factual material is a strong primary verification path, but plug-type taxonomy still needs explicit reusable provenance.
- **Japan:** Embassy of Japan / JNTO pages explicitly state 100 V AC, 50 Hz in eastern Japan and 60 Hz in western Japan; Embassy material also describes generally used two-flat-pin plugs. This confirms that frequency must be modeled as regional, not a single scalar.
- **Australia:** Australian Department of Defence public handbook states 230 V / 50 Hz and describes Australian sockets as two diagonal flat pins, optionally a third earth pin. This is strong factual verification, but a reusable bulk-data license was not established.
- **Europe/Germany:** EU material supports the 230 V / 50 Hz European baseline, but this run did not find a sufficiently explicit Germany-specific, openly licensed plug-type record to clear the complete pilot schema.
- **UK:** no sufficiently explicit authoritative/open plug-type + voltage/frequency source was verified in this bounded pass.

These sources are suitable for cross-checking facts; they do **not** by themselves establish permission to assemble and republish a systematic five-country plug database. Therefore the CEO's legal/reuse gate is not cleared.

## Safety/data model learned from the check
A future schema must support arrays/ranges and notes rather than one forced value:

```text
country_code
nominal_voltage_v[]
frequency_hz[]
frequency_regions[] { region, hz }
plug_types[]
source_records[] { field, publisher, url, checked_at, reuse_basis }
notes[]
```

Compatibility output must separate **physical plug fit** from **voltage compatibility**. Never infer device safety from country voltage. The UI must tell users to read the device input label and explain adapter vs voltage converter/transformer.

## Build acceptance criteria if provenance later clears
1. One canonical `/travel/power/` hub; origin/destination query state canonicalizes to the hub initially.
2. Five-country dataset only; no generated route-page explosion.
3. Every displayed electrical field has a source record and documented reuse basis.
4. Regional exceptions render explicitly (Japan 50/60 Hz is the regression fixture).
5. Core result is server-rendered/non-JS accessible, mobile-first and source-visible.
6. No absolute safety guarantee; device-label check is prominent.
7. Scale/index route pages only after GSC and usage evidence.

## Opportunity scorecard
Directional only; no keyword-volume claims.

| Candidate | Demand signal | Competition/rankability | Source quality/path | Build effort | International scale | Page-depth | Ad suitability | Total /35 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Travel Power | 4 | 4 | 2 | 4 | 5 | 5 | 4 | **28** |
| Destination Climate / best-time planner | 4 | 3 | 5 | 2 | 5 | 5 | 4 | **28** |
| Calling codes + time difference | 4 | 3 | 4 | 4 | 5 | 4 | 3 | **27** |

Travel Power's source score is reduced from 3→2 because the five-country reuse gate failed. It remains attractive, but no longer deserves implementation priority merely because it is cheap.

## Replacement direction
**Destination Climate now deserves the next validation pass.** Its ingestion/UX cost is higher, but NOAA/ERA5 provide a materially cleaner authoritative-data path and the product can support richer destination exploration and page depth. The next comparison should benchmark it against a completely different non-data utility vertical before committing engineering effort.

## CEO recommendation
Do **not** build Travel Power runtime UI yet. Keep the schema/acceptance criteria above ready, but shift Worker 2 research to Destination Climate plus one unrelated evergreen utility. Re-open Travel Power only when a clearly reusable/open plug taxonomy and country electrical dataset (or explicit per-source reuse basis for the pilot) is documented.