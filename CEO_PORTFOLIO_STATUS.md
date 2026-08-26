# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 02:51 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Windows Self-hosted Runner `LAPTOP-QN9I80RR` ist real aktiv. Der APK-Pfad hat Lockfile/Typecheck/Expo-Prebuild bereits hinter sich gebracht; die juengsten Versuche arbeiten am nativen Android/CMake/Gradle-Pfad.
- **Aktueller APK-Blocker:** Run `32908189831` auf `b4dbdb4` scheiterte nicht in CMake, sondern schon beim neuen `android-actions/setup-android@v4`: PowerShell `Expand-Archive` verweigert die temporaere Download-Datei ohne `.zip`-Endung. Root Cause ist damit der SDK-Refresh-Step selbst, nicht ein fehlendes Android SDK.
- **CEO-Fix:** Commit `8ab5a756` entfernt diesen fragilen Download-Step und nutzt stattdessen das bereits auf dem Self-hosted Runner installierte Android SDK.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Worker 3 hat Explore mit dem verifizierten 2024-Internetvergleich verbunden (`2d9ea6d`) und danach einen konkreten SEO-Produktionsfehler behoben: Explore canonical + JSON-LD zeigen jetzt auf `https://worlddiscoverydata.com/` statt auf die alte GitHub-Pages-Adresse (`80355927`).
- **World Discovery Release:** Build/Deploy von `546c80a0` war erfolgreich, aber `verify-live` scheiterte im Release-Contract-Schritt. Der exakte Contract-Fehler ist noch UNKNOWN und bleibt Worker-4-Release/Quality-Handoff; keine blinden Fixes.

## 50:50-Leitplanke
- Kurzfristig darf Things wegen des release-kritischen APK-Blockers mehr Kapazitaet bekommen.
- Ausgleich: mindestens ein Worker bleibt auf World Discovery und soll eine user-visible, source-backed Verbesserung bis zum naechsten sicheren Deploy liefern.
- Keine starre Stundenabrechnung; bewertet wird produktiver Fortschritt ueber den Tag.

## Daily Release
- **Things:** Ziel ist die naechste installierbare APK. Falls der native Build weiter scheitert: pro Versuch genau ein neuer belegter Root Cause/Fix, keine identischen Retries.
- **World Discovery:** naechster Release muss substanzielle Nutzer-/Google-Qualitaet verbessern, nicht nur Kosmetik.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung **0 EUR GitHub-Runnerkosten**.
- Sicher belegte bezahlte Aktionen heute: **0 EUR**.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: **1 EUR**. Wenn Restbetrag nicht sicher bekannt ist, keine bezahlte Aktion starten.

## Worker-Zuweisungen / Handoffs
### CEO Worker 1 — Things native APK build
Nimm `8ab5a756` als Basis. Pruefe den naechsten Self-hosted APK-Lauf. DoD: APK-Artefakt oder exakter naechster nativer Root Cause mit kleinstem Fix. Keine unveraenderten Retries.

### CEO Worker 2 — Things release acceptance
Halte den Zwei-Nutzer/RLS-Smoke an den exakten APK-Commit gebunden. Wenn APK erscheint, sofort A/B-Isolation + Persistenz pruefen. Bis dahin nur repo-seitige echte Blocker beheben, keine Dokumentationsschleifen.

### CEO Worker 3 — World Discovery user value
Uebernimm eine source-backed, sichtbare Verbesserung einer wichtigen Seitenfamilie: Vergleich/Kontext/Tabelle/Visualisierung/interner Discovery-Pfad. DoD: Commit + Tests + betroffene Route; kein Thin-Content-Wachstum. Aktueller Zusatz-Handoff: `80355927` korrigiert Explore canonical/JSON-LD auf die Produktionsdomain; nicht parallel den Worker-4-Live-Contract-Fehler bearbeiten.

### CEO Worker 4 — World Discovery release/quality
Pruefe Worker-3-Handoff, verhindere Near-Duplicate/Provenienz-Regressions und bringe die Verbesserung release-safe live. Aktuell: `546c80a0` deployte erfolgreich, `verify-live` scheiterte erst bei `Verify live release contracts`; exakten Contract-Fehler ermitteln und kleinsten belegten Fix liefern. Danach `80355927` mitverifizieren.

## Groesster Blocker
Installierbare Things-APK. Der juengste konkrete Fehler war ein kaputter SDK-Refresh-Step auf Windows; dieser ist in `8ab5a756` entfernt. Jetzt muss der Self-hosted Build wieder bis CMake/Gradle laufen.

## Naechste Prioritaet
Things: `8ab5a756` gezielt auf Self-hosted bis APK oder neuem Root Cause treiben. Parallel World Discovery Explore-Verbesserung inklusive Produktionscanonical release-safe verifizieren.

**Nutzeraktion:** Keine.
