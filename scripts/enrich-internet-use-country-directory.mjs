import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const htmlUrl = new URL('index.html', root);
const canonical = 'https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function validate(data) {
  if (data?.status !== 'CURRENT_VERIFIED') throw new Error('country directory requires CURRENT_VERIFIED data');
  if (data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected indicator code');
  if (!Number.isInteger(data?.observationYear)) throw new Error('observationYear is required');
  if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('at least two verified records are required');
  if (!data.records.every((record) => /^[A-Z]{3}$/.test(record.code) && record.year === data.observationYear && typeof record.value === 'number')) {
    throw new Error('invalid or mixed-year country records');
  }
}

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
validate(data);
let html = await readFile(htmlUrl, 'utf8');

const records = [...data.records].sort((a, b) => a.country.localeCompare(b.country));
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Internet use country profiles — ${data.observationYear}`,
  description: `Country profile pages derived from the same verified ${data.observationYear} ${data.indicator.code} dataset.`,
  numberOfItems: records.length,
  itemListElement: records.map((record, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${canonical}country/${record.code.toLowerCase()}/`,
    name: `${record.country} internet use rate in ${data.observationYear}`
  }))
};

const directory = `<section class="section section-soft" id="country-profiles"><div class="wrap"><h2>Browse country profiles</h2><p>Open a country page for the exact ${data.observationYear} observation, same-dataset rank context and country-level JSON/CSV evidence. These profiles cover only the countries in this verified same-year dataset.</p><div class="grid">${records.map((record) => `<article class="card"><span class="pill">${esc(record.code)} · ${record.value}%</span><h3><a href="./country/${record.code.toLowerCase()}/">${esc(record.country)}</a></h3><p>${record.value}% in ${record.year}. View provenance, peer context and machine-readable country evidence.</p></article>`).join('')}</div><p><a href="./country/index.json">Machine-readable country directory →</a></p></div></section>`;

if (!html.includes('id="country-profiles"')) {
  const preferredMarker = '<section class="section"><div class="wrap"><h2>How to read this indicator</h2>';
  const fallbackMarker = '</main>';

  if (html.includes(preferredMarker)) {
    html = html.replace(preferredMarker, `${directory}${preferredMarker}`);
  } else if (html.includes(fallbackMarker)) {
    html = html.replace(fallbackMarker, `${directory}${fallbackMarker}`);
  } else {
    throw new Error('internet-use insertion marker not found and no fallback location available');
  }
}

if (!html.includes('Internet use country profiles')) {
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(itemList)}</script></head>`);
}

await writeFile(htmlUrl, html, 'utf8');
console.log(`Added crawlable country directory and ItemList discovery for ${records.length} internet-use profiles.`);
