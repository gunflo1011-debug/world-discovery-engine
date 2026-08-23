import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const INDICATOR_CODE = 'IT.NET.USER.ZS';
export const DEFAULT_YEAR = 2024;
const OUTPUT_URL = new URL('../site/indicators/internet-use/data.json', import.meta.url);

function assertArrayPayload(payload, label) {
  if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) {
    throw new Error(`${label} returned an unexpected World Bank API payload`);
  }
  return payload[1];
}

function countryMap(countryPayload) {
  const countries = assertArrayPayload(countryPayload, 'country metadata');
  return new Map(countries
    .filter((country) => country?.id && country?.name && country?.region?.id && country?.region?.value && country.region.id !== 'NA')
    .map((country) => [country.id, {
      code: country.id,
      country: country.name,
      region: { code: country.region.id, name: country.region.value }
    }]));
}

export function normalizeInternetUseSnapshot({ indicatorPayload, countryPayload, year, retrievedAt, retrievalUrl, countryMetadataUrl }) {
  if (!Number.isInteger(year)) throw new Error('year must be an integer');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(retrievedAt)) throw new Error('retrievedAt must be YYYY-MM-DD');
  if (!/^https:\/\/api\.worldbank\.org\//.test(retrievalUrl)) throw new Error('retrievalUrl must be an official World Bank API URL');
  if (!/^https:\/\/api\.worldbank\.org\//.test(countryMetadataUrl)) throw new Error('countryMetadataUrl must be an official World Bank API URL');

  const countries = countryMap(countryPayload);
  const observations = assertArrayPayload(indicatorPayload, 'indicator data');
  const records = [];

  for (const observation of observations) {
    if (observation?.indicator?.id !== INDICATOR_CODE) continue;
    if (Number(observation?.date) !== year) continue;
    const country = countries.get(observation?.countryiso3code);
    if (!country) continue; // excludes World Bank aggregates and unknown entities fail-closed
    if (typeof observation?.value !== 'number' || !Number.isFinite(observation.value)) continue;
    if (observation.value < 0 || observation.value > 100) {
      throw new Error(`out-of-range percentage for ${country.code}: ${observation.value}`);
    }
    records.push({ ...country, value: observation.value, year });
  }

  records.sort((a, b) => a.country.localeCompare(b.country) || a.code.localeCompare(b.code));
  const codes = new Set(records.map((record) => record.code));
  if (codes.size !== records.length) throw new Error('duplicate country observations in WDI response');
  if (records.length < 2) throw new Error('official same-year snapshot contains fewer than two country observations');

  return {
    schemaVersion: '1.2',
    status: 'CURRENT_VERIFIED',
    indicator: {
      code: INDICATOR_CODE,
      name: 'Individuals using the Internet (% of population)',
      unit: '% of population',
      definition: 'Individuals who have used the Internet from any location in the last 3 months.'
    },
    observationYear: year,
    coverage: {
      type: 'official_same_year_snapshot',
      countries: records.length,
      note: `All non-aggregate country observations returned by the official World Bank Indicators API for ${INDICATOR_CODE} in ${year}; missing countries are not backfilled from other years.`
    },
    retrievedAt,
    retrievalUrl,
    countryMetadataUrl,
    source: {
      publisher: 'International Telecommunication Union (ITU)',
      dataset: 'World Telecommunication/ICT Indicators Database',
      surface: 'World Bank World Development Indicators (WDI), Indicators API v2',
      metadataUrl: 'https://databank.worldbank.org/metadataglossary/world-development-indicators/series/IT.NET.USER.ZS',
      license: 'CC BY-4.0',
      attribution: 'Please cite the International Telecommunication Union for third-party use of these data.'
    },
    records
  };
}

export async function fetchInternetUseSnapshot({ year = DEFAULT_YEAR, retrievedAt = new Date().toISOString().slice(0, 10), fetchImpl = fetch } = {}) {
  const indicatorUrl = `https://api.worldbank.org/v2/country/all/indicator/${INDICATOR_CODE}?date=${year}&format=json&per_page=400&source=2`;
  const countriesUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
  const [indicatorResponse, countryResponse] = await Promise.all([fetchImpl(indicatorUrl), fetchImpl(countriesUrl)]);
  if (!indicatorResponse.ok) throw new Error(`World Bank indicator request failed: HTTP ${indicatorResponse.status}`);
  if (!countryResponse.ok) throw new Error(`World Bank country request failed: HTTP ${countryResponse.status}`);
  const [indicatorPayload, countryPayload] = await Promise.all([indicatorResponse.json(), countryResponse.json()]);
  return normalizeInternetUseSnapshot({
    indicatorPayload,
    countryPayload,
    year,
    retrievedAt,
    retrievalUrl: indicatorUrl,
    countryMetadataUrl: countriesUrl
  });
}

function parseArgs(argv) {
  let year = DEFAULT_YEAR;
  let retrievedAt = new Date().toISOString().slice(0, 10);
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--year') year = Number(argv[++index]);
    else if (argv[index] === '--retrieved-at') retrievedAt = argv[++index];
    else throw new Error(`unknown argument: ${argv[index]}`);
  }
  if (!Number.isInteger(year) || year < 1990 || year > 2100) throw new Error('year must be a plausible integer');
  return { year, retrievedAt };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const snapshot = await fetchInternetUseSnapshot(options);
  await writeFile(OUTPUT_URL, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`Ingested ${snapshot.records.length} official ${snapshot.observationYear} ${INDICATOR_CODE} country observations from WDI.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
