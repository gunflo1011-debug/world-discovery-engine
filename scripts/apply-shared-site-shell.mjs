import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const SKIP_PREFIXES = ['assets/'];

const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rel = (fromFile, targetDir) => {
  const fromDir = path.dirname(fromFile);
  let out = path.relative(fromDir, path.join(siteRoot, targetDir)).replaceAll(path.sep, '/');
  if (!out) out = '.';
  if (!out.startsWith('.')) out = `./${out}`;
  return out.endsWith('/') ? out : `${out}/`;
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function sectionFor(file) {
  const p = path.relative(siteRoot, file).replaceAll(path.sep, '/');
  if (p === 'index.html') return 'home';
  if (p.startsWith('data/') || p.startsWith('indicators/')) return 'data';
  if (p.startsWith('countries/')) return 'countries';
  if (p.startsWith('compare/')) return 'compare';
  if (p.startsWith('methodology/') || p.startsWith('evidence/') || p.startsWith('about/')) return 'about';
  return '';
}

function navLink(href, label, active) {
  return `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
}

function header(file, active) {
  const home = rel(file, '');
  const data = rel(file, 'data');
  const countries = rel(file, 'countries');
  const compare = rel(file, 'compare');
  const about = rel(file, 'methodology');
  return `<header class="topbar wd-global-header" data-wd-shared-shell><div class="wrap"><div class="brand"><a href="${home}">World Discovery</a></div><nav class="nav" aria-label="Primary navigation">${navLink(home,'Home',active==='home')}${navLink(data,'Data',active==='data')}${navLink(countries,'Countries',active==='countries')}${navLink(compare,'Compare',active==='compare')}${navLink(about,'About',active==='about')}</nav></div></header>`;
}

function footer(file) {
  const data = rel(file, 'data');
  const countries = rel(file, 'countries');
  const compare = rel(file, 'compare');
  const about = rel(file, 'methodology');
  return `<footer class="footer wd-global-footer" data-wd-shared-shell><div class="wrap"><strong>World Discovery</strong> · Official global data with explicit years and sources.<br><a href="${data}">Data</a> · <a href="${countries}">Countries</a> · <a href="${compare}">Compare</a> · <a href="${about}">Methodology</a></div></footer>`;
}

function ensureShellCss(html) {
  const css = `<style id="wd-shared-shell-style">.wd-global-header .nav{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}.wd-global-header .nav a[aria-current=\"page\"]{font-weight:800;text-decoration:underline;text-underline-offset:.3rem}.wd-global-footer{margin-top:2rem}.wd-global-footer .wrap{line-height:1.8}@media(max-width:720px){.wd-global-header .wrap{display:block}.wd-global-header .brand{margin-bottom:.7rem}.wd-global-header .nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem}.wd-global-header .nav a{min-height:42px;display:flex;align-items:center}.wd-global-footer .wrap{font-size:.95rem}}</style>`;
  if (html.includes('id="wd-shared-shell-style"')) return html;
  return html.replace('</head>', `${css}</head>`);
}

function normalize(html, file) {
  if (!/<body\b/i.test(html)) return html;
  const active = sectionFor(file);
  html = html.replace(/<header\b[^>]*class="[^"]*topbar[^"]*"[^>]*>[\s\S]*?<\/header>/i, '');
  html = html.replace(/<footer\b[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i, '');
  html = html.replace(/<body([^>]*)>/i, (m, attrs) => `<body${attrs}>${header(file, active)}`);
  html = html.replace(/<\/body>/i, `${footer(file)}</body>`);
  return ensureShellCss(html);
}

const files = await walk(siteRoot);
let changed = 0;
for (const file of files) {
  const relative = path.relative(siteRoot, file).replaceAll(path.sep, '/');
  if (SKIP_PREFIXES.some((prefix) => relative.startsWith(prefix))) continue;
  const before = await readFile(file, 'utf8');
  const after = normalize(before, file);
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}
console.log(`Applied one shared World Discovery header/footer shell to ${changed}/${files.length} HTML pages.`);
