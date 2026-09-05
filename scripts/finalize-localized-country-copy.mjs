import { readdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const translations = JSON.parse(await readFile(new URL('i18n/catalog-translations.json', siteRoot), 'utf8'));

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const released = ['de', 'es', 'fr', 'zh-Hans'];

async function countryPages(locale) {
  const dir = new URL(`${locale.toLowerCase()}/countries/`, siteRoot);
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => new URL(`${entry.name}/index.html`, dir));
}

function replacements(locale) {
  const t = translations[locale] ?? {};
  const pairs = [];
  for (const [slug, localized] of Object.entries(t.indicatorNames ?? {})) {
    pairs.push({ type: 'indicator', slug, localized });
  }
  for (const [english, localized] of Object.entries(t.units ?? {})) {
    pairs.push({ type: 'unit', english, localized });
  }
  return pairs;
}

for (const locale of released) {
  const pairs = replacements(locale);
  const pages = await countryPages(locale);
  for (const file of pages) {
    let html = await readFile(file, 'utf8');
    const before = html;

    for (const pair of pairs) {
      if (pair.type === 'indicator') {
        const marker = `../../data/${pair.slug}/`;
        const re = new RegExp(`(<a href=\"${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\">)([^<]+)(</a>)`, 'g');
        html = html.replace(re, (_m, open, _label, close) => `${open}${escapeHtml(pair.localized)}${close}`);
        continue;
      }

      const english = escapeHtml(pair.english);
      const localized = escapeHtml(pair.localized);
      html = html.replaceAll(`<small>${english}</small>`, `<small>${localized}</small>`);
      html = html.replaceAll(`<p class=\"muted\">${english}</p>`, `<p class=\"muted\">${localized}</p>`);
    }

    if (html !== before) await writeFile(file, html, 'utf8');
  }
}
