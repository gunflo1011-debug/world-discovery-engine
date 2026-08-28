import { access, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const buildUrl = new URL('build.json', siteRoot);
const countryIndexUrl = new URL('indicators/internet-use/country/index.json', siteRoot);
const regionIndexUrl = new URL('indicators/internet-use/region/index.json', siteRoot);
const historyUrl = new URL('indicators/internet-use/history.json', siteRoot);
const baseUrl = process.env.SITE_BASE_URL || 'https://worlddiscoverydata.com/';

async function exists(url) { try { await access(url); return true; } catch { return false; } }

const [sitemap, rawBuild, rawIndex, rawRegionIndex] = await Promise.all([
  readFile(sitemapUrl, 'utf8'),
  readFile(buildUrl, 'utf8'),
  readFile(countryIndexUrl, 'utf8'),
  readFile(regionIndexUrl, 'utf8')
]);

const build = JSON.parse(rawBuild);
const index = JSON.parse(rawIndex);
const regionIndex = JSON.parse(rawRegionIndex);
if (index?.indicator !== 'IT.NET.USER.ZS' || !Number.isInteger(index?.observationYear) || !Array.isArray(index?.countries)) throw new Error('invalid internet-use country discovery index');
if (regionIndex?.indicator !== 'IT.NET.USER.ZS' || !Number.isInteger(regionIndex?.observationYear) || !Array.isArray(regionIndex?.regions)) throw new Error('invalid internet-use region discovery index');

const expectedDiscoveryUrls = [...index.countries, ...regionIndex.regions].map((record) => new URL(record.url.replace(/^\//, ''), baseUrl).href);
const historyUrls = [];
if (await exists(historyUrl)) {
  const history = JSON.parse(await readFile(historyUrl, 'utf8'));
  if (history?.status !== 'CURRENT_VERIFIED_HISTORY' || history?.indicator?.code !== 'IT.NET.USER.ZS' || !Array.isArray(history.records)) throw new Error('invalid internet-use history discovery index');
  for (const record of history.records) {
    const relative = `indicators/internet-use/country/${record.code.toLowerCase()}/history/`;
    if (!(await exists(new URL(`${relative}index.html`, siteRoot)))) throw new Error(`missing generated history page ${record.code}`);
    historyUrls.push(new URL(relative, baseUrl).href);
  }
}

const existingUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);
const uniqueUrls = [...new Set([...existingUrls, ...historyUrls])];
const uniqueSet = new Set(uniqueUrls);
const missing = expectedDiscoveryUrls.filter((url) => !uniqueSet.has(url));
if (missing.length) throw new Error(`sitemap missing ${missing.length} internet-use discovery routes`);

const updatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
const updatedBuild = { ...build, publicRoutes: uniqueUrls.length, internetUseCountryProfiles: index.countries.length, internetUseRegionalPages: regionIndex.regions.length, internetUseHistoryProfiles: historyUrls.length };

await Promise.all([
  writeFile(sitemapUrl, updatedSitemap, 'utf8'),
  writeFile(buildUrl, `${JSON.stringify(updatedBuild, null, 2)}\n`, 'utf8')
]);

console.log(`Finalized ${uniqueUrls.length} unique sitemap routes (${index.countries.length} countries, ${historyUrls.length} histories, ${regionIndex.regions.length} regions).`);
