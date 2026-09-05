import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

test('English compare renders the current CO2 per-capita unit in standard and focused cards', async () => {
  execFileSync(process.execPath, ['scripts/build-wdi-country-compare.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/enrich-wdi-compare-indicator.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/enrich-wdi-compare-focus.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/finalize-compare-query-feedback.mjs'], { cwd: root, stdio: 'pipe' });

  const html = await readFile(new URL('compare/index.html', site), 'utf8');
  assert.ok(html.includes('\"slug\":\"co2-emissions-per-capita\"'), 'compare payload should include the CO2 metric');
  assert.ok(html.includes('\"unit\":\"t CO2e per capita\"'), 'compare payload should use the current CO2 unit key');
  assert.ok(html.includes("if(unit==='t CO2e per capita')return ' t CO₂e/person'"), 'standard/focus formatter should render the current CO2 unit');
  assert.ok(html.includes("unit==='t CO2e per capita'?' t CO₂e/person'"), 'selected-indicator formatter should render the current CO2 unit');
  assert.equal(html.split('data-compare-query-feedback').length - 1, 1, 'test setup must leave the production query-feedback finalizer intact');
});
