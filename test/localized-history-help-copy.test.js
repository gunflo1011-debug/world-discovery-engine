import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = [
  'de/explore/history.html',
  'es/explore/history.html',
  'fr/explore/history.html',
  'zh-hans/explore/history.html',
];

test('localized history help has no naked punctuation before client state loads', async () => {
  for (const relativePath of pages) {
    const html = await readFile(new URL(`../site/${relativePath}`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /<span id="country-count"><\/span>\.\s/);
    assert.match(html, /<span id="country-count"><\/span><span class="country-help-copy">/);
    assert.match(html, /#country-count:not\(:empty\)\+\.country-help-copy::before\{content:"\. "\}/);
  }
});
