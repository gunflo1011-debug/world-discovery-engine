import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const locales = {
  de: ' im Vergleich zu ',
  es: ' frente a ',
  fr: ' comparé à ',
  'zh-hans': ' 与 '
};

const englishExpression = "ca.country+' vs '+cb.country";
const legacySuffixExpression = "if(unit==='metric tons per person')return ' '+localized;return ''";
const localizedSuffixExpression = "if(unit==='metric tons per person'||unit==='t CO2e per capita')return ' '+localized;return ''";
let changed = 0;

for (const [locale, separator] of Object.entries(locales)) {
  const file = new URL(`${locale}/compare/index.html`, siteRoot);
  let html = await readFile(file, 'utf8');
  const localizedExpression = `ca.country+${JSON.stringify(separator)}+cb.country`;
  let dirty = false;

  if (html.includes(englishExpression)) {
    html = html.replace(englishExpression, localizedExpression);
    dirty = true;
  } else if (!html.includes(localizedExpression)) {
    throw new Error(`${locale}/compare/index.html no longer contains the expected dynamic comparison-title expression`);
  }

  if (html.includes(legacySuffixExpression)) {
    html = html.replace(legacySuffixExpression, localizedSuffixExpression);
    dirty = true;
  } else if (!html.includes(localizedSuffixExpression)) {
    throw new Error(`${locale}/compare/index.html no longer contains the expected localized unit-suffix formatter`);
  }

  if (dirty) {
    await writeFile(file, html, 'utf8');
    changed += 1;
  }
}

console.log(`Finalized localized dynamic compare copy on ${changed} page(s).`);
