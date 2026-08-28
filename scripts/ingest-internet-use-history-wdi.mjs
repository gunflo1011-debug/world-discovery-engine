import { readFile, writeFile } from 'node:fs/promises';

const startYear = Number(process.argv.includes('--start') ? process.argv[process.argv.indexOf('--start') + 1] : 1990);
const endYear = Number(process.argv.includes('--end') ? process.argv[process.argv.indexOf('--end') + 1] : 2024);
if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear > endYear) throw new Error('invalid history year range');

const indicator = 'IT.NET.USER.ZS';
const root = new URL('../site/indicators/internet-use/', import.meta.url);
const current = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));
const countryMetaUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
const retrievalUrl = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${startYear}:${endYear}&format=json&per_page=20000&source=2`;

async function getJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'WorldDiscoveryData/1.0 (+https://worlddiscoverydata.com/)' } });
  if (!response.ok) throw new Error(`World Bank request failed: ${response.status} ${url}`);
  return response.json();
}

const [countryPayload, seriesPayload] = await Promise.all([getJson(countryMetaUrl), getJson(retrievalUrl)]);
const countryRows = countryPayload?.[1];
const seriesRows = seriesPayload?.[1];
if (!Array.isArray(countryRows) || !Array.isArray(seriesRows)) throw new Error('unexpected World Bank API response');

const countries = new Map(countryRows
  .filter(row => /^[A-Z]{3}$/.test(row?.id) && row?.region?.id && row.region.id !== 'NA')
  .map(row => [row.id, { code: row.id, country: row.name, region: { code: row.region.id, name: row.region.value?.trim() } }]));
const allowed = new Set(current.records.map(record => record.code));
const grouped = new Map();
for (const row of seriesRows) {
  const code = row?.countryiso3code;
  const year = Number(row?.date);
  const value = row?.value;
  if (!allowed.has(code) || !countries.has(code) || !Number.isInteger(year) || year < startYear || year > endYear || !Number.isFinite(value) || value < 0 || value > 100) continue;
  if (!grouped.has(code)) grouped.set(code, []);
  grouped.get(code).push({ year, value });
}

const currentByCode = new Map(current.records.map(record => [record.code, record]));
const records = [];
for (const [code, observationsRaw] of grouped) {
  const observations = observationsRaw.sort((a, b) => a.year - b.year);
  if (observations.length < 2) continue;
  const meta = countries.get(code);
  const latest = observations.at(-1);
  const first = observations[0];
  const currentRecord = currentByCode.get(code);
  const sameYear = observations.find(item => item.year === current.observationYear);
  if (currentRecord && sameYear && Math.abs(sameYear.value - currentRecord.value) > 1e-9) throw new Error(`history/current snapshot mismatch for ${code}`);
  records.push({
    ...meta,
    firstYear: first.year,
    latestYear: latest.year,
    latestValue: latest.value,
    changePp: latest.value - first.value,
    observations
  });
}
records.sort((a, b) => a.country.localeCompare(b.country));
if (records.length < 150) throw new Error(`history coverage unexpectedly low: ${records.length}`);

const output = {
  schemaVersion: '1.0',
  status: 'CURRENT_VERIFIED_HISTORY',
  indicator: current.indicator,
  period: { startYear, endYear },
  coverage: {
    countries: records.length,
    currentSnapshotCountries: current.records.length,
    rule: 'Only countries in the verified current snapshot are included; null years remain missing and are never interpolated.'
  },
  retrievedAt: new Date().toISOString().slice(0, 10),
  retrievalUrl,
  countryMetadataUrl: countryMetaUrl,
  source: current.source,
  records
};
await writeFile(new URL('history.json', root), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote verified internet-use history for ${records.length} countries (${startYear}-${endYear}).`);
