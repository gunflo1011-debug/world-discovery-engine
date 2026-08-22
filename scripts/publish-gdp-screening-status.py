#!/usr/bin/env python3
"""Publish sanitized fail-closed GDP screening status and human-readable provenance.

This intentionally publishes provenance + methodology-gate state, never screened GDP
values. It refuses to emit public artifacts unless the live screening result proves the
expected blocker is specifically unresolved release-specific methodology comparability.
"""
import html, json, re
from pathlib import Path

SRC = Path("data/screening/real-gdp-2025.json")
DST = Path("site/indicators/real-gdp/status.json")
PROV = Path("site/indicators/real-gdp/provenance.html")
EXPECTED_CODE = "NY.GDP.MKTP.KD"
EXPECTED_YEAR = 2023
EXPECTED_VINTAGES = ["2025-01-28", "2025-07-02"]
EXPECTED_URLS = [
    "https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip",
    "https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip",
]
SHA256 = re.compile(r"^[0-9a-f]{64}$")


def require(condition, message):
    if not condition:
        raise SystemExit(f"Refusing to publish GDP screening status: {message}")


def main():
    require(SRC.is_file(), f"missing live screening artifact {SRC}")
    data = json.loads(SRC.read_text(encoding="utf-8"))

    require(data.get("status") == "SCREENING", "status must remain SCREENING")
    require(data.get("publishable") is False, "publishable must be false")
    indicator = data.get("indicator", {})
    require(indicator.get("code") == EXPECTED_CODE, "unexpected indicator code")
    require(data.get("referenceYear") == EXPECTED_YEAR, "unexpected reference year")

    gate = data.get("methodologyGate", {})
    require(gate.get("archiveNamesConsistent") is True, "archive indicator names are inconsistent")
    require(gate.get("releaseSpecificBaseAndValuationVerified") is False,
            "release-specific methodology gate must be unresolved")

    coverage = data.get("coverage", {})
    require(coverage.get("requested") == 15, "unexpected requested-country count")
    require(coverage.get("comparableRows") == 15, "all 15 sovereign countries must be present")
    require(coverage.get("missing") == [], "screening coverage is incomplete")

    provenance = data.get("provenance", {})
    releases = provenance.get("releases", [])
    require(len(releases) == 2, "expected exactly two archive releases")
    require([r.get("vintage") for r in releases] == EXPECTED_VINTAGES, "unexpected archive vintages")
    require([r.get("url") for r in releases] == EXPECTED_URLS, "unexpected archive URLs")
    for release in releases:
        require(SHA256.match(str(release.get("archiveSha256", ""))), "invalid archive SHA-256")
        require(str(release.get("member", "")).lower().endswith(".xlsx"), "missing XLSX member provenance")
        require(bool(str(release.get("indicatorNameInArchive", "")).strip()), "missing archive indicator name")

    public = {
        "schemaVersion": "1.2",
        "indicator": {
            "code": EXPECTED_CODE,
            "name": indicator.get("currentName", "Real GDP"),
            "currentUnit": indicator.get("currentUnit"),
            "referenceYear": EXPECTED_YEAR,
        },
        "screeningStatus": "BLOCKED_METHODOLOGY_COMPARABILITY",
        "publishableRevisionData": False,
        "coverage": coverage,
        "methodologyGate": {
            "archiveNamesConsistent": True,
            "releaseSpecificBaseAndValuationVerified": False,
            "reason": gate.get("reason"),
        },
        "provenance": {
            "dataset": provenance.get("dataset"),
            "archiveWarningUrl": provenance.get("archiveWarningUrl"),
            "currentMetadataUrl": provenance.get("currentMetadataUrl"),
            "releases": releases,
        },
        "methodologyUrl": "https://gunflo1011-debug.github.io/world-discovery-engine/methodology/",
        "screeningPageUrl": "https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/",
        "provenancePageUrl": "https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/provenance.html",
        "sourceCodeUrl": "https://github.com/gunflo1011-debug/world-discovery-engine/blob/main/scripts/screen-real-gdp.py",
        "note": "No screened GDP values, revisions, rankings, or REAL CSV export are published while release-specific base-year and valuation comparability remains unresolved.",
    }

    serialized = json.dumps(public, indent=2) + "\n"
    require('"rows"' not in serialized and '"first"' not in serialized and '"latest"' not in serialized,
            "screened values leaked into public status")
    DST.parent.mkdir(parents=True, exist_ok=True)
    DST.write_text(serialized, encoding="utf-8")

    rows = []
    for release in releases:
        rows.append(
            "<tr><td>{v}</td><td><a href=\"{u}\">Official WDI ZIP</a></td>"
            "<td><code>{m}</code></td><td><code>{h}</code></td><td>{n}</td></tr>".format(
                v=html.escape(release["vintage"]), u=html.escape(release["url"], quote=True),
                m=html.escape(release["member"]), h=html.escape(release["archiveSha256"]),
                n=html.escape(release["indicatorNameInArchive"]),
            )
        )
    prov_html = """<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Real GDP screening provenance — World Discovery Engine</title><meta name=\"description\" content=\"Exact archived WDI vintages, archive fingerprints and fail-closed methodology state for the Real GDP screening slice.\"><link rel=\"canonical\" href=\"https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/provenance.html\"><link rel=\"stylesheet\" href=\"../../styles.css\"></head><body><header class=\"topbar\"><div class=\"wrap\"><div class=\"brand\">World Discovery Engine</div><nav class=\"nav\" aria-label=\"Primary\"><a href=\"../../index.html\">Home</a><a href=\"../index.html\">Indicators</a><a href=\"./index.html\">GDP screening</a><a href=\"../../methodology/index.html\">Methodology</a></nav></div></header><main><section class=\"hero hero-compact\"><div class=\"wrap\"><div class=\"eyebrow\">Reproducibility → GDP screening</div><h1>Exact archive fingerprints for the blocked Real GDP comparison.</h1><p>This page is generated only from a live fail-closed screening run. It publishes source identity and fingerprints, not screened GDP values or revision claims.</p><span class=\"pill\">BLOCKED · METHODOLOGY COMPARABILITY</span></div></section><section class=\"section\"><div class=\"wrap\"><h2>Archive provenance</h2><div class=\"table-wrap\" role=\"region\" aria-label=\"GDP archive provenance\" tabindex=\"0\"><table class=\"table\"><thead><tr><th>Vintage</th><th>Source</th><th>Workbook member</th><th>Archive SHA-256</th><th>Indicator name in archive</th></tr></thead><tbody>{rows}</tbody></table></div><p class=\"muted\">Reference year: 2023 · Coverage: 15/15 requested sovereign countries · Indicator code: NY.GDP.MKTP.KD.</p></div></section><section class=\"section section-soft\"><div class=\"wrap\"><h2>Why publication is still blocked</h2><div class=\"notice\"><strong>Release-specific base year and valuation are not independently verified.</strong> The World Bank warns that this code has historically represented different base years and that archive views expose current metadata. Matching code, workbook name and coverage therefore do not prove cross-vintage methodological compatibility.</div><p><a href=\"https://databank.worldbank.org/databases/archives\">World Bank WDI archive guidance →</a></p><p><a href=\"https://databank.worldbank.org/metadataglossary/world-development-indicators/series/NY.GDP.MKTP.KD\">Current WDI metadata →</a></p><p><a href=\"./status.json\">Machine-readable status JSON →</a></p></div></section></main><footer class=\"footer\"><div class=\"wrap\">World Discovery Engine · Provenance without overclaiming.</div></footer></body></html>""".format(rows="".join(rows))
    for forbidden in ('absoluteRevision', 'relativeRevision', '>first<', '>latest<'):
        require(forbidden not in prov_html, f"screened value field leaked into provenance page: {forbidden}")
    PROV.write_text(prov_html, encoding="utf-8")
    print(f"Published sanitized GDP screening status to {DST} and provenance to {PROV}")


if __name__ == "__main__":
    main()
