import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const directoryPage = new URL('../site/countries/index.html', import.meta.url);

test('country directory labels countries and territories precisely', async () => {
  await execFileAsync(process.execPath, ['scripts/build-wdi-country-hubs.mjs']);
  await execFileAsync(process.execPath, ['scripts/clarify-country-territory-directory.mjs']);

  const html = await readFile(directoryPage, 'utf8');

  assert.match(html, /COUNTRY & TERRITORY PROFILES · OFFICIAL WORLD BANK DATA/);
  assert.match(html, /Showing all ['+].*country and territory profiles\./);
  assert.match(html, /No country or territory profiles match this search\./);
  assert.match(html, /Browse country and territory profiles built from 30 official World Bank WDI indicators/);
  assert.doesNotMatch(html, /COUNTRY PROFILES · OFFICIAL WORLD BANK DATA/);
  assert.doesNotMatch(html, /Showing all ['+].*country profiles\./);
});
