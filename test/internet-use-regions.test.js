import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const builder = new URL('../scripts/build-internet-use-regions.mjs', import.meta.url);
const sourceUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const root = new URL('../site/indicators/internet-use/region/', import.meta.url);

test('builds seven substantial regional discovery pages and matching JSON', async () => {
  await execFileAsync(process.execPath, [builder.pathname]);
  const source = JSON.parse(await readFile(sourceUrl, 'utf8'));
  const index = JSON.parse(await readFile(new URL('index.json', root), 'utf8'));
  assert.equal(index.regions.length, 7);
  assert.equal(index.regions.reduce((sum, region) => sum + region.countries, 0), source.records.length);

  for (const region of index.regions) {
    const slug = region.code.toLowerCase();
    const [html, rawJson] = await Promise.all([
      readFile(new URL(`${slug}/index.html`, root), 'utf8'),
      readFile(new URL(`${slug}/data.json`, root), 'utf8')
    ]);
    const payload = JSON.parse(rawJson);
    const expected = source.records.filter((record) => record.region.code === region.code);
    assert.equal(payload.region.name, region.name);
    assert.equal(payload.records.length, expected.length);
    assert.ok(payload.records.every((record) => expected.some((item) => item.code === record.code)));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://worlddiscoverydata\\.com/indicators/internet-use/region/${slug}/">`));
    assert.match(html, /<h2>Regional picture<\/h2>/);
    assert.match(html, /<h2>How to use this comparison<\/h2>/);
    assert.match(html, /Region membership comes from the official World Bank country metadata/);
    assert.match(html, /<script type="application\/ld\+json">/);
    const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const webPage = structured['@graph'].find((entry) => entry['@type'] === 'WebPage');
    const dataset = structured['@graph'].find((entry) => entry['@type'] === 'Dataset');
    const breadcrumbs = structured['@graph'].find((entry) => entry['@type'] === 'BreadcrumbList');
    assert.equal(webPage.mainEntity['@id'], dataset['@id']);
    assert.equal(webPage.breadcrumb['@id'], breadcrumbs['@id']);
    assert.equal(dataset.identifier, `IT.NET.USER.ZS-${region.code}-${source.observationYear}`);
    assert.equal(dataset.spatialCoverage.identifier, region.code);
    assert.equal(dataset.variableMeasured.propertyID, source.indicator.code);
    assert.equal(dataset.license, source.source.license);
    assert.deepEqual(breadcrumbs.itemListElement.map((item) => item.position), [1, 2, 3]);
    assert.equal(breadcrumbs.itemListElement[1].item, 'https://worlddiscoverydata.com/indicators/internet-use/');
    assert.equal(breadcrumbs.itemListElement[1].name, `Internet use by country — ${source.observationYear}`);
    assert.equal(breadcrumbs.itemListElement[1].position, 2);
    for (const record of expected) assert.match(html, new RegExp(`href="\\.\\.\/\\.\\.\/country\/${record.code.toLowerCase()}\/"`));
    assert.doesNotMatch(html, /complete global ranking|caused by|because of/i);
  }
});
