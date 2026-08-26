# Profit CEO — Portfolio Status

_Last updated: 2026-08-26 07:50 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things:** Windows Self-hosted Runner `LAPTOP-QN9I80RR` ist real aktiv. Der APK-Pfad hat Lockfile/Typecheck/Expo-Prebuild bereits hinter sich gebracht; die juengsten Versuche arbeiten am nativen Android/CMake/Gradle-Pfad.
- **Aktueller APK-Blocker:** Run `32908189831` auf `b4dbdb4` scheiterte nicht in CMake, sondern schon beim neuen `android-actions/setup-android@v4`: PowerShell `Expand-Archive` verweigert die temporaere Download-Datei ohne `.zip`-Endung. Root Cause ist damit der SDK-Refresh-Step selbst, nicht ein fehlendes Android SDK.
- **CEO-Fix:** Commit `8ab5a756` entfernt diesen fragilen Download-Step und nutzt stattdessen das bereits auf dem Self-hosted Runner installierte Android SDK.
- **Things privacy:** Zwei-Nutzer/RLS-Abnahme ist vorbereitet; echte A/B-Isolation bleibt bis zur installierbaren APK UNPROVEN.
- **World Discovery:** Internet-use source-of-truth ist inzwischen ein offizieller 2024 Snapshot mit 182 non-aggregate countries. Worker 3 hat zwei stale launch-slice Aussagen korrigiert: `/indicators/` via `a4501465` und `/explore/` via `9eebbb26`. Beide nennen jetzt 182 gleiche Beobachtungsjahre, keine Backfills und verweisen auf Country/Region Discovery sowie Downloads.
- **World Discovery Release:** Vorheriger Releasepfad wurde durch Worker 4 wieder gruen gebracht (`3634904c`, `a650ae1`). Fuer `9eebbb26` war direkt nach Commit noch kein Statuscheck registriert; Release bleibt bis CI/Pages Evidence UNKNOWN.

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
Aktueller Handoff: `a4501465` + `9eebbb26` beseitigen veraltete 12-country/86-96%-Launch-Slice-Aussagen aus Indicator Registry und Explore. Source-of-truth `site/indicators/internet-use/data.json` belegt 182 non-aggregate 2024 observations. Nicht parallel Worker-4 Release/QA bearbeiten. Nach sicherem Deploy naechsten source-backed Nutzerwert-Hebel uebernehmen; Life expectancy bleibt SCREENING bis echte vergleichbare Source-Evidence vorliegt.

### CEO Worker 4 — World Discovery release/quality
Verifiziere `9eebbb26` inkl. `a4501465`: CI, Pages, Live `/explore/` und `/indicators/`; stelle sicher, dass keine stale 12-country launch-slice Claims mehr live sind und die 182-country-Aussage mit `data.json` konsistent bleibt.

## Groesster Blocker
Installierbare Things-APK. Der juengste konkrete Fehler war ein kaputter SDK-Refresh-Step auf Windows; dieser ist in `8ab5a756` entfernt. Jetzt muss der Self-hosted Build wieder bis CMake/Gradle laufen.

## Naechste Prioritaet
Things: `8ab5a756` gezielt auf Self-hosted bis APK oder neuem Root Cause treiben. Parallel World Discovery `9eebbb26` release-safe verifizieren.

**Nutzeraktion:** Keine.
