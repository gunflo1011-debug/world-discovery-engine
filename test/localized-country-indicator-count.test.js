import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, 'site');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

test('localized country CTAs derive the verified indicator count from the catalog', async () => {
  execFileSync(process.execPath, ['scripts/sync-localized-country-indicator-count.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/sync-localized-country-indicator-count.mjs'], { cwd: root, stdio: 'pipe' });

  const catalog = JSON.parse(await readFile(path.join(site, 'data/wdi/index.json'), 'utf8'));
  const count = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED').length;
  assert.ok(count > 0, 'expected at least one verified indicator');

  const cases = {
    de: `Alle ${count} Indikatoren erkunden`,
    es: `Explorar los ${count} indicadores`,
    fr: `Explorer les ${count} indicateurs`,
    'zh-hans': `探索全部 ${count} 个指标`
  };

  for (const [locale, expected] of Object.entries(cases)) {
    const files = await walk(path.join(site, locale, 'countries'));
    assert.ok(files.length > 1, `${locale} should have generated country pages`);
    const pages = await Promise.all(files.map((file) => readFile(file, 'utf8')));
    const withCta = pages.filter((html) => /(?:Alle \d+ Indikatoren erkunden|Explorar los \d+ indicadores|Explorer les \d+ indicateurs|探索全部 \d+ 个指标)/.test(html));
    assert.ok(withCta.length > 0, `${locale} should contain localized indicator-count CTAs`);
    assert.ok(withCta.every((html) => html.includes(expected)), `${locale} CTA count must match CURRENT_VERIFIED catalog count`);
  }
});
