import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const siteRoot = new URL('../site/', import.meta.url);
const execFileAsync = promisify(execFile);

async function refreshTrendDiscoverability() {
  await execFileAsync(process.execPath, [new URL('../scripts/add-trends-navigation.mjs', import.meta.url).pathname]);
}

test('global search trends hub is indexable, linked and machine-readable', async () => {
  const [html, explore, snapshot] = await Promise.all([
    readFile(new URL('trends/index.html', siteRoot), 'utf8'),
    readFile(new URL('explore/index.html', siteRoot), 'utf8'),
    readFile(new URL('data/trends/latest.json', siteRoot), 'utf8')
  ]);
  const data = JSON.parse(snapshot);

  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/trends\/">/);
  assert.match(html, /index,follow/);
  assert.match(html, /data\/trends\/latest\.json/);
  assert.match(explore, /href="\.\.\/trends\/"/);
  assert.equal(data.status, 'CURATED_GOOGLE_TRENDS_SNAPSHOT');
  assert.equal(data.snapshotDate, '2026-09-08');
  assert.equal(data.trends.length, 5);
  assert.ok(data.trends.every((trend) => trend.query && trend.market && trend.searchVolumeBucket && trend.sourceUrl));
});

test('generated sitemap enrichment keeps the trends route', async () => {
  const script = await readFile(new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url), 'utf8');
  assert.match(script, /['"]\/trends\/['"]/);
});

test('every globally visible current trend answer is listed in the sitemap', async () => {
  await refreshTrendDiscoverability();
  const [snapshot, sitemap] = await Promise.all([
    readFile(new URL('data/trends/latest.json', siteRoot), 'utf8'),
    readFile(new URL('sitemap.xml', siteRoot), 'utf8')
  ]);
  const data = JSON.parse(snapshot);
  const marketCodes = {
    'United States': 'us',
    India: 'in',
    'United Kingdom': 'uk',
    Brazil: 'br',
    Germany: 'de'
  };

  for (const trend of data.trends) {
    const market = marketCodes[trend.market];
    assert.ok(market, `Unknown trend market: ${trend.market}`);
    const url = `https://worlddiscoverydata.com/trends/${market}/${trend.id}/`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${url} missing from sitemap`);
  }
});

test('the newest visible market-hub answer is listed in the sitemap', async () => {
  await refreshTrendDiscoverability();
  const sitemap = await readFile(new URL('sitemap.xml', siteRoot), 'utf8');
  for (const market of ['us', 'in', 'uk', 'br', 'de']) {
    const html = await readFile(new URL(`trends/${market}/index.html`, siteRoot), 'utf8');
    const match = html.match(/<a class="card" href="([^"#?]+)\/">/);
    assert.ok(match, `${market} hub has no visible trend card`);
    const url = `https://worlddiscoverydata.com/trends/${market}/${match[1]}/`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${url} missing from sitemap`);
  }
});
