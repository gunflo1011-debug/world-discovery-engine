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
  if (!data.records.every((r) => /^[A-Z]{3}$/.test(r?.region?.code) && typeof r?.region?.name === 'string' && r.region.name.trim())) throw new Error('records require official region code and name');
  const regionNames = new Map();
  for (const record of data.records) {
    const regionName = record.region.name.trim();
    if (regionNames.has(record.region.code) && regionNames.get(record.region.code) !== regionName) throw new Error('region code maps to inconsistent names');
    regionNames.set(record.region.code, regionName);
  }
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
  const rows = data.records.map((r) => [data.indicator.code, JSON.stringify(r.country), r.code, r.value, r.year, JSON.stringify(data.indicator.unit)].join(','));
  return `${header}\n${rows.join('\n')}\n`;
}

function makeHtml(data) {
  const rows = ranked(data.records);
  const regions = [...data.records.reduce((map, record) => {
    const code = record.region.code;
    if (!map.has(code)) map.set(code, { code, name: record.region.name.trim(), records: [] });
    map.get(code).records.push(record);
    return map;
  }, new Map()).values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const region of regions) region.records.sort((a, b) => a.country.localeCompare(b.country));
  const max = Math.max(...rows.map((r) => r.value));
  const min = Math.min(...rows.map((r) => r.value));
  const leaders = rows.filter((r) => r.value === max).map((r) => r.country);
  const germany = rows.find((r) => r.code === 'DEU');
  const leaderText = leaders.length === 1 ? leaders[0] : `${leaders.slice(0, -1).join(', ')} and ${leaders.at(-1)}`;
  const retrieved = new Date(`${data.retrievedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const title = `Internet use by country — ${data.observationYear} verified comparison | World Discovery Engine`;
  const description = `Compare ${data.observationYear} internet use as a percentage of population across a verified ${data.records.length}-country same-year subset, with ITU/WDI provenance and JSON/CSV data.`;
  const dataset = { '@context':'https://schema.org','@type':'Dataset',name:`Internet use by country — ${data.observationYear} verified comparison`,description:`A same-year verified subset for ${data.indicator.code}, ${data.indicator.name}, sourced from ITU and surfaced through World Bank WDI.`,url:canonical,license:'https://creativecommons.org/licenses/by/4.0/',creator:{'@type':'Organization',name:data.source.publisher},isBasedOn:data.retrievalUrl,variableMeasured:{'@type':'PropertyValue',propertyID:data.indicator.code,name:data.indicator.name,unitText:data.indicator.unit},temporalCoverage:String(data.observationYear),spatialCoverage:rows.map((r)=>({'@type':'Country',name:r.country,identifier:r.code})),distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:`${canonical}data.json`},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:`${canonical}data.csv`}]};
  const tableRows = rows.map((r) => `<tr data-country="${esc(r.country.toLowerCase())}" data-code="${esc(r.code.toLowerCase())}" data-region="${esc(r.region.code.toLowerCase())}" data-value="${r.value}" data-rank="${r.rank}"><td>${r.rank}</td><th scope="row"><a href="./country/${esc(r.code.toLowerCase())}/">${esc(r.country)}</a></th><td>${r.value}%</td><td>${r.year}</td></tr>`).join('');
  const compareOptions = rows.map((r) => `<option value="${esc(r.code)}">${esc(r.country)} — ${r.value}%</option>`).join('');
  const regionOptions = regions.map((region) => `<option value="${esc(region.code.toLowerCase())}">${esc(region.name)} (${region.records.length})</option>`).join('');
  const regionDirectory = regions.map((region) => `<details class="region-directory-item" id="region-${esc(region.code.toLowerCase())}"><summary><span>${esc(region.name)}</span><span>${region.records.length} countries</span></summary><p><a href="./region/${esc(region.code.toLowerCase())}/">View ${esc(region.name)} comparison →</a></p><ul>${region.records.map((record) => `<li><a href="./country/${esc(record.code.toLowerCase())}/">${esc(record.country)}</a></li>`).join('')}</ul></details>`).join('');
  const germanyAnswer = germany ? `Within this verified ${data.records.length}-country subset, Germany ranks ${germany.rank}${germany.rank === 1 ? 'st' : germany.rank === 2 ? 'nd' : germany.rank === 3 ? 'rd' : 'th'} at ${germany.value}%.` : 'Germany is not included in this verified subset.';
  const rangeAnswer = `Among the ${data.records.length} included countries, the gap between the highest and lowest values is ${max - min} percentage points (${max}% versus ${min}%).`;
  const browserScript = `(()=>{const tools=document.getElementById('internet-tools');const table=document.getElementById('internet-table');if(!tools||!table)return;const rows=[...table.tBodies[0].rows];const search=document.getElementById('country-search');const region=document.getElementById('region-filter');const clear=document.getElementById('country-clear');const status=document.getElementById('country-status');const a=document.getElementById('compare-a');const b=document.getElementById('compare-b');const result=document.getElementById('compare-result');const share=document.getElementById('share-view');const byCode=new Map(rows.map(row=>[row.dataset.code,{country:row.cells[1].textContent.trim(),value:Number(row.dataset.value)}]));tools.hidden=false;const syncUrl=()=>{const url=new URL(location.href);const query=search.value.trim();if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');if(region.value)url.searchParams.set('region',region.value);else url.searchParams.delete('region');if(a.value&&b.value)url.searchParams.set('compare',a.value+','+b.value);else url.searchParams.delete('compare');const relative=url.pathname+url.search+url.hash;history.replaceState(null,'',relative);share.href=relative;};const applyFilter=()=>{const query=search.value.trim().toLowerCase();const regionCode=region.value;let visible=0;for(const row of rows){const matchesQuery=!query||row.dataset.country.includes(query)||row.dataset.code.includes(query);const matchesRegion=!regionCode||row.dataset.region===regionCode;const match=matchesQuery&&matchesRegion;row.hidden=!match;if(match)visible++;}const scope=regionCode?region.options[region.selectedIndex].textContent:'all regions';status.textContent=visible?('Showing '+visible+' '+(visible===1?'country':'countries')+' in '+scope+(query?' matching “'+search.value.trim()+'”':'')+'.'):('No countries match these filters.');};const compare=()=>{const left=byCode.get(a.value.toLowerCase());const right=byCode.get(b.value.toLowerCase());if(!left||!right){result.hidden=true;result.textContent='';return;}if(a.value===b.value){result.hidden=false;result.textContent='Within this verified ${data.observationYear} subset, '+left.country+' is '+left.value+'%. Choose a different second country to compare.';return;}const gap=Math.abs(left.value-right.value);const higher=left.value===right.value?null:(left.value>right.value?left:right);result.hidden=false;result.textContent=higher?('Within this verified ${data.observationYear} subset, '+higher.country+' is higher by '+gap.toFixed(1).replace(/\\.0$/,'')+' percentage points ('+left.country+' '+left.value+'% vs '+right.country+' '+right.value+'%).'):('Within this verified ${data.observationYear} subset, '+left.country+' and '+right.country+' are tied at '+left.value+'%.');};const refresh=()=>{applyFilter();compare();syncUrl();};const params=new URLSearchParams(location.search);const initialQuery=params.get('q');if(initialQuery)search.value=initialQuery.slice(0,80);const initialRegion=(params.get('region')||'').toLowerCase();if([...region.options].some(option=>option.value===initialRegion))region.value=initialRegion;const initialCompare=(params.get('compare')||'').toUpperCase().split(',');if(byCode.has((initialCompare[0]||'').toLowerCase()))a.value=initialCompare[0];if(byCode.has((initialCompare[1]||'').toLowerCase()))b.value=initialCompare[1];search.addEventListener('input',refresh);region.addEventListener('change',refresh);clear.addEventListener('click',()=>{search.value='';region.value='';refresh();search.focus();});a.addEventListener('change',refresh);b.addEventListener('change',refresh);refresh();})();`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../../styles.css"><script type="application/ld+json">${JSON.stringify(dataset)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../index.html">Home</a><a href="../../evidence/index.html">Evidence</a><a href="../index.html" aria-current="page">Indicators</a><a href="../../explore/index.html">Explore</a><a href="../../methodology/index.html">Methodology</a><a href="../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet use · verified same-year subset</div><h1>What share of people used the internet in ${data.observationYear}?</h1><p>Across this verified ${data.records.length}-country same-year subset, internet use ranges from ${min}% to ${max}% of the population. ${esc(leaderText)} ${leaders.length === 1 ? 'is' : 'are'} highest <strong>within this subset</strong> at ${max}%${germany ? `; Germany is ${germany.value}%` : ''}.</p><span class="pill">${data.observationYear} OBSERVATIONS · ${data.records.length} VERIFIED COUNTRIES · ITU VIA WDI</span></div></section><section class="section"><div class="wrap"><h2>Internet use by country — ${data.observationYear} observations</h2><p>This table compares only observations from the same year. It currently covers a curated verified subset, <strong>not a complete global ranking</strong>.</p><div class="internet-tools" id="internet-tools" hidden><div class="internet-lookup"><label class="searchbox" for="country-search">Find a country<input id="country-search" type="search" inputmode="search" autocomplete="off" placeholder="Type Germany, DEU…"></label><button type="button" id="country-clear">Clear filters</button></div><label class="internet-region-filter" for="region-filter">Region<select id="region-filter"><option value="">All regions (${data.records.length})</option>${regionOptions}</select></label><div class="internet-compare"><label>Compare country<select id="compare-a"><option value="">Choose a country</option>${compareOptions}</select></label><label>With<select id="compare-b"><option value="">Choose a country</option>${compareOptions}</select></label></div><p id="country-status" class="internet-tool-status" aria-live="polite">Showing all ${data.records.length} verified countries.</p><p><a id="share-view" href="./">Share this filtered view →</a></p><p id="compare-result" class="internet-compare-result" aria-live="polite" hidden></p></div><nav class="region-directory" aria-labelledby="region-directory-heading"><h3 id="region-directory-heading">Browse all countries by region</h3><p>Open a region to reach every included country profile. This directory works without JavaScript.</p><div class="region-directory-grid">${regionDirectory}</div></nav><div class="table-wrap"><table class="table internet-table" id="internet-table"><caption>${esc(data.indicator.name)}, ${data.observationYear} verified same-year subset</caption><thead><tr><th>Rank in subset</th><th>Country</th><th>Internet users</th><th>Observation year</th></tr></thead><tbody>${tableRows}</tbody></table></div><p><a href="./data.json">Download JSON →</a> · <a href="./data.csv">Download CSV →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>Quick answers from this verified subset</h2><div class="grid"><article class="card"><h3>Which included countries are highest?</h3><p>${esc(leaderText)} ${leaders.length === 1 ? 'has' : 'have'} the highest observed share among these ${data.records.length} countries at ${max}%.</p></article><article class="card"><h3>Where does Germany sit here?</h3><p>${esc(germanyAnswer)}</p></article><article class="card"><h3>How wide is the observed range?</h3><p>${esc(rangeAnswer)}</p></article></div></div></section><section class="section"><div class="wrap"><h2>Source and provenance</h2><p><strong>Indicator:</strong> ${esc(data.indicator.code)} — ${esc(data.indicator.name)}.</p><p><strong>Source:</strong> ${esc(data.source.publisher)}, ${esc(data.source.dataset)}, surfaced via ${esc(data.source.surface)}.</p><p><strong>Retrieval:</strong> ${esc(retrieved)}.</p><p><a href="${esc(data.retrievalUrl)}">World Bank indicator page →</a> · <a href="${esc(data.source.metadataUrl)}">WDI metadata →</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Observation year and retrieval date are kept separate.</div></footer><script>${browserScript}</script></body></html>`;
}

const data = JSON.parse(await readFile(jsonUrl, 'utf8'));
validate(data);
await Promise.all([writeFile(csvUrl, makeCsv(data), 'utf8'), writeFile(htmlUrl, makeHtml(data), 'utf8')]);
console.log(`Built internet-use vertical from ${data.records.length} verified ${data.observationYear} records.`);
