import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/countries/', import.meta.url);
const htmlUrl = new URL('index.html', root);
const indexUrl = new URL('index.json', root);

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const [html, directory] = await Promise.all([
  readFile(htmlUrl, 'utf8'),
  readFile(indexUrl, 'utf8').then(JSON.parse)
]);

const countries = directory.countries ?? [];
const options = countries
  .map((country) => `<option value="${esc(country.country)}">${esc(country.code)} · ${esc(country.region?.name ?? '')}</option>`)
  .join('');

let next = html.replace(
  '<input id="country-search" type="search" placeholder="Germany, Brazil, JPN…" autocomplete="off"',
  '<input id="country-search" type="search" list="country-options" placeholder="Start typing a country…" autocomplete="off" aria-describedby="country-search-help"'
);

next = next.replace(
  '</label><label><span class="muted">Region</span>',
  `</label><datalist id="country-options">${options}</datalist><label><span class="muted">Region</span>`
);

next = next.replace(
  '<p id="country-result-count" class="muted" aria-live="polite">',
  '<p id="country-search-help" class="muted">Choose a suggestion or type any country name or 3-letter code. Press Enter to open the best match.</p><p id="country-result-count" class="muted" aria-live="polite">'
);

next = next.replace(
  "search.addEventListener('input',apply);region.addEventListener('change',apply);",
  `search.addEventListener('input',apply);search.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=search.value.trim().toLowerCase();if(!q)return;const exact=cards.find(card=>card.dataset.country.split(' ').slice(0,-1).join(' ')===q||card.dataset.country.endsWith(' '+q));const prefix=cards.filter(card=>card.dataset.country.startsWith(q));const match=exact||(prefix.length===1?prefix[0]:null);if(match){e.preventDefault();const link=match.querySelector('a[href]');if(link)location.href=link.href;}});region.addEventListener('change',apply);`
);

if (next === html) throw new Error('Country search enrichment markers were not found.');
await writeFile(htmlUrl, next, 'utf8');
console.log(`Enriched country discovery with ${countries.length} searchable suggestions.`);
