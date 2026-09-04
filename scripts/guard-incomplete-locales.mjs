import { readFile, writeFile, readdir } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const indicators = catalog.indicators ?? [];

const previewLabels = {
  de: { suffix: 'Vorschau', note: 'Sprachvorschau: Die veröffentlichten Datenindikatoren sind übersetzt, aber noch nicht alle Bereiche der Website sind vollständig auf Deutsch verfügbar. Diese Version wird bis zur vollständigen Lokalisierung nicht als gleichwertige Sprachseite indexiert.' },
  es: { suffix: 'vista previa', note: 'Vista previa de idioma: los indicadores de datos publicados están traducidos, pero todavía no todas las secciones del sitio están disponibles completamente en español. Esta versión no se indexa como página equivalente hasta completar toda la localización.' },
  fr: { suffix: 'aperçu', note: 'Aperçu linguistique : les indicateurs de données publiés sont traduits, mais toutes les sections du site ne sont pas encore entièrement disponibles en français. Cette version n’est pas indexée comme page équivalente avant la fin de la localisation complète.' },
  'zh-Hans': { suffix: '预览', note: '语言预览：已发布的数据指标已完成翻译，但网站的所有区域尚未全部提供简体中文版本。在完整本地化完成之前，此版本不会作为等效语言页面建立索引。' }
};

const escRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const localizedCount = (cfg) => indicators.filter((item) => Boolean(cfg.indicatorNames?.[item.slug])).length;
const isComplete = (cfg) => cfg.fullSiteReady === true && indicators.length > 0 && localizedCount(cfg) === indicators.length;

async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) files.push(...await listHtml(url));
    else if (entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

const incomplete = Object.entries(config.locales)
  .filter(([locale, cfg]) => locale !== config.defaultLocale && cfg.path && !isComplete(cfg));

for (const [locale, cfg] of incomplete) {
  const preview = previewLabels[locale] ?? {
    suffix: 'preview',
    note: 'Language preview: published data indicators are translated, but not every site section is fully localized yet. This version is not indexed as an equivalent language page until full-site localization is complete.'
  };
  const localeRoot = new URL(`${cfg.path}/`, siteRoot);
  let htmlFiles = [];
  try { htmlFiles = await listHtml(localeRoot); } catch { continue; }

  for (const file of htmlFiles) {
    let html = await readFile(file, 'utf8');
    if (/<meta name="robots" content="[^"]*">/.test(html)) {
      html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,follow">');
    } else {
      html = html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>');
    }
    if (!html.includes('data-locale-preview')) {
      const notice = `<aside class="wrap locale-note" data-locale-preview="true" role="note">${preview.note}</aside>`;
      html = html.replace('</header>', `</header>${notice}`);
    }
    await writeFile(file, html, 'utf8');
  }
}

// Incomplete locale URLs must not be advertised as equivalent search-language targets.
const allHtml = await listHtml(siteRoot);
for (const file of allHtml) {
  let html = await readFile(file, 'utf8');
  const before = html;
  for (const [locale, cfg] of incomplete) {
    const lang = escRegex(cfg.htmlLang);
    html = html.replace(new RegExp(`<link rel="alternate" hreflang="${lang}" href="[^"]*">`, 'g'), '');
    const nativeName = escRegex(cfg.nativeName);
    const suffix = previewLabels[locale]?.suffix ?? 'preview';
    html = html.replace(new RegExp(`>${nativeName}</a>`, 'g'), `>${cfg.nativeName} · ${suffix}</a>`);
  }
  if (html !== before) await writeFile(file, html, 'utf8');
}

const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');
for (const [, cfg] of incomplete) {
  const base = `https://worlddiscoverydata.com/${cfg.path}/`;
  const escapedBase = escRegex(base);
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escapedBase}[^<]*<\\/loc>[\\s\\S]*?<\\/url>`, 'g'), '');
}
await writeFile(sitemapUrl, `${sitemap.trim()}\n`, 'utf8');

console.log(`Guarded ${incomplete.length} incomplete locales from full-language indexing: ${incomplete.map(([locale, cfg]) => `${locale} ${localizedCount(cfg)}/${indicators.length} indicators, fullSiteReady=${cfg.fullSiteReady === true}`).join(', ') || 'none'}.`);
