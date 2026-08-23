import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const regionRoot = new URL('region/', root);
const countryRoot = new URL('country/', root);
const baseCanonical = 'https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugFor = (code) => String(code).toLowerCase();
const valueLabel = (value) => `${Number(value).toFixed(1)}%`;

function validate(data) {
  if (data?.status !== 'CURRENT_VERIFIED') throw new Error('regional pages require CURRENT_VERIFIED data');
  if (data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected indicator code');
  if (!Number.isInteger(data?.observationYear)) throw new Error('observationYear is required');
  if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('at least two records are required');
  if (!data.records.every((record) => record.year === data.observationYear)) throw new Error('mixed observation years are forbidden');
  if (!data.records.every((record) => /^[A-Z]{3}$/.test(record.code) && typeof record.value === 'number' && record.value >= 0 && record.value <= 100)) {
    throw new Error('invalid country record');
  }
  if (!data.records.every((record) => /^[A-Z]{3}$/.test(record?.region?.code) && typeof record?.region?.name === 'string' && record.region.name.trim())) {
    throw new Error('official record.region code/name is required for every country');
  }
  if (!data?.countryMetadataUrl || !/^https:\/\/api\.worldbank\.org\//.test(data.countryMetadataUrl)) {
    throw new Error('official World Bank country metadata provenance is required');
  }
  if (!data?.source?.publisher || !data?.source?.dataset || !data?.source?.metadataUrl || !data?.source?.license || !data?.retrievalUrl || !data?.retrievedAt) {
    throw new Error('regional page provenance is incomplete');
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function ranked(records) {
  const sorted = [...records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  let lastValue;
  let rank = 0;
  return sorted.map((record, index) => {
    if (record.value !== lastValue) rank = index + 1;
    lastValue = record.value;
    return { ...record, regionRank: rank };
  });
}

function groupRegions(records) {
  const namesByCode = new Map();
  const groups = new Map();
  for (const record of records) {
    const name = record.region.name.trim();
    const knownName = namesByCode.get(record.region.code);
    if (knownName && knownName !== name) throw new Error(`conflicting official region names for ${record.region.code}`);
    namesByCode.set(record.region.code, name);
    if (!groups.has(record.region.code)) groups.set(record.region.code, { code: record.region.code, name, records: [] });
    groups.get(record.region.code).records.push(record);
  }
  if (groups.size !== 7) throw new Error(`expected exactly 7 official regions, found ${groups.size}`);
  if ([...groups.values()].some((region) => region.records.length < 2)) throw new Error('regional landing pages require at least two country observations');
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function regionPage(data, region) {
  const records = ranked(region.records);
  const canonical = `${baseCanonical}region/${slugFor(region.code)}/`;
  const values = records.map((record) => record.value);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const middle = median(values);
  const high = records[0];
  const low = records.at(-1);
  const spread = high.value - low.value;
  const above90 = records.filter((record) => record.value >= 90).length;
  const below50 = records.filter((record) => record.value < 50).length;
  const title = `${region.name} internet use in ${data.observationYear} | World Discovery Engine`;
  const description = `Compare ${data.observationYear} internet use across ${records.length} countries in ${region.name}: regional ranking, median, range and official ITU/WDI provenance.`;
  const summary = `${region.name} contains ${records.length} countries with verified ${data.observationYear} observations in this dataset. The regional median is ${valueLabel(middle)} and the arithmetic mean is ${valueLabel(average)}. Values range from ${valueLabel(low.value)} in ${low.country} to ${valueLabel(high.value)} in ${high.country}, a spread of ${valueLabel(spread).replace('%', ' percentage points')}. ${above90} ${above90 === 1 ? 'country records' : 'countries record'} at least 90%, while ${below50} ${below50 === 1 ? 'is' : 'are'} below 50%. These comparisons are scoped to this official region and do not claim a worldwide rank.`;
  const itemList = records.map((record, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseCanonical}country/${slugFor(record.code)}/`,
    name: `${record.country}: ${valueLabel(record.value)} in ${record.year}`
  }));
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `${region.name} internet use in ${data.observationYear}`,
        description,
        url: canonical,
        dateModified: data.retrievedAt,
        isPartOf: { '@type': 'Dataset', name: `Internet use by country — ${data.observationYear}`, url: baseCanonical },
        about: { '@type': 'Place', name: region.name, identifier: region.code }
      },
      {
        '@type': 'ItemList',
        name: `${region.name} internet use ranking — ${data.observationYear}`,
        numberOfItems: records.length,
        itemListElement: itemList
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Indicators', item: 'https://gunflo1011-debug.github.io/world-discovery-engine/indicators/' },
          { '@type': 'ListItem', position: 2, name: 'Internet use', item: baseCanonical },
          { '@type': 'ListItem', position: 3, name: region.name, item: canonical }
        ]
      }
    ]
  };
  const topCards = records.slice(0, Math.min(5, records.length)).map((record) => `<article class="card"><span class="pill">REGION RANK ${record.regionRank}</span><h3><a href="../../country/${slugFor(record.code)}/">${esc(record.country)}</a></h3><p>${valueLabel(record.value)} in ${record.year}.</p></article>`).join('');
  const rows = records.map((record) => `<tr><td>${record.regionRank}</td><th scope="row"><a href="../../country/${slugFor(record.code)}/">${esc(record.country)}</a></th><td>${esc(record.code)}</td><td>${valueLabel(record.value)}</td><td>${record.year}</td></tr>`).join('');
  const retrieved = new Date(`${data.retrievedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../../../../styles.css"><script type="application/ld+json">${JSON.stringify(structured)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../../../index.html">Home</a><a href="../../../../evidence/index.html">Evidence</a><a href="../../../index.html" aria-current="page">Indicators</a><a href="../../../../explore/index.html">Explore</a><a href="../../../../methodology/index.html">Methodology</a><a href="../../../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet use · ${esc(region.code)} · ${data.observationYear}</div><h1>Internet use in ${esc(region.name)}</h1><p>Compare ${records.length} official same-year country observations, with rankings and context calculated only within ${esc(region.name)}.</p><span class="pill">${data.observationYear} · ${esc(data.indicator.code)} · REGION-SCOPED</span></div></section><section class="section"><div class="wrap"><h2>Regional picture</h2><p>${esc(summary)}</p><div class="grid"><article class="card"><span class="pill">MEDIAN</span><h3>${valueLabel(middle)}</h3><p>Half of the included regional observations are at or below this value and half are at or above it.</p></article><article class="card"><span class="pill">MEAN</span><h3>${valueLabel(average)}</h3><p>Arithmetic mean across all ${records.length} included countries in ${esc(region.name)}.</p></article><article class="card"><span class="pill">RANGE</span><h3>${valueLabel(low.value)}–${valueLabel(high.value)}</h3><p>${valueLabel(spread).replace('%', ' percentage points')} between the lowest and highest regional observations.</p></article></div></div></section><section class="section section-soft"><div class="wrap"><h2>Highest values in the region</h2><p>These are the ${Math.min(5, records.length)} highest ${data.observationYear} observations within ${esc(region.name)}${records.length < 5 ? '' : '; ties retain the same rank'}.</p><div class="grid">${topCards}</div></div></section><section class="section"><div class="wrap"><h2>All ${records.length} country observations</h2><p>Values are rounded to one decimal place for display. Rankings are calculated only among the countries assigned to this official World Bank region in the accepted dataset.</p><div class="table-wrap" tabindex="0" aria-label="${esc(region.name)} internet use ranking"><table class="table"><caption>${esc(region.name)} · ${data.observationYear} · ${esc(data.indicator.code)}</caption><thead><tr><th scope="col">Region rank</th><th scope="col">Country</th><th scope="col">Code</th><th scope="col">Internet use</th><th scope="col">Year</th></tr></thead><tbody>${rows}</tbody></table></div></div></section><section class="section section-soft"><div class="wrap"><h2>Definition, source and scope</h2><p><strong>${esc(data.indicator.code)} — ${esc(data.indicator.name)}:</strong> ${esc(data.indicator.definition)}</p><p><strong>Source:</strong> ${esc(data.source.publisher)}, ${esc(data.source.dataset)}, surfaced via ${esc(data.source.surface)}. Region membership comes from the official World Bank country metadata response retained by the ingestion pipeline; no separate country-to-region mapping is used.</p><p><strong>Observation year:</strong> ${data.observationYear}. <strong>Retrieved:</strong> ${esc(retrieved)}. <strong>License:</strong> ${esc(data.source.license)}.</p><p>${esc(data.source.attribution)}</p><p><a href="${esc(data.retrievalUrl)}">World Bank indicator API →</a> · <a href="${esc(data.countryMetadataUrl)}">World Bank country metadata API →</a> · <a href="${esc(data.source.metadataUrl)}">WDI metadata →</a> · <a href="../../data.json">Full JSON →</a> · <a href="../../data.csv">Full CSV →</a></p><p>This page is a same-year regional comparison, not a historical revision product, causal analysis or complete worldwide ranking.</p><p><a href="../../">Back to the global Internet use comparison →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Official-region discovery from verified same-year observations.</div></footer></body></html>`;
}

async function addCountryBacklink(record) {
  const countryUrl = new URL(`${slugFor(record.code)}/index.html`, countryRoot);
  let html = await readFile(countryUrl, 'utf8');
  const href = `../../region/${slugFor(record.region.code)}/`;
  if (html.includes(`href="${href}"`)) return;
  const marker = '<p><a href="../../">Back to Internet use by country →</a></p>';
  if (!html.includes(marker)) throw new Error(`country region-link marker missing for ${record.code}`);
  html = html.replace(marker, `<p><a href="${href}">Compare ${esc(record.region.name.trim())} →</a> · <a href="../../">Back to Internet use by country →</a></p>`);
  await writeFile(countryUrl, html, 'utf8');
}

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
validate(data);
const regions = groupRegions(data.records);
await rm(regionRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
await mkdir(regionRoot, { recursive: true });

for (const region of regions) {
  const directory = new URL(`${slugFor(region.code)}/`, regionRoot);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), regionPage(data, region), 'utf8');
}
for (const record of data.records) await addCountryBacklink(record);

console.log(`Built exactly ${regions.length} official-region landing pages and ${data.records.length} country backlinks.`);
