import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const buildUrl = new URL('build.json', siteRoot);
const countryIndexUrl = new URL('indicators/internet-use/country/index.json', siteRoot);
const regionIndexUrl = new URL('indicators/internet-use/region/index.json', siteRoot);
const baseUrl = process.env.SITE_BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine/';

const [sitemap, rawBuild, rawIndex, rawRegionIndex] = await Promise.all([
  readFile(sitemapUrl, 'utf8'),
  readFile(buildUrl, 'utf8'),
  readFile(countryIndexUrl, 'utf8'),
  readFile(regionIndexUrl, 'utf8')
]);

const build = JSON.parse(rawBuild);
const index = JSON.parse(rawIndex);
const regionIndex = JSON.parse(rawRegionIndex);
if (index?.indicator !== 'IT.NET.USER.ZS' || !Number.isInteger(index?.observationYear) || !Array.isArray(index?.countries)) {
  throw new Error('invalid internet-use country discovery index');
}
if (regionIndex?.indicator !== 'IT.NET.USER.ZS' || !Number.isInteger(regionIndex?.observationYear) || !Array.isArray(regionIndex?.regions)) {
  throw new Error('invalid internet-use region discovery index');
}

const existing = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const additions = [...index.countries, ...regionIndex.regions]
  .map((country) => new URL(country.url.replace(/^\//, ''), baseUrl).href)
  .filter((url) => !existing.has(url));

let updatedSitemap = sitemap;
if (additions.length) {
  const xml = additions.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n');
  updatedSitemap = sitemap.replace(/\s*<\/urlset>\s*$/, `\n${xml}\n</urlset>\n`);
}

const updatedBuild = {
  ...build,
  publicRoutes: Number(build.publicRoutes || 0) + additions.length,
  internetUseCountryProfiles: index.countries.length,
  internetUseRegionalPages: regionIndex.regions.length
};

await Promise.all([
  writeFile(sitemapUrl, updatedSitemap, 'utf8'),
  writeFile(buildUrl, `${JSON.stringify(updatedBuild, null, 2)}\n`, 'utf8')
]);

console.log(`Added ${additions.length} Internet-use country and region routes to discovery outputs.`);
