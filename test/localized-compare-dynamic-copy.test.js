import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const CASES = [
  ['de', "ca.country+\" im Vergleich zu \"+cb.country", 't CO₂e je Einwohner'],
  ['es', "ca.country+\" frente a \"+cb.country", 't CO₂e per cápita'],
  ['fr', "ca.country+\" comparé à \"+cb.country", 't CO₂e par habitant'],
  ['zh-hans', "ca.country+\" 与 \"+cb.country", '吨CO₂e/人']
];

test('localized compare pages keep dynamic copy and current CO2 units localized', async () => {
  execFileSync(process.execPath, ['scripts/build-localized-country-compare.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/finalize-localized-dynamic-copy.mjs'], { cwd: root, stdio: 'pipe' });

  for (const [locale, localizedExpression, localizedUnit] of CASES) {
    const html = await readFile(new URL(`${locale}/compare/index.html`, site), 'utf8');
    assert.ok(!html.includes("ca.country+' vs '+cb.country"), `${locale} compare must not keep the English dynamic separator`);
    assert.ok(html.includes(localizedExpression), `${locale} compare should use its localized dynamic separator`);
    assert.ok(html.includes("unit==='metric tons per person'||unit==='t CO2e per capita'"), `${locale} compare must recognize the current CO2 unit key`);
    assert.ok(html.includes(`\"localizedUnit\":\"${localizedUnit}\"`), `${locale} compare must carry the localized CO2 unit label`);
  }
});
