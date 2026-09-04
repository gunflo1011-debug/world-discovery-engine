import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const countries = JSON.parse(await readFile(new URL('countries/index.json', siteRoot), 'utf8'));
const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');
const base = 'https://worlddiscoverydata.com';
const generatedAt = new Date(catalog.generatedAt);
if (Number.isNaN(generatedAt.getTime())) {
  throw new Error(`WDI catalog generatedAt is invalid: ${catalog.generatedAt}`);
}
const lastmod = generatedAt.toISOString().slice(0, 10);
const urls = [
  '/data/',
  ...(catalog.indicators ?? []).filter((x) => x.status === 'CURRENT_VERIFIED').map((x) => `/data/${x.slug}/`),
  '/countries/',
  ...(countries.countries ?? []).map((x) => x.url),
  '/compare/'
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const path of urls) {
  const loc = `<loc>${base}${path}</loc>`;
  const row = `<url>${loc}<lastmod>${lastmod}</lastmod></url>`;
  const existingRow = new RegExp(`<url>\\s*${escapeRegExp(loc)}(?:\\s*<lastmod>[^<]+</lastmod>)?\\s*</url>`);
  if (existingRow.test(sitemap)) {
    sitemap = sitemap.replace(existingRow, row);
  } else {
    sitemap = sitemap.replace('</urlset>', `${row}\n</urlset>`);
  }
}

await writeFile(sitemapUrl, sitemap, 'utf8');
console.log(`Ensured ${urls.length} WDI discovery routes are present in sitemap.xml with lastmod ${lastmod}.`);
