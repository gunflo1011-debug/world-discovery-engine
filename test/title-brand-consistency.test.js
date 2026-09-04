import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const siteRoot = new URL('../site/', import.meta.url);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) out.push(...await htmlFiles(url));
    else if (extname(entry.name) === '.html') out.push(url);
  }
  return out;
}

test('public page titles use the World Discovery brand consistently', async () => {
  execFileSync(process.execPath, ['scripts/finalize-seo-discovery.mjs'], { stdio: 'pipe' });

  const violations = [];
  for (const file of await htmlFiles(siteRoot)) {
    const html = await readFile(file, 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
    if (/World Discovery (?:Engine|Data)/.test(title) || /World Discovery (?:Engine|Data)/.test(ogTitle)) {
      violations.push(`${file.pathname}: title=${JSON.stringify(title)} og:title=${JSON.stringify(ogTitle)}`);
    }
  }

  assert.deepEqual(violations, [], `Legacy title brands remain:\n${violations.join('\n')}`);

  const methodology = await readFile(new URL('methodology/index.html', siteRoot), 'utf8');
  assert.match(methodology, /<title>Methodology — World Discovery<\/title>/i);
});
