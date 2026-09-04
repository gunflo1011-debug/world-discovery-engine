import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../site/', import.meta.url);
const cases = {
  de: ['Vergleiche zwei Länder direkt.','Länder tauschen','Beobachtungsjahr','Deutschland'],
  es: ['Compara dos países lado a lado.','Intercambiar países','Año de observación','Alemania'],
  fr: ['Comparez deux pays côte à côte.','Permuter les pays','Année d’observation','Allemagne'],
  'zh-hans': ['并排比较两个国家。','交换国家','观测年份','德国']
};

test('localized compare pages are language-pure functional equivalents', async () => {
  for (const [path, expected] of Object.entries(cases)) {
    const html = await readFile(new URL(`${path}/compare/index.html`, root), 'utf8');
    for (const text of expected) assert.ok(html.includes(text), `${path} missing ${text}`);
    assert.ok(html.includes('id="country-a"'));
    assert.ok(html.includes('id="country-b"'));
    assert.ok(html.includes('id="swap-countries"'));
    assert.ok(html.includes('indicator'));
    assert.ok(html.includes(`https://worlddiscoverydata.com/${path}/compare/`));
    assert.ok(!html.includes('Compare two countries side by side.'));
    assert.ok(!html.includes('Start typing to see matching countries.'));
    assert.ok(!html.includes('Observation year '));
    assert.ok(!html.includes('Open Country A profile'));
  }
});
