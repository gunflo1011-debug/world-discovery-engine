import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

test('country compare honors indicator context from ranking actions', async () => {
  await exec(process.execPath, ['scripts/build-wdi-country-compare.mjs']);
  await exec(process.execPath, ['scripts/enrich-wdi-compare-indicator.mjs']);
  const html = await readFile(new URL('../site/compare/index.html', import.meta.url), 'utf8');
  assert.match(html, /URLSearchParams\(location\.search\)\.get\('indicator'\)/);
  assert.match(html, /metric-card-focused/);
  assert.match(html, /data\/wdi\/.*data\.json/);
  assert.match(html, /Showing your selected indicator first/);
  assert.match(html, /params\.set\('indicator',indicator\);history\.replaceState/);
});

test('indicator ranking actions preserve their indicator slug for compare', async () => {
  const source = await readFile(new URL('../scripts/enrich-wdi-country-actions.mjs', import.meta.url), 'utf8');
  assert.match(source, /params\.set\('indicator',indicator\)/);
});
