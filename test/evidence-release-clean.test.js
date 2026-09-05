import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const pages = [
  'evidence/index.html',
  'evidence/germany-population-revision-2025/index.html',
  'evidence/canada-population-revision-2025/index.html',
  'evidence/australia-population-revision-2025/index.html'
];

test('evidence release pages use current branding and canonical origin', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(page, siteRoot), 'utf8');
    assert.doesNotMatch(html, /World Discovery (?:Engine|Data)/, `${page}: stale public brand`);
    assert.doesNotMatch(html, /gunflo1011-debug\.github\.io\/world-discovery-engine/, `${page}: legacy GitHub Pages origin`);
    assert.match(html, /https:\/\/worlddiscoverydata\.com\/evidence\//, `${page}: missing production evidence URL context`);
  }
});

test('evidence human surfaces never collapse negative revisions into negative zero', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(page, siteRoot), 'utf8');
    assert.doesNotMatch(html, /[−-]0(?:\.0+)?%/, `${page}: negative revision rendered as negative zero`);
  }

  const index = await readFile(new URL('evidence/index.html', siteRoot), 'utf8');
  assert.match(index, /Canada:[\s\S]*?[−-]0\.04%/);
  assert.match(index, /Australia:[\s\S]*?[−-]0\.02%/);
});
