import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const pageRoot = new URL('data/', siteRoot);
const catalog = JSON.parse(await readFile(new URL('index.json', dataRoot), 'utf8'));
const indicators = Array.isArray(catalog?.indicators) ? catalog.indicators : [];
const marker = 'data-exact-query-answer';
let changed = 0;

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

for (const item of indicators) {
  if (item.status !== 'CURRENT_VERIFIED') continue;

  const snapshotPath = new URL(`${item.slug}/data.json`, dataRoot);
  const pagePath = new URL(`${item.slug}/index.html`, pageRoot);
  let snapshot;
  let html;
  try {
    snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
    html = await readFile(pagePath, 'utf8');
  } catch {
    continue;
  }

  if (!Array.isArray(snapshot?.records) || !snapshot.records.length || html.includes(marker)) continue;

  const countries = [...snapshot.records]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((record) => `<option value="${esc(record.country)}">${esc(record.country)}</option>`)
    .join('');

  const block = `<section class="section section-soft" ${marker}><div class="wrap"><div class="eyebrow">Exact country & year lookup</div><h2>Find the exact ${esc(item.name)} value</h2><p class="muted">Use this lookup for searches that combine a country, year and World Bank indicator code <strong>${esc(item.code)}</strong>. Values come from the same official dataset used in the ranking below.</p><div class="wdi-browser"><div class="wdi-controls"><div class="wdi-control"><label for="exact-country-${esc(item.slug)}">Country</label><select id="exact-country-${esc(item.slug)}" data-exact-country><option value="">Choose a country</option>${countries}</select></div><div class="wdi-control"><label>Year</label><p class="wdi-browser-note"><strong data-exact-year>${esc(item.year)}</strong> · change the year in the country table below to update this answer.</p></div></div><div class="wdi-trend" aria-live="polite"><p data-exact-answer>Select a country to see its ${esc(item.name)} value for ${esc(item.year)}.</p></div></div></div></section>`;

  const script = `<script>(function(){const root=document.querySelector('[${marker}]');if(!root)return;const country=root.querySelector('[data-exact-country]');const answer=root.querySelector('[data-exact-answer]');const yearOut=root.querySelector('[data-exact-year]');const yearSelect=document.querySelector('[data-year-select]');const rows=document.querySelector('[data-country-rows]');const indicatorName=${JSON.stringify(item.name)};const indicatorCode=${JSON.stringify(item.code)};function update(){const year=(yearSelect&&yearSelect.value)||${JSON.stringify(String(item.year))};yearOut.textContent=year;const selected=country.value;if(!selected){answer.textContent='Select a country to see its '+indicatorName+' value for '+year+'.';return;}const match=[...rows.querySelectorAll('tr')].find((row)=>{const name=row.querySelector('td:nth-child(2) strong');return name&&name.textContent.trim()===selected;});if(!match){answer.textContent='No observation is available for '+selected+' in '+year+' for '+indicatorCode+'.';return;}const value=(match.querySelector('td:nth-child(3)')?.textContent||'').trim();answer.textContent=selected+' — '+indicatorName+' ('+indicatorCode+'), '+year+': '+value+'. Source: World Bank World Development Indicators.';}country.addEventListener('change',update);yearSelect&&yearSelect.addEventListener('change',()=>setTimeout(update,0));if(rows)new MutationObserver(update).observe(rows,{childList:true,subtree:true});update();})();</script>`;

  const anchor = '<section class="section" id="countries">';
  if (!html.includes(anchor)) continue;
  html = html.replace(anchor, `${block}${anchor}`);
  html = html.replace('</body>', `${script}</body>`);
  await writeFile(pagePath, html, 'utf8');
  changed += 1;
}

if (changed === 0) throw new Error('Exact-query answer layer did not modify any verified WDI pages.');
console.log(`Added exact-query answer lookup to ${changed} verified WDI pages.`);
