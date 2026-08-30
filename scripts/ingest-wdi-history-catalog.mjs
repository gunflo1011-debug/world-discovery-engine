import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { INDICATORS } from './ingest-wdi-catalog.mjs';

export const DEFAULT_FROM_YEAR = 2000;
export const DEFAULT_TO_YEAR = 2024;

function rows(payload, label) {
  if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) throw new Error(`${label} returned an unexpected World Bank API payload`);
  return payload[1];
}

function countryMap(payload) {
  return new Map(rows(payload, 'country metadata')
    .filter((country) => country?.id && country?.name && country?.region?.id && country.region.id !== 'NA')
    .map((country) => [country.id, { code: country.id, country: country.name, region: { code: country.region.id, name: country.region.value } }]));
}

export async function ingestHistoryCatalog({ fromYear = DEFAULT_FROM_YEAR, toYear = DEFAULT_TO_YEAR, fetchImpl = fetch } = {}) {
  if (!Number.isInteger(fromYear) || !Number.isInteger(toYear) || fromYear > toYear) throw new Error('invalid year range');
  const retrievedAt = new Date().toISOString().slice(0, 10);
  const countryMetadataUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
  const countryResponse = await fetchImpl(countryMetadataUrl);
  if (!countryResponse.ok) throw new Error(`World Bank country request failed: HTTP ${countryResponse.status}`);
  const countries = countryMap(await countryResponse.json());
  const outputRoot = new URL('../site/data/wdi/', import.meta.url);
  await mkdir(outputRoot, { recursive: true });
  const catalog = [];

  for (const spec of INDICATORS) {
    const retrievalUrl = `https://api.worldbank.org/v2/country/all/indicator/${spec.code}?date=${fromYear}:${toYear}&format=json&per_page=10000&source=2`;
    const response = await fetchImpl(retrievalUrl);
    if (!response.ok) throw new Error(`World Bank ${spec.code} history request failed: HTTP ${response.status}`);
    const records = [];
    for (const observation of rows(await response.json(), `${spec.code} history`)) {
      const year = Number(observation?.date);
      const country = countries.get(observation?.countryiso3code);
      if (observation?.indicator?.id !== spec.code || !country || !Number.isInteger(year) || year < fromYear || year > toYear) continue;
      if (typeof observation?.value !== 'number' || !Number.isFinite(observation.value)) continue;
      records.push({ ...country, value: observation.value, year });
    }
    records.sort((a, b) => a.code.localeCompare(b.code) || a.year - b.year);
    const uniqueKeys = new Set(records.map((record) => `${record.code}:${record.year}`));
    if (uniqueKeys.size !== records.length) throw new Error(`duplicate ${spec.code} country-year observations`);
    const years = [...new Set(records.map((record) => record.year))].sort((a, b) => a - b);
    const countryCount = new Set(records.map((record) => record.code)).size;
    const payload = {
      schemaVersion: '1.0',
      status: records.length >= 2 ? 'VERIFIED_HISTORY' : 'INSUFFICIENT_HISTORY_COVERAGE',
      indicator: { code: spec.code, name: spec.name, unit: spec.unit },
      requestedRange: { fromYear, toYear },
      coverage: { countries: countryCount, years, observations: records.length, note: 'Official WDI country-year observations only; aggregate entities and missing values are omitted and no values are backfilled.' },
      retrievedAt,
      retrievalUrl,
      countryMetadataUrl,
      source: { publisher: 'World Bank', dataset: 'World Development Indicators', surface: 'World Bank Indicators API v2', metadataUrl: `https://data.worldbank.org/indicator/${spec.code}`, license: 'CC BY-4.0', attribution: 'World Bank World Development Indicators.' },
      records
    };
    const directory = new URL(`${spec.slug}/`, outputRoot);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL('history.json', directory), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    catalog.push({ ...spec, fromYear, toYear, countries: countryCount, years: years.length, observations: records.length, status: payload.status, dataUrl: `/data/wdi/${spec.slug}/history.json` });
  }

  await writeFile(new URL('history-index.json', outputRoot), `${JSON.stringify({ schemaVersion: '1.0', generatedAt: new Date().toISOString(), source: 'World Development Indicators', fromYear, toYear, indicators: catalog }, null, 2)}\n`, 'utf8');
  console.log(`Ingested ${catalog.reduce((sum, item) => sum + item.observations, 0)} official WDI country-year observations across ${catalog.length} indicators.`);
  return catalog;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fromIndex = process.argv.indexOf('--from-year');
  const toIndex = process.argv.indexOf('--to-year');
  const fromYear = fromIndex >= 0 ? Number(process.argv[fromIndex + 1]) : DEFAULT_FROM_YEAR;
  const toYear = toIndex >= 0 ? Number(process.argv[toIndex + 1]) : DEFAULT_TO_YEAR;
  ingestHistoryCatalog({ fromYear, toYear }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
