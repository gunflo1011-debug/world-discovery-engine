# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 15:56 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Aktueller `main`-HEAD ist `b86a680bec4a20d9d39f21d95a5bb3d066d97c87` (`Build Android APK from short Windows path`). Current-head APK Run #141 / `32973852703` testet exakt diesen SHA und ist aktuell **in_progress** auf dem Windows Self-hosted Runner. Checkout, Staging nach `C:\things-apk`, Node/Java/Android-SDK, Dependencies, Secret-/Config-Checks, Typecheck, Expo-Prebuild, Native-Cleanup und Gradle-Clean sind bereits gruen. `Build release APK` laeuft; Verify/Artifact-Upload stehen noch aus. Kein weiterer Android-Fix waehrend dieses Runs.
- **Things Root Cause #140:** Run #140 / `32969050107` auf `005210c1` scheiterte reproduzierbar in `expo-modules-core` bei `buildCMakeRelWithDebInfo[arm64-v8a]` mit `ninja: error: manifest 'build.ninja' still dirty after 100 tries`. Der neue Head testet daher die Hypothese Build aus kurzem Pfad `C:\things-apk`.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Der verifizierte 182-country Internet-use-Snapshot ist im normalen Build. Regionalvergleich und Regional-Hub sind umgesetzt. Worker 3 hat den Hub nun zusaetzlich direkt aus dem Indicator Registry verlinkt (`43017fcbb3146bf9c38251096c61aabef53a853d`), statt nur auf einen Anker der grossen Laenderseite zu verweisen. CI/Pages fuer diesen Commit sind noch UNKNOWN. Der separate Mobile-Smoke-Guard bleibt Worker-4-Hebel.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK. #141 laeuft aktuell auf dem echten `main`-HEAD. Bei Gruen Artifact verifizieren und direkt an Worker 2/Nutzer uebergeben; bei Rot nur den neuen konkreten Fehler aus #141 bearbeiten.
- **World Discovery:** Regionalvergleich/Regional-Hub sind der Nutzerwert-Hebel. Neuer direkter Registry-Link zum Regional-Hub ist committed; Release-Evidence noch UNKNOWN. Worker 4 konsolidiert separat den Mobile-Smoke-Performance-Guard.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Kein Blind-Retry.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Current-head Run #141 / `32973852703` auf `b86a680b` laeuft. Buildpfad wurde bewusst nach `C:\things-apk` verkuerzt. Bis zum Ergebnis keine weitere Aenderung. Bei Gruen Artifact/SHA/Groesse verifizieren; bei Rot Logs lesen -> kleinster belegter Fix -> genau ein neuer Current-head Windows-self-hosted Build.

### CEO Worker 2 — Things release acceptance
Acceptance bleibt bis APK blockiert. Sobald #141 oder ein spaeterer Current-head Run ein echtes Artifact liefert, exakt dessen SHA binden und Installation, Persistenz sowie Konto-A/B/RLS-Abnahme uebernehmen.

### CEO Worker 3 — World Discovery user value
Regional-Hub bleibt eigener Website-Hebel. Direkter Einstieg vom Indicator Registry zum Regional-Hub wurde mit `43017fcbb3146bf9c38251096c61aabef53a853d` umgesetzt. Naechster Schritt: CI/Pages/Live fuer genau diesen Commit verifizieren; bei Rot nur konkrete Evidence bearbeiten. Keine parallele Aenderung am Things-APK-Workflow oder Worker-4-Mobile-Guard.

### CEO Worker 4 — Cross-project release guard
Mobile-Smoke-Guard bleibt separater Website-Hebel. Things #141 nur beobachten, nicht parallel am Android-Workflow aendern solange der Current-head Build laeuft.

## Groesster Blocker
Things: Abschluss des echten Current-head APK Run #141; Artifact ist bis Verify/Upload UNKNOWN.

## Naechste Prioritaet
Worker 1: #141 abschliessen lassen. Worker 3: Release-Evidence fuer den direkten Regional-Hub-Einstieg pruefen. Worker 4: separaten Mobile-Smoke-Guard konsolidieren.

**Nutzeraktion:** Keine.
