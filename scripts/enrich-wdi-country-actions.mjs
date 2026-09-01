import { readdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataRoot = new URL('data/', siteRoot);
const entries = await readdir(dataRoot, { withFileTypes: true });
let enriched = 0;

const client = `<script>(()=>{const rows=document.querySelector('[data-country-rows]');if(!rows)return;const indicator=location.pathname.split('/').filter(Boolean).at(-1)||'';const decorate=()=>{for(const row of rows.querySelectorAll('tr')){const cell=row.children[1];if(!cell||cell.dataset.actionsReady)return;const strong=cell.querySelector('strong');const meta=cell.querySelector('.muted');const code=meta?.textContent?.trim().match(/^([A-Z]{3})\\b/)?.[1];if(!strong||!code)continue;const name=strong.textContent.trim();if(!strong.closest('a')){const profile=document.createElement('a');profile.href='../../countries/'+code.toLowerCase()+'/';strong.replaceWith(profile);profile.append(strong)}const compare=document.createElement('a');const params=new URLSearchParams({a:code});if(indicator)params.set('indicator',indicator);compare.href='../../compare/?'+params.toString();compare.textContent='Compare →';compare.className='country-compare-action';cell.insertBefore(document.createTextNode(' · '),meta);cell.insertBefore(compare,meta);cell.insertBefore(document.createElement('br'),meta);const oldBreak=[...cell.childNodes].find(n=>n.nodeName==='BR'&&n.nextSibling===meta);if(oldBreak)oldBreak.remove();cell.dataset.actionsReady='true';compare.setAttribute('aria-label','Compare '+name+' with another country')}};decorate();new MutationObserver(decorate).observe(rows,{childList:true,subtree:true})})();</script>`;

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name === 'wdi') continue;
  const file = new URL(`${entry.name}/index.html`, dataRoot);
  let html;
  try { html = await readFile(file, 'utf8'); } catch { continue; }
  if (!html.includes('data-country-rows') || html.includes('country-compare-action')) continue;
  html = html.replace('</body>', `${client}</body>`);
  await writeFile(file, html, 'utf8');
  enriched++;
}

console.log(`Added direct country/compare actions to ${enriched} WDI indicator pages.`);
