import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function parseJsonLd(html) {
  return [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
}

function datasetNodes(value) {
  if (!value || typeof value !== 'object') return [];
  const nodes = Array.isArray(value) ? value : value['@graph'] ?? [value];
  return nodes.filter((node) => {
    const type = node?.['@type'];
    return type === 'Dataset' || (Array.isArray(type) && type.includes('Dataset'));
  });
}

function assertEligibleDataset(dataset, label) {
  assert.equal(typeof dataset.description, 'string', `${label}: Dataset description must be a string`);
  assert.ok(dataset.description.trim().length >= 40, `${label}: Dataset description must be substantive`);
  assert.ok(dataset.creator && typeof dataset.creator === 'object', `${label}: Dataset creator must be an object`);
  assert.ok(['Organization', 'Person'].includes(dataset.creator['@type']), `${label}: Dataset creator must be Organization or Person`);
  assert.equal(typeof dataset.creator.name, 'string', `${label}: Dataset creator needs a name`);
  assert.ok(dataset.creator.name.trim(), `${label}: Dataset creator name must not be empty`);
  assert.equal(typeof dataset.license, 'string', `${label}: Dataset license must be a URL string`);
  assert.match(dataset.license, /^https:\/\//, `${label}: Dataset license must use an absolute HTTPS URL`);
}

test('internet-use parent Dataset has Google-eligible core metadata', async () => {
  const html = await readFile(new URL('../site/indicators/internet-use/index.html', import.meta.url), 'utf8');
  const datasets = parseJsonLd(html).flatMap(datasetNodes);
  assert.ok(datasets.length >= 1);
  datasets.forEach((dataset, index) => assertEligibleDataset(dataset, `internet-use parent Dataset ${index + 1}`));
});

test('internet-use generated country Dataset contract includes description, creator and URL license', async () => {
  const source = await readFile(new URL('../scripts/build-internet-use-countries.mjs', import.meta.url), 'utf8');
  assert.match(source, /description,/);
  assert.match(source, /creator:\s*\{\s*'@type':\s*'Organization',\s*name:\s*data\.source\.publisher\s*\}/);
  assert.match(source, /license:\s*data\.source\.license/);
});

test('real WDI population Dataset generator emits source-backed CC BY 4.0 URL license', async () => {
  const source = await readFile(new URL('../scripts/build-real-wdi-evidence.py', import.meta.url), 'utf8');
  assert.match(source, /LICENSE_URL="https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/"/);
  assert.match(source, /"license":LICENSE_URL/);
  assert.match(source, /"creator":\{"@type":"Organization","name":"World Discovery Engine"\}/);
});

test('Dataset normalizer never fabricates creator attribution', async () => {
  const source = await readFile(new URL('../scripts/normalize-dataset-structured-data.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /if\s*\(!dataset\.creator\)\s*dataset\.creator\s*=/);
  assert.match(source, /Creator attribution is provenance/);
  assert.match(source, /if\s*\(!eligible\)\s*\{/);
  assert.match(source, /dataset\['@type'\]\s*=\s*'CreativeWork'/);
});

test('generic revision evidence does not claim Dataset eligibility without license provenance', async () => {
  const source = await readFile(new URL('../src/evidence-page.js', import.meta.url), 'utf8');
  assert.match(source, /'@type': 'WebPage'/);
  assert.doesNotMatch(source, /'@type': 'Dataset'/);
});
