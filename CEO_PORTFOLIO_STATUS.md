# Profit CEO — Portfolio Status

_Last updated: 2026-08-27 16:20 Europe/Berlin_

## Unternehmensziel
Things und World Discovery professionell, legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN. Rollierende reale Teamarbeit ca. 50:50 App/Website.

## Frisch verifizierter Stand
- **Things main:** `abe13360da4983e862946cbd8685a5986b96e58c` (`Trigger gated current-main APK candidate`). Dieser Commit ist nur Release-Trigger; gegateter Runtime-SHA bleibt `573ed147c465bd609f818c8168a660d6ffe0dfbd`.
- **Things Gates:** Runtime-SHA `573ed147...` hatte actions-smoke #189, mobile-alpha-ci #232 und backend-security-gate #305 PASS. Trigger-SHA `abe13360...` hat actions-smoke #190 PASS. Android APK #143 (`33074142042`) ist um 16:20 weiterhin `queued`; daher kein neues Artifact und kein Buildfehler belegt. Bekannte Nutzer-E2E-Abnahme fuer current runtime/APK fehlt weiterhin.
- **World Discovery main:** `c4394af10ac9f5483528f52a7d47cb1b4f08859d` (`Record W3 15:52 release-gate status`), CI #536 PASS. Seit dem letzten echten Website-Produktstand kein W2-Produktfix sichtbar.
- **World Discovery LIVE (frisch 27.08.2026):** `/explore/` zeigt nur Internet + Population; `/indicators/` sagt `2 PUBLISHED INDICATOR PRODUCTS` und GDP per capita bleibt SCREENING. Internet 2024 mit 182 Laendern ist live. Economy/GDP ist daher aktuell NICHT als verlaesslicher dritter Live-Pfad freigegeben.
- **Produkt-Backlog:** Issue #3 = EN/DE/FR/ES i18n; Issue #4 = historische Zeitreihen plus automatisch neuestes verifiziertes Jahr. Beide sind sinnvoll, bleiben aber hinter dem aktuellen Live-Konsistenz-P0.

## 50:50-Leitplanke
Die juengste belegbare Engineering-Arbeit war App-lastig (mehrere App Runtime/Gate/Release-Commits), nachdem die vorherige Phase Website-lastig war. Exakte Stunden sind nicht verfuegbar; Commitzahl ist nur Naeherung. Dieser Zyklus gleicht wieder aus: W1 App; W2 Website; W3 beide etwa 50:50; W4 beide etwa 50:50. Keine weitere App-Runtime-Aenderung ohne neue Failure-Evidence; Website bekommt echten Produktfix statt Status-Commits.

## Worker-Zuweisungen 16:20
### Worker 1 — App Engineering — P0
**Projekt:** Things. **Ergebnis:** APK #143 nicht mit weiteren Runtime-Aenderungen stoeren. Pruefe Build-Queue/Runner-Zustand; falls der Build startet und scheitert, behebe ausschliesslich den konkreten Buildfehler. Falls Artifact entsteht, dokumentiere exakte Runtime-/Trigger-SHA-Zuordnung und bereite E2E-Abnahme vor. **Akzeptanz:** keine unbegruendete Codeaenderung; Artifact ist installierbar und eindeutig `573ed147...` Runtime zuordenbar; danach `create A -> create B -> edit A -> delete B -> relaunch -> A vorhanden`, Confirmation-Deep-Link, Login/Logout und RLS bleiben Gate. **Tests:** vorhandene Runtime-Gates nicht abschwaechen; APK Build/Verify/Upload. **Abhaengigkeit:** Windows-self-hosted Runner. **Nutzen:** verwandelt erstmals gruene Runtime in echten Testkandidaten. **Zeitrahmen:** bis naechster CEO-Zyklus/18:00. **Nachweis:** Run-ID + Artifact-ID/SHA oder konkreter Buildfehler.

### Worker 2 — Website Engineering — P0
**Projekt:** World Discovery. **Ergebnis:** Root Cause beheben, warum gebaute Economy/GDP-Arbeit auf direkter Produktion nicht als published in `/explore/` und `/indicators/` erscheint. Keine i18n-/Zeitreihen-/neue Kategorie-Implementierung vor diesem Fix. **Akzeptanz:** GDP per capita auf direkter Produktion in Explore + Registry als published/current-verified; Economy-Hub erreichbar; Nav/Sitemap/Canonical konsistent; Internet/Population regressionsfrei. **Tests:** `npm run check`/CI, Pages, direkter Live-Smoke, Mobile. **Abhaengigkeit:** offene PRs nicht blind mergen. **Nutzen:** verhindert, dass wir Features bauen, die Nutzer/Suchmaschinen nicht verlaesslich sehen. **Zeitrahmen:** dieser Zyklus, Ziel vor 18:00. **Nachweis:** Produktcommit + CI/Pages + reproduzierbare Live-URLs.

### Worker 3 — Qualitaet/Security/DevOps — P0
**Projekt:** beide ca. 50:50. **Ergebnis:** unabhaengiges Gate fuer W1/W2. **App Akzeptanz:** APK #143 nur freigeben, wenn Build/Verify/Upload PASS, Artifact SHA-gebunden/installierbar und keine Secrets; danach echter CRUD/Persistenz/Auth/A-B-RLS-Test bleibt Pflicht. **Website Akzeptanz:** direkter Produktionsoutput muss freigegebenem Produkt-SHA entsprechen; Explore/Registry/Economy + Mobile/Kernnavigation PASS. **Tests:** bestehende Gates plus gezielte Smokechecks; keine Security-Abschwaechung. **Abhaengigkeit:** W1 Artifact bzw. W2 Produktfix. **Nutzen:** verhindert falsche Releases. **Zeitrahmen:** unmittelbar nach Handoff. **Nachweis:** Run/SHA/Artifact bzw. Live-Evidence.

### Worker 4 — Produkt/Wachstum/Business — P1
**Projekt:** beide, ohne konkurrierenden Produktcode. **Ergebnis:** Website: Issues #4 und #3 in minimale wertvolle Reihenfolge konkretisieren: zuerst Zeitreihen-UX (latest verified default + Jahreswaehler + Laendertrend), danach EN/DE/FR/ES; App: Acceptance-Metrik `erster selbst angelegter Thing bleibt nach Relaunch sichtbar` beibehalten. **Akzeptanz:** je Massnahme Problem/Evidence bzw. Annahme, Wirkung, Aufwand, Risiko, Messung, Go/Kill; keine Thin-Content-Jahresseiten, keine PII/Location-Metrik. **Abhaengigkeit:** Website-Ausbau erst nach Economy-P0; App-Growth erst nach APK/CRUD-Gate. **Nutzen:** Wachstum auf stabiler Grundlage. **Zeitrahmen:** dieser Zyklus. **Nachweis:** kurzer evidenzbasierter Handoff.

## Releaseziel 2026-08-27 18:00 Europe/Berlin
- **Things:** nur Release, wenn #143 ein reales installierbares Artifact liefert UND W3 die Releasebedingungen bestaetigt; ohne echten Android CRUD/Persistenz/Auth/RLS-Nachweis bleibt es Kandidat, nicht finaler Nutzerrelease.
- **World Discovery:** nur neuer Release-Stand, wenn Economy/GDP auf direkter Produktion konsistent published ist und CI/Pages/Mobile/Live gemeinsam PASS sind. Sonst bleibt letzte stabile Produktion und der Blocker wird berichtet.

## Sackgassencheck
- **Things:** weitere Runtime-Fixes ohne neue Failure-Evidence waeren Aktivitaet statt Fortschritt. Aktueller Engpass ist Runner/Artifact + Device-Acceptance.
- **Website:** neue Sprachen/Zeitreihen vor Behebung der Deployment-/Generator-Konsistenz wuerden Komplexitaet auf unsicherer Basis aufbauen. Erst sichtbarer dritter Bereich, dann Breite/Freshness/i18n.
- Widerlegbare Wachstumsannahme: mehr Kategorien/Sprachen/Jahre fuehren nur dann zu Reichweite, wenn Nutzer sie finden, Daten vertrauenswuerdig sind und Search-/Nutzungsmetriken spaeter Nachfrage zeigen.

## Kosten heute
Sicher von diesem CEO-Zyklus ausgeloeste bezahlte Aktionen: 0 EUR. Keine Ausgabe/Vertrag/Konto/kostenpflichtiger Dienst/rechtliche Handlung ohne ausdrueckliche Freigabe. Keine Blind-Retries kostenpflichtiger Runner.

## Naechste drei Prioritaeten
1. Things APK #143 zu echtem Artifact bringen bzw. Runner/Buildblocker exakt isolieren; keine unnoetigen Runtime-Aenderungen.
2. World Discovery Economy/GDP direkte Produktionskonsistenz wirklich reparieren.
3. Nach Website-Gate Zeitreihen bis zum jeweils neuesten verifizierten Jahr umsetzen; danach EN/DE/FR/ES.