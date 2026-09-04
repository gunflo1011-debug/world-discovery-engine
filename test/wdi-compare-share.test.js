import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';

const exec = promisify(execFile);

test('country comparison exposes a share action that preserves the current URL context', async () => {
  await exec(process.execPath, ['scripts/build-wdi-country-compare.mjs']);
  await exec(process.execPath, ['scripts/enrich-wdi-compare-share.mjs']);
  const html = await readFile(new URL('../site/compare/index.html', import.meta.url), 'utf8');
  assert.match(html, /Share this comparison/);
  assert.match(html, /const url=location\.href/);
  assert.match(html, /navigator\.share/);
  assert.match(html, /navigator\.clipboard\.writeText\(url\)/);
  assert.match(html, /data-compare-share/);
});
