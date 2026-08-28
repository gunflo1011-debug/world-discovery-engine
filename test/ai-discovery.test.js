import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const siteRoot = new URL('../site/', import.meta.url);

function runBuilder() {
  const result = spawnSync(process.execPath, ['scripts/build-ai-discovery.mjs'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test('AI discovery manifest exposes verified source-faithful products including GDP per capita', async () => {
  runBuilder();

  const [manifest, llms, evidenceIndex, internet, gdp] = await Promise.all([
    readFile(new URL('ai-index.json', siteRoot), 'utf8').then(JSON.parse),
    readFile(new URL('llms.txt', siteRoot), 'utf8'),
    readFile(new URL('evidence/index.json', siteRoot), 'utf8').then(JSON.parse),
    readFile(new URL('indicators/internet-use/data.json', siteRoot), 'utf8').then(JSON.parse),
    readFile(new URL('indicators/gdp-per-capita/data.json', siteRoot), 'utf8').then(JSON.parse)
  ]);

  assert.equal(manifest.schemaVersion, '1.2');
  assert.deepEqual(manifest.trustPolicy.preferStatuses, ['REAL', 'CURRENT_VERIFIED']);
  assert.equal(manifest.trustPolicy.excludeDemoFromPreferredDiscovery, true);
  assert.match(manifest.trustPolicy.realGdpRevisionStatus, /^blocked /);
  assert.match(manifest.generatedFrom.sourcesPage, /\/sources\/$/);
  assert.match(manifest.generatedFrom.gdpPerCapitaDataset, /\/indicators\/gdp-per-capita\/data\.json$/);

  assert.equal(manifest.collections.evidence.length, evidenceIndex.evidence.length);
  for (const record of manifest.collections.evidence) {
    assert.equal(record.status, 'REAL');
    assert.match(record.humanUrl, /^https:\/\//);
    assert.match(record.jsonUrl, /\/evidence\/[^/]+\/evidence\.json$/);
    assert.match(record.csvUrl, /\/evidence\/[^/]+\/evidence\.csv$/);
    assert.ok(record.indicator.code);
    assert.ok(record.entity.code);
    assert.ok(Number.isInteger(record.referenceYear));
    assert.ok(record.license);
    assert.equal(record.citation.recommendedHumanUrl, record.humanUrl);
    assert.equal(record.citation.recommendedMachineUrl, record.jsonUrl);
  }

  const internetManifest = manifest.collections.internetUse;
  assert.equal(internetManifest.indicator.code, 'IT.NET.USER.ZS');
  assert.equal(internetManifest.observationYear, internet.observationYear);
  assert.equal(internetManifest.countries.length, internet.records.length);
  assert.equal(internetManifest.source.publisher, internet.source.publisher);
  assert.equal(internetManifest.source.license, internet.source.license);
  assert.match(internetManifest.countryIndexUrl, /\/indicators\/internet-use\/country\/index\.json$/);

  for (const source of internet.records) {
    const record = internetManifest.countries.find((item) => item.entity.code === source.code);
    assert.ok(record, `missing AI discovery country ${source.code}`);
    assert.equal(record.status, 'CURRENT_VERIFIED');
    assert.equal(record.value, source.value);
    assert.equal(record.observationYear, source.year);
    assert.match(record.humanUrl, new RegExp(`/country/${source.code.toLowerCase()}/$`));
    assert.match(record.jsonUrl, /\/data\.json$/);
    assert.match(record.csvUrl, /\/data\.csv$/);
  }

  const gdpManifest = manifest.collections.gdpPerCapita;
  assert.equal(gdpManifest.indicator.code, 'NY.GDP.PCAP.CD');
  assert.equal(gdpManifest.observationYear, gdp.observationYear);
  assert.equal(gdpManifest.countries.length, gdp.records.length);
  assert.equal(gdpManifest.coverage.countries, 200);
  assert.equal(gdpManifest.source.publisher, gdp.source.publisher);
  assert.equal(gdpManifest.source.license, gdp.source.license);
  assert.match(gdpManifest.humanUrl, /\/indicators\/gdp-per-capita\/$/);
  assert.match(gdpManifest.jsonUrl, /\/indicators\/gdp-per-capita\/data\.json$/);

  for (const source of gdp.records) {
    const record = gdpManifest.countries.find((item) => item.entity.code === source.code);
    assert.ok(record, `missing GDP AI discovery country ${source.code}`);
    assert.equal(record.status, 'CURRENT_VERIFIED');
    assert.equal(record.value, source.value);
    assert.equal(record.observationYear, source.year);
    assert.equal(record.jsonUrl, gdpManifest.jsonUrl);
    assert.equal(record.humanUrl, gdpManifest.humanUrl);
    assert.equal(record.citation.publisher, gdp.source.publisher);
  }

  assert.match(llms, /^# World Discovery Data/m);
  assert.match(llms, /Prefer records explicitly marked REAL or CURRENT_VERIFIED/);
  assert.match(llms, /GDP per capita reports nominal current-U\.S\.-dollar values/);
  assert.match(llms, /Real-GDP revision publishing is blocked/);
  assert.match(llms, /\/sources\//);
  assert.match(llms, /\/evidence\/index\.json/);
  assert.match(llms, /\/indicators\/internet-use\/data\.json/);
  assert.match(llms, /\/indicators\/internet-use\/country\/index\.json/);
  assert.match(llms, /\/indicators\/gdp-per-capita\/data\.json/);
  assert.match(llms, /\/ai-index\.json/);

  for (const source of internet.records) {
    assert.match(llms, new RegExp(`\\[${source.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(https://[^)]+/country/${source.code.toLowerCase()}/\\)`));
  }
});
