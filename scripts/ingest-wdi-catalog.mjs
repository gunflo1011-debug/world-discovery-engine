import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const LATEST_YEAR = 2025;
export const EARLIEST_SNAPSHOT_YEAR = 2020;
export const MIN_COUNTRIES = 120;
export const INDICATORS = [
  { code: 'SP.POP.TOTL', slug: 'population', name: 'Population, total', unit: 'people' },
  { code: 'SP.POP.GROW', slug: 'population-growth', name: 'Population growth (annual %)', unit: 'annual %' },
  { code: 'EN.POP.DNST', slug: 'population-density', name: 'Population density (people per sq. km of land area)', unit: 'people per sq. km' },
  { code: 'SP.POP.0014.TO.ZS', slug: 'population-age-0-14', name: 'Population ages 0-14 (% of total)', unit: '% of population' },
  { code: 'SP.POP.65UP.TO.ZS', slug: 'population-age-65-plus', name: 'Population ages 65 and above (% of total)', unit: '% of population' },
  { code: 'SP.DYN.LE00.IN', slug: 'life-expectancy', name: 'Life expectancy at birth, total (years)', unit: 'years' },
  { code: 'SP.DYN.TFRT.IN', slug: 'fertility-rate', name: 'Fertility rate, total (births per woman)', unit: 'births per woman' },
  { code: 'SP.DYN.CBRT.IN', slug: 'birth-rate', name: 'Birth rate, crude (per 1,000 people)', unit: 'per 1,000 people' },
  { code: 'SP.DYN.CDRT.IN', slug: 'death-rate', name: 'Death rate, crude (per 1,000 people)', unit: 'per 1,000 people' },
  { code: 'SP.DYN.IMRT.IN', slug: 'infant-mortality', name: 'Mortality rate, infant (per 1,000 live births)', unit: 'per 1,000 live births' },
  { code: 'SP.URB.TOTL.IN.ZS', slug: 'urban-population-share', name: 'Urban population (% of total population)', unit: '% of population' },
  { code: 'NY.GDP.MKTP.CD', slug: 'gdp', name: 'GDP (current US$)', unit: 'current US$' },
  { code: 'NY.GDP.PCAP.CD', slug: 'gdp-per-capita', name: 'GDP per capita (current US$)', unit: 'current US$ per person' },
  { code: 'NY.GDP.MKTP.KD.ZG', slug: 'gdp-growth', name: 'GDP growth (annual %)', unit: 'annual %' },
  { code: 'FP.CPI.TOTL.ZG', slug: 'inflation', name: 'Inflation, consumer prices (annual %)', unit: 'annual %' },
  { code: 'SL.UEM.TOTL.ZS', slug: 'unemployment', name: 'Unemployment, total (% of total labor force)', unit: '% of labor force' },
  { code: 'SL.TLF.CACT.ZS', slug: 'labor-force-participation', name: 'Labor force participation rate, total (% of total population ages 15+)', unit: '% ages 15+' },
  { code: 'SL.EMP.TOTL.SP.ZS', slug: 'employment-to-population', name: 'Employment to population ratio, 15+, total (%)', unit: '% ages 15+' },
  { code: 'NE.TRD.GNFS.ZS', slug: 'trade-share-of-gdp', name: 'Trade (% of GDP)', unit: '% of GDP' },
  { code: 'NE.EXP.GNFS.ZS', slug: 'exports-share-of-gdp', name: 'Exports of goods and services (% of GDP)', unit: '% of GDP' },
  { code: 'NE.IMP.GNFS.ZS', slug: 'imports-share-of-gdp', name: 'Imports of goods and services (% of GDP)', unit: '% of GDP' },
  { code: 'BX.KLT.DINV.WD.GD.ZS', slug: 'fdi-net-inflows-share-of-gdp', name: 'Foreign direct investment, net inflows (% of GDP)', unit: '% of GDP' },
  { code: 'IT.NET.USER.ZS', slug: 'internet-use', name: 'Individuals using the Internet (% of population)', unit: '% of population' },
  { code: 'IT.CEL.SETS.P2', slug: 'mobile-subscriptions', name: 'Mobile cellular subscriptions (per 100 people)', unit: 'per 100 people' },
  { code: 'EG.ELC.ACCS.ZS', slug: 'electricity-access', name: 'Access to electricity (% of population)', unit: '% of population' },
  { code: 'EG.FEC.RNEW.ZS', slug: 'renewable-energy-consumption', name: 'Renewable energy consumption (% of total final energy consumption)', unit: '% of final energy consumption' },
  { code: 'EN.ATM.CO2E.PC', slug: 'co2-emissions-per-capita', name: 'CO2 emissions (metric tons per capita)', unit: 'metric tons per person' },
  { code: 'AG.LND.FRST.ZS', slug: 'forest-area-share', name: 'Forest area (% of land area)', unit: '% of land area' },
  { code: 'AG.LND.AGRI.ZS', slug: 'agricultural-land-share', name: 'Agricultural land (% of land area)', unit: '% of land area' },
  { code: 'SH.XPD.CHEX.GD.ZS', slug: 'health-expenditure-share-of-gdp', name: 'Current health expenditure (% of GDP)', unit: '% of GDP' }
];

function apiRows(payload) { return Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : []; }
function countryMap(payload) {
  return new Map(apiRows(payload).filter(c => c?.id && c?.name && c?.region?.id && c.region.id !== 'NA').map(c => [c.id, { code:c.id, country:c.name, region:{ code:c.region.id, name:c.region.value } }]));
}
function normalizeYear(spec, payload, countries, year) {
  const records = apiRows(payload).filter(o => o?.indicator?.id === spec.code && Number(o?.date) === year && typeof o?.value === 'number' && Number.isFinite(o.value) && countries.has(o.countryiso3code)).map(o => ({ ...countries.get(o.countryiso3code), value:o.value, year }));
  records.sort((a,b)=>a.country.localeCompare(b.country));
  return records;
}
async function fetchJson(url, fetchImpl, attempts=3) {
  let last;
  for (let i=0;i<attempts;i++) { try { const r=await fetchImpl(url); if (r.ok) return await r.json(); last=new Error(`HTTP ${r.status}`); } catch(e){ last=e; } if(i+1<attempts) await new Promise(r=>setTimeout(r,1000*(i+1))); }
  throw last;
}
export async function ingestCatalog({ latestYear=LATEST_YEAR, earliestYear=EARLIEST_SNAPSHOT_YEAR, minCountries=MIN_COUNTRIES, fetchImpl=fetch }={}) {
  const retrievedAt=new Date().toISOString().slice(0,10); const countryMetadataUrl='https://api.worldbank.org/v2/country?format=json&per_page=400';
  const countries=countryMap(await fetchJson(countryMetadataUrl,fetchImpl)); const outputRoot=new URL('../site/data/wdi/',import.meta.url); await mkdir(outputRoot,{recursive:true}); const catalog=[];
  for(const spec of INDICATORS){
    let selected=null; const attempts=[];
    for(let year=latestYear;year>=earliestYear;year--){
      const url=`https://api.worldbank.org/v2/country/all/indicator/${spec.code}?date=${year}&format=json&per_page=400&source=2`;
      try { const records=normalizeYear(spec,await fetchJson(url,fetchImpl),countries,year); attempts.push({year,countries:records.length}); if(records.length>=minCountries){selected={year,records,url};break;} } catch(e){ attempts.push({year,countries:0,error:String(e.message||e)}); }
    }
    const directory=new URL(`${spec.slug}/`,outputRoot); await mkdir(directory,{recursive:true});
    const snapshot={schemaVersion:'1.1',status:selected?'CURRENT_VERIFIED':'INSUFFICIENT_CURRENT_COVERAGE',indicator:{code:spec.code,name:spec.name,unit:spec.unit},observationYear:selected?.year??null,coverage:{type:'latest_well_covered_same_year_snapshot',countries:selected?.records.length??0,minimumCountries:minCountries,searchWindow:{latestYear,earliestYear},attempts,note:'Newest same-year non-aggregate country snapshot meeting the coverage threshold; no country is backfilled from another year.'},retrievedAt,retrievalUrl:selected?.url??null,countryMetadataUrl,source:{publisher:'World Bank',dataset:'World Development Indicators',surface:'World Bank Indicators API v2',metadataUrl:`https://data.worldbank.org/indicator/${spec.code}`,license:'CC BY-4.0',attribution:'World Bank World Development Indicators.'},records:selected?.records??[]};
    await writeFile(new URL('data.json',directory),`${JSON.stringify(snapshot,null,2)}\n`,'utf8'); catalog.push({...spec,year:snapshot.observationYear,countries:snapshot.records.length,status:snapshot.status,dataUrl:`/data/wdi/${spec.slug}/data.json`});
  }
  await writeFile(new URL('index.json',outputRoot),`${JSON.stringify({schemaVersion:'1.1',generatedAt:new Date().toISOString(),source:'World Development Indicators',selectionPolicy:{latestYear,earliestYear,minCountries},indicators:catalog},null,2)}\n`,'utf8'); console.log(`Ingested ${catalog.length} WDI indicators: ${catalog.map(x=>`${x.code}=${x.year??'none'}/${x.countries}`).join(', ')}`); return catalog;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href) ingestCatalog().catch(e=>{console.error(e.message);process.exitCode=1;});
