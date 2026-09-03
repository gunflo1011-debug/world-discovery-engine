import { readdir, readFile, writeFile } from 'node:fs/promises';

const dataRoot = new URL('../site/data/', import.meta.url);
const STYLE = '<style data-ranking-table-guard>.ranking-table-wrap{max-height:44rem;overflow:auto;border:1px solid rgba(100,116,139,.18);border-radius:12px}.ranking-table-wrap table{margin:0}.ranking-table-wrap thead th{position:sticky;top:0;background:#fff;z-index:1}.ranking-scroll-note{margin:.5rem 0 0}</style>';
const NOTE = '<p class="muted ranking-scroll-note">The complete ranking stays on this page; scroll inside the table to browse all observations.</p>';

for (const entry of await readdir(dataRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'wdi') continue;
  const pageUrl = new URL(`${entry.name}/index.html`, dataRoot);
  let html;
  try { html = await readFile(pageUrl, 'utf8'); } catch { continue; }
  if (!html.includes('data-country-rows')) continue;

  html = html.replace('<div style="overflow-x:auto"><table>', '<div class="ranking-table-wrap"><table>');
  if (!html.includes('data-ranking-table-guard')) html = html.replace('</head>', `${STYLE}</head>`);
  if (!html.includes('class="muted ranking-scroll-note"')) {
    html = html.replace(/(<p class="muted" data-country-summary>.*?<\/p>)/, `$1${NOTE}`);
  }
  await writeFile(pageUrl, html, 'utf8');
}
