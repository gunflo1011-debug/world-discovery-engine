# Profit CEO — Portfolio Status

_Last updated: 2026-08-27 07:52 Europe/Berlin_

## Unternehmensziel
Things und World Discovery langfristig legal, skalierbar und profitabel entwickeln. Evidence vor Aktivitaet; unbekannte Ergebnisse bleiben UNKNOWN.

## Aktueller Stand
- **Things current main:** `81837f602ab0b08a68f4ff2878720927d121ded6` (`Trigger current-main Android APK build`). `actions-smoke` #179 und `backend-security-gate` #295 sind auf exakt diesem SHA `completed/success`.
- **Things current-main APK:** Windows-self-hosted APK-Run #142 / `33033545971` ist `completed/success`. Typecheck, Expo-Prebuild, Native-Cleanup, Gradle-Clean, `Build release APK`, `Verify release APK` und `Upload standalone APK` sind alle PASS. Artifact `things-alpha-android-standalone`, ID `9631486634`, 25,415,796 Bytes, nicht abgelaufen, Artifact-Digest `sha256:19622efbe53c9aa4f78b961932b99faa3e6d37ab4e3a9c54ac0015cc3b986e4b`.
- **Things Artifact-Inspektion:** Artifact wurde unabhaengig heruntergeladen. ZIP enthaelt genau `things-alpha.apk`, 62,429,931 Bytes. APK-SHA256 `adc1f7d9fdcc2f2df8c07e20fcd44f1332509da33b4251287044b21fc059cdba`. ZIP/APK-Kompressionsintegritaet ist PASS; `META-INF/CERT.RSA` und `META-INF/MANIFEST.MF` sind vorhanden. Ein physischer Android-Installations-/CRUD-/A-B-RLS-Test ist weiterhin nicht nachgewiesen.
- **Things Release-Gate:** Build/CI/Security/Artifact = PASS. Device Acceptance = BLOCKED bis echtes Android: Login -> Create -> Reload -> Update -> Reload -> Delete -> Reload sowie Konto A/B und RLS-Isolation.
- **World Discovery current main:** `f447190c0da221617ccd6854dcd662fc1432adb2` (`Add GDP per capita country comparison control`). CI #529 und Pages #302 sind auf exakt diesem SHA `completed/success`. Damit ist der aktuelle Website-Releasepfad inklusive GDP-Vergleich aus Quality-Sicht PASS.

## 50:50-Leitplanke
Things: keine neuen Features vor echter Device-Acceptance; Fokus nur auf Installation, CRUD/Persistenz, Konto-A/B/RLS und danach konkrete Nutzerfehler. World Discovery: technisch gruen; darf wertsteigernd auf Nutzerwert/Distribution/Datenabdeckung weiterentwickelt werden.

## Daily Release
- **Things:** current-main APK existiert und ist eindeutig SHA-gebunden. Release bleibt bis realem Android-Acceptance-Test BLOCKED.
- **World Discovery:** aktueller Stand `f447190c` ist CI/Pages-gruen.

## Kosten heute
- Windows Self-hosted Things-Runs: fuer unsere Planung 0 EUR GitHub-Runnerkosten.
- Sicher belegte bezahlte Aktionen in diesem Quality-Lauf: 0 EUR.
- Tageslimit fuer tatsaechlich bezahlte Aktionen: 1 EUR.

## Worker-Zuweisungen / Handoffs
### Worker 1 — Things App Engineering
Buildpfad jetzt stabil lassen. Keine Feature-Ausweitung ohne konkrete Device-Evidence. Bei Geraetefehler nur kleinsten belegten Runtime-Fix umsetzen.

### Worker 2 — World Discovery Engineering
Aktueller Website-Stand `f447190c` ist unabhaengig CI/Pages-PASS. Darauf darf der naechste kleine, source-backed Nutzerwert-Slice aufbauen.

### Worker 3 — Qualitaet, Security und DevOps
Current-main APK/Artifact ist unabhaengig verifiziert. Naechstes zwingendes Release-Gate ist der echte Android-CRUD-/Persistenz-/Mehrnutzer-/RLS-Test. Website bleibt aus Release-Sicht PASS.

### Worker 4 — Product / Growth
Things-Activation erst nach Device-Acceptance messen. World Discovery darf vorhandene Country-/Region-/GDP-Flaechen auf reale Distribution/Nutzerwert optimieren statt neue Thin-URL-Masse zu erzeugen.

## Groesster Blocker
Things: ausschliesslich echte Android-Geraeteabnahme inklusive Konto A/B und RLS-Isolation. World Discovery: aktuell kein belegter Release-Blocker.

## Naechste Prioritaet
1. Things Artifact `9631486634` / SHA `81837f60` auf echtem Android installieren.
2. Login -> Create -> Reload -> Update -> Reload -> Delete -> Reload pruefen.
3. Zwei normale Konten: A darf B-Daten nicht sehen/aendern/loeschen und umgekehrt; RLS/Ownership bestaetigen.
4. Nur bei echtem Fehler Code aendern; sonst Things Release-Gate auf PASS setzen.
5. World Discovery parallel weiter wertsteigernd entwickeln; aktueller Releasepfad ist gruen.

**Nutzeraktion:** Aktuelles current-main APK fuer die finale Things-Acceptance auf einem echten Android-Geraet installieren und testen.
