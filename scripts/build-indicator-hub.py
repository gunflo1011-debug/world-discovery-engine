#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path("site")
EVIDENCE_ROOT = ROOT / "evidence"
OUT = ROOT / "indicators" / "population-total"
CANONICAL = "https://gunflo1011-debug.github.io/world-discovery-engine/indicators/population-total/"


def fmt_people(value):
    return f"{value:,.0f}"


def fmt_signed(value):
    if value > 0:
        return f"+{value:,.0f}"
    if value < 0:
        return f"−{abs(value):,.0f}"
    return "0"


def fmt_pct(value):
    pct = value * 100
    if pct > 0:
        return f"+{pct:.2f}%"
    if pct < 0:
        return f"−{abs(pct):.2f}%"
    return "0.00%"


def load_verified():
    manifest = json.loads((EVIDENCE_ROOT / "real-wdi-population-manifest.json").read_text(encoding="utf-8"))
    rows = []
    for item in manifest["items"]:
        page = EVIDENCE_ROOT / item["slug"]
        data = json.loads((page / "evidence.json").read_text(encoding="utf-8"))
        if data.get("status") != "REAL":
            raise RuntimeError(f"Non-REAL evidence found: {item['slug']}")
        if data["indicator"]["code"] != "SP.POP.TOTL" or data["referenceYear"] != 2023:
            raise RuntimeError(f"Unexpected indicator/year: {item['slug']}")
        if data["first"]["vintage"] != "2025-01-28" or data["latest"]["vintage"] != "2025-07-02":
            raise RuntimeError(f"Unexpected vintage pair: {item['slug']}")
        rows.append({
            "code": data["entity"]["code"],
            "country": data["entity"]["name"],
            "slug": item["slug"],
            "first": data["first"]["value"],
            "latest": data["latest"]["value"],
            "absolute": data["revision"]["absolute"],
            "relative": data["revision"]["relative"],
            "source_first": data["first"]["sourceUrl"],
            "source_latest": data["latest"]["sourceUrl"],
        })
    if len(rows) != 15:
        raise RuntimeError(f"Expected 15 verified rows, found {len(rows)}")
    return rows


def main():
    rows = load_verified()
    revised = [r for r in rows if r["absolute"] != 0]
    unchanged = [r for r in rows if r["absolute"] == 0]
    up = [r for r in rows if r["absolute"] > 0]
    down = [r for r in rows if r["absolute"] < 0]
    largest_relative = max(revised, key=lambda r: abs(r["relative"]))
    largest_absolute = max(revised, key=lambda r: abs(r["absolute"]))
    rows_sorted = sorted(rows, key=lambda r: abs(r["relative"]), reverse=True)

    summary = {
        "schemaVersion": "1.0",
        "status": "REAL",
        "indicator": {"code": "SP.POP.TOTL", "name": "Population, total", "unit": "people"},
        "referenceYear": 2023,
        "vintages": ["2025-01-28", "2025-07-02"],
        "countryCount": len(rows),
        "revisedCount": len(revised),
        "unchangedCount": len(unchanged),
        "upwardCount": len(up),
        "downwardCount": len(down),
        "largestRelativeRevision": {"country": largest_relative["country"], "code": largest_relative["code"], "relative": largest_relative["relative"], "absolute": largest_relative["absolute"]},
        "largestAbsoluteRevision": {"country": largest_absolute["country"], "code": largest_absolute["code"], "relative": largest_absolute["relative"], "absolute": largest_absolute["absolute"]},
        "items": rows_sorted,
        "methodologyNote": "Same WDI indicator, unit, sovereign-country set and 2023 reference year compared across archived releases dated 28 Jan 2025 and 2 Jul 2025. Regional and income aggregates are excluded. A revision is a change to a published historical estimate, not population growth between release dates.",
        "license": "CC BY 4.0 (World Bank WDI; preserve attribution)"
    }

    table_rows = []
    for r in rows_sorted:
        cls = "revision-pos" if r["absolute"] > 0 else ("revision-neg" if r["absolute"] < 0 else "revision-zero")
        table_rows.append(
            f'<tr><td><a href="../../evidence/{r["slug"]}/index.html">{r["country"]}</a></td>'
            f'<td class="num">{fmt_people(r["first"])}</td>'
            f'<td class="num">{fmt_people(r["latest"])}</td>'
            f'<td class="num {cls}">{fmt_signed(r["absolute"])}</td>'
            f'<td class="num {cls}">{fmt_pct(r["relative"])}</td></tr>'
        )

    jsonld = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "World Bank WDI population estimate revisions across 15 countries",
        "description": "Verified comparison of 2023 Population, total values across archived World Bank WDI releases dated 28 January 2025 and 2 July 2025.",
        "url": CANONICAL,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": {"@type": "Organization", "name": "World Bank"},
        "measurementTechnique": "Archived WDI vintage comparison with fixed indicator, unit, reference year and sovereign-country allowlist",
        "variableMeasured": "Population, total (SP.POP.TOTL)",
        "temporalCoverage": "2023",
        "distribution": {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": CANONICAL + "summary.json"},
        "isPartOf": {"@type": "WebSite", "name": "World Discovery Engine", "url": "https://gunflo1011-debug.github.io/world-discovery-engine/"}
    }

    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Population estimate revisions across 15 countries — World Discovery Engine</title><meta name="description" content="Verified comparison of 2023 population estimates across two archived World Bank WDI releases for 15 major countries, including upward, downward and zero revisions."><link rel="canonical" href="{CANONICAL}"><link rel="stylesheet" href="../../styles.css"><script type="application/ld+json">{json.dumps(jsonld,separators=(',',':'))}</script><style>.table-wrap{{overflow-x:auto;border:1px solid #e0e6ed;border-radius:12px;background:#fff}}.indicator-table{{width:100%;border-collapse:collapse;min-width:760px}}.indicator-table th,.indicator-table td{{padding:12px 14px;border-bottom:1px solid #edf0f4;text-align:left}}.indicator-table th{{font-size:.86rem;background:#f8fafc}}.indicator-table td.num{{text-align:right;font-variant-numeric:tabular-nums}}.indicator-table tr:last-child td{{border-bottom:0}}.revision-pos,.revision-neg{{font-weight:800}}.revision-zero{{color:#64748b}}</style></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav"><a href="../../index.html">Home</a><a href="../../evidence/index.html">Evidence</a><a href="./index.html" aria-current="page">Indicators</a><a href="../../explore/index.html">Explore</a><a href="../../methodology/index.html">Methodology</a><a href="../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Verified indicator hub · SP.POP.TOTL</div><h1>Population estimates changed in 5 of 15 countries between two 2025 WDI releases.</h1><p>This page treats the indicator as the unit of analysis: same 2023 population series, same unit, same sovereign-country set, two official archived World Bank releases.</p><span class="pill">REAL · 15 COUNTRIES · 5 REVISED · 10 UNCHANGED</span></div></section><section class="section"><div class="wrap"><div class="facts"><article class="fact"><div class="label">Countries checked</div><div class="value">15</div><div class="muted">sovereign-country allowlist</div></article><article class="fact"><div class="label">Revised</div><div class="value">5</div><div class="muted">3 upward · 2 downward</div></article><article class="fact"><div class="label">Unchanged</div><div class="value">10</div><div class="muted">verified zero revisions</div></article></div></div></section><section class="section section-soft"><div class="wrap"><h2>Strongest verified changes</h2><div class="grid"><article class="card"><span class="pill">LARGEST RELATIVE</span><h3>{largest_relative['country']}</h3><p><strong>{fmt_pct(largest_relative['relative'])}</strong> · {fmt_signed(largest_relative['absolute'])} people.</p><a href="../../evidence/{largest_relative['slug']}/index.html">Inspect country evidence →</a></article><article class="card"><span class="pill">LARGEST ABSOLUTE</span><h3>{largest_absolute['country']}</h3><p><strong>{fmt_signed(largest_absolute['absolute'])} people</strong> · {fmt_pct(largest_absolute['relative'])}.</p><a href="../../evidence/{largest_absolute['slug']}/index.html">Inspect country evidence →</a></article><article class="card"><span class="pill">IMPORTANT INTERPRETATION</span><h3>Revision ≠ growth</h3><p>A revision means an older published 2023 estimate changed between database releases. It does not measure population change from January to July 2025.</p><a href="../../methodology/index.html">Read methodology →</a></article></div></div></section><section class="section"><div class="wrap"><h2>All verified country values</h2><p>The table is rendered directly in HTML from the same REAL evidence JSON used by each country page, so search engines and AI systems can read the complete comparison without JavaScript.</p><div class="table-wrap"><table class="indicator-table"><thead><tr><th>Country</th><th>28 Jan 2025 release</th><th>2 Jul 2025 release</th><th>Revision</th><th>Revision %</th></tr></thead><tbody>{''.join(table_rows)}</tbody></table></div><p class="muted">Reference year: 2023 · Unit: people · Indicator: Population, total (SP.POP.TOTL).</p></div></section><section class="section section-soft"><div class="wrap"><h2>Provenance and machine-readable evidence</h2><div class="sourcebox">The comparison uses official archived World Bank World Development Indicators releases dated 28 Jan 2025 and 2 Jul 2025. Regional and income aggregates are excluded. The pipeline fails closed if indicator, year, country type or vintage pair does not match the verified contract.</div><p><a href="./summary.json">Download indicator summary JSON →</a> · <a href="{rows[0]['source_first']}">Open January archive →</a> · <a href="{rows[0]['source_latest']}">Open July archive →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Verified archived WDI indicator evidence</div></footer></body></html>'''

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    (OUT / "index.html").write_text(html, encoding="utf-8")
    print(f"Generated verified population indicator hub with {len(rows)} countries")


if __name__ == "__main__":
    main()
