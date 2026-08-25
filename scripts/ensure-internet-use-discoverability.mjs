import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const internetRoot = new URL('indicators/internet-use/', siteRoot);
const data = JSON.parse(await readFile(new URL('data.json', internetRoot), 'utf8'));
const sitemapUrl = new URL('sitemap.xml', siteRoot);

if (data?.status !== 'CURRENT_VERIFIED') throw new Error('discoverability requires CURRENT_VERIFIED internet-use data');
if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('discoverability requires country records');

const base = 'https://worlddiscoverydata.com/indicators/internet-use/';
const expected = [base, ...data.records.map((record) => `${base}country/${String(record.code).toLowerCase()}/`)];

for (const record of data.records) {
  const slug = String(record.code).toLowerCase();
  const page = await readFile(new URL(`country/${slug}/index.html`, internetRoot), 'utf8');
  const canonical = `${base}country/${slug}/`;
  if (!page.includes(`<link rel="canonical" href="${canonical}">`)) throw new Error(`canonical missing for ${record.code}`);
}

const parent = await readFile(new URL('index.html', internetRoot), 'utf8');
for (const record of data.records) {
  const href = `./country/${String(record.code).toLowerCase()}/`;
  if (!parent.includes(href)) throw new Error(`parent directory link missing for ${record.code}`);
}

let sitemap = await readFile(sitemapUrl, 'utf8');
const closing = '</urlset>';
if (!sitemap.includes(closing)) throw new Error('sitemap closing tag missing');
for (const url of expected) {
  const entry = `<url><loc>${url}</loc></url>`;
  if (!sitemap.includes(entry)) sitemap = sitemap.replace(closing, `${entry}\n${closing}`);
}
await writeFile(sitemapUrl, sitemap, 'utf8');

console.log(`Verified canonical/internal-link discoverability and sitemap coverage for ${data.records.length} internet-use country pages.`);
