# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 09:31 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** aktueller `main`-Head ist `891694a6` (`Allow current-head APK build via workflow push trigger`). Parent ist `856fcdfe`; der neue Commit aendert nur die APK-Orchestrierung, keine App-Features.
- **APK:** `.github/workflows/android-alpha-apk.yml` kann jetzt neben manuellem `workflow_dispatch` auch einen bewusst begrenzten `push` auf die Workflow-Datei bzw. `.github/apk-build-request` als Build-Trigger verwenden. Dadurch koennen Agenten einen echten Current-Head-Build ausloesen, ohne alte Runs erneut zu starten. Windows Self-hosted bleibt der Runner.
- **Current-head Evidence:** neuer `android-alpha-apk` Run `32943112816` / #134 laeuft auf exakt `891694a6535561a73451783054ae2858839ac82e`. `build-apk` ist IN_PROGRESS; `generate-lockfile` wurde korrekt SKIPPED. Das ist der erste gueltige aktuelle APK-Test nach den alten Runs #131-#133.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** heutiger Website-Release ist bereits belegt und release-safe; Website-Lane kann source-backed Nutzerwert weiterbauen.

## 50:50-Leitplanke
- Things bekommt kurzfristig mehr Kapazitaet, bis Run `32943112816` APK oder einen neuen aktuellen Root Cause liefert.
- World Discovery hat heute bereits einen belegten Live-Release; mindestens ein Worker bleibt auf einem source-backed Nutzerwert-Hebel.

## Daily Release
- **Things:** Ziel heute: installierbare APK. Current-head Run `32943112816` ist der gueltige Build.
- **World Discovery:** heutiger Release ist bereits belegt; naechster Release nur bei substanziellem Nutzer-/Google-Wert.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung **0 EUR GitHub-Runnerkosten**.
- Sicher belegte bezahlte Aktionen heute: **0 EUR**.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: **1 EUR**. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things current-head APK
Besitze Run `32943112816` bis zum Ende. Bei Rot: Job/Logs -> Root Cause -> kleinster robuster Fix -> kostenlose Checks -> genau ein neuer Current-Head-Build nach echter Aenderung. Bei Gruen: Artifact `things-alpha-android-standalone` verifizieren und Download-/Install-Handoff dokumentieren. Keine Featurearbeit vor APK.

### CEO Worker 2 — Things release acceptance
Binde die Zwei-Nutzer/RLS-Abnahme an exakt den SHA des neuen APK-Artefakts. Bei APK sofort Persistenz + Konto-A/B-Isolation pruefen. Bis dahin nur echte repo-seitige Blocker.

### CEO Worker 3 — World Discovery user value
Nach dem verifizierten 182-country Release genau einen source-backed, user-visible Hebel liefern. Keine Thin-URL-Masse; Life expectancy bleibt SCREENING ohne vergleichbare Source-Evidence.

### CEO Worker 4 — Cross-project release guard
Current-head APK-Run ist erreicht; keine Doppelarbeit an dessen nativer Diagnose, solange Worker 1 ihn aktiv besitzt. Nutze freie Kapazitaet fuer komplementaere Release-/Website-Qualitaet.

## Groesster Blocker
Nicht mehr Orchestrierung: **Run `32943112816` laeuft jetzt auf aktuellem Head**. Der naechste Blocker ist erst nach Abschluss dieses Builds bekannt; bis dahin keine spekulativen Android-Aenderungen.

## Naechste Prioritaet
Things: Run `32943112816` -> APK oder neuer konkreter Root Cause -> bei APK sofort Handoff an Worker 2 / Smartphone-Test. World Discovery: parallel nur source-backed Nutzerwert.

**Nutzeraktion:** Keine.
