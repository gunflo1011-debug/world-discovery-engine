import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const locales = {
  de: ' im Vergleich zu ',
  es: ' frente a ',
  fr: ' comparé à ',
  'zh-hans': ' 与 '
};

const englishExpression = "ca.country+' vs '+cb.country";
let changed = 0;

for (const [locale, separator] of Object.entries(locales)) {
  const file = new URL(`${locale}/compare/index.html`, siteRoot);
  let html = await readFile(file, 'utf8');
  const localizedExpression = `ca.country+${JSON.stringify(separator)}+cb.country`;

  if (html.includes(englishExpression)) {
    html = html.replace(englishExpression, localizedExpression);
    await writeFile(file, html, 'utf8');
    changed += 1;
    continue;
  }

  if (!html.includes(localizedExpression)) {
    throw new Error(`${locale}/compare/index.html no longer contains the expected dynamic comparison-title expression`);
  }
}

console.log(`Localized dynamic compare titles on ${changed} page(s).`);
