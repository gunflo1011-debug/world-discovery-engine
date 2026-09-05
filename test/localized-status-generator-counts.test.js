import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

test('localized status generator derives coverage counts from current generated data', async () => {
  const catalog = await readJson(new URL('data/wdi/index.json', site));
  const countries = await readJson(new URL('countries/index.json', site));
  const verifiedCount = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED').length;
  const directoryCount = (countries.countries ?? []).length;

  execFileSync(process.execPath, ['scripts/build-localized-status.mjs'], { cwd: root, stdio: 'pipe' });

  for (const locale of ['de', 'es', 'fr', 'zh-hans']) {
    const html = await readFile(new URL(`${locale}/status/index.html`, site), 'utf8');
    assert.match(html, new RegExp(`<div class="value">${verifiedCount}</div>`), `${locale} should use the live verified indicator count`);
    assert.match(html, new RegExp(`<div class="value">${directoryCount}</div>`), `${locale} should use the live country-directory count`);
  }
});
