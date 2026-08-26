# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 13:55 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Aktueller `main`-HEAD ist `4978e7679b3d089509e8d9d127782bda7d9724f6`. Der vorherige Current-head Run #138 / `32962631930` auf `9c8f425a36739f7b3d76bd9449eba37a443a6476` ist rot. Seine vollstaendigen Logs sind jetzt ausgelesen: Typecheck, Expo-Prebuild, Native-Cleanup und Gradle-Clean sind gruen; `Build release APK` scheitert bei `:expo-modules-core:buildCMakeRelWithDebInfo[arm64-v8a]` mit `ninja: error: manifest 'build.ninja' still dirty after 100 tries`. Direkt davor erscheint reproduzierbar `[CXX5304]` wegen SDK-XML-v4 bei Parser-Unterstuetzung nur bis v3. Die im vorherigen Fix vorgesehene kompatible `cmdline-tools\8.0`-Installation war auf dem Laptop nicht vorhanden; Run #138 meldete deshalb explizit `No cmdline-tools 8.0 found; installed SDK remains unchanged.` Worker 1 hat den kleinsten belegten Fix committed: `4978e767` installiert `cmdline-tools;8.0` ueber das vorhandene `sdkmanager.bat`, erzwingt anschliessend dessen Verwendung und laesst erst dann den nativen Build laufen. Current-head Run #139 / `32963621482` testet exakt `4978e767...` auf Windows self-hosted und ist aktuell **in progress**. Artifact bleibt bis Erfolg UNKNOWN/0.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Der verifizierte 182-country Internet-use-Snapshot ist im normalen Build. Regionalvergleich wurde mit `faece991437ab77b41f3942c15649e97540a9042` in den regulaeren Buildpfad integriert. Worker 3 hat zusaetzlich einen echten Regional-Hub umgesetzt: `83b4dd5d` erzeugt `/indicators/internet-use/region/` als nutzbare Uebersicht mit allen Regionen, Summary-Werten und Links; `9ae1cee2` bindet diesen Hub in beide regulaeren Buildpfade ein. CI/Deployment fuer diesen neuen HEAD sind noch UNKNOWN. Der separate Mobile-Smoke-Guard bleibt Worker-4-Hebel.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK. #139 ist der einzige gueltige aktuelle Build und testet exakt `4978e767...`. Kein weiterer Retry/Codewechsel waehrend #139 laeuft. Bei Gruen Artifact verifizieren; bei Rot nur den neuen konkreten Fehler aus #139 bearbeiten.
- **World Discovery:** Regionalvergleich ist build-/deploy-seitig verifiziert. Neuer Regional-Hub `9ae1cee2` wartet auf CI/Pages-Evidence. Release-Guard bleibt separat bei Worker 4.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Kein Blind-Retry.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Run #138 Root Cause jetzt belegt: `expo-modules-core` CMake/Ninja bleibt dirty, waehrend gleichzeitig SDK-XML-v4 mit nur-v3-faehigem Parser gemeldet wird; der vorherige Toolchain-Fix war faktisch nicht aktiv, weil `cmdline-tools\8.0` fehlte. Fix `4978e767` installiert und erzwingt diese kompatible Toolchain. Run #139 / `32963621482` laeuft auf exakt diesem HEAD. Nichts weiter aendern, bis #139 abgeschlossen ist. Bei Gruen APK/Artifact/SHA/Groesse verifizieren; bei Rot nur neue Evidence bearbeiten.

### CEO Worker 2 — Things release acceptance
Acceptance bleibt bis APK blockiert. Sobald #139 oder ein spaeterer Current-head Run ein echtes Artifact liefert, exakt dessen SHA binden und Installation, Persistenz sowie Konto-A/B/RLS-Abnahme uebernehmen.

### CEO Worker 3 — World Discovery user value
Regional-Hub auf `9ae1cee2` umgesetzt und in regulaeren Build integriert. Naechster Schritt ausschliesslich CI/Pages/Live-Evidence auswerten; bei Rot nur konkreten Fehler beheben. Keine parallele Aenderung am Mobile-Smoke-Guard.

### CEO Worker 4 — Cross-project release guard
Separaten World-Discovery-Mobile-Smoke-Guard atomar konsolidieren; nicht in den laufenden Things-Build eingreifen.

## Groesster Blocker
Things: Ergebnis von Current-head APK Run #139 / `32963621482`. Artifact noch nicht belegt.

## Naechste Prioritaet
#139 abschliessen lassen -> bei Gruen APK-Artefakt verifizieren und Handoff an Worker 2/Nutzer; bei Rot exakte neue Fehlerzeile -> kleinster Fix -> genau ein neuer kostenloser Current-head Build. World Discovery parallel: `9ae1cee2` CI/Pages verifizieren.

**Nutzeraktion:** Keine.
