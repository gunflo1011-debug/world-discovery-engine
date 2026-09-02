import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const countries = JSON.parse(await readFile(new URL('countries/index.json', siteRoot), 'utf8'));
const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');
const base = 'https://worlddiscoverydata.com';

async function indicatorLandingRoutes() {
  const indicatorsRoot = new URL('indicators/', siteRoot);
  const entries = await readdir(indicatorsRoot, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const info = await stat(new URL(`${entry.name}/index.html`, indicatorsRoot));
      if (info.isFile()) routes.push(`/indicators/${entry.name}/`);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }

  return routes.sort();
}

const urls = [
  '/data/',
  ...(catalog.indicators ?? []).filter((x) => x.status === 'CURRENT_VERIFIED').map((x) => `/data/${x.slug}/`),
  '/countries/',
  ...(countries.countries ?? []).map((x) => x.url),
  '/compare/',
  ...await indicatorLandingRoutes()
];

for (const path of urls) {
  const row = `<url><loc>${base}${path}</loc></url>`;
  if (!sitemap.includes(row)) sitemap = sitemap.replace('</urlset>', `${row}\n</urlset>`);
}

await writeFile(sitemapUrl, sitemap, 'utf8');
console.log(`Ensured ${urls.length} WDI and indicator discovery routes are present in sitemap.xml.`);
