import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const outputRoot = new URL('countries/', siteRoot);
await mkdir(outputRoot, { recursive: true });

const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
const catalog = await readJson(new URL('index.json', dataRoot));
const indicators = (catalog.indicators ?? []).filter((x) => x.status === 'CURRENT_VERIFIED');
const countries = new Map();

function formatValue(value, unit = '') {
  if (!Number.isFinite(value)) return '—';
  if (unit.includes('US$')) {
    const abs = Math.abs(value);
    if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  if (unit === 'people') return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const digits = Math.abs(value) >= 100 ? 1 : 2;
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
}

function suffix(unit = '') {
  if (unit.includes('%')) return '%';
  if (unit === 'years') return ' years';
  if (unit === 'births per woman') return ' births/woman';
  if (unit.includes('per 1,000')) return ' per 1,000';
  if (unit === 'per 100 people') return ' per 100 people';
  if (unit === 'metric tons per person') return ' t/person';
  if (unit === 'people per sq. km') return ' people/km²';
  return '';
}

for (const item of indicators) {
  const snapshot = await readJson(new URL(`${item.slug}/data.json`, dataRoot));
  for (const record of snapshot.records ?? []) {
    if (!record?.code || !record?.country || !Number.isFinite(record.value)) continue;
    if (!countries.has(record.code)) countries.set(record.code, { code: record.code, country: record.country, region: record.region, metrics: [] });
    countries.get(record.code).metrics.push({ code: item.code, slug: item.slug, name: item.name, unit: item.unit, year: record.year, value: record.value });
  }
}

const hubs = [...countries.values()].filter((c) => c.metrics.length >= 10).sort((a,b) => a.country.localeCompare(b.country));

for (const hub of hubs) {
  hub.metrics.sort((a,b) => a.name.localeCompare(b.name));
  const dir = new URL(`${hub.code.toLowerCase()}/`, outputRoot);
  await mkdir(dir, { recursive: true });
  const rows = hub.metrics.map((m) => `<tr><td><a href="../../data/${esc(m.slug)}/">${esc(m.name)}</a><br><span class="muted">${esc(m.code)}</span></td><td>${esc(m.year)}</td><td><strong>${esc(formatValue(m.value, m.unit))}${esc(suffix(m.unit))}</strong><br><span class="muted">${esc(m.unit)}</span></td></tr>`).join('');
  const featured = hub.metrics.filter((m) => ['population','gdp-per-capita','life-expectancy','internet-use','unemployment','electricity-access'].includes(m.slug)).slice(0,6);
  const cards = featured.map((m) => `<article class="card"><span class="pill">${esc(m.year)} · ${esc(m.code)}</span><div class="metric">${esc(formatValue(m.value, m.unit))}${esc(suffix(m.unit))}</div><h3><a href="../../data/${esc(m.slug)}/">${esc(m.name)}</a></h3></article>`).join('');
  const description = `Explore ${hub.metrics.length} official World Bank indicators for ${hub.country}, with explicit data years, values and links to global country comparisons.`;
  const structured = { '@context':'https://schema.org', '@type':'CollectionPage', name:`${hub.country} data — World Discovery`, description, about:{'@type':'Country',name:hub.country}, isPartOf:{'@type':'WebSite',name:'World Discovery',url:'https://worlddiscoverydata.com/'} };
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(hub.country)} data: population, economy, health & more — World Discovery</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://worlddiscoverydata.com/countries/${hub.code.toLowerCase()}/"><link rel="stylesheet" href="../../styles.css"><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="../../">World Discovery</a></div><nav class="nav"><a href="../../">Home</a><a href="../">Countries</a><a href="../../data/">Data</a><a href="../../methodology/">About</a></nav></div></header><main><section class="hero"><div class="wrap"><div class="eyebrow">${esc(hub.code)} · ${esc(hub.region?.name ?? 'World')} · Official World Bank data</div><h1>${esc(hub.country)} data</h1><p>Explore <strong>${hub.metrics.length} official indicators</strong> for ${esc(hub.country)}. Each value keeps its own observation year so newer and slower-moving datasets are never silently presented as if they came from the same year.</p><div class="hero-actions"><a href="#indicators">Browse all indicators ↓</a><a href="../">All countries →</a></div></div></section>${cards ? `<section class="section"><div class="wrap"><div class="eyebrow">Quick view</div><h2>Key indicators</h2><div class="grid">${cards}</div></div></section>` : ''}<section class="section section-soft" id="indicators"><div class="wrap"><div class="eyebrow">Country profile</div><h2>${esc(hub.country)} across ${hub.metrics.length} indicators</h2><p class="muted">Years differ by indicator because World Discovery uses the latest well-covered official snapshot for each dataset. Open any indicator to compare ${esc(hub.country)} with other countries and browse history.</p><div style="overflow-x:auto"><table><thead><tr><th>Indicator</th><th>Year</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table></div></div></section><section class="section"><div class="wrap"><h2>How to read this page</h2><p>Values come from the World Bank World Development Indicators catalog. Missing indicators are omitted rather than estimated or backfilled. The year shown beside every value is part of the data contract.</p><p><a href="../../data/">Explore all 30 indicators →</a> · <a href="../../methodology/">Read methodology →</a></p></div></section></main><footer class="footer"><div class="wrap"><a href="../">← All countries</a> · World Discovery · Source-faithful global data.</div></footer></body></html>`;
  await writeFile(new URL('index.html', dir), html, 'utf8');
}

const countryCards = hubs.map((c) => `<article class="card"><span class="pill">${esc(c.code)} · ${esc(c.region?.name ?? '')}</span><div class="metric">${c.metrics.length}</div><h3><a href="./${c.code.toLowerCase()}/">${esc(c.country)}</a></h3><p>Official indicators available across population, economy, technology, health and environment.</p><a href="./${c.code.toLowerCase()}/">Explore ${esc(c.country)} →</a></article>`).join('');
const indexHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Country data — World Discovery</title><meta name="description" content="Browse country profiles built from 30 official World Bank WDI indicators, with explicit years and links to global comparisons."><link rel="canonical" href="https://worlddiscoverydata.com/countries/"><link rel="stylesheet" href="../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="../">World Discovery</a></div><nav class="nav"><a href="../">Home</a><a href="./" aria-current="page">Countries</a><a href="../data/">Data</a><a href="../methodology/">About</a></nav></div></header><main><section class="hero"><div class="wrap"><div class="eyebrow">Countries · 30 official indicators</div><h1>Explore the world country by country.</h1><p>Open a country profile to see its available population, economy, technology, health, energy and environment indicators with the correct year shown for every value.</p><p><span class="pill">${hubs.length} COUNTRY PROFILES · OFFICIAL WORLD BANK DATA</span></p></div></section><section class="section"><div class="wrap"><div class="grid">${countryCards}</div></div></section></main><footer class="footer"><div class="wrap">World Discovery · Country profiles built from official WDI data.</div></footer></body></html>`;
await writeFile(new URL('index.html', outputRoot), indexHtml, 'utf8');
await writeFile(new URL('index.json', outputRoot), `${JSON.stringify({ generatedAt:new Date().toISOString(), countries:hubs.map((c)=>({code:c.code,country:c.country,region:c.region,indicators:c.metrics.length,url:`/countries/${c.code.toLowerCase()}/`})) }, null, 2)}\n`, 'utf8');
console.log(`Built ${hubs.length} multi-indicator country hubs.`);
