import { readFile, writeFile } from 'node:fs/promises';
import { compareEntities } from '../src/cross-entity-comparison.js';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));

const TARGET = 'DEU';
const PEER = 'FRA';
const target = data.records.find((record) => record.code === TARGET);
const peer = data.records.find((record) => record.code === PEER);

function observation(record) {
  if (!record) return null;
  return {
    indicator: data.indicator.code,
    entity: record.code,
    period: record.year,
    unit: data.indicator.unit,
    methodologyVersion: data.source.metadataUrl,
    source: `${data.source.publisher} — ${data.source.dataset} via ${data.source.surface}`,
    value: record.value
  };
}

let comparison;
try {
  comparison = compareEntities(observation(target), observation(peer));
} catch (error) {
  console.log(`Cross-country comparison not rendered: ${error.message}`);
  process.exit(0);
}

if (target.year !== data.observationYear || peer.year !== data.observationYear) {
  console.log('Cross-country comparison not rendered: snapshot-year-mismatch');
  process.exit(0);
}

const pageUrl = new URL(`country/${TARGET.toLowerCase()}/index.html`, root);
let html = await readFile(pageUrl, 'utf8');
const marker = '<section class="section"><div class="wrap"><h2>Definition and provenance</h2>';
if (!html.includes(marker)) throw new Error('comparison insertion marker not found');

const delta = Math.abs(comparison.delta);
const direction = comparison.delta > 0 ? 'higher' : comparison.delta < 0 ? 'lower' : 'the same';
const block = `<section class="section"><div class="wrap"><h2>Verified 2024 comparison: ${target.country} vs ${peer.country}</h2><div class="grid"><article class="card"><span class="pill">${target.code}</span><h3>${target.value}%</h3><p>${target.country} · ${target.year} · ${data.indicator.unit}</p></article><article class="card"><span class="pill">${peer.code}</span><h3>${peer.value}%</h3><p>${peer.country} · ${peer.year} · ${data.indicator.unit}</p></article><article class="card"><span class="pill">DELTA</span><h3>${delta} percentage points</h3><p>${peer.country} is ${delta} percentage points ${direction} than ${target.country} in the same verified ${data.observationYear} snapshot.</p></article></div><p><strong>Trust check:</strong> same indicator (${data.indicator.code}), year (${data.observationYear}), unit (${data.indicator.unit}) and WDI methodology metadata. Source: ${data.source.publisher}, ${data.source.dataset}, surfaced via ${data.source.surface}. <a href="${data.source.metadataUrl}">Methodology/provenance →</a></p></div></section>`;

if (!html.includes('Verified 2024 comparison: Germany vs France')) {
  html = html.replace(marker, `${block}${marker}`);
  await writeFile(pageUrl, html, 'utf8');
}

console.log(`Rendered trusted ${data.observationYear} comparison: ${target.country} vs ${peer.country}.`);
