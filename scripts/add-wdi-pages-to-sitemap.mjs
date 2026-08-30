import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const countries = JSON.parse(await readFile(new URL('countries/index.json', siteRoot), 'utf8'));
const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');
const base = 'https://worlddiscoverydata.com';
const urls = [
  '/data/',
  ...(catalog.indicators ?? []).filter((x) => x.status === 'CURRENT_VERIFIED').map((x) => `/data/${x.slug}/`),
  '/countries/',
  ...(countries.countries ?? []).map((x) => x.url)
];

for (const path of urls) {
  const row = `<url><loc>${base}${path}</loc></url>`;
  if (!sitemap.includes(row)) sitemap = sitemap.replace('</urlset>', `${row}\n</urlset>`);
}

await writeFile(sitemapUrl, sitemap, 'utf8');
console.log(`Ensured ${urls.length} WDI discovery routes are present in sitemap.xml.`);
