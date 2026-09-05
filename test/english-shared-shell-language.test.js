import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

test('English shared shell keeps legal navigation in English', async () => {
  execFileSync(process.execPath, ['scripts/apply-shared-site-shell.mjs'], { cwd: root, stdio: 'pipe' });

  for (const page of ['index.html', 'data/index.html', 'countries/index.html', 'compare/index.html', 'methodology/index.html']) {
    const html = await readFile(new URL(page, site), 'utf8');
    const footer = html.match(/<footer\b[^>]*class="[^"]*wd-global-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i)?.[0] || '';
    assert.ok(footer.includes('>Legal notice</a>'), `${page} should label the legal notice in English`);
    assert.ok(footer.includes('>Privacy</a>'), `${page} should label privacy in English`);
    assert.ok(!footer.includes('>Impressum</a>'), `${page} must not leave a German legal label in English UI`);
    assert.ok(!footer.includes('>Datenschutz</a>'), `${page} must not leave a German privacy label in English UI`);
  }
});
