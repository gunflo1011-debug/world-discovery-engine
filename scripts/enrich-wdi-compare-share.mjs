import { readFile, writeFile } from 'node:fs/promises';

const compareUrl = new URL('../site/compare/index.html', import.meta.url);
let html = await readFile(compareUrl, 'utf8');
const enhancement = `<script>(()=>{const summary=document.getElementById('compare-summary');if(!summary)return;const actions=document.createElement('div');actions.className='country-links';actions.setAttribute('data-compare-share','');const share=document.createElement('button');share.type='button';share.className='swap-btn';share.textContent='Share this comparison';const status=document.createElement('span');status.className='muted';status.setAttribute('role','status');actions.append(share,status);summary.insertAdjacentElement('afterend',actions);async function shareComparison(){const url=location.href,title=document.getElementById('compare-title')?.textContent||'Country comparison';try{if(navigator.share){await navigator.share({title:title+' — World Discovery',url});status.textContent='Shared.';return;}await navigator.clipboard.writeText(url);status.textContent='Comparison link copied.';}catch(error){if(error?.name!=='AbortError')status.textContent='Copy the address bar URL to share this comparison.';}}share.addEventListener('click',shareComparison);})();</script>`;
html = html.replace('</body>', `${enhancement}</body>`);
await writeFile(compareUrl, html, 'utf8');
console.log('Added contextual share action to country comparison.');
