import { readFile, writeFile } from 'node:fs/promises';

const localesUrl = new URL('../site/i18n/locales.json', import.meta.url);
const translationsUrl = new URL('../site/i18n/catalog-translations.json', import.meta.url);
const config = JSON.parse(await readFile(localesUrl, 'utf8'));
const translations = JSON.parse(await readFile(translationsUrl, 'utf8'));

for (const [locale, extra] of Object.entries(translations)) {
  if (!config.locales[locale]) continue;
  config.locales[locale].indicatorNames = { ...(config.locales[locale].indicatorNames || {}), ...(extra.indicatorNames || {}) };
  config.locales[locale].unitNames = { ...(extra.units || {}) };
  config.locales[locale].ui = { ...(extra.ui || {}) };
}

await writeFile(localesUrl, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('Hydrated complete indicator, unit and UI translations.');
