import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const clientPath = new URL('wdi-locale-context.js', siteRoot);

const client = `(() => {
  const supported = { de: ['Deutsch', '/de/data/'], es: ['Español', '/es/data/'], fr: ['Français', '/fr/data/'], 'zh-Hans': ['简体中文', '/zh-hans/data/'] };
  const lang = new URLSearchParams(location.search).get('lang');
  const locale = supported[lang];
  if (!locale) return;
  const dataLink = [...document.querySelectorAll('.nav a')].find((a) => a.textContent.trim() === 'Data');
  if (dataLink) dataLink.href = locale[1];
  const hero = document.querySelector('.hero .wrap');
  if (!hero) return;
  const note = document.createElement('p');
  note.className = 'muted locale-context-note';
  note.innerHTML = 'You opened this indicator from the <a href="' + locale[1] + '">' + locale[0] + ' data catalog</a>. Indicator details are currently shown in English.';
  hero.append(note);
})();
`;
await writeFile(clientPath, client, 'utf8');

let changed = 0;
for (const item of catalog.indicators ?? []) {
  const page = new URL(`data/${item.slug}/index.html`, siteRoot);
  let html;
  try { html = await readFile(page, 'utf8'); } catch { continue; }
  if (html.includes('wdi-locale-context.js')) continue;
  html = html.replace('</body>', '<script src="../../wdi-locale-context.js" defer></script></body>');
  await writeFile(page, html, 'utf8');
  changed += 1;
}
console.log(`Added locale-context handoff to ${changed} WDI indicator pages.`);
