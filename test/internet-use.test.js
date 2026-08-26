import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = new URL('../', import.meta.url);
const dataUrl = new URL('site/indicators/internet-use/data.json', root);
const csvUrl = new URL('site/indicators/internet-use/data.csv', root);
const htmlUrl = new URL('site/indicators/internet-use/index.html', root);

function parseCsv(text) {
  const [header, ...lines] = text.trim().split('\n');
  const columns = header.split(',');
  return lines.map((line) => {
    const values = [];
    let current = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) { values.push(current); current = ''; }
      else current += ch;
    }
    values.push(current);
    return Object.fromEntries(columns.map((column, index) => [column, values[index]]));
  });
}

function ordinal(rank) {
  if (rank % 100 >= 11 && rank % 100 <= 13) return `${rank}th`;
  if (rank % 10 === 1) return `${rank}st`;
  if (rank % 10 === 2) return `${rank}nd`;
  if (rank % 10 === 3) return `${rank}rd`;
  return `${rank}th`;
}

test('internet-use generator keeps human, JSON and CSV outputs on one verified source', async () => {
  await execFileAsync(process.execPath, ['scripts/build-internet-use.mjs'], { cwd: new URL('.', root) });
  const [jsonText, csvText, html] = await Promise.all([
    readFile(dataUrl, 'utf8'),
    readFile(csvUrl, 'utf8'),
    readFile(htmlUrl, 'utf8'),
  ]);
  const data = JSON.parse(jsonText);
  const csv = parseCsv(csvText);
  assert.equal(data.status, 'CURRENT_VERIFIED');
  assert.equal(data.indicator.code, 'IT.NET.USER.ZS');
  assert.equal(csv.length, data.records.length);
  assert.ok(data.records.length >= 2);
  assert.ok(data.records.every((record) => record.year === data.observationYear));
  assert.ok(data.records.every((record) => /^[A-Z]{3}$/.test(record.region.code) && record.region.name));

  const sorted = [...data.records].sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  let previous = null;
  let rank = 0;
  const ranked = sorted.map((record, index) => {
    if (record.value !== previous) rank = index + 1;
    previous = record.value;
    return { ...record, rank };
  });
  const max = Math.max(...data.records.map((record) => record.value));
  const min = Math.min(...data.records.map((record) => record.value));
  const germany = ranked.find((record) => record.code === 'DEU');

  for (const record of ranked) {
    const row = csv.find((candidate) => candidate.country_code === record.code);
    assert.ok(row, `missing CSV row for ${record.code}`);
    assert.equal(Number(row.value), record.value);
    assert.equal(Number(row.observation_year), record.year);
    assert.match(html, new RegExp(`>${record.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`));
    assert.match(html, new RegExp(`>${record.value}%<`));
    assert.match(html, new RegExp(`data-code="${record.code.toLowerCase()}"`));
    assert.match(html, new RegExp(`data-region="${record.region.code.toLowerCase()}"`));
    assert.match(html, new RegExp(`href="\\.\\/country\\/${record.code.toLowerCase()}\\/"`));
  }

  assert.match(html, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/indicators\/internet-use\/"/);
  assert.match(html, /href="\.\/data\.json"/);
  assert.match(html, /href="\.\/data\.csv"/);
  assert.match(html, /International Telecommunication Union \(ITU\)/);
  assert.match(html, /verified same-year snapshot/i);
  assert.match(html, /Quick answers from this verified snapshot/);
  assert.match(html, /Which included countries are highest\?/);
  assert.match(html, /How wide is the observed range\?/);
  assert.match(html, new RegExp(`Among the ${data.records.length} included countries, the gap between the highest and lowest values is ${max - min} percentage points \\(${max}% versus ${min}%\\)`));
  assert.match(html, /Rank in snapshot/);
  if (germany) {
    assert.match(html, new RegExp(`Within this verified ${data.records.length}-country snapshot, Germany ranks ${ordinal(germany.rank)} at ${germany.value}%`));
  } else {
    assert.match(html, /Germany is not included in this verified snapshot\./);
  }
});
