import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseCsv } from '../src/csv.js';

const execFileAsync = promisify(execFile);
const htmlPath = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const jsonPath = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const csvPath = new URL('../site/indicators/internet-use/data.csv', import.meta.url);
const generatorPath = new URL('../scripts/build-internet-use.mjs', import.meta.url);

function ranked(records) {
  const sorted = [...records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  let previous = null;
  let rank = 0;
  return sorted.map((record, index) => {
    if (record.value !== previous) rank = index + 1;
    previous = record.value;
    return { ...record, rank };
  });
}

function ordinal(rank) {
  const mod100 = rank % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${rank}th`;
  if (rank % 10 === 1) return `${rank}st`;
  if (rank % 10 === 2) return `${rank}nd`;
  if (rank % 10 === 3) return `${rank}rd`;
  return `${rank}th`;
}

test('internet-use generator keeps human, JSON and CSV outputs on one verified source', async () => {
  await execFileAsync(process.execPath, [generatorPath.pathname]);

  const [html, rawJson, rawCsv] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(jsonPath, 'utf8'),
    readFile(csvPath, 'utf8')
  ]);
  const data = JSON.parse(rawJson);
  const csv = parseCsv(rawCsv);
  const rows = ranked(data.records);
  const max = Math.max(...rows.map((record) => record.value));
  const min = Math.min(...rows.map((record) => record.value));
  const germany = rows.find((record) => record.code === 'DEU');
  const regions = new Map();
  for (const record of data.records) {
    assert.match(record.region.code, /^[A-Z]{3}$/);
    assert.ok(record.region.name.trim());
    if (!regions.has(record.region.code)) regions.set(record.region.code, { name: record.region.name.trim(), count: 0 });
    assert.equal(regions.get(record.region.code).name, record.region.name.trim());
    regions.get(record.region.code).count += 1;
  }

  assert.equal(data.status, 'CURRENT_VERIFIED');
  assert.equal(data.indicator.code, 'IT.NET.USER.ZS');
  assert.equal(data.indicator.unit, '% of population');
  assert.equal(data.observationYear, 2024);
  assert.ok(data.records.length >= 2, 'verified source must contain at least two countries');
  assert.ok(data.records.every((record) => record.year === data.observationYear));
  assert.equal(csv.length, data.records.length);

  for (const record of data.records) {
    const row = csv.find((item) => item.country_code === record.code);
    assert.ok(row, `missing CSV row for ${record.code}`);
    assert.equal(row.indicator_code, data.indicator.code);
    assert.equal(Number(row.value), record.value);
    assert.equal(Number(row.observation_year), record.year);
    assert.match(html, new RegExp(`>${record.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`));
    assert.match(html, new RegExp(`>${record.value}%<`));
    assert.match(html, new RegExp(`data-code="${record.code.toLowerCase()}"`));
    assert.match(html, new RegExp(`data-region="${record.region.code.toLowerCase()}"`));
    assert.match(html, new RegExp(`href="\\.\\/country\\/${record.code.toLowerCase()}\\/"`));
  }

  assert.match(html, /rel="canonical" href="https:\/\/gunflo1011-debug\.github\.io\/world-discovery-engine\/indicators\/internet-use\/"/);
  assert.match(html, /href="\.\/data\.json"/);
  assert.match(html, /href="\.\/data\.csv"/);
  assert.match(html, /International Telecommunication Union \(ITU\)/);
  assert.match(html, /verified same-year subset/i);
  assert.match(html, /Quick answers from this verified subset/);
  assert.match(html, /Which included countries are highest\?/);
  assert.match(html, /How wide is the observed range\?/);
  assert.match(html, new RegExp(`Among the ${data.records.length} included countries, the gap between the highest and lowest values is ${max - min} percentage points \\(${max}% versus ${min}%\\)`));
  assert.match(html, /Rank in subset/);
  if (germany) {
    assert.match(html, new RegExp(`Within this verified ${data.records.length}-country subset, Germany ranks ${ordinal(germany.rank)} at ${germany.value}%`));
  } else {
    assert.match(html, /Germany is not included in this verified subset\./);
  }
  assert.match(html, /"spatialCoverage":\[/);
  assert.match(html, /not a complete global ranking/i);
  assert.match(html, /id="country-search"[^>]+placeholder="Type Germany, DEU…"/);
  assert.match(html, /id="country-status" class="internet-tool-status" aria-live="polite"/);
  assert.match(html, /id="region-filter"/);
  assert.match(html, /aria-labelledby="region-directory-heading"/);
  assert.match(html, /This directory works without JavaScript\./);
  for (const [code, region] of regions) {
    assert.match(html, new RegExp(`<option value="${code.toLowerCase()}">[^<]+ \\(${region.count}\\)<\\/option>`));
    assert.match(html, new RegExp(`<details class="region-directory-item" id="region-${code.toLowerCase()}">`));
    assert.match(html, new RegExp(`href="\\.\/region\/${code.toLowerCase()}\/"`));
    assert.match(html, new RegExp(`<span>${region.count} countries<\\/span>`));
  }
  assert.match(html, /id="compare-a"/);
  assert.match(html, /id="compare-b"/);
  assert.match(html, /id="compare-result" class="internet-compare-result" aria-live="polite" hidden/);
  assert.match(html, /tools\.hidden=false/);
  assert.match(html, /row\.hidden=!match/);
  assert.match(html, /region\.addEventListener\('change',applyFilter\)/);
  assert.match(html, /const matchesRegion=!regionCode\|\|row\.dataset\.region===regionCode/);
  assert.match(html, /region\.value=''/);
  assert.match(html, new RegExp(`Within this verified ${data.observationYear} subset`));
  assert.match(html, /percentage points/);
  assert.doesNotMatch(html, /current\/latest vertical/i);
  assert.doesNotMatch(html, /complete worldwide ranking/i);
  assert.doesNotMatch(html, /revision-ready|archive-to-archive delta/i);
});
