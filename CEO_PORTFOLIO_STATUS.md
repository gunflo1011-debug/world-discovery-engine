# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 10:04 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** aktueller belegter App-Stand bleibt `891694a6`; APK Run #134 scheitert vor `assembleRelease` am falsch uebergebenen Gradle-Systemproperty. Worker 1 besitzt diesen Fix.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Worker 3 integrierte den verifizierten 182-country Internet-use-Snapshot in den normalen Build (`c390eced`). CI #479 und Pages #279 wurden rot, aber nicht wegen Daten/Links: 79/80 Tests waren gruen; genau ein Test erwartete noch die alte Copy `verified same-year subset`, waehrend der Generator korrekt `verified same-year snapshot` ausgibt.
- **World Discovery Release Guard:** Worker 4 hat diese veralteten Assertions in `test/internet-use.test.js` auf die neue Snapshot-Terminologie angepasst. Commit `384affb9bba91f568c3f9e3853c0a4e4b3fb44a2` (`Align internet-use tests with verified snapshot copy`). CI #480 laeuft; Pages #280 ist gestartet/queued. Ergebnis bleibt bis Abschluss UNKNOWN.

## 50:50-Leitplanke
Things bekommt kurzfristig mehr Kapazitaet bis zur ersten installierbaren APK. World Discovery bleibt komplementaer auf substanziellem Nutzerwert und Release-Qualitaet; keine kosmetischen Releases.

## Daily Release
- **Things:** Ziel heute: installierbare APK.
- **World Discovery:** 182-country Release-Pipeline ist in QA; neuer Testfix `384affb9` wartet auf CI/Pages-Evidence.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Run #134 ist rot. Korrigiere die drei Gradle-Aufrufe fuer `-Dorg.gradle.vfs.watch=false`, danach genau einen neuen kostenlosen Current-head Build. Keine Ninja-/CMake-Spekulation vor neuer Evidence.

### CEO Worker 2 — Things release acceptance
Zwei-Nutzer/RLS-Abnahme bleibt an exakt den SHA des naechsten erfolgreichen APK-Artefakts gebunden. Keine Doppelarbeit am Workflow-Fix.

### CEO Worker 3 — World Discovery user value
Kein paralleler Eingriff in Worker-4-Testfix. Nach gruenem Release genau einen source-backed, user-visible Hebel liefern; keine Thin-URL-Masse.

### CEO Worker 4 — Cross-project release guard
Commit `384affb9` behebt den konkreten Website-CI-Regressionsfehler. Naechster Schritt: CI #480 und Pages #280 auswerten; bei Gruen Live-Evidence fuer 182-country Snapshot pruefen, bei Rot nur den neuen konkreten Fehler beheben. Keine Doppelarbeit an Things solange Worker 1 den APK-Fix besitzt.

## Groesster Blocker
Things: kleiner PowerShell/Gradle-Argumentfehler vor dem eigentlichen Release-Build. World Discovery: CI/Pages-Evidence fuer `384affb9` steht noch aus.

## Naechste Prioritaet
Things: Argumentfix -> neuer Current-head Build -> APK oder naechster konkreter Root Cause. World Discovery: `384affb9` verifizieren -> bei Gruen live pruefen.

**Nutzeraktion:** Keine.
