import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const catalog = JSON.parse(await readFile(new URL('index.json', dataRoot), 'utf8'));
const indicators = Array.isArray(catalog?.indicators) ? catalog.indicators : [];

const groups = [
  ['People', ['population','population-growth','population-density','population-age-0-14','population-age-65-plus','urban-population-share','life-expectancy','fertility-rate','birth-rate','death-rate','infant-mortality']],
  ['Economy & work', ['gdp','gdp-per-capita','gdp-growth','inflation','unemployment','labor-force-participation','employment-to-population','trade-share-of-gdp','exports-share-of-gdp','imports-share-of-gdp','fdi-net-inflows-share-of-gdp']],
  ['Technology & infrastructure', ['internet-use','mobile-subscriptions','electricity-access']],
  ['Health', ['life-expectancy','infant-mortality','health-expenditure-share-of-gdp']],
  ['Energy & environment', ['electricity-access','renewable-energy-consumption','co2-emissions-per-capita','forest-area-share','agricultural-land-share']]
];

const bySlug = new Map(indicators.map((item) => [item.slug, item]));
const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

for (const item of indicators) {
  const path = new URL(`data/${item.slug}/index.html`, siteRoot);
  let html;
  try { html = await readFile(path, 'utf8'); } catch { continue; }
  html = html.replace(/<section class="section section-related"[\s\S]*?<\/section>/, '');
  const memberships = groups.filter(([, slugs]) => slugs.includes(item.slug));
  const candidates = [];
  for (const [group, slugs] of memberships) {
    for (const slug of slugs) {
      if (slug === item.slug || candidates.some((x) => x.slug === slug)) continue;
      const related = bySlug.get(slug);
      if (related) candidates.push({ ...related, group });
    }
  }
  if (!candidates.length) continue;
  const cards = candidates.slice(0, 4).map((related) => `<article class="card"><span class="pill">${esc(related.group)} · ${esc(related.year ?? 'latest')}</span><h3><a href="../${esc(related.slug)}/">${esc(related.name)}</a></h3><p>Compare ${esc(related.countries ?? '')} countries and explore the available historical years.</p><a href="../${esc(related.slug)}/">Explore ${esc(related.name)} →</a></article>`).join('');
  const section = `<section class="section section-related"><div class="wrap"><div class="eyebrow">Keep exploring</div><h2>Related indicators</h2><p class="muted">Continue with closely related official World Bank data.</p><div class="grid">${cards}</div><p><a href="../">Browse all 30 indicators →</a></p></div></section>`;
  html = html.replace('<section class="section"><div class="wrap"><div class="eyebrow">Source & coverage</div>', `${section}<section class="section"><div class="wrap"><div class="eyebrow">Source & coverage</div>`);
  await writeFile(path, html, 'utf8');
}

console.log(`Added related-indicator discovery paths across ${indicators.length} WDI pages.`);
