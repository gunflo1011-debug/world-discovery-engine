# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 08:18 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** aktueller `main`-Head ist `856fcdfe` (`Fix mobile inventory RPC pgTAP type resolution`). `actions-smoke` Run `32911668376` und `backend-security-gate` Run `32911668351` sind SUCCESS.
- **APK:** Workflow `.github/workflows/android-alpha-apk.yml` ist `workflow_dispatch` und laeuft auf `[self-hosted, Windows, X64]`. Er nutzt seit `8ab5a756` das installierte Android SDK und enthaelt Lockfile -> npm ci -> Secret/Config -> Typecheck -> Expo prebuild -> Clean -> Gradle assembleRelease -> APK verify/upload.
- **Wichtige Evidence-Luecke:** der letzte belegte `android-alpha-apk` Run `32908189831` lief trotz spaeterer Re-Runs weiterhin auf dem alten SHA `b4dbdb4c`; ein Re-Run kann den neuen Head nicht validieren. Fuer `856fcdfe` ist noch kein APK-Artefakt belegt.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** `a4501465` und `9eebbb26` ersetzen stale launch-slice Claims durch den verifizierten 2024-Snapshot mit 182 non-aggregate countries. Worker 4 hat den Stand release-safe verifiziert; Pages `32935755529` war SUCCESS inkl. Live contracts/mobile smoke.

## 50:50-Leitplanke
- Things bekommt kurzfristig mehr Kapazitaet, bis ein **neuer** APK-Dispatch auf `856fcdfe` oder neuer laeuft.
- World Discovery hat heute bereits einen belegten Live-Release; mindestens ein Worker bleibt auf einem source-backed Nutzerwert-Hebel.

## Daily Release
- **Things:** Ziel heute: installierbare APK. Naechster gueltiger Test muss ein neuer Workflow-Dispatch auf aktuellem `main` sein; alte Run-Re-Runs nicht mehr verwenden.
- **World Discovery:** heutiger Release ist bereits belegt; naechster Release nur bei substanziellem Nutzer-/Google-Wert.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung **0 EUR GitHub-Runnerkosten**.
- Sicher belegte bezahlte Aktionen heute: **0 EUR**.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: **1 EUR**. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK dispatch
Starte/ermittle einen **neuen** `android-alpha-apk` workflow_dispatch auf aktuellem `main` (`856fcdfe` oder neuer), nicht Re-Run `32908189831`. DoD: APK-Artefakt oder exakter neuer Root Cause auf dem aktuellen SHA. Keine unveraenderten Retries.

### CEO Worker 2 — Things release acceptance
Binde die Zwei-Nutzer/RLS-Abnahme an exakt den SHA des neuen APK-Artefakts. Bei APK sofort Persistenz + Konto-A/B-Isolation pruefen. Bis dahin nur echte repo-seitige Blocker.

### CEO Worker 3 — World Discovery user value
Nach dem verifizierten 182-country Release genau einen source-backed, user-visible Hebel liefern. Keine Thin-URL-Masse; Life expectancy bleibt SCREENING ohne vergleichbare Source-Evidence.

### CEO Worker 4 — Cross-project release guard
Pruefe, ob Worker 1 einen current-head APK-Run erreicht. Falls nicht und keine Doppelarbeit entsteht, uebernimm genau diesen Dispatch-/Workflow-Hebel. Falls APK bereits laeuft, sichere World-Discovery-Live-Qualitaet bzw. einen komplementaeren source-backed Hebel.

## Groesster Blocker
Nicht mehr ein bekannter CMake-Fehler, sondern die **fehlende current-head Build-Evidence**: der aktuelle Things-Code `856fcdfe` wurde noch nicht durch einen neuen `android-alpha-apk` Dispatch validiert. Alte Re-Runs bleiben auf `b4dbdb4c` und duerfen nicht als aktueller Test gelten.

## Naechste Prioritaet
Things: neuen Self-hosted `android-alpha-apk` Dispatch auf aktuellem `main` -> APK oder neuer Root Cause -> bei APK sofort Smartphone-/Zwei-Nutzer-Test. World Discovery: nach bereits belegtem Release nur source-backed Nutzerwert weiterbauen.

**Nutzeraktion:** Keine.
