# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 18:05 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** ERSTER INSTALLIERBARER APK-BUILD IST ERFOLGREICH. Current-head APK Run #141 / `32973852703` auf `b86a680bec4a20d9d39f21d95a5bb3d066d97c87` ist `completed/success`. Artifact `things-alpha-android-standalone` existiert real: Artifact-ID `9609396283`; enthalten ist `things-alpha.apk`, 62,429,526 Bytes, APK-SHA256 `c00d60a20215522218a7e2ec5e53b47dd5f7f4ea9a48ff94733586bf8f009076`.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist jetzt nur noch durch den echten Geraetetest begrenzt.
- **World Discovery:** Worker 3 hat CI #501 konkret gelesen. 78/80 Tests waren gruen; beide Fehler hatten dieselbe Ursache: der neue Registry-Link `./internet-use/region/` zeigte auf einen Hub, dessen `index.html` bei wiederholten `buildSite()`-Aufrufen im Testprozess nicht verlaesslich regeneriert wurde. Fixes `b87d4249` + `e45d3437`: Region-Directory ist nun als Funktion aufrufbar und wird in jedem `buildSite()` regeneriert; der Hub ist zudem explizite statische Route. Worker 3 meldet die nachfolgenden CI-Laeufe weiterhin rot; konkrete Rest-Assertion noch zu triagieren.
- **World Discovery Mobile Guard:** Worker 4 hat die veraltete `<110_000`-Assertion auf den bereits geltenden `<125_000`-Contract angehoben. Commit `0b37f81fcb4f1036a99bc0bb30d5508b1685d490`. Alle anderen Mobile-Checks bleiben erhalten. Neue CI-Evidence ist noch UNKNOWN.

## 50:50-Leitplanke
Things hat den ersten grossen Release-Meilenstein erreicht. Jetzt verschiebt sich Things von Build-Reparatur zu echter Produkt-/Privacy-Acceptance; World Discovery bleibt parallel auf Release-Qualitaet und Nutzerwert.

## Daily Release
- **Things:** Ziel heute erreicht: real erzeugtes Android-Artefakt. Naechster Schritt echter Geraetetest.
- **World Discovery:** Regional-Hub/Registry-Link ist umgesetzt; Mobile-Performance-Guard ist auf den gueltigen 125-kB-Vertrag konsolidiert. CI/Pages muss noch gruen bestaetigt werden.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen heute: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things APK abgeschlossen / Release-Handoff
APK Run #141 ist gruen. Kein weiterer Android-Buildfix noetig. Buildpfad stabil halten und Worker 2 bei Acceptance nur bei konkretem Fehler unterstuetzen.

### CEO Worker 2 — Things release acceptance
Installationskandidat ist verifiziert. Naechster notwendiger Schritt: echter Android-Geraetetest mit Start/Login, Persistenz, Konto A/B und RLS-Isolation.

### CEO Worker 3 — World Discovery user value / CI-Triage
CI-Root-Cause aus #501 wurde mit `b87d4249` + `e45d3437` adressiert; nachfolgende CI blieb rot. Naechster Schritt: konkrete Rest-Assertion aus dem aktuellen CI-Joblog lesen und nur diesen Fehler beheben. Worker 4 hat den separaten Mobile-Budget-Guard bereits erledigt.

### CEO Worker 4 — Cross-project release guard
Mobile-Smoke-Guard konsolidiert: `<110_000` -> `<125_000` in Commit `0b37f81f`. Keine Abschwaechung anderer Checks. Naechster Schritt: CI/Pages fuer den aktuellen Head verifizieren; bei Gruen abgeschlossen, bei Rot nur konkrete neue Evidence bearbeiten und Doppelarbeit mit Worker 3 vermeiden.

## Groesster Blocker
Things: echter Installation/Acceptance-Test auf Android. World Discovery: CI/Pages noch nicht gruen bestaetigt; konkrete Restfehler-Evidence hat Vorrang vor weiteren Aenderungen.

## Naechste Prioritaet
Worker 2: APK-Geraetetest. Worker 3: konkreten aktuellen CI-Restfehler triagieren. Worker 4: CI/Pages fuer Mobile-Guard verifizieren und nur bei eindeutigem komplementaerem Fehler eingreifen.

**Nutzeraktion:** `things-alpha.apk` installieren und den ersten echten Start testen; danach Persistenz und Konto-A/B/RLS abnehmen.
