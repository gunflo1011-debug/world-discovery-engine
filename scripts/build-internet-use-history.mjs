import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const historyUrl = new URL('history.json', root);
const countriesRoot = new URL('country/', root);
const baseCanonical = 'https://worlddiscoverydata.com/indicators/internet-use/';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const fmt = value => Number.isInteger(value) ? String(value) : Number(value).toFixed(1).replace(/\.0$/,'');

async function exists(url) { try { await access(url); return true; } catch { return false; } }

function chart(record) {
  const points = record.observations;
  const minYear = points[0].year;
  const maxYear = points.at(-1).year;
  const width = 720, height = 280, left = 48, right = 18, top = 18, bottom = 36;
  const x = year => left + ((year - minYear) / Math.max(1, maxYear - minYear)) * (width - left - right);
  const y = value => top + (1 - value / 100) * (height - top - bottom);
  const polyline = points.map(p => `${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const grid = [0,25,50,75,100].map(v => `<line x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}" stroke="currentColor" opacity="0.14"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end" font-size="12">${v}%</text>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc" style="width:100%;height:auto;display:block;max-width:${width}px;margin:20px 0"><title id="chart-title">${esc(record.country)} internet penetration over time</title><desc id="chart-desc">Verified World Bank WDI observations for ${esc(record.country)} from ${minYear} to ${maxYear}. Missing years are not interpolated.</desc>${grid}<line x1="${left}" y1="${height-bottom}" x2="${width-right}" y2="${height-bottom}" stroke="currentColor" opacity="0.45"/><polyline points="${polyline}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="${left}" y="${height-8}" text-anchor="start" font-size="12">${minYear}</text><text x="${width-right}" y="${height-8}" text-anchor="end" font-size="12">${maxYear}</text></svg>`;
}

function firstAtOrAbove(record, threshold) {
  return record.observations.find(observation => observation.value >= threshold) || null;
}

function comparisonObservation(record, yearsBack = 5) {
  const latest = record.observations.at(-1);
  const cutoff = latest.year - yearsBack;
  return [...record.observations].reverse().find(observation => observation.year <= cutoff) || null;
}

function page(data, record) {
  const canonical = `${baseCanonical}country/${record.code.toLowerCase()}/history/`;
  const first = record.observations[0];
  const latest = record.observations.at(-1);
  const change = latest.value - first.value;
  const fiveYearBase = comparisonObservation(record, 5);
  const recentChange = fiveYearBase ? latest.value - fiveYearBase.value : null;
  const halfway = firstAtOrAbove(record, 50);
  const threeQuarters = firstAtOrAbove(record, 75);
  const title = `${record.country} internet penetration trend: ${record.firstYear}–${record.latestYear} | World Discovery Data`;
  const description = `${record.country} internet penetration over time: ${fmt(latest.value)}% in ${latest.year}, with verified ITU/WDI observations from ${record.firstYear}. Explore the historical trend, milestones and source data.`;
  const dataset = {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage','@id':`${canonical}#webpage`,name:`${record.country} internet penetration trend`,description,url:canonical,mainEntity:{'@id':`${canonical}#dataset`},dateModified:data.retrievedAt},
    {'@type':'Dataset','@id':`${canonical}#dataset`,name:`${record.country} internet use history`,description,url:canonical,license:'https://creativecommons.org/licenses/by/4.0/',creator:{'@type':'Organization',name:data.source.publisher},isBasedOn:data.retrievalUrl,temporalCoverage:`${record.firstYear}/${record.latestYear}`,about:{'@type':'Country',name:record.country,identifier:record.code},variableMeasured:{'@type':'PropertyValue',propertyID:data.indicator.code,name:data.indicator.name,unitText:data.indicator.unit},distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:`${canonical}data.json`}]}
  ]};
  const rows = [...record.observations].reverse().map(o => `<tr><th scope="row">${o.year}</th><td>${fmt(o.value)}%</td></tr>`).join('');
  const recentText = fiveYearBase
    ? `From ${fiveYearBase.year} to ${latest.year}, the observed rate changed by ${fmt(recentChange)} percentage points, from ${fmt(fiveYearBase.value)}% to ${fmt(latest.value)}%.`
    : `The available series does not contain an observation at least five years before ${latest.year}, so no five-year comparison is reported.`;
  const milestoneText = [
    halfway ? `The first observation at or above 50% is ${halfway.year} (${fmt(halfway.value)}%).` : 'The available observations never reach 50%.',
    threeQuarters ? `The first observation at or above 75% is ${threeQuarters.year} (${fmt(threeQuarters.value)}%).` : 'The available observations never reach 75%.'
  ].join(' ');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="alternate" type="application/json" href="./data.json" title="Historical internet-use observations"><link rel="stylesheet" href="../../../../../styles.css"><script type="application/ld+json">${JSON.stringify(dataset)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../../../../index.html">Home</a><a href="../../../../index.html">Indicators</a><a href="../../../">Internet use</a><a href="../../../../../methodology/index.html">Methodology</a><a href="../../../../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet penetration history · ${esc(record.code)}</div><h1>${esc(record.country)} internet penetration over time</h1><p>The latest verified observation is <strong>${fmt(latest.value)}%</strong> in <strong>${latest.year}</strong>. The available series begins at <strong>${fmt(first.value)}%</strong> in <strong>${first.year}</strong>, a net change of <strong>${fmt(change)} percentage points</strong>.</p><span class="pill">${record.observations.length} VERIFIED OBSERVATIONS · ITU VIA WDI</span></div></section><section class="section"><div class="wrap"><h2>Quick answers</h2><div class="grid"><article class="card"><span class="pill">LATEST</span><h3>${fmt(latest.value)}%</h3><p>Internet penetration in ${esc(record.country)} in ${latest.year}, the latest available observation in this series.</p></article><article class="card"><span class="pill">LONG-TERM CHANGE</span><h3>${change >= 0 ? '+' : ''}${fmt(change)} pp</h3><p>Change between the first available observation in ${first.year} and the latest in ${latest.year}.</p></article><article class="card"><span class="pill">RECENT CONTEXT</span><h3>${fiveYearBase ? `${recentChange >= 0 ? '+' : ''}${fmt(recentChange)} pp` : 'Not available'}</h3><p>${esc(recentText)}</p></article></div><p>${esc(milestoneText)}</p></div></section><section class="section section-soft"><div class="wrap"><h2>Historical trend</h2><p>Each point is an official observation returned by World Bank WDI for ${esc(data.indicator.code)}. Lines connect observed points for readability; they do not create data for missing years.</p>${chart(record)}</div></section><section class="section"><div class="wrap"><h2>Year-by-year internet penetration</h2><div class="table-wrap"><table class="table"><caption>${esc(data.indicator.name)} — ${esc(record.country)}</caption><thead><tr><th>Year</th><th>Internet users</th></tr></thead><tbody>${rows}</tbody></table></div><p><a href="./data.json">Download historical JSON →</a> · <a href="../">See ${esc(record.country)} latest profile and country comparison →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>What this measure means</h2><p>Internet penetration here means <strong>${esc(data.indicator.name.toLowerCase())}</strong>. It is reported as ${esc(data.indicator.unit)}. The indicator definition is: ${esc(data.indicator.definition)}</p><p>This series is useful for questions such as “How has internet access changed in ${esc(record.country)}?” and “What is ${esc(record.country)}’s latest internet penetration rate?” It does not estimate people missing from the official observations.</p></div></section><section class="section"><div class="wrap"><h2>Source and methodology</h2><p><strong>Indicator:</strong> ${esc(data.indicator.code)} — ${esc(data.indicator.name)}.</p><p><strong>Source:</strong> ${esc(data.source.publisher)}, ${esc(data.source.dataset)}, surfaced through ${esc(data.source.surface)}. <strong>License:</strong> ${esc(data.source.license)}.</p><p>Values are kept at their official observation years. Missing years are not backfilled, averaged or interpolated. This page is a historical observation series, not a revision comparison.</p><p><a href="${esc(data.retrievalUrl)}">World Bank API source →</a> · <a href="${esc(data.source.metadataUrl)}">Indicator metadata →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Verified historical observations with explicit gaps.</div></footer></body></html>`;
}

if (!(await exists(historyUrl))) {
  console.log('No internet-use history.json found; historical pages skipped.');
  process.exit(0);
}
const data = JSON.parse(await readFile(historyUrl, 'utf8'));
if (data?.status !== 'CURRENT_VERIFIED_HISTORY' || data?.indicator?.code !== 'IT.NET.USER.ZS' || !Array.isArray(data.records)) throw new Error('invalid internet-use history dataset');

for (const record of data.records) {
  if (!/^[A-Z]{3}$/.test(record.code) || !Array.isArray(record.observations) || record.observations.length < 2) throw new Error(`invalid history record ${record.code || 'unknown'}`);
  const countryDir = new URL(`${record.code.toLowerCase()}/`, countriesRoot);
  if (!(await exists(new URL('index.html', countryDir)))) continue;
  const historyDir = new URL('history/', countryDir);
  await mkdir(historyDir, { recursive: true });
  const machine = {schemaVersion:'1.0',status:'CURRENT_VERIFIED_HISTORY',indicator:data.indicator,entity:{type:'country',code:record.code,name:record.country,region:record.region},period:{firstYear:record.firstYear,latestYear:record.latestYear},observations:record.observations,provenance:{publisher:data.source.publisher,dataset:data.source.dataset,surface:data.source.surface,metadataUrl:data.source.metadataUrl,retrievalUrl:data.retrievalUrl,retrievedAt:data.retrievedAt,license:data.source.license,attribution:data.source.attribution},humanUrl:`${baseCanonical}country/${record.code.toLowerCase()}/history/`};
  await Promise.all([writeFile(new URL('index.html', historyDir), page(data, record), 'utf8'),writeFile(new URL('data.json', historyDir), `${JSON.stringify(machine, null, 2)}\n`, 'utf8')]);
  const profileUrl = new URL('index.html', countryDir);
  let html = await readFile(profileUrl, 'utf8');
  const marker = '<section class="section section-soft"><div class="wrap"><h2>Scope note</h2>';
  const block = `<section class="section"><div class="wrap"><h2>Historical trend</h2><p>Go beyond the ${data.period.endYear} snapshot: ${esc(record.country)} has ${record.observations.length} verified observations from ${record.firstYear} to ${record.latestYear}.</p><p><a href="./history/">View ${esc(record.country)} internet penetration over time →</a></p></div></section>`;
  if (html.includes(marker) && !html.includes('href="./history/"')) html = html.replace(marker, `${block}${marker}`);
  await writeFile(profileUrl, html, 'utf8');
}
console.log(`Built ${data.records.length} internet-use historical country pages.`);
