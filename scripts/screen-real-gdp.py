#!/usr/bin/env python3
"""Screen archived WDI real GDP vintages; fail closed and never publish evidence.

Important: WDI warns that NY.GDP.MKTP.KD has historically reused the same code
for different base years and that archive pages expose only current metadata.
Therefore matching code/name/current metadata is NOT sufficient to promote a
cross-vintage GDP comparison to REAL evidence.
"""
import hashlib, io, json, math, urllib.request, zipfile
from pathlib import Path
from openpyxl import load_workbook

RELEASES=[
 {"vintage":"2025-01-28","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip"},
 {"vintage":"2025-07-02","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip"},
]
CODE="NY.GDP.MKTP.KD"; CURRENT_NAME="GDP (constant 2015 US$)"; CURRENT_UNIT="constant 2015 US$"; YEAR=2023
COUNTRIES=["DEU","USA","CHN","IND","JPN","GBR","FRA","ITA","BRA","CAN","AUS","ESP","MEX","IDN","KOR"]
OUT=Path("data/screening/real-gdp-2025.json")
ARCHIVE_WARNING_URL="https://databank.worldbank.org/databases/archives"
CURRENT_METADATA_URL="https://databank.worldbank.org/metadataglossary/world-development-indicators/series/NY.GDP.MKTP.KD"

def download(url):
    req=urllib.request.Request(url,headers={"User-Agent":"world-discovery-engine/0.4"})
    with urllib.request.urlopen(req,timeout=180) as r:
        blob=r.read()
    if not blob: raise RuntimeError(f"Empty archive: {url}")
    return blob

def extract_xlsx(blob):
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        names=[n for n in z.namelist() if n.lower().endswith('.xlsx') and not n.startswith('__MACOSX')]
        if not names: raise RuntimeError('No XLSX in archive')
        name=sorted(names,key=lambda n:(('data' not in n.lower()),-z.getinfo(n).file_size))[0]
        return name,z.read(name)

def read(blob):
    wb=load_workbook(io.BytesIO(blob),read_only=True,data_only=True)
    ws=wb['Data'] if 'Data' in wb.sheetnames else wb[wb.sheetnames[0]]
    rows=ws.iter_rows(values_only=True); header=None
    for row in rows:
        vals=[str(v).strip() if v is not None else '' for v in row]
        if all(x in vals for x in ('Country Name','Country Code','Indicator Name','Indicator Code')): header=vals; break
    if not header: raise RuntimeError('WDI header missing')
    idx={v:i for i,v in enumerate(header)}
    if str(YEAR) not in idx: raise RuntimeError(f'{YEAR} missing')
    out={}; names=set()
    for row in rows:
        if row[idx['Indicator Code']] != CODE: continue
        indicator_name=str(row[idx['Indicator Name']]).strip(); names.add(indicator_name)
        code=str(row[idx['Country Code']]).strip(); val=row[idx[str(YEAR)]]
        if code in COUNTRIES and val is not None:
            value=float(val)
            if not math.isfinite(value) or value <= 0: raise RuntimeError(f'Invalid GDP value for {code}: {value}')
            if code in out: raise RuntimeError(f'Duplicate GDP row for {code}')
            out[code]={"country":str(row[idx['Country Name']]).strip(),"value":value}
    if len(names) != 1: raise RuntimeError(f'Ambiguous indicator names in archive: {sorted(names)}')
    return out,next(iter(names))

def main():
    snapshots=[]
    for rel in RELEASES:
        archive=download(rel['url']); member,xlsx=extract_xlsx(archive); data,name=read(xlsx)
        snapshots.append({**rel,"archiveSha256":hashlib.sha256(archive).hexdigest(),"member":member,"indicatorNameInArchive":name,"data":data})
    common=[c for c in COUNTRIES if all(c in s['data'] for s in snapshots)]
    missing=[c for c in COUNTRIES if c not in common]
    rows=[]
    for c in common:
        a=snapshots[0]['data'][c]['value']; b=snapshots[1]['data'][c]['value']; d=b-a
        rows.append({"code":c,"country":snapshots[1]['data'][c]['country'],"first":a,"latest":b,"absoluteRevision":d,"relativeRevision":d/abs(a)})

    archive_names=[s['indicatorNameInArchive'] for s in snapshots]
    name_consistent=len(set(archive_names)) == 1
    # Deliberately FALSE until release-specific evidence proves the base/valuation
    # for BOTH snapshots. Current WDI metadata cannot satisfy this gate.
    release_specific_methodology_verified=False
    publishable=(not missing and name_consistent and release_specific_methodology_verified)
    result={
      "status":"SCREENING" if not publishable else "VERIFIED",
      "publishable":publishable,
      "indicator":{"code":CODE,"currentName":CURRENT_NAME,"currentUnit":CURRENT_UNIT},
      "referenceYear":YEAR,
      "provenance":{"dataset":"World Development Indicators (WDI)","archiveWarningUrl":ARCHIVE_WARNING_URL,"currentMetadataUrl":CURRENT_METADATA_URL,"releases":[{k:s[k] for k in ('vintage','url','archiveSha256','member','indicatorNameInArchive')} for s in snapshots]},
      "methodologyGate":{"archiveNamesConsistent":name_consistent,"releaseSpecificBaseAndValuationVerified":release_specific_methodology_verified,"reason":"World Bank warns NY.GDP.MKTP.KD reused the same code across different base years and states archive views expose only current metadata. Current metadata says constant 2015 US$, but cannot prove the base/valuation of each archived release."},
      "coverage":{"requested":len(COUNTRIES),"comparableRows":len(common),"missing":missing},
      "rows":rows,
      "promotionGate":"Do not generate public REAL GDP evidence until independent release-specific metadata or another authoritative release artifact proves identical base year and valuation for both archived vintages."
    }
    OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(result,indent=2)+"\n",encoding='utf-8')
    print(json.dumps(result,indent=2))
    if missing: raise SystemExit(f'Fail closed: missing countries {missing}')
    if not name_consistent: raise SystemExit('Fail closed: archived indicator names differ')
    if not release_specific_methodology_verified: raise SystemExit('Fail closed: GDP release-specific base/valuation is not independently verified; screening output only')
if __name__=='__main__': main()
