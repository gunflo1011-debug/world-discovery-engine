import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = new URL('../site/', import.meta.url);
const sitePath = fileURLToPath(siteRoot);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));
const locales = config.locales;
const entries = Object.entries(locales);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
let sitemap = await readFile(sitemapUrl, 'utf8');

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const escRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const localeUrl = (locale, suffix = '') => {
  const path = locales[locale].path;
  const base = path ? `https://worlddiscoverydata.com/${path}/` : 'https://worlddiscoverydata.com/';
  return `${base}${suffix}`;
};

const linksFor = (suffix, supportedEntries) => supportedEntries
  .map(([locale, cfg]) => `<link rel="alternate" hreflang="${esc(cfg.htmlLang)}" href="${esc(localeUrl(locale, suffix))}">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="${esc(localeUrl(config.defaultLocale, suffix))}">`)
  .join('');

async function exists(url) {
  try { await access(url); return true; } catch { return false; }
}

async function listHtml(dir) {
  let dirEntries;
  try { dirEntries = await readdir(dir, { withFileTypes: true }); }
  catch { return []; }
  const files = [];
  for (const entry of dirEntries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) files.push(...await listHtml(url));
    else if (entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

const htmlRelative = (url, localePath = '') => {
  const root = localePath ? fileURLToPath(new URL(`${localePath}/`, siteRoot)) : sitePath;
  return relative(root, fileURLToPath(url)).split(sep).join('/');
};

const suffixFor = (relativeHtml) => {
  if (relativeHtml === 'index.html') return '';
  if (relativeHtml.endsWith('/index.html')) return relativeHtml.slice(0, -'index.html'.length);
  return relativeHtml;
};

const fileFor = (locale, relativeHtml) => {
  const prefix = locales[locale].path ? `${locales[locale].path}/` : '';
  return new URL(`${prefix}${relativeHtml}`, siteRoot);
};

async function setAlternates(file, links) {
  let html = await readFile(file, 'utf8');
  const before = html;
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]*">/g, '');
  html = html.replace('</head>', `${links}</head>`);
  if (html !== before) await writeFile(file, html, 'utf8');
  return html !== before;
}

const sitemapHas = (url) => new RegExp(`<loc>${escRegex(url)}</loc>`).test(sitemap);
const ensureSitemap = (url) => {
  if (sitemapHas(url)) return false;
  sitemap = sitemap.replace('</urlset>', `<url><loc>${url}</loc></url>\n</urlset>`);
  return true;
};

// Discover route equivalence from the localized trees themselves. A route is only
// advertised when the English page and the corresponding localized file both exist.
// This keeps hreflang and sitemap parity aligned with the central generators instead
// of maintaining a second, fragile list of page families here.
const localizedRoutes = new Set();
for (const [locale, cfg] of entries) {
  if (locale === config.defaultLocale || !cfg.path) continue;
  const files = await listHtml(new URL(`${cfg.path}/`, siteRoot));
  for (const file of files) localizedRoutes.add(htmlRelative(file, cfg.path));
}

let routeCount = 0;
let changed = 0;
let sitemapAdded = 0;
for (const relativeHtml of [...localizedRoutes].sort()) {
  const englishFile = fileFor(config.defaultLocale, relativeHtml);
  if (!await exists(englishFile)) continue;

  const supportedEntries = [];
  for (const entry of entries) {
    const [locale, cfg] = entry;
    if (locale !== config.defaultLocale && !cfg.path) continue;
    if (await exists(fileFor(locale, relativeHtml))) supportedEntries.push(entry);
  }
  if (supportedEntries.length <= 1) continue;

  const suffix = suffixFor(relativeHtml);
  const links = linksFor(suffix, supportedEntries);
  for (const [locale] of supportedEntries) {
    if (await setAlternates(fileFor(locale, relativeHtml), links)) changed += 1;
  }

  const englishUrl = localeUrl(config.defaultLocale, suffix);
  if (sitemapHas(englishUrl)) {
    for (const [locale] of supportedEntries) {
      if (locale !== config.defaultLocale && ensureSitemap(localeUrl(locale, suffix))) sitemapAdded += 1;
    }
  }
  routeCount += 1;
}

await writeFile(sitemapUrl, `${sitemap.trim()}\n`, 'utf8');
console.log(`Aligned reciprocal hreflang across ${routeCount} equivalent routes (${changed} HTML files updated; ${sitemapAdded} localized sitemap URLs mirrored).`);
