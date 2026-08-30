import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function ordinal(value) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

test('country pages expose source-backed regional rank, median context and peer discovery', async () => {
  const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));
  const record = data.records.find((item) => item.code === 'DEU') ?? data.records[0];
  const regional = data.records.filter((item) => item.region.code === record.region.code);
  const rank = 1 + regional.filter((item) => item.value > record.value).length;
  const regionMedian = median(regional.map((item) => item.value));
  const closestPeer = regional
    .filter((item) => item.code !== record.code)
    .sort((a, b) => Math.abs(a.value - record.value) - Math.abs(b.value - record.value) || a.country.localeCompare(b.country))[0];

  const page = await readFile(new URL(`country/${record.code.toLowerCase()}/index.html`, root), 'utf8');

  assert.match(page, new RegExp(`data-regional-context="${record.region.code}"`));
  assert.match(page, new RegExp(`Among the ${regional.length} countries from`));
  assert.match(page, new RegExp(`ranks ${ordinal(rank)}\\.`));
  assert.match(page, /regional median of/);
  assert.match(page, /This comparison only describes countries present in this same-year dataset\./);
  if (closestPeer) {
    assert.ok(page.includes(`href="../${closestPeer.code.toLowerCase()}/"`));
    assert.ok(page.includes(closestPeer.country));
  }
});

test('regional context enrichment remains idempotent after the double-build check', async () => {
  const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));
  const record = data.records[0];
  const page = await readFile(new URL(`country/${record.code.toLowerCase()}/index.html`, root), 'utf8');
  const occurrences = page.match(/data-regional-context=/g) ?? [];
  assert.equal(occurrences.length, 1);
});
