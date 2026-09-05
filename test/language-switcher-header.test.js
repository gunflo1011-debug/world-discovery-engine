import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

const run = (script) => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

test('released pages use one compact top-right same-route language menu', async () => {
  run('scripts/apply-shared-site-shell.mjs');
  run('scripts/polish-language-switcher.mjs');

  const cases = [
    ['de/index.html', 'DE', '/', '/es/', '/fr/', '/zh-hans/'],
    ['countries/deu/index.html', 'EN', '/de/countries/deu/', '/es/countries/deu/', '/fr/countries/deu/', '/zh-hans/countries/deu/'],
    ['de/countries/deu/index.html', 'DE', '/countries/deu/', '/es/countries/deu/', '/fr/countries/deu/', '/zh-hans/countries/deu/']
  ];

  for (const [page, current, ...targets] of cases) {
    const html = await readFile(new URL(page, site), 'utf8');
    const header = html.match(/<header\b[^>]*class="[^"]*wd-global-header[^"]*"[^>]*>[\s\S]*?<\/header>/i)?.[0] || '';
    assert.ok(header.includes('class="wd-language-menu"'), `${page} should keep language switching in the shared header`);
    assert.ok(header.includes(`<span>${current}</span>`), `${page} should show the compact current-language code`);
    assert.ok(header.includes('🌐'), `${page} should expose the globe affordance`);
    assert.ok(!html.includes('class="wrap language-switcher"'), `${page} should remove the old full-width language bar`);
    assert.equal((html.match(/class="wd-language-menu"/g) || []).length, 1, `${page} should have one language menu`);
    for (const target of targets) assert.ok(header.includes(`href="${target}"`), `${page} should preserve the same logical route for ${target}`);
  }
});
