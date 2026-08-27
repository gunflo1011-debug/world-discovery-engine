# Profit CEO — Portfolio Status

_Last updated: 2026-08-27 08:20 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN. Rollierende reale Teamarbeit ca. 50:50 App/Website.

## Frisch verifizierter Stand
- **Things main:** `81837f602ab0b08a68f4ff2878720927d121ded6` (`Trigger current-main Android APK build`). Android APK Run #142 und Backend Security Gate #295 sind `completed/success`.
- **Things APK:** Artifact `things-alpha-android-standalone`, ID `9631486634`, 25,415,796 Bytes, nicht abgelaufen bis 2026-09-03, eindeutig SHA `81837f60` zugeordnet.
- **Things bekannte echte Nutzer-Evidence:** Die zuvor installierte APK konnte nur einen eingeschraenkten Item-Pfad; mehrere frei erstellbare Items sowie Edit/Delete funktionierten nicht. Diese Evidence darf nicht durch gruenen Build ersetzt werden. Fuer die current-main APK `81837f60` ist ein echter Android-CRUD-Test noch UNKNOWN.
- **Things Release-Gate:** Build/Security/Artifact = PASS. Produkt-/Device-Acceptance = BLOCKED bis current-main APK `81837f60` `create A -> create B -> edit A -> delete B -> relaunch -> A vorhanden` sowie Konto-A/B-RLS besteht. Falls derselbe CRUD-Fehler reproduziert wird, sofort Code-Root-Cause statt weiterer allgemeiner Guards.
- **World Discovery main:** `8708f67a4461830595f7a049c0085047c8d427b7` (`Refresh CEO release baseline after current-main APK`). Dieser Commit aendert nur Portfolio-Status; CI #530 ist `completed/success`. Letzter Produktcommit `f447190c` (`Add GDP per capita country comparison control`) hatte CI #529 und Pages #302 `completed/success`.
- **World Discovery LIVE:** `/explore/` zeigt aktuell 3 verifizierte Discovery-Pfade: Economy/GDP per capita (2024, 200 Laender), Technology/Internet (2024, 182 Laender) und People/Population revisions. Damit ist GDP live fuer Besucher sichtbar. Die gecrawlte `/indicators/`-Registry ist dagegen noch inkonsistent und nennt nur 2 published products bzw. GDP per capita als SCREENING. Das ist der aktuelle Website-Qualitaets-/IA-Engpass.

## 50:50-Leitplanke
Die juengste Commitserie ist Website-lastig. Commitzahl ist keine Arbeitszeitmessung, aber die beste aktuelle Evidence. Deshalb naechster Zyklus App-lastiger, bis die Balance wieder naeher 50:50 ist; Website bekommt einen eng begrenzten Konsistenz-Slice.

## Worker-Zuweisungen
### Worker 1 — App Engineering — P0
**Projekt:** Things. **Ergebnis:** current-main Produktpfad gegen bekannten CRUD-Fail pruefen und nur bei reproduziertem Fehler den kleinsten Root-Cause-Fix implementieren. **Akzeptanz:** `create A -> create B -> edit A -> delete B -> relaunch -> A vorhanden`; keine Ein-Item-Sonderlogik; RLS nicht abschalten. **Tests:** Lifecycle-Test + bestehende Security-Gates; danach neuer APK-Kandidat nur wenn Code geaendert wurde. **Abhaengigkeit:** current-main Code/alte funktionsreichere Git-Historie. **Nutzen:** repariert blockierten Kernflow. **Zeitrahmen:** dieser Zyklus. **Nachweis:** Commit/Testausgabe/Artifact oder klarer Beleg, dass current-main Code bereits vollstaendiges CRUD enthaelt.

### Worker 2 — Website Engineering — P1
**Projekt:** World Discovery. **Ergebnis:** oeffentliche Inkonsistenz Explore vs Indicator Registry beseitigen; GDP per capita muss als verifizierter dritter Produktpfad konsistent erscheinen. **Akzeptanz:** Explore, Registry, Economy-Hub, Navigation, Sitemap/Canonical stimmen ueberein; Population/Internet regressieren nicht. **Tests:** npm check/CI + Live-Smoke/Mobile. **Abhaengigkeit:** keine App-Dateien. **Nutzen:** Besucher und Suchmaschinen erkennen die neue Kategorie verlaesslich. **Zeitrahmen:** dieser Zyklus. **Nachweis:** Commit + CI + Live-URL.

### Worker 3 — Qualitaet/Security/DevOps — P0/P1
**Projekt:** beide, etwa 50:50. **Ergebnis:** unabhaengiges Gate fuer W1 CRUD/RLS/APK und W2 Registry/Explore-Konsistenz. **Akzeptanz App:** kein Release nur wegen Build; CRUD/Persistenz + A/B-RLS + installierbares Artifact. **Akzeptanz Website:** Build/CI + Kernnavigation + Mobile + Live-Konsistenz. **Tests:** bestehende Gates plus gezielte Regression. **Abhaengigkeit:** W1/W2 Ergebnisse; keine konkurrierenden Produktcode-Aenderungen. **Nutzen:** verhindert falsche Releases. **Zeitrahmen:** nach den Engineering-Handoffs. **Nachweis:** konkrete PASS/FAIL-Evidence.

### Worker 4 — Produkt/Wachstum/Business — P1
**Projekt:** beide. **Ergebnis:** Things Aktivierung erst nach CRUD; fuer Website genau den naechsten Bereich aus Health/Energy/Education priorisieren. **Akzeptanz:** Problem, reale Evidence oder markierte Annahme, erwartete Wirkung, Aufwand, Risiko, Messung und Go/Kill-Kriterium; genau eine Empfehlung, keine Ideenliste. **Tests/Messung:** Suchintention/Datenquelle/Nutzerpfad pruefen. **Abhaengigkeit:** keine konkurrierenden Code-Aenderungen. **Nutzen:** mehr thematische Reichweite ohne Thin Content. **Zeitrahmen:** dieser Zyklus. **Nachweis:** evidenzbasierter Handoff an CEO/W2.

## Releaseziel 2026-08-27 18:00 Europe/Berlin
- **Things:** nur Release, wenn current-main CRUD/Persistenz/RLS wirklich bestanden hat und eine installierbare SHA-gebundene APK vorliegt. Sonst letzte stabile/testbare Version beibehalten und Blocker melden.
- **World Discovery:** Explore/Registry/Economy konsistent live, CI/Mobile/Live-Gate PASS. Danach darf der naechste source-backed Kategorien-Slice begonnen werden.

## Kosten heute
Sicher belegte von diesem CEO-Zyklus ausgeloeste bezahlte Aktionen: 0 EUR. Keine Ausgabe/Vertrag/Konto/kostenpflichtiger Dienst/rechtliche Handlung ohne ausdrueckliche Nutzerfreigabe.

## Naechste drei Prioritaeten
1. Things current-main gegen den realen Multi-Item-CRUD-Vertrag beweisen oder Root Cause reparieren.
2. World Discovery GDP per capita in Indicator Registry und Explore konsistent als dritten verifizierten Bereich darstellen.
3. Nach stabilen Gates genau einen vierten hochwertigen Website-Bereich evidenzbasiert starten.
