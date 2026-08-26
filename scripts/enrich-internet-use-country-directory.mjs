import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const htmlUrl = new URL('index.html', root);
const canonical = 'https://worlddiscoverydata.com/indicators/internet-use/';

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

// Country links already exist twice in crawlable HTML: the region directory and
// the comparison table. Remove the legacy third 182-card rendering when this
// enrichment is run against an older generated artifact.
html = html.replace(/<section\b[^>]*\bid="country-profiles"[^>]*>[\s\S]*?<\/section>/, '');

// Keep the user-visible scope contract explicit. The dataset is broad and same-year,
// but countries without a current-year observation are deliberately omitted rather
// than backfilled, so this must not be presented as a complete global ranking.
html = html.replace(
  `Countries without a ${data.observationYear} observation are omitted rather than backfilled from older years.`,
  `Countries without a ${data.observationYear} observation are omitted rather than backfilled from older years, so this is not a complete global ranking.`
);

if (!html.includes('Internet use country profiles')) {
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(itemList)}</script></head>`);
}

if (!html.includes('../../internet-table.js')) {
  html = html.replace('</head>', '<script src="../../internet-table.js" defer></script></head>');
}

if (!html.includes('id="comparison-trust"')) {
  const trust = '<nav id="comparison-trust" class="sourcebox" aria-label="Verify this comparison data"><strong>Verify before you compare:</strong> <a href="#source-provenance">Source, license and retrieval</a> · <a href="../../methodology/">Validation methodology</a></nav>';
  html = html.replace('<div class="internet-tools" id="internet-tools" hidden>', `${trust}<div class="internet-tools" id="internet-tools" hidden>`);
}

if (!html.includes('id="source-provenance"')) {
  html = html.replace(
    '<section class="section"><div class="wrap"><h2>Source and provenance</h2>',
    '<section class="section" id="source-provenance" tabindex="-1"><div class="wrap"><h2>Source and provenance</h2>'
  );
}

await writeFile(htmlUrl, html, 'utf8');
console.log(`Added ItemList discovery for ${records.length} country profiles without duplicating the crawlable HTML directory.`);
