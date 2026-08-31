import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const outputRoot = new URL('compare/', siteRoot);
await mkdir(outputRoot, { recursive: true });

const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
const countryIndex = await readJson(new URL('countries/index.json', siteRoot));
const catalog = await readJson(new URL('index.json', dataRoot));
const wanted = ['population','gdp-per-capita','gdp-growth','life-expectancy','internet-use','co2-emissions-per-capita'];
const metaBySlug = new Map((catalog.indicators ?? []).map((x) => [x.slug, x]));
const countries = (countryIndex.countries ?? []).map((c) => ({ code:c.code, country:c.country, region:c.region?.name ?? c.region ?? '' }));
const values = Object.fromEntries(countries.map((c) => [c.code, {}]));
const metrics = [];

for (const slug of wanted) {
  const meta = metaBySlug.get(slug);
  if (!meta || meta.status !== 'CURRENT_VERIFIED') continue;
  const snapshot = await readJson(new URL(`${slug}/data.json`, dataRoot));
  metrics.push({ slug, name:meta.name ?? snapshot.indicator?.name ?? slug, unit:meta.unit ?? snapshot.indicator?.unit ?? '' });
  for (const r of snapshot.records ?? []) {
    if (!values[r.code] || !Number.isFinite(r.value)) continue;
    values[r.code][slug] = { value:r.value, year:r.year, unit:meta.unit ?? snapshot.indicator?.unit ?? '' };
  }
}

const payload = { countries, metrics, values };
const options = countries.map((c) => `<option value="${esc(c.code)}">${esc(c.country)} (${esc(c.code)})</option>`).join('');
const structured = {'@context':'https://schema.org','@type':'WebApplication',name:'Country comparison — World Discovery',applicationCategory:'DataApplication',url:'https://worlddiscoverydata.com/compare/',description:'Compare two countries across official World Bank indicators with explicit observation years.'};
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compare countries: population, GDP, health & more — World Discovery</title><meta name="description" content="Compare two countries across official World Bank indicators including population, GDP per capita, growth, life expectancy, internet use and CO₂ emissions."><link rel="canonical" href="https://worlddiscoverydata.com/compare/"><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="../">World Discovery</a></div><nav class="nav"><a href="../">Home</a><a href="../countries/">Countries</a><a href="./" aria-current="page">Compare</a><a href="../data/">Data</a></nav></div></header><main><section class="hero"><div class="wrap"><div class="eyebrow">Country comparison · Official World Bank data</div><h1>Compare two countries side by side.</h1><p>Choose any two supported countries. Every metric keeps its own observation year; differences are shown only when both values come from the same year.</p></div></section><section class="section section-soft"><div class="wrap"><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem"><label><span class="muted">Country A</span><select id="country-a" style="width:100%;margin-top:.35rem;padding:.8rem;border:1px solid currentColor;border-radius:.5rem">${options}</select></label><label><span class="muted">Country B</span><select id="country-b" style="width:100%;margin-top:.35rem;padding:.8rem;border:1px solid currentColor;border-radius:.5rem">${options}</select></label></div></div></section><section class="section"><div class="wrap"><h2 id="compare-title">Country comparison</h2><div style="overflow-x:auto"><table><thead><tr><th>Indicator</th><th id="head-a">Country A</th><th id="head-b">Country B</th><th>Difference</th></tr></thead><tbody id="comparison-body"></tbody></table></div><p class="muted">A dash means the current verified snapshot has no value for that country. Mixed-year values are displayed but not differenced.</p></div></section></main><footer class="footer"><div class="wrap"><a href="../countries/">← Browse all countries</a> · World Discovery</div></footer><script>const DATA=${JSON.stringify(payload).replaceAll('<','\\u003c')};
const byCode=Object.fromEntries(DATA.countries.map(c=>[c.code,c]));const a=document.getElementById('country-a');const b=document.getElementById('country-b');const body=document.getElementById('comparison-body');
function fmt(v,unit){if(!Number.isFinite(v))return '—';if((unit||'').includes('US$')){const n=Math.abs(v);if(n>=1e12)return '$'+(v/1e12).toFixed(2)+'T';if(n>=1e9)return '$'+(v/1e9).toFixed(2)+'B';if(n>=1e6)return '$'+(v/1e6).toFixed(2)+'M';return '$'+v.toLocaleString('en-US',{maximumFractionDigits:0});}if(unit==='people')return v.toLocaleString('en-US',{maximumFractionDigits:0});return v.toLocaleString('en-US',{maximumFractionDigits:Math.abs(v)>=100?1:2});}
function suffix(unit){if((unit||'').includes('%'))return '%';if(unit==='years')return ' years';if(unit==='metric tons per person')return ' t/person';return '';}
function cell(m){return m?'<strong>'+fmt(m.value,m.unit)+suffix(m.unit)+'</strong><br><small>'+m.year+'</small>':'—';}
function difference(ma,mb){if(!ma||!mb||ma.year!==mb.year)return '<span class="muted">Not same year</span>';const d=ma.value-mb.value;const sign=d>0?'+':'';return sign+fmt(d,ma.unit)+suffix(ma.unit)+'<br><small>'+ma.year+'</small>';}
function render(){const ca=byCode[a.value],cb=byCode[b.value];document.getElementById('head-a').textContent=ca?.country||'Country A';document.getElementById('head-b').textContent=cb?.country||'Country B';document.getElementById('compare-title').textContent=(ca?.country||'Country A')+' vs '+(cb?.country||'Country B');body.innerHTML=DATA.metrics.map(metric=>{const ma=DATA.values[a.value]?.[metric.slug],mb=DATA.values[b.value]?.[metric.slug];return '<tr><td><a href="../data/'+metric.slug+'/">'+metric.name+'</a></td><td>'+cell(ma)+'</td><td>'+cell(mb)+'</td><td>'+difference(ma,mb)+'</td></tr>';}).join('');const q=new URLSearchParams({a:a.value,b:b.value});history.replaceState(null,'','?'+q.toString());}
const q=new URLSearchParams(location.search);const qa=q.get('a'),qb=q.get('b');a.value=byCode[qa]?qa:(byCode.DEU?'DEU':DATA.countries[0]?.code||'');b.value=byCode[qb]?qb:(byCode.FRA?'FRA':DATA.countries[1]?.code||a.value);a.addEventListener('change',render);b.addEventListener('change',render);render();</script></body></html>`;
await writeFile(new URL('index.html', outputRoot), html, 'utf8');
console.log(`Built country comparison explorer with ${countries.length} countries and ${metrics.length} indicators.`);
