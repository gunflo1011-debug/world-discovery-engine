import fs from 'node:fs';

const file = new URL('../site/index.html', import.meta.url);
let html = fs.readFileSync(file, 'utf8');

const oldRender = "function render(q){const rows=matches(q);box.innerHTML='';if(!rows.length){box.hidden=true;input.setAttribute('aria-expanded','false');return}rows.forEach(x=>{const a=document.createElement('a');a.href=x.url;a.className='search-suggestion';a.setAttribute('role','option');a.innerHTML='<span>'+x.label+'</span><small>'+x.detail+'</small>';box.appendChild(a)});box.hidden=false;input.setAttribute('aria-expanded','true')}";
const newRender = "let activeSuggestion=-1;function setActiveSuggestion(i){const rows=[...box.querySelectorAll('[role=option]')];if(!rows.length){activeSuggestion=-1;input.removeAttribute('aria-activedescendant');return}activeSuggestion=(i+rows.length)%rows.length;rows.forEach((row,index)=>row.setAttribute('aria-selected',index===activeSuggestion?'true':'false'));input.setAttribute('aria-activedescendant',rows[activeSuggestion].id)}function render(q){const rows=matches(q);box.innerHTML='';activeSuggestion=-1;input.removeAttribute('aria-activedescendant');if(!rows.length){box.hidden=true;input.setAttribute('aria-expanded','false');return}rows.forEach((x,i)=>{const a=document.createElement('a');a.href=x.url;a.id='home-suggestion-'+i;a.className='search-suggestion';a.setAttribute('role','option');a.setAttribute('aria-selected','false');a.innerHTML='<span>'+x.label+'</span><small>'+x.detail+'</small>';box.appendChild(a)});box.hidden=false;input.setAttribute('aria-expanded','true')}";
const oldKeys = "input.addEventListener('keydown',e=>{if(e.key==='Enter')go();if(e.key==='Escape'){box.hidden=true;input.setAttribute('aria-expanded','false')}});";
const newKeys = "input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(box.hidden)render(input.value);setActiveSuggestion(activeSuggestion+(e.key==='ArrowDown'?1:-1));return}if(e.key==='Enter'){const active=box.querySelector('[aria-selected=true]');if(active){e.preventDefault();location.href=active.href}else go();return}if(e.key==='Escape'){box.hidden=true;activeSuggestion=-1;input.removeAttribute('aria-activedescendant');input.setAttribute('aria-expanded','false')}});";

if (html.includes(newKeys)) process.exit(0);
if (!html.includes(oldRender) || !html.includes(oldKeys)) throw new Error('Homepage guided-search markers changed; refusing unsafe rewrite.');
html = html.replace(oldRender, newRender).replace(oldKeys, newKeys);
fs.writeFileSync(file, html);
