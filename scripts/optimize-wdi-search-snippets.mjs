import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const translations = JSON.parse(await readFile(new URL('i18n/catalog-translations.json', siteRoot), 'utf8'));
const indicators = Array.isArray(catalog?.indicators) ? catalog.indicators : [];
const MAX_DESCRIPTION_LENGTH = 160;

const releasedLocales = [
  {
    key: 'en',
    path: '',
    title: (name, year) => `${name} by Country (${year}) | World Bank Data`,
    description: (name, year, count) => `World Bank WDI ${year}: ${name}. ${count}. Compare countries, rankings and historical trends.`,
    fallbackCount: 'Country and territory observations worldwide',
    count: (value) => `${value} country and territory observations`,
  },
  {
    key: 'de',
    path: 'de/',
    title: (name, year) => `${name} nach Ländern (${year}) | Weltbank-Daten`,
    description: (name, year, count) => `Weltbank-WDI ${year}: ${name}. ${count}. Länder vergleichen, Rankings und historische Trends.`,
    fallbackCount: 'Länder- und Gebietseinträge weltweit',
    count: (value) => `${value} Länder- und Gebietseinträge`,
  },
  {
    key: 'es',
    path: 'es/',
    title: (name, year) => `${name} por país (${year}) | Datos del Banco Mundial`,
    description: (name, year, count) => `WDI del Banco Mundial ${year}: ${name}. ${count}. Compara países, rankings y tendencias históricas.`,
    fallbackCount: 'Observaciones de países y territorios de todo el mundo',
    count: (value) => `${value} observaciones de países y territorios`,
  },
  {
    key: 'fr',
    path: 'fr/',
    title: (name, year) => `${name} par pays (${year}) | Données Banque mondiale`,
    description: (name, year, count) => `WDI Banque mondiale ${year} : ${name}. ${count}. Comparez les pays, classements et tendances historiques.`,
    fallbackCount: 'Observations de pays et territoires dans le monde',
    count: (value) => `${value} observations de pays et territoires`,
  },
  {
    key: 'zh-Hans',
    path: 'zh-hans/',
    title: (name, year) => `${name}：各国比较（${year}）| 世界银行数据`,
    description: (name, year, count) => `世界银行 WDI ${year}：${name}。${count}。比较各国排名和历史趋势。`,
    fallbackCount: '全球国家和地区观测值',
    count: (value) => `${value} 个国家和地区观测值`,
  },
];

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const conciseDescription = (value) => {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
  const clipped = text.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const boundary = clipped.lastIndexOf(' ');
  const safe = (boundary >= 120 ? clipped.slice(0, boundary) : clipped).replace(/[\s,;:.!?-]+$/u, '');
  return `${safe}…`;
};

let updated = 0;
for (const item of indicators) {
  if (item?.status !== 'CURRENT_VERIFIED' || !item?.slug || !item?.name || !item?.year) continue;

  for (const locale of releasedLocales) {
    const localizedName = locale.key === 'en'
      ? item.name
      : translations?.[locale.key]?.indicatorNames?.[item.slug];
    if (!localizedName) throw new Error(`Missing ${locale.key} indicator translation for ${item.slug}`);

    const pageUrl = new URL(`${locale.path}data/${item.slug}/index.html`, siteRoot);
    let html;
    try {
      html = await readFile(pageUrl, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') throw new Error(`Verified indicator page missing: /${locale.path}data/${item.slug}/`);
      throw error;
    }

    const countryCount = Number(item.countries);
    const countText = Number.isFinite(countryCount) && countryCount > 0
      ? locale.count(countryCount)
      : locale.fallbackCount;
    const title = locale.title(localizedName, item.year);
    const description = conciseDescription(locale.description(localizedName, item.year, countText));

    if (!/<title>[^<]*<\/title>/i.test(html)) throw new Error(`Missing title on /${locale.path}data/${item.slug}/`);
    if (!/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i.test(html)) throw new Error(`Missing meta description on /${locale.path}data/${item.slug}/`);

    const next = html
      .replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i, `<meta name="description" content="${esc(description)}">`);

    if (next !== html) {
      await writeFile(pageUrl, next, 'utf8');
      updated += 1;
    }
  }
}

console.log(`Optimized localized search-result title and description copy for ${updated} verified WDI indicator pages.`);
