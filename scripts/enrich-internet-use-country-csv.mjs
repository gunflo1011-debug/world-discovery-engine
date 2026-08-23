import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const sourceUrl = new URL('data.json', root);
const countriesRoot = new URL('country/', root);
const registryUrl = new URL('index.json', countriesRoot);

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function countryCsv(data, record) {
  const header = [
    'entity_code',
    'entity_name',
    'indicator_code',
    'indicator_name',
    'unit',
    'reference_year',
    'value',
    'publisher',
    'dataset',
    'retrieval_url',
    'retrieved_at',
    'license'
  ];
  const row = [
    record.code,
    record.country,
    data.indicator.code,
    data.indicator.name,
    data.indicator.unit,
    record.year,
    record.value,
    data.source.publisher,
    data.source.dataset,
    data.retrievalUrl,
    data.retrievedAt,
    data.source.license
  ];
  return `${header.join(',')}\n${row.map(csvCell).join(',')}\n`;
}

function assertSource(data) {
  if (data?.status !== 'CURRENT_VERIFIED') throw new Error('country CSV enrichment requires CURRENT_VERIFIED source data');
  if (data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected indicator code');
  if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('at least two records are required');
  if (!data.records.every((record) => record.year === data.observationYear)) throw new Error('mixed observation years are forbidden');
}

const data = JSON.parse(await readFile(sourceUrl, 'utf8'));
assertSource(data);
const registry = JSON.parse(await readFile(registryUrl, 'utf8'));
if (!Array.isArray(registry?.countries)) throw new Error('country registry is missing countries');

for (const record of data.records) {
  const slug = record.code.toLowerCase();
  const directory = new URL(`${slug}/`, countriesRoot);
  const htmlUrl = new URL('index.html', directory);
  const html = await readFile(htmlUrl, 'utf8');
  const alternate = '<link rel="alternate" type="text/csv" href="./data.csv" title="Machine-readable country observation CSV">';
  let nextHtml = html;
  if (!nextHtml.includes('type="text/csv" href="./data.csv"')) {
    nextHtml = nextHtml.replace('</head>', `${alternate}</head>`);
  }
  if (!nextHtml.includes('Country CSV →')) {
    nextHtml = nextHtml.replace('Country JSON →</a> · <a href="../../data.json">', 'Country JSON →</a> · <a href="./data.csv">Country CSV →</a> · <a href="../../data.json">');
  }
  await Promise.all([
    writeFile(new URL('data.csv', directory), countryCsv(data, record), 'utf8'),
    writeFile(htmlUrl, nextHtml, 'utf8')
  ]);
}

registry.schemaVersion = '1.2';
registry.countries = registry.countries.map((item) => ({
  ...item,
  machineCsvUrl: `/indicators/internet-use/country/${String(item.code).toLowerCase()}/data.csv`
}));
await writeFile(registryUrl, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

console.log(`Added country-level CSV discovery outputs for ${data.records.length} internet-use profiles.`);
