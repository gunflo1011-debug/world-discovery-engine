import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const indicators = Array.isArray(catalog?.indicators) ? catalog.indicators : [];

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

let updated = 0;
for (const item of indicators) {
  if (item?.status !== 'CURRENT_VERIFIED' || !item?.slug || !item?.name || !item?.year) continue;
  const pageUrl = new URL(`data/${item.slug}/index.html`, siteRoot);
  let html;
  try {
    html = await readFile(pageUrl, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`Verified indicator page missing: /data/${item.slug}/`);
    throw error;
  }

  const countryCount = Number(item.countries);
  const countText = Number.isFinite(countryCount) && countryCount > 0 ? `${countryCount} countries` : 'countries worldwide';
  const title = `${item.name} by Country (${item.year}) | World Bank Data`;
  const description = `Compare ${item.name} by country in ${item.year} using official World Bank WDI data. See rankings for ${countText}, historical years and country trends.`;

  if (!/<title>[^<]*<\/title>/i.test(html)) throw new Error(`Missing title on /data/${item.slug}/`);
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i.test(html)) throw new Error(`Missing meta description on /data/${item.slug}/`);

  const next = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i, `<meta name="description" content="${esc(description)}">`);

  if (next !== html) {
    await writeFile(pageUrl, next, 'utf8');
    updated += 1;
  }
}

console.log(`Optimized search-result title and description copy for ${updated} verified WDI indicator pages.`);
