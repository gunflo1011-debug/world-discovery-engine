#!/usr/bin/env python3
"""Screen WDI real GDP for safe archived-vintage comparison; never publishes evidence."""
import io, json, urllib.request, zipfile
from pathlib import Path
from openpyxl import load_workbook

RELEASES=[{"vintage":"2025-01-28","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_01_28.zip"},{"vintage":"2025-07-02","url":"https://databank.worldbank.org/data/download/Archive/WDI_excel_2025_07_02.zip"}]
CODE="NY.GDP.MKTP.KD"; NAME="GDP (constant 2015 US$)"; UNIT="constant 2015 US$"; YEAR=2023
COUNTRIES=["DEU","USA","CHN","IND","JPN","GBR","FRA","ITA","BRA","CAN","AUS","ESP","MEX","IDN","KOR"]
OUT=Path("data/screening/real-gdp-2025.json")

def download(url):
    req=urllib.request.Request(url,headers={"User-Agent":"world-discovery-engine/0.3"})
    with urllib.request.urlopen(req,timeout=180) as r:return r.read()

def xlsx(blob):
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        names=[n for n in z.namelist() if n.lower().endswith('.xlsx') and not n.startswith('__MACOSX')]
        if not names: raise RuntimeError('No XLSX in archive')
        name=sorted(names,key=lambda n:(('data' not in n.lower()),-z.getinfo(n).file_size))[0]
        return z.read(name)

def read(blob):
    wb=load_workbook(io.BytesIO(blob),read_only=True,data_only=True); ws=wb['Data'] if 'Data' in wb.sheetnames else wb[wb.sheetnames[0]]
    rows=ws.iter_rows(values_only=True); header=None
    for row in rows:
        vals=[str(v).strip() if v is not None else '' for v in row]
        if all(x in vals for x in ('Country Name','Country Code','Indicator Code')): header=vals; break
    if not header: raise RuntimeError('WDI header missing')
    idx={v:i for i,v in enumerate(header)}
    if str(YEAR) not in idx: raise RuntimeError(f'{YEAR} missing')
    out={}
    for row in rows:
        if row[idx['Indicator Code']] != CODE: continue
        code=str(row[idx['Country Code']]); val=row[idx[str(YEAR)]]
        if code in COUNTRIES and val is not None: out[code]={"country":str(row[idx['Country Name']]),"value":float(val)}
    return out

def main():
    snapshots=[]
    for rel in RELEASES: snapshots.append({**rel,"data":read(xlsx(download(rel['url'])))})
    common=[c for c in COUNTRIES if all(c in s['data'] for s in snapshots)]
    missing=[c for c in COUNTRIES if c not in common]
    rows=[]
    for c in common:
        a=snapshots[0]['data'][c]['value']; b=snapshots[1]['data'][c]['value']; d=b-a
        rows.append({"code":c,"country":snapshots[1]['data'][c]['country'],"first":a,"latest":b,"absoluteRevision":d,"relativeRevision":d/abs(a) if a else None})
    # Screening is deliberately not promotion. Current official WDI metadata must independently confirm the unit/base.
    result={"status":"SCREENING","publishable":False,"indicator":{"code":CODE,"name":NAME,"expectedUnit":UNIT},"referenceYear":YEAR,"vintages":[r['vintage'] for r in RELEASES],"coverage":{"requested":len(COUNTRIES),"comparableRows":len(common),"missing":missing},"rows":rows,"promotionGate":"Requires independent metadata/base-year validation for both archived vintages before any REAL evidence is generated."}
    OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(result,indent=2)+"\n",encoding='utf-8')
    print(json.dumps(result,indent=2))
    if missing: raise SystemExit(f'Fail closed: missing countries {missing}')
if __name__=='__main__': main()
