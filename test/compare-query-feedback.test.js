import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

const surfaces = [
  ['compare/index.html', 'One or more country codes in this URL were not recognized.'],
  ['de/compare/index.html', 'Mindestens ein Ländercode in dieser URL wurde nicht erkannt.'],
  ['es/compare/index.html', 'No se reconoció uno o más códigos de país de esta URL.'],
  ['fr/compare/index.html', 'Un ou plusieurs codes pays de cette URL ne sont pas reconnus.'],
  ['zh-hans/compare/index.html', '此网址中的一个或多个国家代码无法识别']
];

test('compare pages explain invalid URL country codes in every released locale', async () => {
  for (const [path, message] of surfaces) {
    const html = await readFile(new URL(path, siteRoot), 'utf8');

    assert.equal(html.split('data-compare-query-capture').length - 1, 1, `${path} should capture the requested query once`);
    assert.equal(html.split('data-compare-query-feedback').length - 1, 1, `${path} should install feedback once`);
    assert.equal(html.split('id="compare-query-warning"').length - 1, 1, `${path} should expose one status message`);
    assert.match(html, /id="compare-query-warning"[^>]*role="status"[^>]*aria-live="polite"[^>]*hidden/);
    assert.ok(html.includes(message), `${path} should use locale-native warning copy`);
    assert.match(html, /validCodes\.has\(String\(requested\.a\)\.toUpperCase\(\)\)/);
    assert.match(html, /validCodes\.has\(String\(requested\.b\)\.toUpperCase\(\)\)/);
  }
});
