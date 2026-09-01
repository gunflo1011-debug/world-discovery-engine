import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const locales = config.locales;
const entries = Object.entries(locales);

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const localeUrl = (locale, suffix = '') => {
  const path = locales[locale].path;
  const base = path ? `https://worlddiscoverydata.com/${path}/` : 'https://worlddiscoverydata.com/';
  return `${base}${suffix}`;
};

const linksFor = (suffix, supportedEntries = entries) => supportedEntries
  .map(([locale, cfg]) => `<link rel="alternate" hreflang="${esc(cfg.htmlLang)}" href="${esc(localeUrl(locale, suffix))}">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="${esc(localeUrl(config.defaultLocale, suffix))}">`)
  .join('');

async function enrich(path, links) {
  const url = new URL(path, siteRoot);
  let html;
  try { html = await readFile(url, 'utf8'); }
  catch { return false; }
  if (html.includes('rel="alternate" hreflang=')) return false;
  html = html.replace('</head>', `${links}</head>`);
  await writeFile(url, html, 'utf8');
  return true;
}

let changed = 0;
if (await enrich('data/index.html', linksFor('data/'))) changed += 1;

for (const item of catalog.indicators ?? []) {
  const translated = entries.filter(([locale, cfg]) => locale === config.defaultLocale || Boolean(cfg.indicatorNames?.[item.slug]));
  if (translated.length <= 1) continue;
  if (await enrich(`data/${item.slug}/index.html`, linksFor(`data/${item.slug}/`, translated))) changed += 1;
}

console.log(`Added reciprocal hreflang discovery to ${changed} English data pages.`);
