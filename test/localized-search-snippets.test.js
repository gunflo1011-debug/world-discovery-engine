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

const localePaths = ['', 'de/', 'es/', 'fr/', 'zh-hans/'];
const site = new URL('../site/', import.meta.url);

test('released WDI indicator pages expose localized high-intent search snippets', async () => {
  for (const [path, titleFragment, descriptionFragment] of pages) {
    const html = await readFile(new URL(`../site/${path}`, import.meta.url), 'utf8');
    assert.match(html, new RegExp(`<title>[^<]*${escapeRegex(titleFragment)}[^<]*<\\/title>`));
    assert.match(html, new RegExp(`<meta name="description" content="[^"]*${escapeRegex(descriptionFragment)}[^"]*">`));
  }
});

test('all released verified WDI meta descriptions stay within 160 characters', async () => {
  const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', site), 'utf8'));
  const verified = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED');

  for (const item of verified) {
    for (const localePath of localePaths) {
      const path = `${localePath}data/${item.slug}/index.html`;
      const html = await readFile(new URL(path, site), 'utf8');
      const description = html.match(/<meta name="description" content="([^"]*)">/i)?.[1];
      assert.ok(description, `${path} should expose a meta description`);
      assert.ok(description.length <= 160, `${path} meta description is ${description.length} characters`);
    }
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
