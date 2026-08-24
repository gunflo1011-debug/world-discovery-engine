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
const tableScriptUrl = new URL('../site/internet-table.js', import.meta.url);

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
  const tableScript = await readFile(tableScriptUrl, 'utf8');

  assert.doesNotMatch(html, /id="country-profiles"/);
  assert.match(html, /<script src="\.\.\/\.\.\/internet-table\.js" defer><\/script>/);
  assert.match(html, /id="country-table-jump" href="#internet-table"/);
  assert.match(html, /id="internet-table" tabindex="-1"/);
  assert.match(html, /id="comparison-trust" class="sourcebox" aria-label="Verify this comparison data"/);
  assert.match(html, /href="#source-provenance">Source, license and retrieval<\/a>/);
  assert.match(html, /href="\.\.\/\.\.\/methodology\/">Validation methodology<\/a>/);
  assert.match(html, /id="source-provenance" tabindex="-1"/);
  assert.equal((html.match(/id="comparison-trust"/g) || []).length, 1);
  assert.equal((html.match(/<th scope="col">/g) || []).length, 4);
  assert.match(html, /<select id="compare-a"><option value="">Choose a country<\/option><\/select>/);
  assert.match(html, /<select id="compare-b"><option value="">Choose a country<\/option><\/select>/);
  assert.match(html, /const compareEntries=\[\.\.\.byCode\.entries\(\)\]\.sort/);
  assert.match(html, /option\.value=code\.toUpperCase\(\)/);
  assert.match(html, /rank:Number\(row\.dataset\.rank\)/);
  assert.match(html, /region:\[\.\.\.region\.options\]\.find/);
  assert.match(html, /ranks #"\+left\.rank\+" of "\+rows\.length/);
  assert.ok(Buffer.byteLength(html, 'utf8') < 110_000, 'parent HTML exceeds the mobile performance budget');
  assert.ok((html.match(/<article\b/g) || []).length < 10, 'country profiles must not be duplicated as 182 article cards');
  assert.match(tableScript, /const initialLimit = 25;/);
  assert.match(tableScript, /aria-controls/);
  assert.match(tableScript, /Show all \$\{rows\.length\} countries/);
  assert.match(tableScript, /search\.addEventListener\('input', compact\)/);
  assert.match(tableScript, /empty\.setAttribute\('aria-labelledby', 'country-status'\)/);
  assert.match(tableScript, /No countries match these filters\. Reset both filters/);
  assert.match(tableScript, /emptyReset\.textContent = `Show all \$\{rows\.length\} countries`/);
  assert.match(tableScript, /emptyReset\.addEventListener\('click', \(\) => clear\.click\(\)\)/);
  assert.match(tableScript, /aria-label', 'Selected country profiles'/);
  assert.match(tableScript, /\.\/country\/\$\{code\.toLowerCase\(\)\}\//);
  assert.match(tableScript, /Open \$\{countriesByCode\.get\(code\)\} profile/);
  assert.match(tableScript, /compareA\?\.addEventListener\('change', renderCompareLinks\)/);
  assert.match(tableScript, /shareStatus\.setAttribute\('role', 'status'\)/);
  assert.match(tableScript, /navigator\.share\(\{/);
  assert.match(tableScript, /navigator\.clipboard\?\.writeText/);
  assert.match(tableScript, /url: shareLink\.href/);
  assert.match(tableScript, /Comparison shared\./);
  assert.match(tableScript, /Comparison link copied\./);
  assert.match(tableScript, /shareLink\?\.addEventListener\('click', shareComparison\)/);

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    const links = html.match(new RegExp(`href="\\.\\/country\\/${slug}\\/"`, 'g')) || [];
    assert.equal(links.length, 2, `${record.code} must remain linked from the region directory and comparison table`);
  }
  assert.equal((html.match(/<th scope="row">/g) || []).length, data.records.length);

  const itemList = extractJsonLd(html).find((entry) => entry['@type'] === 'ItemList');
  assert.ok(itemList, 'missing country ItemList JSON-LD');
  assert.equal(itemList.numberOfItems, data.records.length);
  assert.equal(itemList.itemListElement.length, data.records.length);

  const urls = new Set(itemList.itemListElement.map((item) => item.url));
  for (const record of data.records) {
    assert.ok(urls.has(`https://worlddiscoverydata.com/indicators/internet-use/country/${record.code.toLowerCase()}/`));
  }
});
