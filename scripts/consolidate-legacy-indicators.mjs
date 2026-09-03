import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteRoot = resolve(process.cwd(), 'site');

const legacyRoutes = [
  {
    path: 'indicators/index.html',
    route: '/indicators/',
    canonical: 'https://worlddiscoverydata.com/data/',
    currentHref: '../data/',
    label: 'indicator catalog',
  },
  {
    path: 'indicators/gdp/index.html',
    route: '/indicators/gdp/',
    canonical: 'https://worlddiscoverydata.com/data/gdp/',
    currentHref: '../../data/gdp/',
    label: 'GDP',
  },
  {
    path: 'indicators/gdp-per-capita/index.html',
    route: '/indicators/gdp-per-capita/',
    canonical: 'https://worlddiscoverydata.com/data/gdp-per-capita/',
    currentHref: '../../data/gdp-per-capita/',
    label: 'GDP per capita',
  },
  {
    path: 'indicators/internet-use/index.html',
    route: '/indicators/internet-use/',
    canonical: 'https://worlddiscoverydata.com/data/internet-use/',
    currentHref: '../../data/internet-use/',
    label: 'internet use',
  },
  {
    path: 'indicators/real-gdp/index.html',
    route: '/indicators/real-gdp/',
    canonical: null,
    currentHref: '../../data/',
    label: 'indicator data',
  },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function consolidateHtml(html, item) {
  let next = html;
  if (/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i.test(next)) {
    next = next.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex,follow">');
  } else {
    next = next.replace(/<head>/i, '<head><meta name="robots" content="noindex,follow">');
  }
  if (item.canonical) {
    if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(next)) {
      next = next.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${item.canonical}">`);
    } else {
      next = next.replace(/<\/head>/i, `<link rel="canonical" href="${item.canonical}"></head>`);
    }
  }
  if (!next.includes('data-legacy-indicator-notice')) {
    const notice = `<section class="section section-soft" data-legacy-indicator-notice><div class="wrap"><strong>Current ${item.label}:</strong> this older URL is retained for existing links, but maintained World Discovery data now live at <a href="${item.currentHref}">${item.currentHref}</a>.</div></section>`;
    next = next.replace(/<main>/i, `<main>${notice}`);
  }
  return next;
}

for (const item of legacyRoutes) {
  const file = resolve(siteRoot, item.path);
  const html = await readFile(file, 'utf8');
  await writeFile(file, consolidateHtml(html, item), 'utf8');
}

// Once legacy indicator pages leave the sitemap, current indexed pages must remain
// discoverable without relying on those retired routes as their only inbound links.
const dataIndexPath = resolve(siteRoot, 'data/index.html');
let dataIndex = await readFile(dataIndexPath, 'utf8');
dataIndex = dataIndex
  .replace(/<a href="\.\.\/indicators\/">Indicators<\/a>/g, '')
  .replace(/<a href="\.\.\/indicators\/">Indicator guide<\/a>/g, '<a href="../categories/economy/">Economy overview</a>')
  .replace(/<a href="\.\.\/indicators\/">browse indicator topics<\/a>/g, '<a href="../data/">browse the data catalog</a>');
if (!dataIndex.includes('data-maintained-context-links')) {
  const contextLinks = '<section class="section section-soft" data-maintained-context-links><div class="wrap"><h2>Data context</h2><p><a href="../categories/economy/">Economy overview</a> · <a href="../archive/">Historical source archive</a> · <a href="../sources/">Sources</a> · <a href="../methodology/">Methodology</a></p></div></section>';
  dataIndex = dataIndex.replace(/<\/main>/i, `${contextLinks}</main>`);
}
await writeFile(dataIndexPath, dataIndex, 'utf8');

const homePath = resolve(siteRoot, 'index.html');
let home = await readFile(homePath, 'utf8');
home = home.replace(/href="\.\/indicators\/internet-use\/"/g, 'href="./data/internet-use/"');
await writeFile(homePath, home, 'utf8');

const sitemapPath = resolve(siteRoot, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
for (const item of legacyRoutes) {
  const absolute = `https://worlddiscoverydata.com${item.route}`;
  const escaped = escapeRegex(absolute);
  sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>`, 'g'), '');
}
await writeFile(sitemapPath, sitemap.trimEnd() + '\n', 'utf8');

console.log('Consolidated legacy indicator URLs onto the maintained /data/ architecture.');
