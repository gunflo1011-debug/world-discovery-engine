import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const localePrefixes = new Map([
  ['de', 'de'],
  ['es', 'es'],
  ['fr', 'fr'],
  ['zh-hans', 'zh-Hans']
]);

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

function rel(file) {
  return path.relative(siteRoot, file).replaceAll(path.sep, '/');
}

test('generated HTML has no legacy brand/domain residue and localized paths declare the correct language', async () => {
  const files = await walk(siteRoot);
  assert.ok(files.length > 1000, `expected full generated site, found only ${files.length} HTML files`);

  const failures = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const relative = rel(file);

    if (/World Discovery (?:Engine|Data)/i.test(html)) failures.push(`${relative}: legacy World Discovery branding`);
    if (/gunflo1011-debug\.github\.io\/world-discovery-engine/i.test(html)) failures.push(`${relative}: legacy GitHub Pages origin`);

    const first = relative.split('/')[0].toLowerCase();
    const expectedLang = localePrefixes.get(first);
    if (expectedLang) {
      const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
      if (lang !== expectedLang) failures.push(`${relative}: expected lang=${expectedLang}, got ${lang ?? 'missing'}`);
    }

    const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1]
      ?? html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[1];
    if (canonical && !canonical.startsWith('https://worlddiscoverydata.com/')) {
      failures.push(`${relative}: non-production canonical ${canonical}`);
    }
  }

  assert.deepEqual(failures, [], `sitewide release residue detected:\n${failures.slice(0, 100).join('\n')}${failures.length > 100 ? `\n...and ${failures.length - 100} more` : ''}`);
});
