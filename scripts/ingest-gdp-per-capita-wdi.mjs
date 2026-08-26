import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const INDICATOR_CODE = 'NY.GDP.PCAP.CD';
export const DEFAULT_YEAR = 2024;
const OUTPUT_URL = new URL('../site/indicators/gdp-per-capita/data.json', import.meta.url);

function rows(payload, label) {
  if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) throw new Error(`${label} returned an unexpected World Bank API payload`);
  return payload[1];
}

function countries(payload) {
  return new Map(rows(payload, 'country metadata')
    .filter((country) => country?.id && country?.name && country?.region?.id && country.region.id !== 'NA')
    .map((country) => [country.id, { code: country.id, country: country.name, region: { code: country.region.id, name: country.region.value } }]));
}

export function normalizeGdpPerCapitaSnapshot({ indicatorPayload, countryPayload, year, retrievedAt, retrievalUrl, countryMetadataUrl }) {
  if (!Number.isInteger(year)) throw new Error('year must be an integer');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(retrievedAt)) throw new Error('retrievedAt must be YYYY-MM-DD');
  for (const url of [retrievalUrl, countryMetadataUrl]) if (!/^https:\/\/api\.worldbank\.org\//.test(url)) throw new Error('provenance URL must be an official World Bank API URL');
  const countryMap = countries(countryPayload);
  const records = [];
  for (const observation of rows(indicatorPayload, 'indicator data')) {
    if (observation?.indicator?.id !== INDICATOR_CODE || Number(observation?.date) !== year) continue;
    const country = countryMap.get(observation?.countryiso3code);
    if (!country) continue;
    if (typeof observation?.value !== 'number' || !Number.isFinite(observation.value) || observation.value < 0) continue;
    records.push({ ...country, value: observation.value, year });
  }
  records.sort((a, b) => a.country.localeCompare(b.country) || a.code.localeCompare(b.code));
  if (new Set(records.map((record) => record.code)).size !== records.length) throw new Error('duplicate country observations in WDI response');
  if (records.length < 2) throw new Error('official same-year snapshot contains fewer than two country observations');
  return {
    schemaVersion: '1.0', status: 'CURRENT_VERIFIED',
    indicator: { code: INDICATOR_CODE, name: 'GDP per capita (current US$)', unit: 'current US$ per person', definition: 'Gross domestic product divided by midyear population, expressed in current U.S. dollars.' },
    observationYear: year,
    coverage: { type: 'official_same_year_snapshot', countries: records.length, note: `All non-aggregate country observations returned by WDI for ${INDICATOR_CODE} in ${year}; missing countries are not backfilled from other years.` },
    retrievedAt, retrievalUrl, countryMetadataUrl,
    source: { publisher: 'World Bank', dataset: 'World Development Indicators', surface: 'World Bank Indicators API v2', metadataUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD', license: 'CC BY-4.0', attribution: 'World Bank World Development Indicators; underlying national accounts sources as documented by WDI.' },
    records
  };
}

export async function fetchGdpPerCapitaSnapshot({ year = DEFAULT_YEAR, retrievedAt = new Date().toISOString().slice(0, 10), fetchImpl = fetch } = {}) {
  const indicatorUrl = `https://api.worldbank.org/v2/country/all/indicator/${INDICATOR_CODE}?date=${year}&format=json&per_page=400&source=2`;
  const countriesUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
  const [indicatorResponse, countryResponse] = await Promise.all([fetchImpl(indicatorUrl), fetchImpl(countriesUrl)]);
  if (!indicatorResponse.ok) throw new Error(`World Bank indicator request failed: HTTP ${indicatorResponse.status}`);
  if (!countryResponse.ok) throw new Error(`World Bank country request failed: HTTP ${countryResponse.status}`);
  return normalizeGdpPerCapitaSnapshot({ indicatorPayload: await indicatorResponse.json(), countryPayload: await countryResponse.json(), year, retrievedAt, retrievalUrl: indicatorUrl, countryMetadataUrl: countriesUrl });
}

async function main() {
  const yearIndex = process.argv.indexOf('--year');
  const year = yearIndex >= 0 ? Number(process.argv[yearIndex + 1]) : DEFAULT_YEAR;
  const snapshot = await fetchGdpPerCapitaSnapshot({ year });
  await writeFile(OUTPUT_URL, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`Ingested ${snapshot.records.length} official ${snapshot.observationYear} ${INDICATOR_CODE} country observations from WDI.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
