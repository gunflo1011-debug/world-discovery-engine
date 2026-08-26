# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 09:39 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** aktueller `main`-Head ist `891694a6` (`Allow current-head APK build via workflow push trigger`). Parent ist `856fcdfe`; der neue Commit aendert nur die APK-Orchestrierung, keine App-Features.
- **APK:** `.github/workflows/android-alpha-apk.yml` kann neben `workflow_dispatch` auch einen begrenzten `push` auf Workflow-Datei bzw. `.github/apk-build-request` als Build-Trigger verwenden. Windows Self-hosted bleibt der Runner.
- **Current-head Evidence:** `android-alpha-apk` Run `32943112816` / #134 auf exakt `891694a6535561a73451783054ae2858839ac82e` ist **FAILURE**. Checkout, Dependencies, Client-Secret-Check, Alpha-Config, Typecheck, Expo prebuild und Native-Cleanup waren gruen. Der erste Fehler ist bereits im Schritt `Clean Gradle build`, noch vor `assembleRelease`: Gradle meldet `Task '.gradle.vfs.watch=false' not found`. Die PowerShell-Zeile uebergibt `-Dorg.gradle.vfs.watch=false` damit nicht korrekt als Gradle-Systemproperty. Das ist ein neuer, konkreter Workflow-Argument-Fehler und nicht der alte Ninja-Manifest-Fehler.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** heutiger Website-Release ist bereits belegt und release-safe; Website-Lane kann source-backed Nutzerwert weiterbauen.

## 50:50-Leitplanke
- Things bekommt kurzfristig mehr Kapazitaet, bis der kleine Workflow-Argument-Fix einen neuen Current-head APK-Build ermoeglicht.
- World Discovery hat heute bereits einen belegten Live-Release; mindestens ein Worker bleibt auf einem source-backed Nutzerwert-Hebel.

## Daily Release
- **Things:** Ziel heute: installierbare APK. Run #134 lieferte einen kleinen, klar abgegrenzten Workflow-Root-Cause statt eines App-Codefehlers.
- **World Discovery:** heutiger Release ist bereits belegt; naechster Release nur bei substanziellem Nutzer-/Google-Wert.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung **0 EUR GitHub-Runnerkosten**.
- Sicher belegte bezahlte Aktionen heute: **0 EUR**.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: **1 EUR**. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Run #134 ist rot. Root Cause aus Worker-2-Evidence: `Clean Gradle build` interpretiert `-Dorg.gradle.vfs.watch=false` unter PowerShell falsch und Gradle sucht deshalb eine Task `.gradle.vfs.watch=false`. Kleinster Fix: die Systemproperty so quoten/uebergeben, dass sie als ein Gradle-Argument ankommt; dieselbe Stelle auch in beiden `assembleRelease`-Aufrufen korrigieren. Danach kostenlose Checks und genau ein neuer Current-Head-Build. Keine Ninja-/CMake-Spekulation vor neuer Evidence.

### CEO Worker 2 — Things release acceptance
Zwei-Nutzer/RLS-Abnahme bleibt an exakt den SHA des naechsten erfolgreichen APK-Artefakts gebunden. Worker 2 hat Run #134 bis zum ersten Fehler ausgewertet und den konkreten Root Cause an Worker 1 uebergeben; keine Doppelarbeit am Workflow-Fix.

### CEO Worker 3 — World Discovery user value
Nach dem verifizierten 182-country Release genau einen source-backed, user-visible Hebel liefern. Keine Thin-URL-Masse; Life expectancy bleibt SCREENING ohne vergleichbare Source-Evidence.

### CEO Worker 4 — Cross-project release guard
Keine Doppelarbeit an der nativen Diagnose, solange Worker 1 den APK-Fix besitzt. Nutze freie Kapazitaet fuer komplementaere Release-/Website-Qualitaet.

## Groesster Blocker
**Run #134 scheitert an einem kleinen PowerShell/Gradle-Argumentfehler im Workflow**, bevor der eigentliche Release-Build beginnt. Der alte Ninja-Manifest-Fehler ist auf aktuellem Head dadurch noch nicht erneut getestet.

## Naechste Prioritaet
Things: Worker 1 korrigiert die drei Gradle-Aufrufe -> neuer Current-head Build -> APK oder naechster konkreter Root Cause -> bei APK sofort Handoff an Worker 2 / Smartphone-Test. World Discovery parallel nur source-backed Nutzerwert.

**Nutzeraktion:** Keine.
