import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const index = JSON.parse(await readFile(new URL('countries/index.json', siteRoot), 'utf8'));
let linked = 0;

for (const country of index.countries ?? []) {
  const code = String(country.code ?? '').toUpperCase();
  if (!code) continue;
  const file = new URL(`countries/${code.toLowerCase()}/index.html`, siteRoot);
  let html;
  try { html = await readFile(file, 'utf8'); } catch { continue; }
  if (html.includes(`../compare/?a=${code}`) || html.includes(`../../compare/?a=${code}`)) continue;
  const marker = '<a href="../">All countries →</a>';
  if (!html.includes(marker)) continue;
  html = html.replace(marker, `${marker}<a href="../../compare/?a=${encodeURIComponent(code)}">Compare ${country.country} →</a>`);
  await writeFile(file, html, 'utf8');
  linked++;
}

console.log(`Linked ${linked} country hubs to the country comparison explorer.`);
