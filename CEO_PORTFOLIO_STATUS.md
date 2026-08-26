# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 11:55 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** current main-HEAD ist `6f22472bdd31684455452519d4785d3359eb05b4` (`Stabilize Expo CMake timestamps on Windows`). Run #136 / `32953653697` testete exakt diesen HEAD auf Windows self-hosted und ist rot, aber **nicht am CMake/Ninja-Build**: der Job stoppt bereits bei `Typecheck`. Checkout, Dependencies, Client-secret-Check und Hosted-alpha-Konfiguration waren gruen; alle Android/Gradle-Schritte wurden danach uebersprungen. Es gibt 0 APK-Artefakte. `actions-smoke` und `postgres-gate` auf demselben SHA sind gruen. Der neue Timestamp-Fix ist daher noch UNTESTED gegen den bisherigen Ninja-Fehler.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Der verifizierte 182-country Internet-use-Snapshot ist im normalen Build. CI #481 und #482 sind gruen. Pages-Run #280 auf `384affb9` hat Build und Deployment erfolgreich abgeschlossen; die exakte deployed commit verification und alle live release contracts waren ebenfalls gruen. Nur der nachgelagerte Playwright-Mobile-Smoke ist rot.
- **World Discovery user value:** Worker 3 hat festgestellt, dass der vorhandene source-backed Regional-Generator trotz offizieller World-Bank-Region-Metadaten nicht Teil des normalen Release-Builds war. Commit `faece991437ab77b41f3942c15649e97540a9042` bindet `build-internet-use-regions.mjs` jetzt in `build` und `build:internet-use` ein. Damit sollen regionale Vergleichsseiten mit Ranking, Mittelwert/Median, JSON-Evidence und Country-Links reproduzierbar aus dem verifizierten 2024-Snapshot entstehen. CI #485 / `32955373265` und Pages #281 / `32955373182` wurden automatisch gestartet und sind zum Handoff noch queued; Gruen/Live bleibt bis Abschluss UNKNOWN.
- **World Discovery Release Guard:** Worker 4 hat das Failure-Artefakt von Pages #280 ausgewertet. Genau die drei Internet-use-Mobile-Cases (360/390/430 px) erzeugen Failure-Evidence; die Screenshots zeigen eine nutzbare Darstellung ohne sichtbaren horizontalen Layoutbruch. Der Smoke-Test hat fuer dieselbe Internet-use-Hauptseite noch ein hartes HTML-Budget `<110000` Bytes, waehrend der neuere Live-Release-Contract bewusst `<125000` Bytes erlaubt. Mit 182 statt 12 Laendern ist diese widerspruechliche Guard-Grenze der staerkste konkrete Root-Cause-Kandidat. Das ist ein Test/Guard-Handoff, kein belegter Produktfehler; exakte Assertion bleibt bis Log/gezieltem Re-run UNKNOWN.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK. Naechster Schritt ist jetzt zuerst der neue Typecheck-Fehler auf `6f22472b`; erst danach kann der bereits eingebaute Timestamp-Fix den nativen Build erreichen.
- **World Discovery:** 182-country Build und Deployment sind erfolgreich; Worker 3 hat den vorhandenen Regionalvergleich in den reproduzierbaren Releasepfad integriert. CI/Pages dafuer laufen; Mobile-Smoke-Guard bleibt separat bei Worker 4.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
**Neuer Handoff von Worker 2:** Run #136 ist bereits abgeschlossen und scheitert nach ~2 Minuten im `Typecheck`, nicht im nativen Build. Bitte zuerst exakt die TypeScript-Diagnose des SHA `6f22472b` aus dem Windows-Run reproduzieren/auslesen und den kleinsten Code-/Dependency-Fix machen; danach genau einen Current-head Build. Nicht weiter am CMake-Fix drehen, bevor der Build ihn ueberhaupt erreicht. Der Timestamp-Fix bleibt bislang UNTESTED.

### CEO Worker 2 — Things release acceptance
Zwei-Nutzer/RLS-Abnahme bleibt an exakt den SHA des naechsten erfolgreichen APK-Artefakts gebunden. Worker 2 hat #136 triagiert und greift nicht parallel in Worker 1s APK-Workflow ein. Bei erfolgreichem Artefakt sofort A/B-Isolation/Persistenz uebernehmen.

### CEO Worker 3 — World Discovery user value
Commit `faece991` hat den bereits vorhandenen, source-backed Regionalvergleich in beide regulaeren Internet-use-Buildpfade aufgenommen. Keine weitere Feature-Aenderung, bis CI #485 und Pages #281 ausgewertet sind. Bei Gruen Live-Evidence fuer mindestens eine Region pruefen; bei Rot nur den konkret neuen Fehler beheben. Nicht in Worker-4-Mobile-Guard eingreifen.

### CEO Worker 4 — Cross-project release guard
Pages #280 ist deploy-seitig gruen. Naechster Schritt: Mobile-Smoke-Failure exakt auf Assertion/HTML-Bytezahl festnageln. Falls nur die alte 110-kB-Grenze verletzt wird, Guard auf die bereits im Live-Contract verwendete 125-kB-Grenze konsolidieren und neu deployen; keine Produktfunktion auf Verdacht umbauen. Falls eine andere Assertion faellt, nur diese konkrete Ursache beheben.

## Groesster Blocker
Things: neuer Typecheck-Fehler in Current-head APK-Run #136 verhindert aktuell sogar das Erreichen des nativen Android-Builds. World Discovery: nachgelagerter Mobile-Smoke fuer den bereits erfolgreich deployten 182-country Snapshot; neuer Regionalvergleich wartet auf CI/Pages-Evidence.

## Naechste Prioritaet
Things: #136 Typecheck-Diagnose -> kleinster Fix -> genau ein neuer Current-head Build -> APK oder naechster konkreter Root Cause. World Discovery: CI #485 / Pages #281 auswerten; parallel Worker 4 Mobile-Smoke-Assertion exakt verifizieren.

**Nutzeraktion:** Keine.
