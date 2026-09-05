import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const siteRoot = new URL('../site/', import.meta.url);

const locales = [
  ['de', 'Subsahara-Afrika', 'Lateinamerika & Karibik'],
  ['es', 'África subsahariana', 'América Latina y el Caribe'],
  ['fr', 'Afrique subsaharienne', 'Amérique latine et Caraïbes'],
  ['zh-hans', '撒哈拉以南非洲', '拉丁美洲和加勒比地区']
];

test('localized country hubs normalize and translate World Bank region labels', async () => {
  await execFileAsync(process.execPath, ['scripts/build-localized-country-hubs.mjs']);

  for (const [path, africa, latam] of locales) {
    const directory = await readFile(new URL(`${path}/countries/index.html`, siteRoot), 'utf8');
    const angola = await readFile(new URL(`${path}/countries/ago/index.html`, siteRoot), 'utf8');
    const argentina = await readFile(new URL(`${path}/countries/arg/index.html`, siteRoot), 'utf8');

    assert.match(directory, new RegExp(africa));
    assert.match(directory, new RegExp(latam.replace('&', '&amp;')));
    assert.match(angola, new RegExp(africa));
    assert.match(argentina, new RegExp(latam.replace('&', '&amp;')));
    assert.doesNotMatch(directory, /Sub-Saharan Africa\s*|Latin America &amp; Caribbean\s*/);
    assert.doesNotMatch(angola, /Sub-Saharan Africa\s*/);
    assert.doesNotMatch(argentina, /Latin America &amp; Caribbean\s*/);
  }
});
