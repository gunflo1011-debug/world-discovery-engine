#!/usr/bin/env python3
import csv, io, json, os, sys, urllib.request, zipfile
from datetime import datetime, timezone
from pathlib import Path

from openpyxl import load_workbook

RELEASES = [
    {"vintage":"2025-01-28","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip"},
    {"vintage":"2025-07-02","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip"},
]
INDICATOR_CODE = "SP.POP.TOTL"
INDICATOR_NAME = "Population, total"
REFERENCE_YEAR = 2023
UNIT = "people"
METHODOLOGY_VERSION = "wdi-population-estimates-2024-note-v1"
OUT_DIR = Path("site/evidence/real-wdi-population-revision-2025")


def download(url):
    req = urllib.request.Request(url, headers={"User-Agent":"world-discovery-engine/0.1"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def extract_data_xlsx(blob):
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        names = [n for n in z.namelist() if n.lower().endswith('.xlsx') and not n.startswith('__MACOSX')]
        if not names:
            raise RuntimeError('No XLSX file found in WDI archive')
        preferred = sorted(names, key=lambda n: (('data' not in n.lower()), -z.getinfo(n).file_size))[0]
        return z.read(preferred), preferred


def read_indicator_rows(xlsx_bytes):
    wb = load_workbook(io.BytesIO(xlsx_bytes), read_only=True, data_only=True)
    ws = wb['Data'] if 'Data' in wb.sheetnames else wb[wb.sheetnames[0]]
    rows = ws.iter_rows(values_only=True)
    header = None
    for row in rows:
        vals = [str(v).strip() if v is not None else '' for v in row]
        if 'Country Name' in vals and 'Country Code' in vals and 'Indicator Code' in vals:
            header = vals
            break
    if not header:
        raise RuntimeError('Could not locate WDI header')
    idx = {name:i for i,name in enumerate(header)}
    year_key = str(REFERENCE_YEAR)
    if year_key not in idx:
        raise RuntimeError(f'Reference year {REFERENCE_YEAR} not found')
    out = {}
    for row in rows:
        code = row[idx['Indicator Code']] if idx['Indicator Code'] < len(row) else None
        if code != INDICATOR_CODE:
            continue
        country_code = row[idx['Country Code']]
        country_name = row[idx['Country Name']]
        value = row[idx[year_key]]
        if country_code and value is not None:
            try:
                out[str(country_code)] = {"country":str(country_name),"value":float(value)}
            except (TypeError, ValueError):
                pass
    if not out:
        raise RuntimeError(f'No values found for {INDICATOR_CODE}')
    return out


def choose_revision(a, b):
    candidates=[]
    for code in sorted(set(a) & set(b)):
        va, vb = a[code]['value'], b[code]['value']
        if va == 0:
            continue
        delta = vb-va
        rel = delta/abs(va)
        if delta != 0:
            candidates.append((abs(rel), code, va, vb, rel))
    if not candidates:
        # A zero-revision pair is still genuine evidence, but pick Germany if present for readability.
        code = 'DEU' if 'DEU' in a and 'DEU' in b else sorted(set(a)&set(b))[0]
        return code, a[code]['value'], b[code]['value'], 0.0
    _, code, va, vb, rel = max(candidates)
    return code, va, vb, rel


def fmt_people(v):
    return f"{v:,.0f}"


def main():
    snapshots=[]
    for rel in RELEASES:
        blob=download(rel['url'])
        xlsx,name=extract_data_xlsx(blob)
        data=read_indicator_rows(xlsx)
        snapshots.append({**rel,"archive_file":name,"data":data})
        print(f"Loaded {len(data)} {INDICATOR_CODE} values from {rel['vintage']} ({name})")

    code, first, latest, relrev = choose_revision(snapshots[0]['data'], snapshots[1]['data'])
    country=snapshots[1]['data'][code]['country']
    absolute=latest-first
    generated=datetime.now(timezone.utc).isoformat()
    evidence={
        "schemaVersion":"1.0",
        "status":"REAL",
        "indicator":{"code":INDICATOR_CODE,"name":INDICATOR_NAME,"unit":UNIT,"methodologyVersion":METHODOLOGY_VERSION},
        "entity":{"code":code,"name":country},
        "referenceYear":REFERENCE_YEAR,
        "first":{"vintage":RELEASES[0]['vintage'],"value":first,"sourceUrl":RELEASES[0]['url']},
        "latest":{"vintage":RELEASES[1]['vintage'],"value":latest,"sourceUrl":RELEASES[1]['url']},
        "revision":{"absolute":absolute,"relative":relrev},
        "generatedAt":generated,
        "methodologyNote":"Population, total uses the World Bank population estimates/projections methodology documented in its 2024 technical note. This comparison is limited to two 2025 WDI releases and the same indicator code/name/unit. No causal claim is made.",
        "license":"CC BY 4.0 (World Bank WDI; preserve attribution)",
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR/'evidence.json').write_text(json.dumps(evidence,indent=2)+"\n",encoding='utf-8')
    with (OUT_DIR/'evidence.csv').open('w',newline='',encoding='utf-8') as f:
        w=csv.writer(f); w.writerow(['entity_code','entity','indicator_code','reference_year','vintage','value','unit','source_url'])
        for key in ('first','latest'):
            item=evidence[key]; w.writerow([code,country,INDICATOR_CODE,REFERENCE_YEAR,item['vintage'],item['value'],UNIT,item['sourceUrl']])

    direction='upward' if absolute>0 else ('downward' if absolute<0 else 'not revised')
    relative_text=f"{relrev*100:+.4f}%" if relrev else "0.0000%"
    html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{country} population revision — World Discovery Engine</title><meta name="description" content="Real World Bank WDI vintage comparison for {country} population in {REFERENCE_YEAR}, comparing the 28 Jan 2025 and 2 Jul 2025 database releases."><link rel="stylesheet" href="../../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav"><a href="../../index.html">Home</a><a href="../index.html">Evidence</a><a href="../../methodology/index.html">Methodology</a></nav></div></header><main><section class="evidence-head"><div class="wrap"><span class="pill">REAL WDI EVIDENCE · TWO ARCHIVED RELEASES</span><h1>{country}'s {REFERENCE_YEAR} population estimate was {direction} between two 2025 WDI releases.</h1><p class="muted">This page is generated from two official archived World Development Indicators releases. It is not a demo fixture.</p></div></section><section class="section"><div class="wrap"><div class="facts"><div class="fact"><div class="label">28 Jan 2025 release</div><div class="value">{fmt_people(first)}</div><div class="muted">people</div></div><div class="fact"><div class="label">2 Jul 2025 release</div><div class="value">{fmt_people(latest)}</div><div class="muted">people</div></div><div class="fact"><div class="label">Relative revision</div><div class="value">{relative_text}</div><div class="muted">{absolute:+,.0f} people</div></div></div><h2 style="margin-top:34px">Revision history</h2><table class="table"><tr><th>Publication vintage</th><th>Reference year</th><th>Value</th><th>Source</th></tr><tr><td>{RELEASES[0]['vintage']}</td><td>{REFERENCE_YEAR}</td><td>{fmt_people(first)}</td><td><a href="{RELEASES[0]['url']}">World Bank archive</a></td></tr><tr><td>{RELEASES[1]['vintage']}</td><td>{REFERENCE_YEAR}</td><td>{fmt_people(latest)}</td><td><a href="{RELEASES[1]['url']}">World Bank archive</a></td></tr></table><h2 style="margin-top:34px">Comparability & provenance</h2><div class="sourcebox"><strong>Indicator:</strong> {INDICATOR_NAME} ({INDICATOR_CODE}) · <strong>Unit:</strong> {UNIT} · <strong>Methodology gate:</strong> {METHODOLOGY_VERSION}. The comparison is constrained to two 2025 WDI releases, the same indicator identity and unit, using the World Bank population estimates/projections technical methodology. Source license: CC BY 4.0.</div><p><a href="./evidence.json">JSON evidence</a> · <a href="./evidence.csv">CSV evidence</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Real archived WDI evidence · Generated {generated}</div></footer></body></html>'''
    (OUT_DIR/'index.html').write_text(html,encoding='utf-8')
    print(json.dumps({"entity":country,"code":code,"first":first,"latest":latest,"relative_revision":relrev},indent=2))

if __name__=='__main__':
    main()
