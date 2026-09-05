import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const CASES = [
  ['de', '"separator":" im Vergleich zu "', 't CO₂e je Einwohner'],
  ['es', '"separator":" frente a "', 't CO₂e per cápita'],
  ['fr', '"separator":" comparé à "', 't CO₂e par habitant'],
  ['zh-hans', '"separator":" 与 "', '吨CO₂e/人']
];

test('localized compare generator emits dynamic copy and current CO2 units directly', async () => {
  execFileSync(process.execPath, ['scripts/build-localized-country-compare.mjs'], { cwd: root, stdio: 'pipe' });

  for (const [locale, localizedSeparator, localizedUnit] of CASES) {
    const html = await readFile(new URL(`${locale}/compare/index.html`, site), 'utf8');
    assert.ok(!html.includes("ca.country+' vs '+cb.country"), `${locale} compare generator must not emit the English dynamic separator`);
    assert.ok(html.includes(localizedSeparator), `${locale} compare should carry its localized dynamic separator in TXT`);
    assert.ok(html.includes('ca.country+TXT.separator+cb.country'), `${locale} compare should render the localized separator directly`);
    assert.ok(html.includes("unit==='metric tons per person'||unit==='t CO2e per capita'"), `${locale} compare generator must recognize the current CO2 unit key`);
    assert.ok(html.includes(`\"localizedUnit\":\"${localizedUnit}\"`), `${locale} compare must carry the localized CO2 unit label`);
  }
});
