import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = new URL('../site/', import.meta.url);

for (const relative of ['index.html', 'data/index.html', '404.html']) {
  test(`shared brand remains readable on ${relative}`, async () => {
    // Keep this regression independent of suite ordering: lower-level build tests
    // may regenerate HTML before the production shared-shell post-build pass.
    await import('../scripts/apply-shared-site-shell.mjs');

    const html = await readFile(new URL(relative, site), 'utf8');
    assert.match(html, /\.wd-global-header\{background:#111827;color:#fff\}/);
    assert.match(html, /\.wd-global-header \.brand a\{color:#fff;text-decoration:none\}/);
  });
}
