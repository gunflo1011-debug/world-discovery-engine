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

test('AI discovery manifest exposes only verified source-faithful resources', async () => {
  runBuilder();

  const [manifest, llms, evidenceIndex, internet] = await Promise.all([
    readFile(new URL('ai-index.json', siteRoot), 'utf8').then(JSON.parse),
    readFile(new URL('llms.txt', siteRoot), 'utf8'),
    readFile(new URL('evidence/index.json', siteRoot), 'utf8').then(JSON.parse),
    readFile(new URL('indicators/internet-use/data.json', siteRoot), 'utf8').then(JSON.parse)
  ]);

  assert.equal(manifest.schemaVersion, '1.1');
  assert.deepEqual(manifest.trustPolicy.preferStatuses, ['REAL', 'CURRENT_VERIFIED']);
  assert.equal(manifest.trustPolicy.excludeDemoFromPreferredDiscovery, true);
  assert.match(manifest.trustPolicy.realGdpRevisionStatus, /^blocked /);
  assert.match(manifest.generatedFrom.sourcesPage, /\/sources\/$/);

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
    assert.equal(record.citation.indicatorCode, record.indicator.code);
    assert.equal(record.citation.entityCode, record.entity.code);
    assert.equal(record.citation.referenceYear, record.referenceYear);
  }

  const internetManifest = manifest.collections.internetUse;
  assert.equal(internetManifest.indicator.code, 'IT.NET.USER.ZS');
  assert.equal(internetManifest.observationYear, internet.observationYear);
  assert.equal(internetManifest.countries.length, internet.records.length);
  assert.equal(internetManifest.source.publisher, internet.source.publisher);
  assert.equal(internetManifest.source.license, internet.source.license);
  assert.equal(internetManifest.source.surface, internet.source.surface);
  assert.match(internetManifest.countryIndexUrl, /\/indicators\/internet-use\/country\/index\.json$/);

  for (const source of internet.records) {
    const record = internetManifest.countries.find((item) => item.entity.code === source.code);
    assert.ok(record, `missing AI discovery country ${source.code}`);
    assert.equal(record.status, 'CURRENT_VERIFIED');
    assert.equal(record.value, source.value);
    assert.equal(record.observationYear, source.year);
    assert.equal(record.indicatorName, internet.indicator.name);
    assert.match(record.humanUrl, new RegExp(`/country/${source.code.toLowerCase()}/$`));
    assert.match(record.jsonUrl, /\/data\.json$/);
    assert.match(record.csvUrl, /\/data\.csv$/);
    assert.equal(record.citation.recommendedHumanUrl, record.humanUrl);
    assert.equal(record.citation.recommendedMachineUrl, record.jsonUrl);
    assert.equal(record.citation.publisher, internet.source.publisher);
    assert.equal(record.citation.dataset, internet.source.dataset);
    assert.equal(record.citation.surfacedVia, internet.source.surface);
    assert.equal(record.citation.metadataUrl, internet.source.metadataUrl);
    assert.equal(record.citation.retrievalUrl, internet.retrievalUrl);
    assert.equal(record.citation.retrievedAt, internet.retrievedAt);
    assert.equal(record.citation.license, internet.source.license);
    assert.equal(record.citation.attribution, internet.source.attribution);
  }

  assert.match(llms, /^# World Discovery Engine/m);
  assert.match(llms, /Prefer records explicitly marked REAL or CURRENT_VERIFIED/);
  assert.match(llms, /does not claim a complete global ranking or a historical revision/);
  assert.match(llms, /Real-GDP revision publishing is blocked/);
  assert.match(llms, /\/sources\//);
  assert.match(llms, /\/evidence\/index\.json/);
  assert.match(llms, /\/indicators\/internet-use\/data\.json/);
  assert.match(llms, /\/indicators\/internet-use\/country\/index\.json/);
  assert.match(llms, /\/ai-index\.json/);
  assert.match(llms, new RegExp(internet.source.publisher.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(llms, new RegExp(internet.source.metadataUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  for (const source of internet.records) {
    assert.match(llms, new RegExp(`\\[${source.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(https://[^)]+/country/${source.code.toLowerCase()}/\\)`));
  }
});
