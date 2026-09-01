import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/wdi/', siteRoot);
const compareUrl = new URL('compare/index.html', siteRoot);
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
const catalog = await readJson(new URL('index.json', dataRoot));
const focus = {};

for (const meta of catalog.indicators ?? []) {
  if (meta.status !== 'CURRENT_VERIFIED') continue;
  const snapshot = await readJson(new URL(`${meta.slug}/data.json`, dataRoot));
  const values = {};
  for (const row of snapshot.records ?? []) {
    if (!row.code || !Number.isFinite(row.value)) continue;
    values[row.code] = { value: row.value, year: row.year };
  }
  focus[meta.slug] = {
    name: meta.name ?? snapshot.indicator?.name ?? meta.slug,
    unit: meta.unit ?? snapshot.indicator?.unit ?? '',
    values,
  };
}

let html = await readFile(compareUrl, 'utf8');
const payload = JSON.stringify(focus).replaceAll('<', '\\u003c');
const enhancement = `<script>const FOCUS=${payload};
(()=>{const q=new URLSearchParams(location.search),slug=q.get('indicator'),metric=FOCUS[slug];if(!metric)return;const grid=document.getElementById('comparison-grid'),summary=document.getElementById('compare-summary');let busy=false;
function fmt(v,unit){if(!Number.isFinite(v))return '—';if((unit||'').includes('US$')){const n=Math.abs(v);if(n>=1e12)return '$'+(v/1e12).toFixed(2)+'T';if(n>=1e9)return '$'+(v/1e9).toFixed(2)+'B';if(n>=1e6)return '$'+(v/1e6).toFixed(2)+'M';return '$'+v.toLocaleString('en-US',{maximumFractionDigits:0});}if(unit==='people')return v.toLocaleString('en-US',{maximumFractionDigits:0});return v.toLocaleString('en-US',{maximumFractionDigits:Math.abs(v)>=100?1:2});}
function suffix(unit){if((unit||'').includes('%'))return '%';if(unit==='years')return ' years';if(unit==='metric tons per person')return ' t/person';return '';}
function cell(m){return m?'<strong>'+fmt(m.value,metric.unit)+suffix(metric.unit)+'</strong><br><small>Observation year '+m.year+'</small>':'—';}
function paint(){if(busy)return;const params=new URLSearchParams(location.search),a=params.get('a'),b=params.get('b');if(!a||!b)return;const ca=DATA.countries.find(c=>c.code===a),cb=DATA.countries.find(c=>c.code===b);if(!ca||!cb)return;const ma=metric.values[a],mb=metric.values[b];let diff='<span class="muted">No comparable pair</span>';if(ma&&mb){diff=ma.year===mb.year?'<strong>'+((ma.value-mb.value)>0?'+':'')+fmt(ma.value-mb.value,metric.unit)+suffix(metric.unit)+'</strong> <span class="muted">(A − B, '+ma.year+')</span>':'<span class="muted">No difference shown — observation years differ</span>';}
busy=true;grid.querySelector('[data-comparison-focus]')?.remove();grid.insertAdjacentHTML('afterbegin','<article class="metric-card" data-comparison-focus><div class="eyebrow">Comparison focus</div><h3><a href="../data/'+slug+'/">'+metric.name+'</a></h3><div class="metric-values"><div class="metric-value"><small class="muted">'+ca.country+'</small><br>'+cell(ma)+'</div><div class="metric-value"><small class="muted">'+cb.country+'</small><br>'+cell(mb)+'</div></div><p class="metric-diff">'+diff+'</p></article>');summary.textContent='Focused on '+metric.name+'. The six standard indicators remain below for broader context.';const next=new URLSearchParams(location.search);next.set('indicator',slug);history.replaceState(null,'','?'+next.toString());busy=false;}
new MutationObserver(()=>paint()).observe(grid,{childList:true});paint();})();</script>`;
html = html.replace('</body>', `${enhancement}</body>`);
await writeFile(compareUrl, html, 'utf8');
console.log(`Enriched country comparison with ${Object.keys(focus).length} contextual indicators.`);
