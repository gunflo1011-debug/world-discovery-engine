import { readFile, writeFile } from 'node:fs/promises';

const directoryUrl = new URL('../site/countries/index.html', import.meta.url);
let html = await readFile(directoryUrl, 'utf8');

html = html
  .replaceAll('COUNTRY PROFILES', 'COUNTRY &amp; TERRITORY PROFILES')
  .replaceAll('country profiles.', 'country and territory profiles.')
  .replaceAll('country profiles built from', 'country and territory profiles built from')
  .replaceAll('No country profiles match this search.', 'No country or territory profiles match this search.');

await writeFile(directoryUrl, html, 'utf8');
console.log('Clarified country and territory directory wording.');
