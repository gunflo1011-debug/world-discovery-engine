import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const jsonUrl = new URL('data.json', root);
const csvUrl = new URL('data.csv', root);
const htmlUrl = new URL('index.html', root);
const canonical = 'https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function validate(data) {
  if (data?.status !== 'CURRENT_VERIFIED') throw new Error('internet-use source must be CURRENT_VERIFIED');
  if (data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected indicator code');
  if (!Number.isInteger(data?.observationYear)) throw new Error('observationYear is required');
  if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('at least two verified records are required');
  if (!data.records.every((r) => r.year === data.observationYear)) throw new Error('mixed observation years are forbidden');
  if (!data.records.every((r) => typeof r.value === 'number' && r.value >= 0 && r.value <= 100)) throw new Error('values must be percentages between 0 and 100');
  const codes = new Set(data.records.map((r) => r.code));
  if (codes.size !== data.records.length) throw new Error('duplicate country codes are forbidden');
  if (!data?.source?.publisher || !data?.source?.metadataUrl || !data?.source?.license) throw new Error('source provenance is incomplete');
}

function ranked(records) {
  const sorted = [...records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  let previous = null;
  let rank = 0;
  return sorted.map((record, index) => {
    if (record.value !== previous) rank = index + 1;
    previous = record.value;
    return { ...record, rank };
  });
}

function makeCsv(data) {
  const header = 'indicator_code,country,country_code,value,observation_year,unit';
  const rows = data.records.map((r) => [
    data.indicator.code,
    JSON.stringify(r.country),
    r.code,
    r.value,
    r.year,
    JSON.stringify(data.indicator.unit)
  ].join(','));
  return `${header}\n${rows.join('\n')}\n`;
}

function makeHtml(data) {
  const rows = ranked(data.records);
  const max = Math.max(...rows.map((r) => r.value));
  const min = Math.min(...rows.map((r) => r.value));
  const leaders = rows.filter((r) => r.value === max).map((r) => r.country);
  const germany = rows.find((r) => r.code === 'DEU');
  const leaderText = leaders.length === 1 ? leaders[0] : `${leaders.slice(0, -1).join(', ')} and ${leaders.at(-1)}`;
  const retrieved = new Date(`${data.retrievedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const title = `Internet use by country — ${data.observationYear} verified comparison | World Discovery Engine`;
  const description = `Compare ${data.observationYear} internet use as a percentage of population across a verified ${data.records.length}-country launch slice, with ITU/WDI provenance and JSON/CSV data.`;
  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Internet use by country — ${data.observationYear} verified comparison`,
    description: `A same-year verified launch slice for ${data.indicator.code}, ${data.indicator.name}, sourced from ITU and surfaced through World Bank WDI.`,
    url: canonical,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: data.source.publisher },
    isBasedOn: data.retrievalUrl,
    variableMeasured: { '@type': 'PropertyValue', propertyID: data.indicator.code, name: data.indicator.name, unitText: data.indicator.unit },
    temporalCoverage: String(data.observationYear),
    spatialCoverage: rows.map((r) => ({ '@type': 'Country', name: r.country, identifier: r.code })),
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${canonical}data.json` },
      { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${canonical}data.csv` }
    ]
  };
  const tableRows = rows.map((r) => `<tr><td>${r.rank}</td><th scope="row">${esc(r.country)}</th><td>${r.value}%</td><td>${r.year}</td></tr>`).join('');
  const germanyAnswer = germany ? `Germany is ${germany.rank}${germany.rank === 1 ? 'st' : germany.rank === 2 ? 'nd' : germany.rank === 3 ? 'rd' : 'th'} in this ${data.records.length}-country slice at ${germany.value}%.` : 'Germany is not included in this launch slice.';

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../../styles.css"><script type="application/ld+json">${JSON.stringify(dataset)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../index.html">Home</a><a href="../../evidence/index.html">Evidence</a><a href="../index.html" aria-current="page">Indicators</a><a href="../../explore/index.html">Explore</a><a href="../../methodology/index.html">Methodology</a><a href="../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet use · current/latest vertical</div><h1>What share of people used the internet in ${data.observationYear}?</h1><p>In this verified ${data.records.length}-country same-year launch slice, internet use ranges from ${min}% to ${max}% of the population. ${esc(leaderText)} ${leaders.length === 1 ? 'is' : 'are'} highest in the current slice at ${max}%${germany ? `; Germany is ${germany.value}%` : ''}.</p><span class="pill">${data.observationYear} OBSERVATIONS · ${data.records.length} COUNTRIES · ITU VIA WDI</span></div></section><section class="section"><div class="wrap"><h2>Internet use by country — ${data.observationYear} observations</h2><p>This table compares only observations from the same year. It is intentionally a curated launch slice, <strong>not a complete global ranking</strong>. Values are the share of people who used the Internet from any location in the last three months.</p><div class="table-wrap" tabindex="0" role="region" aria-label="${data.observationYear} internet use comparison table"><table class="table"><caption>${esc(data.indicator.name)}, ${data.observationYear} verified launch slice</caption><thead><tr><th scope="col">Rank</th><th scope="col">Country</th><th scope="col">Internet users</th><th scope="col">Observation year</th></tr></thead><tbody>${tableRows}</tbody></table></div><p><a href="./data.json">Download JSON →</a> · <a href="./data.csv">Download CSV →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>Quick answers from this slice</h2><div class="grid"><article class="card"><span class="pill">HIGHEST</span><h3>Which countries are highest?</h3><p>${esc(leaderText)} ${leaders.length === 1 ? 'has' : 'have'} the highest observed share in this verified slice at ${max}%.</p></article><article class="card"><span class="pill">GERMANY</span><h3>Where does Germany sit?</h3><p>${esc(germanyAnswer)}</p></article><article class="card"><span class="pill">SPREAD</span><h3>How wide is the observed range?</h3><p>The gap between the highest and lowest values in this launch slice is ${max - min} percentage points (${max}% versus ${min}%).</p></article></div></div></section><section class="section"><div class="wrap"><h2>How to read this indicator</h2><div class="grid"><article class="card"><span class="pill">DEFINITION</span><h3>Used the internet in the last 3 months</h3><p>${esc(data.indicator.definition)}</p></article><article class="card"><span class="pill">YEAR MATTERS</span><h3>${data.observationYear} is the observation year</h3><p>The page was retrieved and assembled on ${esc(retrieved)}. That retrieval date does not make the observations “${new Date(`${data.retrievedAt}T00:00:00Z`).getUTCFullYear()} data”. Every comparison above is explicitly a ${data.observationYear} observation.</p></article><article class="card"><span class="pill">NO IMPUTATION</span><h3>No mixed-year carry-forward</h3><p>This view does not fill missing countries with older values. The release uses a small verified same-year slice so comparison semantics remain defensible.</p></article></div></div></section><section class="section"><div class="wrap"><h2>Source and provenance</h2><p><strong>Indicator:</strong> ${esc(data.indicator.code)} — ${esc(data.indicator.name)}.</p><p><strong>Source:</strong> ${esc(data.source.publisher)}, ${esc(data.source.dataset)}, surfaced via ${esc(data.source.surface)}.</p><p><strong>Unit:</strong> ${esc(data.indicator.unit)} · <strong>Periodicity:</strong> annual · <strong>License:</strong> ${esc(data.source.license)}. ${esc(data.source.attribution)}</p><p><strong>Retrieval:</strong> ${esc(retrieved)} from the World Bank indicator page. The human table and JSON/CSV distributions are generated from the same normalized records.</p><p><a href="${esc(data.retrievalUrl)}">World Bank indicator page →</a> · <a href="${esc(data.source.metadataUrl)}">WDI metadata →</a> · <a href="../../methodology/index.html">Methodology →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>What this page does not claim</h2><p>This is not a revision product and does not compare historical WDI vintages. It also does not claim to be the full worldwide ${data.observationYear} table yet. Expansion should happen only when additional country observations enter the same validated source → normalized record → HTML → JSON/CSV chain.</p><p><a href="../index.html">Back to indicator registry →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Observation year and retrieval date are kept separate.</div></footer></body></html>`;
}

const data = JSON.parse(await readFile(jsonUrl, 'utf8'));
validate(data);
await Promise.all([
  writeFile(csvUrl, makeCsv(data), 'utf8'),
  writeFile(htmlUrl, makeHtml(data), 'utf8')
]);
console.log(`Built internet-use vertical from ${data.records.length} verified ${data.observationYear} records.`);
