import fs from 'node:fs/promises';
import path from 'node:path';

const INDICATOR = 'SP.DYN.LE00.IN';
const API = `https://api.worldbank.org/v2/country/all/indicator/${INDICATOR}?format=json&mrnev=1&per_page=400`;
const OUT = path.resolve('data/life-expectancy/latest.json');

function fail(message) { throw new Error(`Life expectancy snapshot rejected: ${message}`); }

const response = await fetch(API, { headers: { accept: 'application/json' } });
if (!response.ok) fail(`World Bank API HTTP ${response.status}`);
const payload = await response.json();
if (!Array.isArray(payload) || !Array.isArray(payload[1])) fail('unexpected World Bank response');

const rows = payload[1].filter((row) => row?.countryiso3code && row.countryiso3code.length === 3 && row.region?.id !== 'NA' && row.value != null);
if (rows.length < 100) fail(`coverage too small (${rows.length} country observations)`);

const observations = rows.map((row) => {
  const value = Number(row.value);
  const year = Number(row.date);
  if (!Number.isFinite(value) || value <= 0 || value > 120) fail(`invalid value for ${row.countryiso3code}`);
  if (!Number.isInteger(year) || year < 1900 || year > new Date().getUTCFullYear()) fail(`invalid year for ${row.countryiso3code}`);
  return { countryCode: row.countryiso3code, country: row.country?.value, year, value };
}).sort((a, b) => a.country.localeCompare(b.country));

const snapshot = {
  status: 'CURRENT_VERIFIED',
  indicator: INDICATOR,
  label: 'Life expectancy at birth, total (years)',
  unit: 'years',
  source: 'World Bank World Development Indicators',
  sourceUrl: `https://api.worldbank.org/v2/country/all/indicator/${INDICATOR}`,
  methodologyUrl: `https://data.worldbank.org/indicator/${INDICATOR}`,
  retrievedAt: new Date().toISOString(),
  observations
};

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${observations.length} verified life-expectancy observations to ${OUT}`);
