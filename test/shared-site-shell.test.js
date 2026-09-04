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
const countAnchors = (fragment) => (fragment.match(/<a\b/gi) || []).length;

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
    if (!/class="wd-skip-link" href="#wd-main-content">[^<]+<\/a>/.test(html)) failures.push(`${relative}: skip link target`);
    if (count(html, 'id="wd-main-content"') !== 1) failures.push(`${relative}: content-start target count`);
    if (!html.includes('id="wd-main-content" class="wd-skip-target" tabindex="-1"')) failures.push(`${relative}: focusable content-start target`);
    const headerEnd = html.indexOf('</header>');
    const targetStart = html.indexOf('id="wd-main-content"');
    const firstMain = html.search(/<main\b/i);
    if (headerEnd === -1 || targetStart <= headerEnd) failures.push(`${relative}: content-start target must follow shared header`);
    if (firstMain !== -1 && targetStart >= firstMain) failures.push(`${relative}: content-start target must precede main content/hero layouts`);

    const header = html.match(/<header\b[^>]*class="[^"]*wd-global-header[^"]*"[^>]*>[\s\S]*?<\/header>/i)?.[0] || '';
    const footer = html.match(/<footer\b[^>]*class="[^"]*wd-global-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i)?.[0] || '';
    if (!header.includes('<nav class="nav"') || countAnchors(header) < 7) failures.push(`${relative}: incomplete shared navigation`);
    if (countAnchors(footer) < 7) failures.push(`${relative}: incomplete shared footer links`);
  }

  assert.deepEqual(failures, []);
});
