import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const mainBuilder = new URL('../scripts/build-internet-use.mjs', import.meta.url);
const countryBuilder = new URL('../scripts/build-internet-use-countries.mjs', import.meta.url);
const regionBuilder = new URL('../scripts/build-internet-use-regions.mjs', import.meta.url);
const dataUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('regional builder creates exactly seven substantial source-faithful landing pages with bidirectional discovery', async () => {
  await execFileAsync(process.execPath, [mainBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);
  await execFileAsync(process.execPath, [regionBuilder.pathname]);

  const data = JSON.parse(await readFile(dataUrl, 'utf8'));
  const groups = new Map();
  for (const record of data.records) {
    assert.match(record.region.code, /^[A-Z]{3}$/);
    assert.ok(record.region.name.trim());
    if (!groups.has(record.region.code)) groups.set(record.region.code, []);
    groups.get(record.region.code).push(record);
  }
  assert.equal(groups.size, 7);

  for (const [code, records] of groups) {
    const slug = code.toLowerCase();
    const regionName = records[0].region.name.trim();
    const htmlRegionName = regionName.replaceAll('&', '&amp;');
    const html = await readFile(new URL(`../site/indicators/internet-use/region/${slug}/index.html`, import.meta.url), 'utf8');
    assert.match(html, new RegExp(`<h1>Internet use in ${escapeRegex(htmlRegionName)}</h1>`));
    assert.match(html, new RegExp(`Compare ${records.length} official same-year country observations`));
    assert.match(html, new RegExp(`rel="canonical" href="https://gunflo1011-debug\\.github\\.io/world-discovery-engine/indicators/internet-use/region/${slug}/"`));
    assert.match(html, /Regional picture/);
    assert.match(html, /Highest values in the region/);
    assert.match(html, new RegExp(`These are the ${Math.min(5, records.length)} highest ${data.observationYear} observations`));
    assert.match(html, new RegExp(`All ${records.length} country observations`));
    assert.match(html, /rankings are calculated only among the countries assigned to this official World Bank region/i);
    assert.match(html, /no separate country-to-region mapping is used/i);
    assert.match(html, /not a historical revision product, causal analysis or complete worldwide ranking/i);
    assert.match(html, /"@type":"WebPage"/);
    assert.match(html, /"@type":"ItemList"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, new RegExp(`"identifier":"${code}"`));
    assert.match(html, new RegExp(`"numberOfItems":${records.length}`));
    assert.match(html, new RegExp(escapeRegex(data.countryMetadataUrl.replaceAll('&', '&amp;'))));

    for (const record of data.records) {
      const countryLink = `../../country/${record.code.toLowerCase()}/`;
      if (record.region.code === code) assert.match(html, new RegExp(`href="${escapeRegex(countryLink)}"`));
      else assert.doesNotMatch(html, new RegExp(`href="${escapeRegex(countryLink)}"`));
    }
    for (const record of records) {
      const countryHtml = await readFile(new URL(`../site/indicators/internet-use/country/${record.code.toLowerCase()}/index.html`, import.meta.url), 'utf8');
      assert.match(countryHtml, new RegExp(`href="\\.\\./\\.\\./region/${slug}/"`));
      assert.match(countryHtml, new RegExp(`Compare ${escapeRegex(htmlRegionName)} →`));
    }
  }
});
