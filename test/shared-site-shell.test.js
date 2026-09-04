import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const count = (text, needle) => text.split(needle).length - 1;

test('every generated HTML page uses exactly one shared World Discovery shell', async () => {
  // Some earlier tests exercise the low-level buildSite() function directly, which
  // intentionally regenerates its page subset before the post-build shell pass.
  // Re-apply the production post-build transform here so this contract test is
  // independent of test-file ordering and validates the actual deployable state.
  await import('../scripts/apply-shared-site-shell.mjs');

  const files = await walk(siteRoot);
  assert.ok(files.length > 0, 'expected generated HTML pages');

  const failures = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const relative = path.relative(siteRoot, file).replaceAll(path.sep, '/');
    if (count(html, 'class="topbar wd-global-header"') !== 1) failures.push(`${relative}: shared header count`);
    if (count(html, 'class="footer wd-global-footer"') !== 1) failures.push(`${relative}: shared footer count`);
    if (count(html, 'id="wd-shared-shell-style"') !== 1) failures.push(`${relative}: shared shell style count`);
    if (count(html, 'class="wd-skip-link"') !== 1) failures.push(`${relative}: skip link count`);
    if (!html.includes('class="wd-skip-link" href="#wd-main-content">Skip to main content</a>')) failures.push(`${relative}: skip link target`);
    if (count(html, 'id="wd-main-content"') !== 1) failures.push(`${relative}: content-start target count`);
    if (!html.includes('id="wd-main-content" class="wd-skip-target" tabindex="-1"')) failures.push(`${relative}: focusable content-start target`);
    const headerEnd = html.indexOf('</header>');
    const targetStart = html.indexOf('id="wd-main-content"');
    const firstMain = html.search(/<main\b/i);
    if (headerEnd === -1 || targetStart <= headerEnd) failures.push(`${relative}: content-start target must follow shared header`);
    if (firstMain !== -1 && targetStart >= firstMain) failures.push(`${relative}: content-start target must precede main content/hero layouts`);
    for (const label of ['Explore', 'Data', 'Countries', 'Compare', 'About']) {
      if (!html.includes(`>${label}</a>`)) failures.push(`${relative}: missing ${label} navigation`);
    }
    if (!html.includes('>Impressum</a>') || !html.includes('>Datenschutz</a>')) failures.push(`${relative}: missing legal links`);
  }

  assert.deepEqual(failures, []);
});
