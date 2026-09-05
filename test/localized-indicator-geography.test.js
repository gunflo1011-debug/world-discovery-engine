import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const cases = [
  ['de', 'Deutschland', 'Personen'],
  ['es', 'Alemania', 'personas'],
  ['fr', 'Allemagne', 'personnes'],
  ['zh-hans', '德国', '人']
];

for (const [path, germany, people] of cases) {
  test(`${path} indicator ranking localizes country names and units`, async () => {
    const html = await read(`site/${path}/data/population/index.html`);
    assert.ok(html.includes(`<strong>${germany}</strong>`), `${path} ranking should display the localized Germany name`);
    assert.ok(html.includes(` · ${people}</th>`), `${path} population value heading should use the localized unit`);
    assert.ok(!html.includes('<strong>Germany</strong>'), `${path} ranking must not expose Germany as visible English copy`);
  });
}
