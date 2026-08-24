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

test('internet-use parent keeps crawlable country links and ItemList discovery without duplicate profile cards', async () => {
  await execFileAsync(process.execPath, [parentBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);
  await execFileAsync(process.execPath, [directoryBuilder.pathname]);

  const data = JSON.parse(await readFile(dataUrl, 'utf8'));
  const html = await readFile(htmlUrl, 'utf8');

  assert.doesNotMatch(html, /id="country-profiles"/);
  assert.ok(Buffer.byteLength(html, 'utf8') < 125_000, 'parent HTML exceeds the mobile performance budget');
  assert.ok((html.match(/<article\b/g) || []).length < 10, 'country profiles must not be duplicated as 182 article cards');

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    const links = html.match(new RegExp(`href="\\.\\/country\\/${slug}\\/"`, 'g')) || [];
    assert.equal(links.length, 2, `${record.code} must remain linked from the region directory and comparison table`);
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
