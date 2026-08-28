import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const htmlUrl = new URL('index.html', root);
const canonical = 'https://worlddiscoverydata.com/indicators/internet-use/';

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

// Search Console is repeatedly surfacing phrases around "internet penetration".
// Align the hub with that real user language, but keep the metric contract exact:
// IT.NET.USER.ZS measures people using the internet, not access infrastructure,
// subscriptions, network coverage or internet traffic.
html = html.replace(
  `<title>Internet use by country — ${data.observationYear} verified comparison | World Discovery Engine</title>`,
  `<title>Internet use &amp; penetration by country — ${data.observationYear} verified comparison | World Discovery Engine</title>`
);
html = html.replace(
  `Compare ${data.observationYear} internet use as a percentage of population across ${data.records.length} verified non-aggregate countries, with ITU/WDI provenance and JSON/CSV data.`,
  `Compare ${data.observationYear} internet use (often searched as internet penetration) as a percentage of population across ${data.records.length} verified non-aggregate countries, with ITU/WDI provenance and JSON/CSV data.`
);
html = html.replace(
  `<h2>Internet use by country — ${data.observationYear} observations</h2>`,
  `<h2>Internet use and penetration by country — ${data.observationYear} observations</h2>`
);
const penetrationExplanation = `<p id="internet-penetration-definition"><strong>About “internet penetration”:</strong> people often use that phrase for this topic. On this page it refers specifically to the World Development Indicators measure <strong>${esc(data.indicator.name)}</strong> (${esc(data.indicator.code)}): the share of people who used the internet. It is not a measure of household access, subscriptions, network coverage or internet traffic.</p>`;
if (!html.includes('id="internet-penetration-definition"')) {
  html = html.replace(
    `<h2>Internet use and penetration by country — ${data.observationYear} observations</h2>`,
    `<h2>Internet use and penetration by country — ${data.observationYear} observations</h2>${penetrationExplanation}`
  );
}

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

// Search Console is already surfacing country profiles for phrases such as
// "internet penetration rate", "internet access" and "how many people ... use
// the internet". Answer those intents directly while preserving the exact WDI
// metric definition instead of silently treating broader connectivity concepts
// as interchangeable.
for (const record of records) {
  const countryHtmlUrl = new URL(`country/${record.code.toLowerCase()}/index.html`, root);
  let countryHtml = await readFile(countryHtmlUrl, 'utf8');
  if (countryHtml.includes('id="internet-access-quick-answer"')) continue;

  const comparisonHeading = `<section class="section"><div class="wrap"><h2>How ${esc(record.country)} compares</h2>`;
  if (!countryHtml.includes(comparisonHeading)) {
    throw new Error(`country comparison section not found for ${record.code}`);
  }

  const quickAnswer = `<section class="section section-soft" id="internet-access-quick-answer"><div class="wrap"><h2>Internet access in ${esc(record.country)}: quick answers</h2><div class="grid"><article class="card"><span class="pill">QUICK ANSWER</span><h3>How many people in ${esc(record.country)} use the internet?</h3><p><strong>${record.value}% of the population</strong> used the internet in ${record.year} in this verified World Development Indicators observation.</p></article><article class="card"><span class="pill">METRIC CLARITY</span><h3>What is ${esc(record.country)}'s internet penetration rate?</h3><p>“Internet penetration” and “internet access rate” are common ways people search for this topic. The value reported here is specifically the official <strong>${esc(data.indicator.name)}</strong> measure (${esc(data.indicator.code)}). It should not be read as a household-access, subscription or network-coverage statistic.</p></article><article class="card"><span class="pill">DATA YEAR</span><h3>Which year does this figure describe?</h3><p>The observation is for <strong>${record.year}</strong>. The retrieval date shown below records when the source was collected and is not treated as the observation year.</p></article></div></div></section>`;
  countryHtml = countryHtml.replace(comparisonHeading, `${quickAnswer}${comparisonHeading}`);
  await writeFile(countryHtmlUrl, countryHtml, 'utf8');
}

console.log(`Added ItemList discovery and search-intent quick answers for ${records.length} country profiles.`);
