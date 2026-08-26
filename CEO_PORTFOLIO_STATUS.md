# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 15:31 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Aktueller `main`-HEAD ist `b86a680bec4a20d9d39f21d95a5bb3d066d97c87` (`Build Android APK from short Windows path`). Current-head APK Run #141 / `32973852703` testet exakt diesen SHA und ist aktuell **in_progress** auf dem Windows Self-hosted Runner. Checkout, Staging nach `C:\things-apk`, Node/Java/Android-SDK, Dependencies, Secret-/Config-Checks, Typecheck, Expo-Prebuild, Native-Cleanup und Gradle-Clean sind bereits gruen. `Build release APK` laeuft; Verify/Artifact-Upload stehen noch aus. Kein weiterer Android-Fix waehrend dieses Runs.
- **Things Root Cause #140:** Run #140 / `32969050107` auf `005210c1` scheiterte reproduzierbar in `expo-modules-core` bei `buildCMakeRelWithDebInfo[arm64-v8a]` mit `ninja: error: manifest 'build.ninja' still dirty after 100 tries`. Der Log zeigt den sehr langen Buildpfad unter `C:\Users\gunde\actions-runner\_work\asset-market-alpha\asset-market-alpha\mobile\node_modules\expo-modules-core\android\.cxx\...`. Der neue Head testet daher die neue Hypothese: Build aus kurzem Pfad `C:\things-apk` statt weitere Cache-/Timestamp-Retries.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Der verifizierte 182-country Internet-use-Snapshot ist im normalen Build. Regionalvergleich und Regional-Hub sind umgesetzt. Der separate Mobile-Smoke-Guard bleibt Worker-4-Hebel.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK. #141 laeuft aktuell auf dem echten `main`-HEAD. Bei Gruen Artifact verifizieren und direkt an Worker 2/Nutzer uebergeben; bei Rot nur den neuen konkreten Fehler aus #141 bearbeiten.
- **World Discovery:** Regionalvergleich/Regional-Hub sind der Nutzerwert-Hebel. Worker 4 konsolidiert separat den Mobile-Smoke-Performance-Guard.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Kein Blind-Retry.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Current-head Run #141 / `32973852703` auf `b86a680b` laeuft. Buildpfad wurde bewusst nach `C:\things-apk` verkuerzt. Alle Vorstufen bis Gradle-Clean sind gruen; `Build release APK` ist in_progress. Bis zum Ergebnis keine weitere Aenderung. Bei Gruen Artifact/SHA/Groesse verifizieren; bei Rot Logs lesen -> kleinster belegter Fix -> genau ein neuer Current-head Windows-self-hosted Build.

### CEO Worker 2 — Things release acceptance
Acceptance bleibt bis APK blockiert. Sobald #141 oder ein spaeterer Current-head Run ein echtes Artifact liefert, exakt dessen SHA binden und Installation, Persistenz sowie Konto-A/B/RLS-Abnahme uebernehmen.

### CEO Worker 3 — World Discovery user value
Regional-Hub bleibt eigener Website-Hebel. Keine parallele Aenderung am Things-APK-Workflow oder Worker-4-Mobile-Guard.

### CEO Worker 4 — Cross-project release guard
Mobile-Smoke-Guard bleibt separater Website-Hebel. Things #141 nur beobachten, nicht parallel am Android-Workflow aendern solange der Current-head Build laeuft.

## Groesster Blocker
Things: Abschluss des echten Current-head APK Run #141; Artifact ist bis Verify/Upload UNKNOWN.

## Naechste Prioritaet
Worker 1: #141 abschliessen lassen -> bei Gruen APK verifizieren/Handoff, bei Rot nur neue Log-Evidence bearbeiten. Keine weitere Hypothese solange `Build release APK` laeuft.

**Nutzeraktion:** Keine.
