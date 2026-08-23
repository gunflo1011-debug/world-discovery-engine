import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const dataUrl = new URL('indicators/internet-use/data.json', siteRoot);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const buildUrl = new URL('build.json', siteRoot);
const baseUrl = process.env.SITE_BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine/';

const [rawData, sitemap, rawBuild] = await Promise.all([
  readFile(dataUrl, 'utf8'),
  readFile(sitemapUrl, 'utf8'),
  readFile(buildUrl, 'utf8')
]);
const data = JSON.parse(rawData);
const build = JSON.parse(rawBuild);
if (!Array.isArray(data?.records) || !data.records.every((record) => /^[A-Z]{3}$/.test(record?.region?.code) && record?.region?.name?.trim())) {
  throw new Error('official record.region contract is required for regional discovery');
}
const regions = [...new Set(data.records.map((record) => record.region.code))].sort();
if (regions.length !== 7) throw new Error(`expected exactly 7 official regions, found ${regions.length}`);

const regionPrefix = new URL('indicators/internet-use/region/', baseUrl).href;
let updatedSitemap = sitemap.replace(/\s*<url><loc>[^<]*\/indicators\/internet-use\/region\/[a-z]{3}\/<\/loc><\/url>/g, '');
const additions = regions.map((code) => new URL(`indicators/internet-use/region/${code.toLowerCase()}/`, baseUrl).href);
const xml = additions.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n');
updatedSitemap = updatedSitemap.replace(/\s*<\/urlset>\s*$/, `\n${xml}\n</urlset>\n`);
const locations = [...updatedSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(locations.filter((url) => url.startsWith(regionPrefix))).size !== 7) throw new Error('regional sitemap routes are incomplete');

const previousRegionRoutes = Number(build.internetUseRegionPages || 0);
const updatedBuild = {
  ...build,
  publicRoutes: Number(build.publicRoutes || 0) - previousRegionRoutes + regions.length,
  internetUseRegionPages: regions.length
};

await Promise.all([
  writeFile(sitemapUrl, updatedSitemap, 'utf8'),
  writeFile(buildUrl, `${JSON.stringify(updatedBuild, null, 2)}\n`, 'utf8')
]);
console.log(`Added exactly ${regions.length} official-region routes to discovery outputs.`);
