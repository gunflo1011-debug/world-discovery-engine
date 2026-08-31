import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const locales = config.locales;
const localeEntries = Object.entries(locales);

const esc = (v) => String(v ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const localeUrl = (locale, suffix = '') => {
  const path = locales[locale].path;
  const base = path ? `https://worlddiscoverydata.com/${path}/` : 'https://worlddiscoverydata.com/';
  return `${base}${suffix}`;
};

const hreflangLinks = (suffix = '') => localeEntries
  .map(([locale, cfg]) => `<link rel="alternate" hreflang="${esc(cfg.htmlLang)}" href="${esc(localeUrl(locale, suffix))}">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="${esc(localeUrl(config.defaultLocale, suffix))}">`)
  .join('');

const languageSwitcher = (current, suffix = '') => `<div class="wrap language-switcher" aria-label="${esc(locales[current].language)}"><span>${esc(locales[current].language)}:</span>${localeEntries.map(([locale, cfg]) => `<a href="${esc(localeUrl(locale, suffix))}" hreflang="${esc(cfg.htmlLang)}" lang="${esc(cfg.htmlLang)}"${locale === current ? ' aria-current="page"' : ''}>${esc(cfg.nativeName)}</a>`).join('')}</div>`;

const sharedStyle = `<style>.language-switcher{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap;padding:.65rem 0;font-size:.92rem}.language-switcher a[aria-current=page]{font-weight:700;text-decoration:underline}.localized-actions{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.25rem}.locale-note{margin-top:1rem;font-size:.95rem}.localized-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}.localized-card{border:1px solid rgba(100,116,139,.2);border-radius:14px;padding:1rem;background:#fff}</style>`;

function localizedHome(locale, cfg) {
  const canonical = localeUrl(locale);
  const countryHref = locale === 'en' ? './countries/' : '/countries/';
  const dataHref = locale === 'en' ? './data/' : `/${cfg.path}/data/`;
  return `<!doctype html><html lang="${esc(cfg.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.title)}</title><meta name="description" content="${esc(cfg.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}">${hreflangLinks()}<link rel="stylesheet" href="${locale === 'en' ? './styles.css' : '../styles.css'}">${sharedStyle}</head><body><header class="topbar"><div class="wrap"><a class="brand" href="${esc(canonical)}">World Discovery</a></div></header>${languageSwitcher(locale)}<section class="hero"><div class="wrap"><div class="eyebrow">${esc(cfg.eyebrow)}</div><h1>${esc(cfg.hero)}</h1><p>${esc(cfg.intro)}</p><div class="localized-actions"><a href="${esc(dataHref)}">${esc(cfg.browseData)} →</a><a href="${esc(countryHref)}">${esc(cfg.browseCountries)} →</a></div><p class="muted locale-note">${esc(cfg.sourceNote)}</p></div></section><main><section class="section"><div class="wrap"><div class="grid"><article class="card"><span class="pill">DATA</span><h2>${esc(cfg.dataTitle)}</h2><p>${esc(cfg.dataIntro)}</p><a href="${esc(dataHref)}">${esc(cfg.browseData)} →</a></article><article class="card"><span class="pill">COUNTRIES</span><h2>${esc(cfg.browseCountries)}</h2><p>${esc(cfg.sourceNote)}</p><a href="${esc(countryHref)}">${esc(cfg.browseCountries)} →</a></article></div></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${esc(cfg.sourceNote)}</div></footer></body></html>`;
}

function localizedData(locale, cfg) {
  const canonical = localeUrl(locale, 'data/');
  const cards = (catalog.indicators ?? []).map((item) => `<article class="localized-card"><span class="pill">${esc(item.code)} · ${esc(item.year ?? '')}</span><h2>${esc(item.name)}</h2><p>${esc(item.unit ?? '')}</p><a href="/data/${esc(item.slug)}/">${esc(cfg.openIndicator)} →</a></article>`).join('');
  return `<!doctype html><html lang="${esc(cfg.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.dataTitle)} — World Discovery</title><meta name="description" content="${esc(cfg.dataIntro)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}">${hreflangLinks('data/')}<link rel="stylesheet" href="${locale === 'en' ? '../styles.css' : '../../styles.css'}">${sharedStyle}</head><body><header class="topbar"><div class="wrap"><a class="brand" href="${esc(localeUrl(locale))}">World Discovery</a></div></header>${languageSwitcher(locale, 'data/')}<main><section class="hero"><div class="wrap"><div class="eyebrow">World Bank WDI</div><h1>${esc(cfg.dataTitle)}</h1><p>${esc(cfg.dataIntro)}</p><p class="muted">${esc(cfg.sourceNote)}</p></div></section><section class="section"><div class="wrap"><div class="localized-grid">${cards}</div></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${esc(cfg.sourceNote)}</div></footer></body></html>`;
}

for (const [locale, cfg] of localeEntries) {
  if (locale === config.defaultLocale) continue;
  const root = new URL(`${cfg.path}/`, siteRoot);
  const data = new URL('data/', root);
  await mkdir(data, { recursive: true });
  await writeFile(new URL('index.html', root), localizedHome(locale, cfg), 'utf8');
  await writeFile(new URL('index.html', data), localizedData(locale, cfg), 'utf8');
}

// Add language discovery to the existing English homepage without replacing its richer UX.
const englishHomeUrl = new URL('index.html', siteRoot);
let englishHome = await readFile(englishHomeUrl, 'utf8');
if (!englishHome.includes('hreflang="de"')) {
  englishHome = englishHome.replace('</head>', `${hreflangLinks()}${sharedStyle}</head>`);
}
if (!englishHome.includes('class="wrap language-switcher"')) {
  englishHome = englishHome.replace('</header>', `</header>${languageSwitcher('en')}`);
}
await writeFile(englishHomeUrl, englishHome, 'utf8');

// Add localized entry points to the sitemap while preserving existing URLs.
const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');
const extraUrls = localeEntries
  .filter(([locale]) => locale !== config.defaultLocale)
  .flatMap(([locale]) => [localeUrl(locale), localeUrl(locale, 'data/')]);
for (const url of extraUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `<url><loc>${url}</loc></url></urlset>`);
  }
}
await writeFile(sitemapUrl, sitemap, 'utf8');

console.log(`Built localized entry points for ${localeEntries.length} locales.`);
