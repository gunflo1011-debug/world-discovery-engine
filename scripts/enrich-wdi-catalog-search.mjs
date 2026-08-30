import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../site/data/index.html', import.meta.url);
let html = await readFile(path, 'utf8');
html = html.replace(/<section class="section" id="catalog-search">[\s\S]*?<\/section>/, '');
html = html.replace(/<script id="catalog-filter">[\s\S]*?<\/script>/, '');
const search = `<section class="section" id="catalog-search"><div class="wrap"><div class="discovery-search"><label for="indicator-search"><strong>Find an indicator</strong></label><div><input id="indicator-search" type="search" placeholder="Try population, GDP, internet, health…" autocomplete="off"><button type="button" id="indicator-clear">Clear</button></div><p class="muted" id="indicator-count"></p></div></div></section>`;
html = html.replace('<main><section class="section">', `<main>${search}<section class="section">`);
const script = `<script id="catalog-filter">(()=>{const input=document.getElementById('indicator-search'),clear=document.getElementById('indicator-clear'),count=document.getElementById('indicator-count'),cards=[...document.querySelectorAll('main .card')];if(!input)return;const apply=()=>{const q=input.value.trim().toLowerCase();let shown=0;for(const card of cards){const ok=!q||card.textContent.toLowerCase().includes(q);card.hidden=!ok;if(ok)shown++}count.textContent=q?shown+' matching indicator'+(shown===1?'':'s'):cards.length+' indicators available';const u=new URL(location.href);if(q)u.searchParams.set('q',input.value.trim());else u.searchParams.delete('q');history.replaceState(null,'',u)};input.value=new URLSearchParams(location.search).get('q')||'';input.addEventListener('input',apply);clear.addEventListener('click',()=>{input.value='';apply();input.focus()});apply()})()</script>`;
html = html.replace('</body>', `${script}</body>`);
await writeFile(path, html, 'utf8');
console.log('Added query-aware indicator filtering to the public WDI catalog.');
