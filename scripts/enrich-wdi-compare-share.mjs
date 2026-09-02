import { readFile, writeFile } from 'node:fs/promises';

const pageUrl = new URL('../site/compare/index.html', import.meta.url);
let html = await readFile(pageUrl, 'utf8');
const marker = 'data-wdi-compare-share="v1"';

if (html.includes(marker)) {
  console.log('Country comparison sharing already enriched.');
  process.exit(0);
}

const summary = '<p id="compare-summary" class="muted"></p>';
if (!html.includes(summary)) throw new Error('Compare summary marker not found');

html = html.replace(
  summary,
  `${summary}<div class="compare-actions" ${marker}><button id="share-comparison" class="swap-btn" type="button">Share comparison</button><span id="share-comparison-status" class="compare-share-status muted" role="status" aria-live="polite"></span></div>`
);

const styleEnd = '</style>';
if (!html.includes(styleEnd)) throw new Error('Compare style marker not found');
html = html.replace(
  styleEnd,
  `.compare-actions{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin:.75rem 0 1rem}.compare-share-status{font-size:.86rem}@media(max-width:700px){.compare-actions .swap-btn{width:100%}}${styleEnd}`
);

const scriptEnd = '</script></body>';
if (!html.includes(scriptEnd)) throw new Error('Compare script marker not found');
html = html.replace(
  scriptEnd,
  `\nconst shareButton=document.getElementById('share-comparison'),shareStatus=document.getElementById('share-comparison-status');shareButton.addEventListener('click',async()=>{const ca=byCode[codeA],cb=byCode[codeB],url=location.href,title=ca&&cb?ca.country+' vs '+cb.country+' — World Discovery':'World Discovery country comparison';try{if(navigator.share){await navigator.share({title,url});shareStatus.textContent='Shared.';return}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);shareStatus.textContent='Comparison link copied.';return}window.prompt('Copy this comparison link:',url);shareStatus.textContent='Comparison link ready to copy.'}catch(error){if(error?.name==='AbortError')return;window.prompt('Copy this comparison link:',url);shareStatus.textContent='Comparison link ready to copy.';}});\n${scriptEnd}`
);

await writeFile(pageUrl, html, 'utf8');
console.log('Added shareable country comparison action.');
