import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRobotsTxt, renderSitemap } from '../src/site-assets.js';

test('robots allows public crawling and OAI-SearchBot and advertises subpath sitemap', () => {
  const robots = renderRobotsTxt({ baseUrl: 'https://example.org/app/' });
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /Sitemap: https:\/\/example\.org\/app\/sitemap\.xml/);
});

test('sitemap emits canonical absolute URLs and optional lastmod', () => {
  const xml = renderSitemap({
    baseUrl: 'https://example.org',
    pages: [
      { path: '/evidence/germany-gdp-growth-2024/', lastModified: '2026-08-20' },
      { path: '/methodology/' }
    ]
  });
  assert.match(xml, /<loc>https:\/\/example\.org\/evidence\/germany-gdp-growth-2024\/<\/loc>/);
  assert.match(xml, /<lastmod>2026-08-20<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/example\.org\/methodology\/<\/loc>/);
});

test('sitemap preserves a deployment base path', () => {
  const xml = renderSitemap({
    baseUrl: 'https://example.org/world-discovery-engine/',
    pages: [{ path: '/evidence/example/' }]
  });
  assert.match(xml, /<loc>https:\/\/example\.org\/world-discovery-engine\/evidence\/example\/<\/loc>/);
});

test('sitemap XML-escapes URLs', () => {
  const xml = renderSitemap({ baseUrl: 'https://example.org', pages: [{ path: '/compare/?a=x&b=y' }] });
  assert.match(xml, /a=x&amp;b=y/);
});
