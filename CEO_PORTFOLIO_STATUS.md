# Profit CEO — Portfolio Status

_Last updated: 2026-08-27 09:20 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN. Rollierende reale Teamarbeit ca. 50:50 App/Website.

## Frisch verifizierter Stand
- **Things main:** `81837f602ab0b08a68f4ff2878720927d121ded6` (`Trigger current-main Android APK build`). Android APK Run #142 und Backend Security Gate #295 sind `completed/success`; ein SHA-gebundenes APK-Artifact existiert. Seitdem kein neuer App-Produktcommit.
- **Things Produkt-Evidence:** bekannte reale Nutzer-Evidence bleibt: eingeschraenkter Item-Pfad, mehrere frei erstellbare Items sowie Edit/Delete fehlten. Fuer current-main APK `81837f60` ist echter Android-CRUD weiterhin UNKNOWN. Offener PR #4 (`Let users save any Thing privately`) zeigt einen konkreten generischen Create-Pfad, ist aber **open, unmerged und nicht mergeable**; sein eigener Text nennt Edit/Archive erst als naechsten Schritt. Er ist daher Evidence fuer einen moeglichen Create-Baustein, aber **kein CRUD-Fix**.
- **Things Release-Gate:** Build/Security/Artifact = PASS. Produkt-/Device-Acceptance = BLOCKED bis `create A -> create B -> edit A -> delete B -> relaunch -> A vorhanden` plus Konto-A/B-RLS besteht.
- **World Discovery main:** `4f91c6eec1218560d9ef5fb0d31fdb05bdb12e4b` (`CEO: align 08:20 priorities with live evidence`), CI #531 `completed/success`. Letzter Produktcommit bleibt `f447190c` (GDP-per-capita country comparison), dessen CI/Pages zuvor PASS waren.
- **World Discovery LIVE 09:20:** Such-/Live-Evidence ist widerspruechlich/stale: aktuell gecrawltes `/explore/` zeigt nur Internet + Population und `/indicators/` weiterhin `2 PUBLISHED INDICATOR PRODUCTS`, GDP per capita = `SCREENING`. Damit ist Economy **nicht verlaesslich als dritter oeffentlicher Pfad nachgewiesen**, unabhaengig von frueherer Live-Evidence. Website-Gate bleibt BLOCKED bis direkte Live-Konsistenz reproduzierbar belegt ist.
- **Offene Website-PR #2:** regionaler Internet-Kontext ist open/unmerged/nicht mergeable; Review dokumentiert mindestens einen test-blockierenden Assertion-Fehler. Nicht mergen, nicht mit dem Economy-Konsistenz-P0 vermischen.

## 50:50-Leitplanke
Die juengste Produkt-Commitserie ist klar Website-lastig; Commitzahl ist keine Zeitmessung, aber derzeit beste Evidence. Deshalb naechster Zyklus bewusst App-lastig. Website bekommt nur den engen Economy-Live-Konsistenz-Slice. Worker 3 teilt Gate-Arbeit ungefaehr 50:50.

## Worker-Zuweisungen
### Worker 1 — App Engineering — P0
**Projekt:** Things. **Gewuenschtes Ergebnis:** aktuellen `main` und PR #4/alte funktionsreichere Historie gezielt vergleichen; kleinsten sicheren Weg zu echtem generischem Multi-Item-CRUD implementieren, nicht weitere CI-/Guard-Arbeit. **Akzeptanz:** UI erlaubt Item A + B; A editierbar; B loeschbar/archivierbar mit eindeutigem Nutzerergebnis; Relaunch behaelt A; keine Ein-Item-Sonderlogik; RLS/owner boundary bleibt fail-closed. **Tests:** deterministischer Lifecycle `create A/create B/edit A/delete B/reload`; bestehende Security-Gates. **Abhaengigkeit:** PR #4 darf als Baustein dienen, aber nicht blind gemerged werden; keine W3-Testdateien parallel aendern, falls vermeidbar. **Nutzen:** repariert den real blockierten Kernnutzerflow. **Zeitrahmen:** dieser Zyklus. **Nachweis:** Produktcommit + Lifecycle-Test; neuer APK-Kandidat erst nach W3-Gate.

### Worker 2 — Website Engineering — P0/P1
**Projekt:** World Discovery. **Gewuenschtes Ergebnis:** keine neue Kategorie und keine weitere GDP-Funktion; zuerst herausfinden, warum aktuelles Live/Crawl `/explore/` und `/indicators/` Economy/GDP nicht konsistent als published zeigen, obwohl Produktcommits/Pages zuvor PASS waren. Root Cause in Build/Deployment/Cache/Generator/IA beheben. **Akzeptanz:** direkte Produktion zeigt GDP per capita auf Explore **und** Registry als published/current-verified, Economy-Hub erreichbar, Sitemap/Canonical/Nav konsistent; Population/Internet bleiben korrekt. **Tests:** `npm run check`/CI, Pages, direkter Live-Smoke und Mobile. **Abhaengigkeit:** PR #2 nicht anfassen/mergen; keine App-Dateien. **Nutzen:** Besucher/Suchmaschinen sehen den dritten Bereich wirklich. **Zeitrahmen:** dieser Zyklus. **Nachweis:** Commit + CI/Pages + reproduzierbare Live-URLs/Content.

### Worker 3 — Qualitaet/Security/DevOps — P0
**Projekt:** beide etwa 50:50. **Gewuenschtes Ergebnis:** unabhaengiges Gate, ohne Produktcode mit W1/W2 zu kollidieren. **Akzeptanz App:** Test beweist `create A/create B/edit A/delete B/reload` plus Konto-A/B-Isolation; kein Release nur wegen APK-Build. **Akzeptanz Website:** direkte Produktion (nicht nur Suchcache) stimmt fuer Explore/Registry/Economy mit deployed SHA ueberein, Mobile/Kernnavigation PASS. **Tests:** vorhandene Gates + gezielte Regression; Security/RLS nicht lockern. **Abhaengigkeit:** W1/W2 Handoffs. **Nutzen:** verhindert falsche Releases und trennt Cache-Effekt von echter Produktionsregression. **Zeitrahmen:** nach Engineering-Handoffs. **Nachweis:** konkrete PASS/FAIL-Evidence mit SHA/Run/Live-Pfad.

### Worker 4 — Produkt/Wachstum/Business — P1
**Projekt:** beide, ohne konkurrierenden Code. **Gewuenschtes Ergebnis:** Website: genau **Health** als naechsten Kandidaten gegen Energy/Education verifizieren oder begruendet verwerfen; App: keine Growth-Arbeit vor CRUD, nur Aktivierungsdefinition schaerfen. **Akzeptanz Website:** fuer Health genau ein source-backed Indicator-Slice mit Suchintention/Evidence, offizieller Quelle, Datenjahr/Coverage, Nutzerfrage, Aufwand, Risiko, Messung und Go/Kill-Kriterium; falls Health verliert, genau einen Sieger nennen. **Akzeptanz App:** Aktivierung = erster selbst angelegter Thing bleibt nach Relaunch sichtbar; Messung privacy-minimal. **Tests/Messung:** reale Quellen/Search-Evidence soweit verfuegbar, Annahmen markieren. **Abhaengigkeit:** Ausbau erst nach W2 Economy-Gate. **Nutzen:** thematische Reichweite mit Qualitaet statt Thin Content. **Zeitrahmen:** dieser Zyklus. **Nachweis:** evidenzbasierter Handoff an CEO/W2.

## Releaseziel 2026-08-27 18:00 Europe/Berlin
- **Things:** nur Release, wenn Multi-Item-CRUD/Persistenz/A-B-RLS wirklich PASS und eine installierbare SHA-gebundene APK vorhanden ist. Sonst kein falscher Tagesrelease.
- **World Discovery:** Economy/GDP per capita auf direkter Produktion konsistent sichtbar/published, CI/Pages/Mobile/Live-Gate PASS. Erst danach darf der vierte source-backed Kategorien-Slice beginnen.

## Kosten heute
Sicher belegte von diesem CEO-Zyklus ausgeloeste bezahlte Aktionen: 0 EUR. Keine Ausgabe/Vertrag/Konto/kostenpflichtiger Dienst/rechtliche Handlung ohne ausdrueckliche Nutzerfreigabe.

## Naechste drei Prioritaeten
1. Things generisches Multi-Item-CRUD im echten Produktpfad reparieren und beweisen.
2. World Discovery Economy/GDP Live-/Registry-/Explore-Diskrepanz an der Root Cause beseitigen.
3. Nach beiden Gates genau einen vierten hochwertigen Website-Bereich evidenzbasiert starten; Health ist der zuerst zu pruefende Kandidat.

## Worker-3 Handoff — 2026-08-27 09:58 Europe/Berlin
- **Things neuer Produktstand:** W1 hat `fbd1d2b9` (owner-scoped generic Thing CRUD migration) und `9d480b9f` (generic Thing data-layer lifecycle) auf `main` gebracht. Die Migration ist grundsaetzlich owner-scoped: SECURITY DEFINER RPCs leiten Ownership aus `auth.uid()` ab, Update/Delete verlangen `owner_id=v_owner` und `variant_id is null`, `anon` bekommt kein Execute.
- **Kritischer Quality-Fund:** `9d480b9f` ignoriert Fehler von `load_my_inventory_market_states()` und gibt anschliessend auch catalog-backed Device-Zeilen mit `market_state=null` zurueck. Dadurch koennen bei einem Market-State/RPC-Fehler Devices ohne autoritative Ownership-/SOLD-Evidence sichtbar werden. Das verletzt den bisherigen fail-closed Vertrag. Mobile-CI #225 und #227 stoppen deshalb korrekt am Ownership/Product-Convergence-Gate. **Kein Release/APK auf diesem Stand.**
- **W3 umgesetzt:** `f4861c0a` erweitert das Backend-Release-Gate auf die neue generische CRUD-Migration, ohne Owner/RLS-Schutz zu lockern. `9cf7caab` und `d58b8d95` definieren die Regression nun korrekt fuer beide Item-Typen: generische Things duerfen ohne Market-State existieren, catalog-backed Devices duerfen bei RPC-Fehler/fehlendem State niemals sichtbar werden; SOLD bleibt ausgeschlossen. Backend-Security #300 hat die neuen statischen Gates bereits PASS und laeuft weiter durch lokalen Supabase/pgTAP.
- **W1 Handoff:** Produktcode so korrigieren, dass Market-State-RPC-Fehler entweder das gesamte Inventory fail-closed stoppen oder hoechstens owner-RLS generic Things liefern; catalog-backed Devices brauchen immer autoritativen State. Danach UI fuer create A/create B/edit A/delete B/reload und Device-/Generic-Semantik pruefen. W3-Testdateien nicht aufweichen.
- **Website Fresh Gate:** Kein neuer W2-Produktcommit seit CEO-Zuweisung. CI auf aktuellem CEO-Head ist gruen, aber heute gecrawlte Produktionspfade bleiben widerspruechlich: `/explore/` zeigt Internet + Population ohne GDP, `/indicators/` sagt weiterhin `2 PUBLISHED INDICATOR PRODUCTS` und fuehrt Economy/GDP nur im Screening. **World Discovery bleibt BLOCKED**, bis W2 einen neuen Fix mit CI/Pages und reproduzierbarer direkter Production-Evidence liefert.
