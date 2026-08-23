import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const parentBuilder = new URL('../scripts/build-internet-use.mjs', import.meta.url);
const countryBuilder = new URL('../scripts/build-internet-use-countries.mjs', import.meta.url);
const directoryBuilder = new URL('../scripts/enrich-internet-use-country-directory.mjs', import.meta.url);
const dataUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const htmlUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);

function extractJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
}

test('internet-use parent exposes crawlable country profiles and ItemList discovery', async () => {
  await execFileAsync(process.execPath, [parentBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);
  await execFileAsync(process.execPath, [directoryBuilder.pathname]);

  const data = JSON.parse(await readFile(dataUrl, 'utf8'));
  const html = await readFile(htmlUrl, 'utf8');

  assert.match(html, /id="country-profiles"/);
  assert.match(html, /href="\.\/country\/index\.json">Machine-readable country directory →<\/a>/);

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    assert.match(html, new RegExp(`href="\\.\\/country\\/${slug}\\/"`));
    assert.match(html, new RegExp(`${record.code} · ${record.value}%`));
  }

  const itemList = extractJsonLd(html).find((entry) => entry['@type'] === 'ItemList');
  assert.ok(itemList, 'missing country ItemList JSON-LD');
  assert.equal(itemList.numberOfItems, data.records.length);
  assert.equal(itemList.itemListElement.length, data.records.length);

  const urls = new Set(itemList.itemListElement.map((item) => item.url));
  for (const record of data.records) {
    assert.ok(urls.has(`https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/country/${record.code.toLowerCase()}/`));
  }
});
