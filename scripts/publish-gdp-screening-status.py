#!/usr/bin/env python3
"""Publish a sanitized, fail-closed GDP screening status from a real screener run.

This intentionally publishes provenance + methodology-gate state, never screened GDP
values. It refuses to emit a public status unless the live screening result proves the
expected blocker is specifically unresolved release-specific methodology comparability.
"""
import json, re
from pathlib import Path

SRC = Path("data/screening/real-gdp-2025.json")
DST = Path("site/indicators/real-gdp/status.json")
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
        "schemaVersion": "1.1",
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
        "sourceCodeUrl": "https://github.com/gunflo1011-debug/world-discovery-engine/blob/main/scripts/screen-real-gdp.py",
        "note": "No screened GDP values, revisions, rankings, or REAL CSV export are published while release-specific base-year and valuation comparability remains unresolved.",
    }

    # Defensive invariant: the public artifact must never expose row-level GDP values.
    serialized = json.dumps(public, indent=2) + "\n"
    require('"rows"' not in serialized and '"first"' not in serialized and '"latest"' not in serialized,
            "screened values leaked into public status")
    DST.parent.mkdir(parents=True, exist_ok=True)
    DST.write_text(serialized, encoding="utf-8")
    print(f"Published sanitized GDP screening provenance to {DST}")


if __name__ == "__main__":
    main()
