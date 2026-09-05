import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = [
  ['data/death-rate/index.html', 'Death rate, crude (per 1,000 people) by Country', 'country and territory observations'],
  ['de/data/death-rate/index.html', 'Sterberate (je 1.000 Personen) nach Ländern', 'Länder- und Gebietseinträge'],
  ['es/data/death-rate/index.html', 'Tasa bruta de mortalidad (por 1.000 personas) por país', 'observaciones de países y territorios'],
  ['fr/data/death-rate/index.html', 'Taux brut de mortalité (pour 1 000 personnes) par pays', 'observations de pays et territoires'],
  ['zh-hans/data/death-rate/index.html', '粗死亡率（每千人）：各国比较', '国家和地区观测值'],
];

test('released WDI indicator pages expose localized high-intent search snippets', async () => {
  for (const [path, titleFragment, descriptionFragment] of pages) {
    const html = await readFile(new URL(`../site/${path}`, import.meta.url), 'utf8');
    assert.match(html, new RegExp(`<title>[^<]*${escapeRegex(titleFragment)}[^<]*<\\/title>`));
    assert.match(html, new RegExp(`<meta name="description" content="[^"]*${escapeRegex(descriptionFragment)}[^"]*">`));
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
