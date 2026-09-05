import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const localizedHistoryPages = [
  'de/explore/history.html',
  'es/explore/history.html',
  'fr/explore/history.html',
  'zh-hans/explore/history.html',
];

let changed = 0;
for (const relativePath of localizedHistoryPages) {
  const page = new URL(relativePath, siteRoot);
  let html = await readFile(page, 'utf8');

  if (!html.includes('id="country-count"')) continue;

  const before = html;
  html = html.replace(
    /<span id="country-count"><\/span>\. ([^<]+)<\/small>/,
    '<span id="country-count"></span><span class="country-help-copy">$1</span></small>',
  );

  if (!html.includes('#country-count:not(:empty)+.country-help-copy::before')) {
    html = html.replace(
      '</style></head>',
      '#country-count:not(:empty)+.country-help-copy::before{content:". "}</style></head>',
    );
  }

  if (html !== before) {
    await writeFile(page, html, 'utf8');
    changed += 1;
  }
}

console.log(`Finalized localized history help copy on ${changed} pages.`);
