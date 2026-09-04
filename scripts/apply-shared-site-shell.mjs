import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const SKIP_PREFIXES = ['assets/'];
const SKIP_TARGET_ID = 'wd-main-content';
const LOCALE_PREFIXES = new Set(['de', 'es', 'fr', 'zh-hans']);
const LOCALIZED_SECTIONS = new Set(['', 'data', 'countries', 'compare']);

const SHELL = {
  en: {
    skip: 'Skip to main content', navLabel: 'Primary navigation', home: 'Home', explore: 'Explore', data: 'Data', countries: 'Countries', compare: 'Compare', about: 'About',
    footer: 'Official global data with explicit years and sources.', methodology: 'Methodology', impressum: 'Impressum', privacy: 'Datenschutz', englishSuffix: ''
  },
  de: {
    skip: 'Zum Hauptinhalt springen', navLabel: 'Hauptnavigation', home: 'Startseite', explore: 'Entdecken', data: 'Daten', countries: 'Länder', compare: 'Vergleichen', about: 'Über World Discovery',
    footer: 'Offizielle globale Daten mit klaren Jahren und Quellen.', methodology: 'Methodik', impressum: 'Impressum', privacy: 'Datenschutz', englishSuffix: ' · Auf Englisch öffnen'
  },
  es: {
    skip: 'Saltar al contenido principal', navLabel: 'Navegación principal', home: 'Inicio', explore: 'Explorar', data: 'Datos', countries: 'Países', compare: 'Comparar', about: 'Acerca de World Discovery',
    footer: 'Datos globales oficiales con años y fuentes explícitos.', methodology: 'Metodología', impressum: 'Aviso legal', privacy: 'Privacidad', englishSuffix: ' · Abrir en inglés'
  },
  fr: {
    skip: 'Aller au contenu principal', navLabel: 'Navigation principale', home: 'Accueil', explore: 'Explorer', data: 'Données', countries: 'Pays', compare: 'Comparer', about: 'À propos de World Discovery',
    footer: 'Données mondiales officielles avec années et sources explicites.', methodology: 'Méthodologie', impressum: 'Mentions légales', privacy: 'Confidentialité', englishSuffix: ' · Ouvrir en anglais'
  },
  'zh-hans': {
    skip: '跳到主要内容', navLabel: '主导航', home: '首页', explore: '探索', data: '数据', countries: '国家', compare: '比较', about: '关于 World Discovery',
    footer: '官方全球数据，明确标注年份和来源。', methodology: '方法', impressum: '法律声明', privacy: '隐私', englishSuffix: ' · 用英语打开'
  }
};

function relativePath(file) {
  return path.relative(siteRoot, file).replaceAll(path.sep, '/');
}

function localeFor(file) {
  const first = relativePath(file).split('/')[0].toLowerCase();
  return LOCALE_PREFIXES.has(first) ? first : 'en';
}

function stripLocalePrefix(relative, locale) {
  if (locale === 'en') return relative;
  return relative.startsWith(`${locale}/`) ? relative.slice(locale.length + 1) : relative;
}

const rel = (fromFile, targetDir) => {
  if (path.basename(fromFile) === '404.html') return targetDir ? `/${targetDir.replace(/^\/+|\/+$/g, '')}/` : '/';
  const fromDir = path.dirname(file);
  let out = path.relative(fromDir, path.join(siteRoot, targetDir)).replaceAll(path.sep, '/');
  if (!out) out = '.';
  if (!out.startsWith('.')) out = `./${out}`;
  return out.endsWith('/') ? out : `${out}/`;
};

function targetFor(file, targetDir) {
  const locale = localeFor(file);
  if (locale === 'en') return targetDir;
  if (LOCALIZED_SECTIONS.has(targetDir)) return targetDir ? `${locale}/${targetDir}` : locale;
  return targetDir;
}

function hrefFor(file, targetDir) {
  return rel(file, targetFor(file, targetDir));
}

function isLocalizedTarget(file, targetDir) {
  const locale = localeFor(file);
  return locale === 'en' || LOCALIZED_SECTIONS.has(targetDir);
}

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
  const locale = localeFor(file);
  const p = stripLocalePrefix(relativePath(file), locale);
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

function navLabel(file, targetDir, label) {
  return isLocalizedTarget(file, targetDir) ? label : `${label}${SHELL[localeFor(file)].englishSuffix}`;
}

function header(file, active) {
  const locale = localeFor(file);
  const ui = SHELL[locale];
  const home = hrefFor(file, '');
  const explore = hrefFor(file, 'explore');
  const data = hrefFor(file, 'data');
  const countries = hrefFor(file, 'countries');
  const compare = hrefFor(file, 'compare');
  const about = hrefFor(file, 'methodology');
  return `<a class="wd-skip-link" href="#${SKIP_TARGET_ID}">${ui.skip}</a><header class="topbar wd-global-header" data-wd-shared-shell data-wd-shell-locale="${locale}"><div class="wrap"><div class="brand"><a href="${home}">World Discovery</a></div><nav class="nav" aria-label="${ui.navLabel}">${navLink(home,ui.home,active==='home')}${navLink(explore,navLabel(file,'explore',ui.explore),active==='explore')}${navLink(data,ui.data,active==='data')}${navLink(countries,navLabel(file,'countries',ui.countries),active==='countries')}${navLink(compare,navLabel(file,'compare',ui.compare),active==='compare')}${navLink(about,navLabel(file,'methodology',ui.about),active==='about')}</nav></div></header><span id="${SKIP_TARGET_ID}" class="wd-skip-target" tabindex="-1"></span>`;
}

function footer(file) {
  const locale = localeFor(file);
  const ui = SHELL[locale];
  const explore = hrefFor(file, 'explore');
  const data = hrefFor(file, 'data');
  const countries = hrefFor(file, 'countries');
  const compare = hrefFor(file, 'compare');
  const about = hrefFor(file, 'methodology');
  const impressum = hrefFor(file, 'impressum');
  const datenschutz = hrefFor(file, 'datenschutz');
  return `<footer class="footer wd-global-footer" data-wd-shared-shell data-wd-shell-locale="${locale}"><div class="wrap"><strong>World Discovery</strong> · ${ui.footer}<br>${navLink(explore,navLabel(file,'explore',ui.explore),false)} · ${navLink(data,ui.data,false)} · ${navLink(countries,navLabel(file,'countries',ui.countries),false)} · ${navLink(compare,navLabel(file,'compare',ui.compare),false)} · ${navLink(about,navLabel(file,'methodology',ui.methodology),false)}<br>${navLink(impressum,navLabel(file,'impressum',ui.impressum),false)} · ${navLink(datenschutz,navLabel(file,'datenschutz',ui.privacy),false)}</div></footer>`;
}

function ensureShellCss(html) {
  const css = `<style id="wd-shared-shell-style">.wd-skip-link{position:absolute;left:1rem;top:.75rem;transform:translateY(-200%);padding:.65rem .85rem;border:2px solid #172033;border-radius:.5rem;background:#fff;color:#172033;font-weight:800;text-decoration:none}.wd-skip-link:focus{transform:none;z-index:1000}.wd-skip-target{display:block;position:relative;scroll-margin-top:.5rem}.wd-skip-target:focus{outline:none}.wd-global-header{background:#111827;color:#fff}.wd-global-header .brand a{color:#fff;text-decoration:none}.wd-global-header .nav{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}.wd-global-header .nav a[aria-current=\"page\"]{font-weight:800;text-decoration:underline;text-underline-offset:.3rem}.wd-global-footer{margin-top:2rem}.wd-global-footer .wrap{line-height:1.8}@media(max-width:720px){.wd-global-header .wrap{display:block}.wd-global-header .brand{margin-bottom:.7rem}.wd-global-header .nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem}.wd-global-header .nav a{min-height:42px;display:flex;align-items:center}.wd-global-footer .wrap{font-size:.95rem}}</style>`;
  if (html.includes('id="wd-shared-shell-style"')) return html;
  return html.replace('</head>', `${css}</head>`);
}

function normalize(html, file) {
  if (!/<body\b/i.test(html)) return html;
  const active = sectionFor(file);
  html = html.replace(/<header\b[^>]*class="[^"]*topbar[^"]*"[^>]*>[\s\S]*?<\/header>/i, '');
  html = html.replace(/<footer\b[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i, '');
  html = html.replace(/<a\b[^>]*class="[^"]*wd-skip-link[^"]*"[^>]*>[\s\S]*?<\/a>/i, '');
  html = html.replace(/<span\b[^>]*class="[^"]*wd-skip-target[^"]*"[^>]*><\/span>/i, '');
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
  const relative = relativePath(file);
  if (SKIP_PREFIXES.some((prefix) => relative.startsWith(prefix))) continue;
  const before = await readFile(file, 'utf8');
  const after = normalize(before, file);
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}
console.log(`Applied one locale-aware World Discovery header/footer shell to ${changed}/${files.length} HTML pages.`);
