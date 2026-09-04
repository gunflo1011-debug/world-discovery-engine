import { readFile, writeFile } from 'node:fs/promises';

const directoryUrl = new URL('../site/countries/index.html', import.meta.url);
let html = await readFile(directoryUrl, 'utf8');

const replacements = [
  [' COUNTRY PROFILES · OFFICIAL WORLD BANK DATA', ' COUNTRY & TERRITORY PROFILES · OFFICIAL WORLD BANK DATA'],
  ['Showing all '+"' + cards.length + '"+' country profiles.', 'Showing all '+"' + cards.length + '"+' country and territory profiles.'],
  ['Showing '+"' + visible + ' of ' + cards.length + '"+' country profiles.', 'Showing '+"' + visible + ' of ' + cards.length + '"+' country and territory profiles.'],
  ['No country profiles match this search.', 'No country or territory profiles match this search.'],
  ['Official WDI country profiles.', 'Official WDI country and territory profiles.'],
  ['Browse country profiles built from 30 official World Bank WDI indicators', 'Browse country and territory profiles built from 30 official World Bank WDI indicators']
];

for (const [from, to] of replacements) html = html.replaceAll(from, to);

await writeFile(directoryUrl, html, 'utf8');
console.log('Clarified country and territory directory wording.');
