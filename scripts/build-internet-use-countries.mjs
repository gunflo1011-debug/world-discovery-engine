import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const indexUrl = new URL('index.html', root);
const countriesRoot = new URL('country/', root);
const baseCanonical = 'https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugFor = (code) => String(code).toLowerCase();

function ordinal(value) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function validate(data) {
  if (data?.status !== 'CURRENT_VERIFIED') throw new Error('internet-use country pages require CURRENT_VERIFIED data');
  if (data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected indicator code');
  if (!Number.isInteger(data?.observationYear)) throw new Error('observationYear is required');
  if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('at least two records are required');
  if (!data.records.every((record) => record.year === data.observationYear)) throw new Error('mixed observation years are forbidden');
  if (!data.records.every((record) => /^[A-Z]{3}$/.test(record.code) && typeof record.value === 'number')) throw new Error('invalid country record');
}

function rankRecords(records) {
  const sorted = [...records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  let previousValue = null;
  let rank = 0;
  return sorted.map((record, index) => {
    if (record.value !== previousValue) rank = index + 1;
    previousValue = record.value;
    return { ...record, rank };
  });
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function nearestPeers(record, ranked) {
  return ranked
    .filter((item) => item.code !== record.code)
    .sort((a, b) => Math.abs(a.value - record.value) - Math.abs(b.value - record.value) || a.country.localeCompare(b.country))
    .slice(0, 3);
}

function countryPage(data, record, ranked) {
  const canonical = `${baseCanonical}country/${slugFor(record.code)}/`;
  const top = ranked[0];
  const sliceMedian = median(ranked.map((item) => item.value));
  const versusMedian = record.value - sliceMedian;
  const versusTop = top.value - record.value;
  const peers = nearestPeers(record, ranked);
  const retrieved = new Date(`${data.retrievedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const title = `${record.country} internet use rate in ${data.observationYear}: ${record.value}% | World Discovery Engine`;
  const description = `${record.value}% of people in ${record.country} used the internet in ${data.observationYear} in this verified ITU/WDI comparison slice. See rank, peer context and source provenance.`;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${record.country} internet use rate in ${data.observationYear}`,
    description,
    url: canonical,
    isPartOf: { '@type': 'Dataset', name: `Internet use by country — ${data.observationYear} verified comparison`, url: baseCanonical },
    mainEntity: {
      '@type': 'PropertyValue',
      propertyID: data.indicator.code,
      name: data.indicator.name,
      value: record.value,
      unitText: data.indicator.unit
    },
    about: { '@type': 'Country', name: record.country, identifier: record.code },
    dateModified: data.retrievedAt
  };
  const peerCards = peers.map((peer) => `<article class="card"><span class="pill">${esc(peer.code)}</span><h3><a href="../${slugFor(peer.code)}/">${esc(peer.country)}</a></h3><p>${peer.value}% in ${peer.year}, ${Math.abs(peer.value - record.value)} percentage points ${peer.value > record.value ? 'higher' : peer.value < record.value ? 'lower' : 'the same'}.</p></article>`).join('');
  const medianText = versusMedian === 0
    ? `exactly the ${sliceMedian}% median of this ${ranked.length}-country slice`
    : `${Math.abs(versusMedian)} percentage points ${versusMedian > 0 ? 'above' : 'below'} the ${sliceMedian}% slice median`;
  const leaderText = versusTop === 0
    ? `${record.country} is tied for the highest value in this slice`
    : `${versusTop} percentage points below the current slice high of ${top.value}%`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../../../../styles.css"><script type="application/ld+json">${JSON.stringify(structured)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../../../index.html">Home</a><a href="../../../../evidence/index.html">Evidence</a><a href="../../../index.html" aria-current="page">Indicators</a><a href="../../../../explore/index.html">Explore</a><a href="../../../../methodology/index.html">Methodology</a><a href="../../../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet use · ${esc(record.code)} · ${data.observationYear}</div><h1>${esc(record.country)} internet use rate: ${record.value}%</h1><p><strong>${record.value}%</strong> of people in ${esc(record.country)} used the internet in ${record.year} in this verified ITU/WDI same-year comparison slice. ${esc(record.country)} ranks ${ordinal(record.rank)} of ${ranked.length} included countries.</p><span class="pill">${data.observationYear} OBSERVATION · ${esc(record.code)} · ${esc(data.indicator.code)}</span></div></section><section class="section"><div class="wrap"><h2>How ${esc(record.country)} compares</h2><div class="grid"><article class="card"><span class="pill">VALUE</span><h3>${record.value}%</h3><p>${esc(data.indicator.name)} in ${record.year}.</p></article><article class="card"><span class="pill">RANK</span><h3>${ordinal(record.rank)} of ${ranked.length}</h3><p>This rank applies only to the verified launch slice, not to a complete worldwide ranking.</p></article><article class="card"><span class="pill">CONTEXT</span><h3>${versusMedian === 0 ? 'At slice median' : `${Math.abs(versusMedian)} pp ${versusMedian > 0 ? 'above' : 'below'} median`}</h3><p>${esc(record.country)} is ${medianText} and ${leaderText}.</p></article></div></div></section><section class="section section-soft"><div class="wrap"><h2>Closest peers in this slice</h2><div class="grid">${peerCards}</div><p><a href="../../">Compare all ${ranked.length} countries →</a></p></div></section><section class="section"><div class="wrap"><h2>Definition and provenance</h2><p><strong>Indicator:</strong> ${esc(data.indicator.code)} — ${esc(data.indicator.name)}.</p><p>${esc(data.indicator.definition)}</p><p><strong>Source:</strong> ${esc(data.source.publisher)}, ${esc(data.source.dataset)}, surfaced via ${esc(data.source.surface)}. <strong>Unit:</strong> ${esc(data.indicator.unit)}. <strong>License:</strong> ${esc(data.source.license)}.</p><p><strong>Observation year:</strong> ${data.observationYear}. <strong>Retrieved:</strong> ${esc(retrieved)}. Retrieval date is not treated as the observation year.</p><p>${esc(data.source.attribution)}</p><p><a href="${esc(data.retrievalUrl)}">World Bank indicator page →</a> · <a href="${esc(data.source.metadataUrl)}">WDI metadata →</a> · <a href="../../data.json">Full JSON →</a> · <a href="../../data.csv">Full CSV →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>Scope note</h2><p>This page reports one current/latest observation from the same validated source used by the parent comparison. It does not claim a historical WDI revision, a causal explanation or a complete global rank.</p><p><a href="../../">Back to Internet use by country →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Source-faithful country profile generated from the verified comparison dataset.</div></footer></body></html>`;
}

function linkCountryRows(html, data) {
  let output = html;
  for (const record of data.records) {
    const plain = `<th scope="row">${esc(record.country)}</th>`;
    const linked = `<th scope="row"><a href="./country/${slugFor(record.code)}/">${esc(record.country)}</a></th>`;
    if (!output.includes(plain)) throw new Error(`country row not found for ${record.code}`);
    output = output.replace(plain, linked);
  }
  return output;
}

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
validate(data);
const ranked = rankRecords(data.records);
await rm(countriesRoot, { recursive: true, force: true });
await mkdir(countriesRoot, { recursive: true });

for (const record of ranked) {
  const directory = new URL(`${slugFor(record.code)}/`, countriesRoot);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), countryPage(data, record, ranked), 'utf8');
}

const indexHtml = await readFile(indexUrl, 'utf8');
await writeFile(indexUrl, linkCountryRows(indexHtml, data), 'utf8');
await writeFile(new URL('index.json', countriesRoot), `${JSON.stringify({
  schemaVersion: '1.0',
  indicator: data.indicator.code,
  observationYear: data.observationYear,
  generatedFrom: '../data.json',
  countries: ranked.map((record) => ({
    code: record.code,
    country: record.country,
    value: record.value,
    rank: record.rank,
    url: `/indicators/internet-use/country/${slugFor(record.code)}/`
  }))
}, null, 2)}\n`, 'utf8');

console.log(`Built ${ranked.length} crawlable internet-use country profiles.`);
