import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const SKIP_PREFIXES = ['assets/'];

const rel = (fromFile, targetDir) => {
  if (path.basename(fromFile) === '404.html') return targetDir ? `/${targetDir.replace(/^\/+|\/+$/g, '')}/` : '/';
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
  if (p.startsWith('explore/')) return 'explore';
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
  const explore = rel(file, 'explore');
  const data = rel(file, 'data');
  const countries = rel(file, 'countries');
  const compare = rel(file, 'compare');
  const about = rel(file, 'methodology');
  return `<header class="topbar wd-global-header" data-wd-shared-shell><div class="wrap"><div class="brand"><a href="${home}">World Discovery</a></div><nav class="nav" aria-label="Primary navigation">${navLink(home,'Home',active==='home')}${navLink(explore,'Explore',active==='explore')}${navLink(data,'Data',active==='data')}${navLink(countries,'Countries',active==='countries')}${navLink(compare,'Compare',active==='compare')}${navLink(about,'About',active==='about')}</nav></div></header>`;
}

function footer(file) {
  const explore = rel(file, 'explore');
  const data = rel(file, 'data');
  const countries = rel(file, 'countries');
  const compare = rel(file, 'compare');
  const about = rel(file, 'methodology');
  const impressum = rel(file, 'impressum');
  const datenschutz = rel(file, 'datenschutz');
  return `<footer class="footer wd-global-footer" data-wd-shared-shell><div class="wrap"><strong>World Discovery</strong> · Official global data with explicit years and sources.<br><a href="${explore}">Explore</a> · <a href="${data}">Data</a> · <a href="${countries}">Countries</a> · <a href="${compare}">Compare</a> · <a href="${about}">Methodology</a><br><a href="${impressum}">Impressum</a> · <a href="${datenschutz}">Datenschutz</a></div></footer>`;
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

async function ensureBranded404() {
  const file = path.join(siteRoot, '404.html');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>Page not found · World Discovery</title>
<meta name="description" content="The requested World Discovery page could not be found. Return to data, countries, comparisons, or the home page.">
<style>body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f7f9fc}a{color:#174ea6}.wrap{max-width:72rem;margin:0 auto;padding:1rem 1.25rem}.topbar{background:#fff;border-bottom:1px solid #dfe5ee}.brand a{font-weight:800;text-decoration:none;color:#172033}.not-found{min-height:55vh;display:grid;place-items:center}.not-found-card{max-width:44rem;background:#fff;border:1px solid #dfe5ee;border-radius:1rem;padding:clamp(1.5rem,4vw,3rem);box-shadow:0 .5rem 2rem rgba(23,32,51,.06)}.eyebrow{font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:.8rem;color:#5b6472}.not-found h1{font-size:clamp(2rem,6vw,3.6rem);line-height:1.05;margin:.5rem 0 1rem}.not-found p{font-size:1.05rem;line-height:1.7}.recovery-links{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem}.recovery-links a{display:inline-flex;align-items:center;min-height:44px;padding:.65rem .9rem;border:1px solid #c9d2df;border-radius:.65rem;background:#fff;text-decoration:none;font-weight:700}.footer{background:#fff;border-top:1px solid #dfe5ee}</style>
</head>
<body>
<main class="wrap not-found" id="main"><section class="not-found-card" aria-labelledby="not-found-title"><div class="eyebrow">404 · Page not found</div><h1 id="not-found-title">This page isn’t here.</h1><p>The address may be outdated or mistyped. Continue with the current World Discovery data catalog, country profiles, or comparison tools.</p><nav class="recovery-links" aria-label="404 recovery links"><a href="/">Home</a><a href="/data/">Data catalog</a><a href="/countries/">Countries</a><a href="/compare/">Compare</a></nav></section></main>
</body>
</html>`;
  await writeFile(file, html, 'utf8');
}

await ensureBranded404();
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