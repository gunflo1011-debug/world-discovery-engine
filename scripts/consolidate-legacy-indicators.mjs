import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteRoot = resolve(process.cwd(), 'site');

const legacyRoutes = [
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
  if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(next)) {
    next = next.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${item.canonical}">`);
  } else {
    next = next.replace(/<\/head>/i, `<link rel="canonical" href="${item.canonical}"></head>`);
  }
  if (!next.includes('data-legacy-indicator-notice')) {
    const notice = `<section class="section section-soft" data-legacy-indicator-notice><div class="wrap"><strong>Current ${item.label} page:</strong> this older URL is retained for existing links, but the maintained dataset and historical year browser now live at <a href="${item.currentHref}">${item.currentHref}</a>.</div></section>`;
    next = next.replace(/<main>/i, `<main>${notice}`);
  }
  return next;
}

for (const item of legacyRoutes) {
  const file = resolve(siteRoot, item.path);
  const html = await readFile(file, 'utf8');
  await writeFile(file, consolidateHtml(html, item), 'utf8');
}

const sitemapPath = resolve(siteRoot, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
for (const item of legacyRoutes) {
  const absolute = `https://worlddiscoverydata.com${item.route}`;
  const escaped = escapeRegex(absolute);
  sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>`, 'g'), '');
}
await writeFile(sitemapPath, sitemap.trimEnd() + '\n', 'utf8');

console.log('Consolidated overlapping legacy GDP indicator URLs onto /data/ canonicals.');
