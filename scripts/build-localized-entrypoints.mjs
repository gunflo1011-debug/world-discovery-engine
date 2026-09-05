import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { localizeCountryName } from './localize-geo-name.mjs';

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

const readJson = async (url) => {
  try { return JSON.parse(await readFile(url, 'utf8')); }
  catch { return null; }
};

const localeUrl = (locale, suffix = '') => {
  const path = locales[locale].path;
  const base = path ? `https://worlddiscoverydata.com/${path}/` : 'https://worlddiscoverydata.com/';
  return `${base}${suffix}`;
};

const hreflangLinks = (suffix = '') => localeEntries
  .map(([locale, cfg]) => `<link rel="alternate" hreflang="${esc(cfg.htmlLang)}" href="${esc(localeUrl(locale, suffix))}">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="${esc(localeUrl(config.defaultLocale, suffix))}">`)
  .join('');

const languageSwitcher = (current, suffix = '') => `<nav class="wrap language-switcher" aria-label="${esc(locales[current].language)}"><span aria-hidden="true">${esc(locales[current].language)}:</span>${localeEntries.map(([locale, cfg]) => `<a href="${esc(localeUrl(locale, suffix))}" hreflang="${esc(cfg.htmlLang)}" lang="${esc(cfg.htmlLang)}"${locale === current ? ' aria-current="page"' : ''}>${esc(cfg.nativeName)}</a>`).join('')}</nav>`;

const sharedStyle = `<style>.language-switcher{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap;padding:.65rem 0;font-size:.92rem}.language-switcher a{display:inline-block;padding:.35rem .2rem}.language-switcher a[aria-current=page]{font-weight:700;text-decoration:underline}.language-switcher a:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:3px}.localized-actions{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.25rem}.locale-note{margin-top:1rem;font-size:.95rem}.localized-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}.localized-card{border:1px solid rgba(100,116,139,.2);border-radius:14px;padding:1rem;background:#fff}.localized-search{width:100%;max-width:560px;min-height:46px;padding:.7rem .8rem;border:1px solid rgba(100,116,139,.35);border-radius:10px;font:inherit}.localized-table-wrap{overflow-x:auto;margin-top:1rem}.localized-table{width:100%;border-collapse:collapse}.localized-table th,.localized-table td{padding:.75rem;border-bottom:1px solid rgba(100,116,139,.18);text-align:left}.localized-table td:last-child,.localized-table th:last-child{text-align:right;font-variant-numeric:tabular-nums}@media(max-width:430px){.language-switcher{gap:.45rem}.language-switcher a{padding:.45rem .25rem}.localized-table th,.localized-table td{padding:.65rem .45rem}}</style>`;

const translatedIndicatorName = (cfg, item) => cfg.indicatorNames?.[item.slug] ?? item.name;
const translatedUnitName = (cfg, unit) => cfg.unitNames?.[unit] ?? unit;
const hasLocalizedIndicator = (cfg, item) => Boolean(cfg.indicatorNames?.[item.slug]);

function localizedHome(locale, cfg) {
  const canonical = localeUrl(locale);
  const countryHref = locale === 'en' ? '/countries/' : `/${cfg.path}/countries/`;
  const dataHref = locale === 'en' ? '/data/' : `/${cfg.path}/data/`;
  return `<!doctype html><html lang="${esc(cfg.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.title)}</title><meta name="description" content="${esc(cfg.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}">${hreflangLinks()}<link rel="stylesheet" href="/styles.css">${sharedStyle}</head><body><header class="topbar"><div class="wrap"><a class="brand" href="${esc(canonical)}">World Discovery</a></div></header>${languageSwitcher(locale)}<section class="hero"><div class="wrap"><div class="eyebrow">${esc(cfg.eyebrow)}</div><h1>${esc(cfg.hero)}</h1><p>${esc(cfg.intro)}</p><div class="localized-actions"><a href="${esc(dataHref)}">${esc(cfg.browseData)} →</a><a href="${esc(countryHref)}">${esc(cfg.browseCountries)} →</a></div><p class="muted locale-note">${esc(cfg.sourceNote)}</p></div></section><main><section class="section"><div class="wrap"><div class="grid"><article class="card"><span class="pill">DATA</span><h2>${esc(cfg.dataTitle)}</h2><p>${esc(cfg.dataIntro)}</p><a href="${esc(dataHref)}">${esc(cfg.browseData)} →</a></article><article class="card"><span class="pill">COUNTRIES</span><h2>${esc(cfg.browseCountries)}</h2><p>${esc(cfg.sourceNote)}</p><a href="${esc(countryHref)}">${esc(cfg.browseCountries)} →</a></article></div></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${esc(cfg.sourceNote)}</div></footer></body></html>`;
}

function localizedData(locale, cfg) {
  const canonical = localeUrl(locale, 'data/');
  const cards = (catalog.indicators ?? []).map((item) => {
    const localized = hasLocalizedIndicator(cfg, item);
    const href = localized ? localeUrl(locale, `data/${item.slug}/`) : localeUrl('en', `data/${item.slug}/`);
    const action = localized ? cfg.openIndicator : cfg.openInEnglish;
    return `<article class="localized-card"><span class="pill">${esc(item.code)} · ${esc(item.year ?? '')}</span><h2>${esc(translatedIndicatorName(cfg, item))}</h2><p>${esc(translatedUnitName(cfg, item.unit ?? ''))}</p><a href="${esc(href)}">${esc(action)} →</a></article>`;
  }).join('');
  return `<!doctype html><html lang="${esc(cfg.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.dataTitle)} — World Discovery</title><meta name="description" content="${esc(cfg.dataIntro)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}">${hreflangLinks('data/')}<link rel="stylesheet" href="/styles.css">${sharedStyle}</head><body><header class="topbar"><div class="wrap"><a class="brand" href="${esc(localeUrl(locale))}">World Discovery</a></div></header>${languageSwitcher(locale, 'data/')}<main><section class="hero"><div class="wrap"><div class="eyebrow">World Bank WDI</div><h1>${esc(cfg.dataTitle)}</h1><p>${esc(cfg.dataIntro)}</p><p class="muted">${esc(cfg.sourceNote)}</p></div></section><section class="section"><div class="wrap"><div class="localized-grid">${cards}</div></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${esc(cfg.sourceNote)}</div></footer></body></html>`;
}

function formatLocalizedValue(value, unit, locale) {
  if (!Number.isFinite(value)) return '—';
  if (unit?.includes('US$')) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', notation: Math.abs(value) >= 1e6 ? 'compact' : 'standard', maximumFractionDigits: Math.abs(value) >= 1e6 ? 2 : 0 }).format(value);
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: Math.abs(value) >= 100 ? 1 : 2 }).format(value);
}

function localizedIndicator(locale, cfg, item, snapshot) {
  const canonical = localeUrl(locale, `data/${item.slug}/`);
  const name = translatedIndicatorName(cfg, item);
  const unit = translatedUnitName(cfg, item.unit ?? '');
  const records = [...snapshot.records].filter((r) => Number.isFinite(r.value)).sort((a, b) => b.value - a.value || String(a.country).localeCompare(String(b.country)));
  const description = `${name}: ${records.length} ${cfg.coverage}. ${cfg.sourceNote}`;
  const rows = records.map((record, index) => {
    const displayCountry = localizeCountryName(record.code, record.country, locale);
    const searchCountry = `${displayCountry} ${record.country} ${record.code}`.toLocaleLowerCase(locale);
    return `<tr data-country="${esc(searchCountry)}"><td>${index + 1}</td><td><strong>${esc(displayCountry)}</strong><br><span class="muted">${esc(record.code)}</span></td><td>${esc(formatLocalizedValue(record.value, item.unit, locale))}</td></tr>`;
  }).join('');
  const script = `<script>(()=>{const input=document.querySelector('[data-country-search]');if(!input)return;const rows=[...document.querySelectorAll('[data-country]')];input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase(document.documentElement.lang);for(const row of rows)row.hidden=q&&!row.dataset.country.includes(q);});})();</script>`;
  return `<!doctype html><html lang="${esc(cfg.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(name)} (${esc(item.year)}) — World Discovery</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}">${hreflangLinks(`data/${item.slug}/`)}<link rel="stylesheet" href="/styles.css">${sharedStyle}</head><body><header class="topbar"><div class="wrap"><a class="brand" href="${esc(localeUrl(locale))}">World Discovery</a></div></header>${languageSwitcher(locale, `data/${item.slug}/`)}<main><section class="hero"><div class="wrap"><div class="eyebrow">${esc(item.code)} · World Bank WDI · ${esc(item.year)}</div><h1>${esc(name)}</h1><p>${esc(records.length)} ${esc(cfg.coverage)}.</p><p class="muted">${esc(cfg.officialLabel)}: ${esc(item.name)} · ${esc(unit)}</p><p class="muted">${esc(cfg.sourceNote)}</p></div></section><section class="section"><div class="wrap"><label for="country-search"><strong>${esc(cfg.searchCountries)}</strong></label><br><input id="country-search" class="localized-search" data-country-search type="search" placeholder="${esc(cfg.searchPlaceholder)}" autocomplete="off"><div class="localized-table-wrap"><table class="localized-table"><thead><tr><th>${esc(cfg.rank)}</th><th>${esc(cfg.country)}</th><th>${esc(cfg.value)} · ${esc(unit)}</th></tr></thead><tbody>${rows}</tbody></table></div><p><a href="${esc(localeUrl(locale, 'data/'))}">← ${esc(cfg.backToData)}</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${esc(cfg.sourceNote)}</div></footer>${script}</body></html>`;
}

const localizedIndicatorUrls = [];
for (const [locale, cfg] of localeEntries) {
  if (locale === config.defaultLocale) continue;
  const root = new URL(`${cfg.path}/`, siteRoot);
  const data = new URL('data/', root);
  await mkdir(data, { recursive: true });
  await writeFile(new URL('index.html', root), localizedHome(locale, cfg), 'utf8');
  await writeFile(new URL('index.html', data), localizedData(locale, cfg), 'utf8');

  for (const item of catalog.indicators ?? []) {
    if (!hasLocalizedIndicator(cfg, item)) continue;
    const snapshot = await readJson(new URL(`data/wdi/${item.slug}/data.json`, siteRoot));
    if (!snapshot || snapshot.status !== 'CURRENT_VERIFIED' || !Array.isArray(snapshot.records) || !snapshot.records.length) continue;
    const dir = new URL(`${item.slug}/`, data);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL('index.html', dir), localizedIndicator(locale, cfg, item, snapshot), 'utf8');
    localizedIndicatorUrls.push(localeUrl(locale, `data/${item.slug}/`));
  }
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
  .flatMap(([locale]) => [localeUrl(locale), localeUrl(locale, 'data/')])
  .concat(localizedIndicatorUrls);
for (const url of extraUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `<url><loc>${url}</loc></url></urlset>`);
  }
}
await writeFile(sitemapUrl, sitemap, 'utf8');

console.log(`Built localized entry points for ${localeEntries.length} locales and ${localizedIndicatorUrls.length} localized indicator pages.`);
