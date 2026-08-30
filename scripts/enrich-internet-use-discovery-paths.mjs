import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const root = new URL('indicators/internet-use/', siteRoot);
const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));
if (data?.status !== 'CURRENT_VERIFIED' || data?.indicator?.code !== 'IT.NET.USER.ZS' || !Array.isArray(data.records)) throw new Error('verified internet-use data required');

const esc = (v) => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = (r) => r.code.toLowerCase();
const fmt = (v) => Number(v).toFixed(1).replace(/\.0$/, '');
const ranked = [...data.records].sort((a,b) => b.value-a.value || a.country.localeCompare(b.country));
const rankOf = new Map(ranked.map((r,i) => [r.code,i]));

function card(target, current, label) {
  const delta = Math.abs(target.value-current.value).toFixed(1).replace(/\.0$/, '');
  const direction = target.value > current.value ? 'higher' : target.value < current.value ? 'lower' : 'the same';
  return `<article class="card"><span class="pill">${label}</span><h3><a href="../${slug(target)}/">${esc(target.country)}</a></h3><p><strong>${fmt(target.value)}%</strong> in ${target.year} · ${delta} percentage points ${direction} than ${esc(current.country)}.</p></article>`;
}

for (const record of ranked) {
  const path = new URL(`country/${slug(record)}/index.html`, root);
  let html = await readFile(path, 'utf8');
  html = html.replace(/<section class="section section-soft" id="country-discovery-paths">[\s\S]*?<\/section>/, '');
  const i = rankOf.get(record.code);
  const above = i > 0 ? ranked[i-1] : null;
  const below = i < ranked.length-1 ? ranked[i+1] : null;
  const regional = ranked.filter(r => r.code !== record.code && r.region?.code === record.region?.code).sort((a,b) => Math.abs(a.value-record.value)-Math.abs(b.value-record.value) || a.country.localeCompare(b.country)).slice(0,2);
  const cards = [above && card(above, record, 'NEXT HIGHER'), below && card(below, record, 'NEXT LOWER'), ...regional.map(r => card(r, record, 'REGIONAL PEER'))].filter(Boolean).join('');
  const section = `<section class="section section-soft" id="country-discovery-paths"><div class="wrap"><div class="eyebrow">Keep exploring</div><h2>Countries to compare with ${esc(record.country)}</h2><p>Move through the ${data.observationYear} ranking or compare ${esc(record.country)} with nearby values in ${esc(record.region?.name || 'its region')}.</p><div class="grid">${cards}</div><p><a href="../../region/${record.region.code.toLowerCase()}/">Explore ${esc(record.region.name)} →</a> · <a href="../../">Compare all ${ranked.length} countries →</a></p></div></section>`;
  const marker = '<section class="section"><div class="wrap"><h2>Definition and provenance</h2>';
  if (html.includes(marker)) html = html.replace(marker, `${section}${marker}`);
  else if (html.includes('</main>')) html = html.replace('</main>', `${section}</main>`);
  else throw new Error(`safe insertion point missing for ${record.code}`);
  await writeFile(path, html, 'utf8');
}

// Homepage discovery is now deliberately owned by site/index.html. Do not couple
// this data enrichment step to a particular homepage section or layout.
console.log(`Added ranking and regional discovery paths for ${ranked.length} internet-use countries.`);
