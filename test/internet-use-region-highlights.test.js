import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const htmlUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const dataUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

test('internet-use landing page exposes data-derived regional highlights', async () => {
  const [html, data] = await Promise.all([
    readFile(htmlUrl, 'utf8'),
    readFile(dataUrl, 'utf8').then(JSON.parse),
  ]);

  const regions = [...new Map(data.records.map((record) => [record.region.code, record.region.name])).entries()];
  assert.ok(regions.length >= 2);
  assert.match(html, /id="region-highlights-heading"/);
  assert.match(html, /Compare internet use by region/);

  for (const [code, name] of regions) {
    assert.ok(html.includes(`href="./region/${code.toLowerCase()}/"`), `missing region link for ${code}`);
    assert.ok(html.includes(`>${esc(name)}</h3>`), `missing regional highlight for ${name}`);
  }
});
