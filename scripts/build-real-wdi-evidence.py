#!/usr/bin/env python3
import csv, io, json, re, urllib.request, zipfile
from datetime import datetime, timezone
from pathlib import Path
from openpyxl import load_workbook

RELEASES=[{"vintage":"2025-01-28","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip"},{"vintage":"2025-07-02","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip"}]
INDICATOR_CODE="SP.POP.TOTL"; INDICATOR_NAME="Population, total"; REFERENCE_YEAR=2023; UNIT="people"
METHODOLOGY_VERSION="wdi-population-estimates-2024-note-v1"
# Sovereign-country allowlist: deliberately excludes regional/income aggregates.
ENTITY_CODES=["DEU","USA","CHN","IND","JPN","GBR","FRA","ITA","BRA","CAN","AUS","ESP","MEX","IDN","KOR"]
ROOT=Path("site/evidence")

def download(url):
    req=urllib.request.Request(url,headers={"User-Agent":"world-discovery-engine/0.2"})
    with urllib.request.urlopen(req,timeout=180) as r:return r.read()

def extract_data_xlsx(blob):
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        names=[n for n in z.namelist() if n.lower().endswith('.xlsx') and not n.startswith('__MACOSX')]
        if not names: raise RuntimeError('No XLSX file found in WDI archive')
        preferred=sorted(names,key=lambda n:(('data' not in n.lower()),-z.getinfo(n).file_size))[0]
        return z.read(preferred),preferred

def read_indicator_rows(xlsx_bytes):
    wb=load_workbook(io.BytesIO(xlsx_bytes),read_only=True,data_only=True); ws=wb['Data'] if 'Data' in wb.sheetnames else wb[wb.sheetnames[0]]
    rows=ws.iter_rows(values_only=True); header=None
    for row in rows:
        vals=[str(v).strip() if v is not None else '' for v in row]
        if 'Country Name' in vals and 'Country Code' in vals and 'Indicator Code' in vals: header=vals; break
    if not header: raise RuntimeError('Could not locate WDI header')
    idx={name:i for i,name in enumerate(header)}; year=str(REFERENCE_YEAR); out={}
    if year not in idx: raise RuntimeError(f'Reference year {REFERENCE_YEAR} not found')
    for row in rows:
        if row[idx['Indicator Code']] != INDICATOR_CODE: continue
        code=row[idx['Country Code']]; value=row[idx[year]]
        if code in ENTITY_CODES and value is not None:
            try: out[str(code)]={"country":str(row[idx['Country Name']]),"value":float(value)}
            except (TypeError,ValueError): pass
    missing=set(ENTITY_CODES)-set(out)
    if missing: raise RuntimeError(f'Missing countries: {sorted(missing)}')
    return out

def slug(name): return re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
def fmt(v): return f"{v:,.0f}"

def main():
    snapshots=[]
    for rel in RELEASES:
        xlsx,name=extract_data_xlsx(download(rel['url'])); data=read_indicator_rows(xlsx); snapshots.append({**rel,"archive_file":name,"data":data})
        print(f"Loaded {INDICATOR_CODE} for {len(data)} countries from {rel['vintage']}")
    generated=datetime.now(timezone.utc).isoformat(); manifest=[]
    for code in ENTITY_CODES:
        first=snapshots[0]['data'][code]['value']; latest=snapshots[1]['data'][code]['value']; country=snapshots[1]['data'][code]['country']
        absolute=latest-first; relative=absolute/abs(first) if first else 0.0
        page_slug=f"{slug(country)}-population-revision-2025"; out=ROOT/page_slug; out.mkdir(parents=True,exist_ok=True)
        evidence={"schemaVersion":"1.0","status":"REAL","indicator":{"code":INDICATOR_CODE,"name":INDICATOR_NAME,"unit":UNIT,"methodologyVersion":METHODOLOGY_VERSION},"entity":{"code":code,"name":country,"entityType":"country"},"referenceYear":REFERENCE_YEAR,"first":{"vintage":RELEASES[0]['vintage'],"value":first,"sourceUrl":RELEASES[0]['url']},"latest":{"vintage":RELEASES[1]['vintage'],"value":latest,"sourceUrl":RELEASES[1]['url']},"revision":{"absolute":absolute,"relative":relative},"generatedAt":generated,"methodologyNote":"Same WDI indicator, unit, sovereign country and reference year across two archived 2025 releases. Regional and income aggregates are excluded.","license":"CC BY 4.0 (World Bank WDI; preserve attribution)"}
        (out/'evidence.json').write_text(json.dumps(evidence,indent=2)+"\n",encoding='utf-8')
        with (out/'evidence.csv').open('w',newline='',encoding='utf-8') as f:
            w=csv.writer(f); w.writerow(['entity_code','entity','indicator_code','reference_year','vintage','value','unit','source_url'])
            for key in ('first','latest'):
                x=evidence[key]; w.writerow([code,country,INDICATOR_CODE,REFERENCE_YEAR,x['vintage'],x['value'],UNIT,x['sourceUrl']])
        direction='increased' if absolute>0 else ('decreased' if absolute<0 else 'was unchanged')
        canonical=f"https://gunflo1011-debug.github.io/world-discovery-engine/evidence/{page_slug}/"
        html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{country} population revision 2025 — World Discovery Engine</title><meta name="description" content="Verified World Bank WDI vintage comparison showing how the published {REFERENCE_YEAR} population estimate for {country} changed between January and July 2025."><link rel="canonical" href="{canonical}"><link rel="stylesheet" href="../../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav"><a href="../../index.html">Home</a><a href="../index.html">Evidence</a><a href="../../methodology/index.html">Methodology</a></nav></div></header><main><section class="evidence-head"><div class="wrap"><span class="pill">REAL WDI EVIDENCE · VERIFIED VINTAGE COMPARISON</span><h1>{country}'s published {REFERENCE_YEAR} population estimate {direction} between two 2025 WDI releases.</h1><p class="muted">A reproducible comparison of official archived World Development Indicators releases.</p></div></section><section class="section"><div class="wrap"><div class="facts"><div class="fact"><div class="label">28 Jan 2025</div><div class="value">{fmt(first)}</div><div class="muted">people</div></div><div class="fact"><div class="label">2 Jul 2025</div><div class="value">{fmt(latest)}</div><div class="muted">people</div></div><div class="fact"><div class="label">Revision</div><div class="value">{relative*100:+.4f}%</div><div class="muted">{absolute:+,.0f} people</div></div></div><h2>What changed?</h2><p>The value published for {country}'s {REFERENCE_YEAR} population changed by <strong>{absolute:+,.0f} people</strong> ({relative*100:+.4f}%) between the two archived releases. This is a revision of a published estimate, not population growth between January and July 2025.</p><h2>Provenance</h2><div class="sourcebox">Indicator: {INDICATOR_NAME} ({INDICATOR_CODE}) · Unit: {UNIT} · Country: {code} · Reference year: {REFERENCE_YEAR} · Methodology gate: {METHODOLOGY_VERSION}. Regional aggregates are excluded. Source license: CC BY 4.0.</div><p><a href="./evidence.json">JSON evidence</a> · <a href="./evidence.csv">CSV evidence</a> · <a href="{RELEASES[0]['url']}">Jan archive</a> · <a href="{RELEASES[1]['url']}">Jul archive</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Verified archived WDI evidence</div></footer></body></html>'''
        (out/'index.html').write_text(html,encoding='utf-8')
        manifest.append({"code":code,"country":country,"slug":page_slug,"absolute":absolute,"relative":relative})
    (ROOT/'real-wdi-population-manifest.json').write_text(json.dumps({"generatedAt":generated,"count":len(manifest),"items":manifest},indent=2)+"\n",encoding='utf-8')
    print(json.dumps(manifest,indent=2))
if __name__=='__main__': main()
