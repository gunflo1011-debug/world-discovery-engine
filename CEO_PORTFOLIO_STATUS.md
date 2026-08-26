# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 14:33 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Aktueller `main`-HEAD ist `005210c16fff0d5e526cdbbf2b6ed04c14a315e9`. Current-head Run #139 / `32963621482` auf `4978e7679b3d089509e8d9d127782bda7d9724f6` ist abgeschlossen und rot. Der Versuch hat `cmdline-tools;8.0` erfolgreich installiert und verwendet, aber der `[CXX5304]` SDK-XML-v4/v3-Warnhinweis blieb unveraendert. Danach scheiterte `:expo-modules-core:buildCMakeRelWithDebInfo[arm64-v8a]` erneut mit `ninja: error: manifest 'build.ninja' still dirty after 100 tries`; CMake regenerierte dasselbe Manifest wiederholt. Damit ist die cmdline-tools-Hypothese widerlegt. Worker 1 hat den kleinsten neuen Fix committed: `005210c1` entfernt den wirkungslosen cmdline-tools-8.0-Workaround und normalisiert vor CMake die Timestamps der echten `expo-modules-core/android`-Quellinputs auf einen stabilen Zeitpunkt in der Vergangenheit; generierte `.cxx`/`build`-Verzeichnisse bleiben ausgeschlossen und werden danach wie bisher geloescht. Current-head Run #140 / `32969050107` testet exakt `005210c1...` auf Windows self-hosted und ist aktuell **in progress**. `actions-smoke` auf demselben SHA ist bereits gruen. Artifact bleibt bis Erfolg UNKNOWN/0.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Der verifizierte 182-country Internet-use-Snapshot ist im normalen Build. Regionalvergleich wurde mit `faece991437ab77b41f3942c15649e97540a9042` in den regulaeren Buildpfad integriert. Worker 3 hat zusaetzlich einen echten Regional-Hub umgesetzt: `83b4dd5d` erzeugt `/indicators/internet-use/region/` als nutzbare Uebersicht mit allen Regionen, Summary-Werten und Links; `9ae1cee2` bindet diesen Hub in beide regulaeren Buildpfade ein. Der separate Mobile-Smoke-Guard bleibt Worker-4-Hebel.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK. #140 ist der einzige gueltige aktuelle Build und testet exakt `005210c1...`. Kein weiterer Retry/Codewechsel waehrend #140 laeuft. Bei Gruen Artifact verifizieren; bei Rot nur den neuen konkreten Fehler aus #140 bearbeiten.
- **World Discovery:** Regionalvergleich ist build-/deploy-seitig verifiziert. Regional-Hub bleibt separater Website-Hebel; Release-Guard bleibt Worker 4.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Kein Blind-Retry.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Run #139 widerlegt die cmdline-tools-Hypothese: Installation von 8.0 war erfolgreich, Warnung und Ninja-Dirty-Manifest blieben. Fix `005210c1` adressiert nun den belegten wiederholten CMake-Regenerationszustand ueber stabile Expo-Native-Input-Timestamps. Run #140 / `32969050107` laeuft auf exakt diesem HEAD. Nichts weiter aendern, bis #140 abgeschlossen ist. Bei Gruen APK/Artifact/SHA/Groesse verifizieren; bei Rot nur neue Evidence bearbeiten.

### CEO Worker 2 — Things release acceptance
Acceptance bleibt bis APK blockiert. Sobald #140 oder ein spaeterer Current-head Run ein echtes Artifact liefert, exakt dessen SHA binden und Installation, Persistenz sowie Konto-A/B/RLS-Abnahme uebernehmen.

### CEO Worker 3 — World Discovery user value
Regional-Hub bleibt eigener Website-Hebel. Keine parallele Aenderung am Things-APK-Workflow.

### CEO Worker 4 — Cross-project release guard
Separaten World-Discovery-Mobile-Smoke-Guard atomar konsolidieren; nicht in den laufenden Things-Build eingreifen.

## Groesster Blocker
Things: Ergebnis von Current-head APK Run #140 / `32969050107`. Artifact noch nicht belegt.

## Naechste Prioritaet
#140 abschliessen lassen -> bei Gruen APK-Artefakt verifizieren und Handoff an Worker 2/Nutzer; bei Rot exakte neue Fehlerzeile -> kleinster Fix -> genau ein neuer kostenloser Current-head Build.

**Nutzeraktion:** Keine.
