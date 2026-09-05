import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const CASES = [
  ['de', "ca.country+\" im Vergleich zu \"+cb.country"],
  ['es', "ca.country+\" frente a \"+cb.country"],
  ['fr', "ca.country+\" comparé à \"+cb.country"],
  ['zh-hans', "ca.country+\" 与 \"+cb.country"]
];

test('localized compare pages do not rebuild their dynamic title with English vs', async () => {
  execFileSync(process.execPath, ['scripts/build-localized-country-compare.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/finalize-localized-dynamic-copy.mjs'], { cwd: root, stdio: 'pipe' });

  for (const [locale, localizedExpression] of CASES) {
    const html = await readFile(new URL(`${locale}/compare/index.html`, site), 'utf8');
    assert.ok(!html.includes("ca.country+' vs '+cb.country"), `${locale} compare must not keep the English dynamic separator`);
    assert.ok(html.includes(localizedExpression), `${locale} compare should use its localized dynamic separator`);
  }
});
