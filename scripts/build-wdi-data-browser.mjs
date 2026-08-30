import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const outputRoot = new URL('data/', siteRoot);
await mkdir(outputRoot, { recursive: true });

const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const readJson = async (url) => { try { return JSON.parse(await readFile(url, 'utf8')); } catch { return null; } };
const catalog = await readJson(new URL('index.json', dataRoot));
const historyIndex = await readJson(new URL('history-index.json', dataRoot));
const indicators = Array.isArray(catalog?.indicators) ? catalog.indicators : [];
const verified = indicators.filter((x) => x.status === 'CURRENT_VERIFIED');
const historyByCode = new Map((historyIndex?.indicators ?? []).map((x) => [x.code, x]));

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

function unitSuffix(unit = '') {
  if (unit.includes('%')) return '%';
  if (unit === 'years') return ' years';
  if (unit === 'births per woman') return ' births/woman';
  if (unit.includes('per 1,000')) return ' per 1,000';
  if (unit === 'per 100 people') return ' per 100 people';
  if (unit === 'metric tons per person') return ' t/person';
  if (unit === 'people per sq. km') return ' people/km²';
  return '';
}

function countryRows(records, unit) {
  return records.map((r, i) => `<tr><td>${i + 1}</td><td><strong>${esc(r.country)}</strong><br><span class="muted">${esc(r.code)} · ${esc(r.region?.name ?? '')}</span></td><td>${esc(formatValue(r.value, unit))}${esc(unitSuffix(unit))}</td></tr>`).join('');
}

for (const item of indicators) {
  const snapshot = await readJson(new URL(`${item.slug}/data.json`, dataRoot));
  if (!snapshot || snapshot.status !== 'CURRENT_VERIFIED' || !Array.isArray(snapshot.records) || !snapshot.records.length) continue;
  const records = [...snapshot.records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  const history = historyByCode.get(item.code);
  const dir = new URL(`${item.slug}/`, outputRoot);
  await mkdir(dir, { recursive: true });
  const best = records[0];
  const lowest = records.at(-1);
  const middle = records[Math.floor(records.length / 2)];
  const description = `${item.name}: compare ${records.length} countries using the latest well-covered same-year World Bank WDI snapshot (${item.year}). Browse values, coverage, source and historical data.`;
  const dedicated = item.slug === 'internet-use' ? '../../indicators/internet-use/' : item.slug === 'gdp-per-capita' ? '../../indicators/gdp-per-capita/' : null;
  const browserStyle = `<style>.wdi-browser{margin:1.5rem 0 2rem;padding:1rem;border:1px solid rgba(100,116,139,.25);border-radius:16px;background:rgba(255,255,255,.7)}.wdi-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.wdi-control label{display:block;font-weight:700;margin-bottom:.45rem}.wdi-control select{width:100%;min-height:46px;padding:.65rem .75rem;border:1px solid rgba(100,116,139,.35);border-radius:10px;background:#fff;color:inherit;font:inherit}.wdi-trend{margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(100,116,139,.2)}.wdi-chart{display:block;width:100%;height:auto;min-height:190px;overflow:visible}.wdi-browser-note{margin:.45rem 0 0;font-size:.95rem}.wdi-browser[data-history-error=true] .wdi-trend{display:none}@media(max-width:640px){.wdi-controls{grid-template-columns:1fr}.wdi-browser{padding:.85rem}.wdi-chart{min-height:160px}}</style>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.name)} by country (${item.year}) — World Discovery</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://worlddiscoverydata.com/data/${esc(item.slug)}/"><link rel="stylesheet" href="../../styles.css">${browserStyle}<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org', '@type':'Dataset', name:item.name, description, temporalCoverage:String(item.year), spatialCoverage:'World', creator:{'@type':'Organization',name:'World Bank'}, isBasedOn:`https://data.worldbank.org/indicator/${item.code}`, license:'https://creativecommons.org/licenses/by/4.0/' }).replaceAll('<','\\u003c')}</script></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="../../">World Discovery</a></div><nav class="nav"><a href="../../">Home</a><a href="../">Data</a><a href="../../indicators/">Indicators</a><a href="../../methodology/">About</a></nav></div></header><main><section class="hero"><div class="wrap"><div class="eyebrow">${esc(item.code)} · World Bank WDI · ${esc(item.year)}</div><h1>${esc(item.name)}</h1><p>Compare <strong>${records.length} countries</strong> in the newest same-year snapshot that meets World Discovery's coverage rule. You can now switch to every available historical year below.</p><div class="hero-actions"><a href="#countries">Browse countries ↓</a>${dedicated ? `<a href="${dedicated}">Open detailed explorer →</a>` : ''}</div></div></section><section class="section"><div class="wrap"><div class="grid"><article class="card" data-highest-card><span class="pill">HIGHEST · ${esc(item.year)}</span><div class="metric">${esc(formatValue(best.value, item.unit))}${esc(unitSuffix(item.unit))}</div><h3>${esc(best.country)}</h3></article><article class="card" data-middle-card><span class="pill">MIDDLE OBSERVATION · ${esc(item.year)}</span><div class="metric">${esc(formatValue(middle.value, item.unit))}${esc(unitSuffix(item.unit))}</div><h3>${esc(middle.country)}</h3></article><article class="card" data-lowest-card><span class="pill">LOWEST · ${esc(item.year)}</span><div class="metric">${esc(formatValue(lowest.value, item.unit))}${esc(unitSuffix(item.unit))}</div><h3>${esc(lowest.country)}</h3></article></div></div></section><section class="section section-soft" id="countries"><div class="wrap"><div class="eyebrow">Country comparison</div><h2 data-country-heading>${esc(item.name)} by country in ${esc(item.year)}</h2><p class="muted" data-country-summary>Sorted from highest to lowest. Values shown here come directly from the verified same-year snapshot.</p><div class="wdi-browser" data-wdi-year-browser data-history-url="../wdi/${esc(item.slug)}/history.json" data-current-year="${esc(item.year)}" data-unit="${esc(item.unit)}" data-indicator-name="${esc(item.name)}"><div class="wdi-controls"><div class="wdi-control"><label for="year-${esc(item.slug)}">Year</label><select id="year-${esc(item.slug)}" data-year-select><option>${esc(item.year)}</option></select><p class="muted wdi-browser-note">Choose any year with official country observations.</p></div><div class="wdi-control"><label for="country-${esc(item.slug)}">Country history</label><select id="country-${esc(item.slug)}" data-country-select><option>Loading countries…</option></select><p class="muted wdi-browser-note">See how one country's value changed over time.</p></div></div><div class="wdi-trend"><svg class="wdi-chart" data-history-chart viewBox="0 0 720 260" aria-label="Historical trend"></svg><p class="muted" data-history-summary>Loading historical trend…</p></div></div><div style="overflow-x:auto"><table><thead><tr><th>Rank</th><th>Country</th><th>${esc(item.unit)}</th></tr></thead><tbody data-country-rows>${countryRows(records, item.unit)}</tbody></table></div></div></section><section class="section"><div class="wrap"><div class="eyebrow">Source & coverage</div><h2>What this dataset means</h2><div class="grid"><article class="card"><span class="pill">DEFAULT YEAR</span><div class="metric">${esc(item.year)}</div><h3>Latest well-covered snapshot</h3><p>The page opens on the newest year between ${esc(catalog?.selectionPolicy?.latestYear ?? item.year)} and ${esc(catalog?.selectionPolicy?.earliestYear ?? item.year)} with at least ${esc(catalog?.selectionPolicy?.minCountries ?? '')} eligible country observations. Historical years remain selectable even when their coverage differs.</p></article><article class="card"><span class="pill">COVERAGE</span><div class="metric">${records.length}</div><h3>Countries in default year</h3><p>Missing countries are not assigned zero and are not backfilled from older years.</p></article><article class="card"><span class="pill">HISTORY</span><div class="metric">${esc(history?.observations ?? '—')}</div><h3>Country-year observations</h3><p>${history?.years?.length ? `${esc(history.years.length)} years represented in the historical file.` : 'Historical data is available as a machine-readable file.'}</p></article></div><p><a href="../wdi/${esc(item.slug)}/data.json">Download current snapshot JSON →</a> · <a href="../wdi/${esc(item.slug)}/history.json">Download history JSON →</a> · <a href="https://data.worldbank.org/indicator/${encodeURIComponent(item.code)}">World Bank indicator source →</a></p></div></section></main><footer class="footer"><div class="wrap"><a href="../">← All official indicators</a> · World Discovery · Source-faithful global data.</div></footer><script src="../../wdi-year-browser.js" defer></script></body></html>`;
  await writeFile(new URL('index.html', dir), html, 'utf8');
}

const cards = indicators.map((item) => `<article class="card"><span class="pill">${esc(item.code)} · ${esc(item.year ?? 'pending')}</span><div class="metric">${esc(item.countries)}</div><h3><a href="./${esc(item.slug)}/">${esc(item.name)}</a></h3><p>${item.year ? `Compare ${esc(item.countries)} countries in the latest well-covered ${esc(item.year)} snapshot, then switch across historical years.` : 'No snapshot currently meets the coverage threshold.'} Unit: ${esc(item.unit)}.</p><p><a href="./${esc(item.slug)}/">Explore countries →</a></p></article>`).join('');
const body = indicators.length ? `<section class="hero"><div class="wrap"><div class="eyebrow">Official global data · World Bank WDI</div><h1>Explore 30 global indicators.</h1><p>Choose a topic and compare countries using the newest well-covered same-year snapshot, then move through the available historical years and inspect country trends.</p><p><span class="pill">${indicators.length} INDICATORS · ${verified.length} VERIFIED SNAPSHOTS · OFFICIAL SOURCE</span></p></div></section><main><section class="section"><div class="wrap"><h2>Choose an indicator</h2><p class="muted">Population, economy, technology, health, energy and environment — all from the official World Development Indicators catalog.</p><div class="grid">${cards}</div></div></section></main>` : `<section class="hero"><div class="wrap"><h1>Data catalog refresh pending.</h1></div></section>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Explore global indicators — World Discovery</title><meta name="description" content="Browse 30 official World Bank WDI indicators and compare countries across available years."><link rel="canonical" href="https://worlddiscoverydata.com/data/"><link rel="stylesheet" href="../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="../">World Discovery</a></div><nav class="nav"><a href="../">Home</a><a href="./" aria-current="page">Data</a><a href="../indicators/">Indicators</a><a href="../methodology/">About</a></nav></div></header>${body}<footer class="footer"><div class="wrap">World Discovery · Official global data with explicit years and sources.</div></footer></body></html>`;
await writeFile(new URL('index.html', outputRoot), html, 'utf8');
console.log(`Built human-readable WDI catalog with ${verified.length} indicator pages.`);
