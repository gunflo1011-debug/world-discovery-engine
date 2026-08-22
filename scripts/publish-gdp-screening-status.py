#!/usr/bin/env python3
"""Publish sanitized fail-closed GDP screening artifacts from one validated live run.

The public HTML, JSON and provenance page are generated atomically from the same
screening artifact. No screened GDP values/revisions are published while historical
base-year and valuation comparability is unresolved.
"""
import html, json, re
from pathlib import Path

SRC=Path("data/screening/real-gdp-2025.json")
DST=Path("site/indicators/real-gdp/status.json")
PROV=Path("site/indicators/real-gdp/provenance.html")
INDEX=Path("site/indicators/real-gdp/index.html")
EXPECTED_CODE="NY.GDP.MKTP.KD"; EXPECTED_NAME="GDP (constant 2015 US$)"; EXPECTED_UNIT="constant 2015 US$"; EXPECTED_YEAR=2023
EXPECTED_VINTAGES=["2025-01-28","2025-07-02"]
EXPECTED_URLS=["https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip","https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip"]
SHA256=re.compile(r"^[0-9a-f]{64}$"); UTCSTAMP=re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")

def require(c,m):
    if not c: raise SystemExit(f"Refusing to publish GDP screening artifacts: {m}")

def main():
    require(SRC.is_file(),f"missing live screening artifact {SRC}")
    data=json.loads(SRC.read_text(encoding="utf-8"))
    require(data.get("status")=="SCREENING","status must remain SCREENING")
    require(data.get("publishable") is False,"publishable must be false")
    screened=str(data.get("screenedAtUtc","")); require(UTCSTAMP.fullmatch(screened),"invalid screenedAtUtc")
    ind=data.get("indicator",{})
    require(ind.get("code")==EXPECTED_CODE,"unexpected indicator code")
    require(ind.get("currentName")==EXPECTED_NAME,"unexpected current indicator name")
    require(ind.get("currentUnit")==EXPECTED_UNIT,"unexpected current unit")
    require(data.get("referenceYear")==EXPECTED_YEAR,"unexpected reference year")
    gate=data.get("methodologyGate",{})
    require(gate.get("archiveNamesConsistent") is True,"archive names inconsistent")
    require(gate.get("releaseSpecificBaseAndValuationVerified") is False,"methodology gate must remain unresolved")
    coverage=data.get("coverage",{}); require(coverage=={"requested":15,"comparableRows":15,"missing":[]},"unexpected coverage")
    provenance=data.get("provenance",{}); releases=provenance.get("releases",[])
    require(len(releases)==2,"expected exactly two releases")
    require([r.get("vintage") for r in releases]==EXPECTED_VINTAGES,"unexpected vintages")
    require([r.get("url") for r in releases]==EXPECTED_URLS,"unexpected archive URLs")
    for r in releases:
        require(SHA256.fullmatch(str(r.get("archiveSha256",""))),"invalid archive SHA-256")
        require(isinstance(r.get("archiveBytes"),int) and r["archiveBytes"]>1_000_000,"invalid archive byte length")
        require(str(r.get("member","")).lower().endswith(".xlsx"),"missing XLSX member")
        require(r.get("indicatorNameInArchive")==EXPECTED_NAME,"archive indicator name differs from expected screening contract")

    public={"schemaVersion":"1.4","screenedAtUtc":screened,"indicator":{"code":EXPECTED_CODE,"name":EXPECTED_NAME,"currentUnit":EXPECTED_UNIT,"referenceYear":EXPECTED_YEAR},"screeningStatus":"BLOCKED_METHODOLOGY_COMPARABILITY","publishableRevisionData":False,"coverage":coverage,"methodologyGate":{"archiveNamesConsistent":True,"archiveNamesMatchExpectedScreeningContract":True,"releaseSpecificBaseAndValuationVerified":False,"reason":gate.get("reason")},"provenance":{"dataset":provenance.get("dataset"),"archiveWarningUrl":provenance.get("archiveWarningUrl"),"currentMetadataUrl":provenance.get("currentMetadataUrl"),"releases":releases},"methodologyUrl":"https://gunflo1011-debug.github.io/world-discovery-engine/methodology/","screeningPageUrl":"https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/","provenancePageUrl":"https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/provenance.html","sourceCodeUrl":"https://github.com/gunflo1011-debug/world-discovery-engine/blob/main/scripts/screen-real-gdp.py","note":"No screened GDP values, revisions, rankings, or REAL CSV export are published while release-specific base-year and valuation comparability remains unresolved."}
    serialized=json.dumps(public,indent=2)+"\n"
    for forbidden in ('"rows"','"first"','"latest"','"absoluteRevision"','"relativeRevision"'): require(forbidden not in serialized,f"private screened field leaked: {forbidden}")
    DST.parent.mkdir(parents=True,exist_ok=True); DST.write_text(serialized,encoding="utf-8")

    trs=[]
    for r in releases:
        trs.append('<tr><td>{}</td><td><a href="{}">Official WDI ZIP</a></td><td><code>{}</code></td><td>{:,} bytes</td><td><code>{}</code></td><td>{}</td></tr>'.format(html.escape(r['vintage']),html.escape(r['url'],quote=True),html.escape(r['member']),r['archiveBytes'],html.escape(r['archiveSha256']),html.escape(r['indicatorNameInArchive'])))
    prov='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Real GDP screening provenance — World Discovery Engine</title><meta name="description" content="Exact archived WDI vintages, fingerprints and fail-closed methodology state for Real GDP screening."><link rel="canonical" href="https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/provenance.html"><link rel="stylesheet" href="../../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../index.html">Home</a><a href="../index.html">Indicators</a><a href="./index.html">GDP screening</a><a href="../../methodology/index.html">Methodology</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Reproducibility → GDP screening</div><h1>Exact archive fingerprints for the blocked Real GDP comparison.</h1><p>Generated from the same validated live screening run as the public status page. Source identity is published; screened GDP values are not.</p><span class="pill">BLOCKED · METHODOLOGY COMPARABILITY</span></div></section><section class="section"><div class="wrap"><h2>Archive provenance</h2><p><strong>Last live screening run:</strong> <time datetime="{s}">{s}</time></p><div class="table-wrap" role="region" aria-label="GDP archive provenance" tabindex="0"><table class="table"><thead><tr><th>Vintage</th><th>Source</th><th>Workbook member</th><th>Archive size</th><th>Archive SHA-256</th><th>Indicator name in archive</th></tr></thead><tbody>{rows}</tbody></table></div><p class="muted">Reference year: 2023 · Coverage: 15/15 requested sovereign countries · Indicator code: NY.GDP.MKTP.KD.</p></div></section><section class="section section-soft"><div class="wrap"><h2>Why publication is blocked</h2><div class="notice"><strong>Release-specific base year and valuation are not independently verified.</strong> World Bank archive guidance warns that this code has historically represented different base years and that archive views expose current metadata. Matching code/name therefore cannot prove cross-vintage methodology.</div><p><a href="https://databank.worldbank.org/databases/archives">World Bank WDI archive guidance →</a></p><p><a href="https://databank.worldbank.org/metadataglossary/world-development-indicators/series/NY.GDP.MKTP.KD">Current WDI metadata →</a></p><p><a href="./status.json">Machine-readable status JSON →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Provenance without overclaiming.</div></footer></body></html>'''.format(s=html.escape(screened,quote=True),rows=''.join(trs))
    PROV.write_text(prov,encoding="utf-8")

    index='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Real GDP WDI screening status — World Discovery Engine</title><meta name="description" content="Fail-closed WDI Real GDP vintage screening: both 2025 archives cover all 15 requested 2023 country rows, but revision values remain unpublished because release-specific methodology comparability is unresolved."><link rel="canonical" href="https://gunflo1011-debug.github.io/world-discovery-engine/indicators/real-gdp/"><link rel="stylesheet" href="../../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../index.html">Home</a><a href="../../evidence/index.html">Evidence</a><a href="../index.html">Indicators</a><a href="../../methodology/index.html">Methodology</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Indicators → Economy → Screening</div><h1>Real GDP revisions are not publishable yet.</h1><p>Both exact archived WDI releases contain all 15 requested 2023 rows for <strong>NY.GDP.MKTP.KD</strong>, named <strong>GDP (constant 2015 US$)</strong>. Release-specific base-year and valuation comparability is not independently proven, so no revision values or rankings are published.</p><span class="pill">SCREENING · FAIL CLOSED</span><div class="hero-actions"><a href="./provenance.html">Archive provenance</a><a href="./status.json">Status JSON</a><a href="../../methodology/index.html">Methodology</a></div></div></section><section class="section"><div class="wrap"><h2>Live screening state</h2><p><strong>Last validated live screening run:</strong> <time datetime="{s}">{s}</time></p><div class="facts"><div class="fact"><div class="label">Coverage</div><div class="value">15 / 15</div><div>Requested country rows present in both vintages</div></div><div class="fact"><div class="label">Reference year</div><div class="value">2023</div><div>Same observation year</div></div><div class="fact"><div class="label">Archive vintages</div><div class="value">2</div><div>28 Jan 2025 · 2 Jul 2025</div></div></div><div class="notice" style="margin-top:18px"><strong>Methodology gate blocked.</strong> Code, archived series name, source fingerprints and coverage are verified identity signals. They are not sufficient proof that both releases use identical historical base year and valuation.</div></div></section><section class="section section-soft"><div class="wrap"><h2>What the pipeline guarantees</h2><div class="grid"><article class="card"><span class="pill">PASSED</span><h3>Exact sources are fingerprinted</h3><p>Each official archive URL, ZIP byte length, workbook member and SHA-256 hash is published.</p><a href="./provenance.html">Inspect provenance →</a></article><article class="card"><span class="pill">PASSED</span><h3>Screening contract is exact</h3><p>Both archive workbooks must expose the expected code/name and all 15 requested 2023 rows or public refresh fails.</p><a href="./status.json">Inspect machine status →</a></article><article class="card"><span class="pill">BLOCKED</span><h3>Methodology compatibility is unresolved</h3><p>World Bank itself warns this code has represented multiple base years historically and archived views show current metadata.</p><a href="https://databank.worldbank.org/databases/archives">Official archive guidance →</a></article></div><p><strong>CSV:</strong> intentionally unavailable until the methodology gate passes.</p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Uncertainty is shown instead of converted into a claim.</div></footer></body></html>'''.format(s=html.escape(screened,quote=True))
    for text,name in ((prov,"provenance"),(index,"screening page")):
        for forbidden in ('absoluteRevision','relativeRevision','>first<','>latest<'): require(forbidden not in text,f"screened field leaked into {name}: {forbidden}")
    INDEX.write_text(index,encoding="utf-8")
    print(f"Published synchronized fail-closed GDP artifacts: {DST}, {PROV}, {INDEX}")

if __name__=="__main__": main()
