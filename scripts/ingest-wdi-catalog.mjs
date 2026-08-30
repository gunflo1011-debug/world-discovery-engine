import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const DEFAULT_YEAR = 2024;
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

function rows(payload, label) {
  if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) throw new Error(`${label} returned an unexpected World Bank API payload`);
  return payload[1];
}

function countryMap(payload) {
  return new Map(rows(payload, 'country metadata')
    .filter((country) => country?.id && country?.name && country?.region?.id && country.region.id !== 'NA')
    .map((country) => [country.id, { code: country.id, country: country.name, region: { code: country.region.id, name: country.region.value } }]));
}

export function normalizeSnapshot({ spec, indicatorPayload, countries, year, retrievedAt, retrievalUrl, countryMetadataUrl }) {
  const records = [];
  for (const observation of rows(indicatorPayload, spec.code)) {
    if (observation?.indicator?.id !== spec.code || Number(observation?.date) !== year) continue;
    const country = countries.get(observation?.countryiso3code);
    if (!country || typeof observation?.value !== 'number' || !Number.isFinite(observation.value)) continue;
    records.push({ ...country, value: observation.value, year });
  }
  records.sort((a, b) => a.country.localeCompare(b.country));
  if (new Set(records.map((record) => record.code)).size !== records.length) throw new Error(`duplicate ${spec.code} country observations`);
  return {
    schemaVersion: '1.0', status: records.length >= 2 ? 'CURRENT_VERIFIED' : 'INSUFFICIENT_CURRENT_COVERAGE',
    indicator: { code: spec.code, name: spec.name, unit: spec.unit }, observationYear: year,
    coverage: { type: 'official_same_year_snapshot', countries: records.length, note: `Non-aggregate country observations returned by WDI for ${spec.code} in ${year}; missing countries are not backfilled.` },
    retrievedAt, retrievalUrl, countryMetadataUrl,
    source: { publisher: 'World Bank', dataset: 'World Development Indicators', surface: 'World Bank Indicators API v2', metadataUrl: `https://data.worldbank.org/indicator/${spec.code}`, license: 'CC BY-4.0', attribution: 'World Bank World Development Indicators.' },
    records
  };
}

export async function ingestCatalog({ year = DEFAULT_YEAR, fetchImpl = fetch } = {}) {
  const retrievedAt = new Date().toISOString().slice(0, 10);
  const countryMetadataUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
  const countryResponse = await fetchImpl(countryMetadataUrl);
  if (!countryResponse.ok) throw new Error(`World Bank country request failed: HTTP ${countryResponse.status}`);
  const countries = countryMap(await countryResponse.json());
  const outputRoot = new URL('../site/data/wdi/', import.meta.url);
  await mkdir(outputRoot, { recursive: true });
  const catalog = [];

  for (const spec of INDICATORS) {
    const retrievalUrl = `https://api.worldbank.org/v2/country/all/indicator/${spec.code}?date=${year}&format=json&per_page=400&source=2`;
    const response = await fetchImpl(retrievalUrl);
    if (!response.ok) throw new Error(`World Bank ${spec.code} request failed: HTTP ${response.status}`);
    const snapshot = normalizeSnapshot({ spec, indicatorPayload: await response.json(), countries, year, retrievedAt, retrievalUrl, countryMetadataUrl });
    const directory = new URL(`${spec.slug}/`, outputRoot);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL('data.json', directory), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    catalog.push({ ...spec, year, countries: snapshot.records.length, status: snapshot.status, dataUrl: `/data/wdi/${spec.slug}/data.json` });
  }

  await writeFile(new URL('index.json', outputRoot), `${JSON.stringify({ schemaVersion: '1.0', generatedAt: new Date().toISOString(), source: 'World Development Indicators', indicators: catalog }, null, 2)}\n`, 'utf8');
  console.log(`Ingested ${catalog.length} WDI indicators for ${year}: ${catalog.map(item => `${item.code}=${item.countries}`).join(', ')}`);
  return catalog;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const yearIndex = process.argv.indexOf('--year');
  const year = yearIndex >= 0 ? Number(process.argv[yearIndex + 1]) : DEFAULT_YEAR;
  ingestCatalog({ year }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
