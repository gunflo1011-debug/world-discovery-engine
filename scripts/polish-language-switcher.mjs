import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const localeDefs = [
  { key: 'en', path: '', htmlLang: 'en', nativeName: 'English', short: 'EN', label: 'Language' },
  { key: 'de', path: 'de', htmlLang: 'de', nativeName: 'Deutsch', short: 'DE', label: 'Sprache' },
  { key: 'es', path: 'es', htmlLang: 'es', nativeName: 'Español', short: 'ES', label: 'Idioma' },
  { key: 'fr', path: 'fr', htmlLang: 'fr', nativeName: 'Français', short: 'FR', label: 'Langue' },
  { key: 'zh-hans', path: 'zh-hans', htmlLang: 'zh-Hans', nativeName: '简体中文', short: '中文', label: '语言' }
];
const localePaths = new Set(localeDefs.filter((item) => item.path).map((item) => item.path));

const style = `<style id="wd-language-menu-style">.wd-global-header .wrap{position:relative;padding-right:6.25rem}.wd-language-menu{position:absolute;right:0;top:0;z-index:40;margin:0}.wd-language-menu summary{list-style:none;display:flex;align-items:center;justify-content:center;gap:.38rem;min-width:4.85rem;min-height:44px;padding:.45rem .7rem;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;font:inherit;font-weight:700;cursor:pointer;user-select:none}.wd-language-menu summary::-webkit-details-marker{display:none}.wd-language-menu summary:hover,.wd-language-menu summary:focus-visible{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.5);outline:none}.wd-language-menu[open] summary{background:rgba(255,255,255,.16)}.wd-language-options{position:absolute;right:0;top:calc(100% + .45rem);display:grid;min-width:11rem;padding:.4rem;border:1px solid rgba(15,23,42,.14);border-radius:.8rem;background:#fff;box-shadow:0 14px 34px rgba(15,23,42,.25);color:#172033}.wd-language-options a{display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:44px;padding:.55rem .7rem;border-radius:.55rem;color:#172033;text-decoration:none;white-space:nowrap}.wd-language-options a:hover,.wd-language-options a:focus-visible{background:#eef2f7;outline:none}.wd-language-options a[aria-current="page"]{font-weight:800;background:#e8eef7}.wd-language-options a[aria-current="page"]::after{content:"✓"}.wd-language-icon{font-size:1.05rem;line-height:1}.language-switcher{display:none!important}@media(max-width:720px){.wd-global-header .wrap{padding-right:5.7rem}.wd-language-menu{right:0;top:0}.wd-language-menu summary{min-width:4.4rem;padding:.4rem .55rem}.wd-language-options{min-width:10.5rem}}</style>`;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(file);
  }
  return out;
}

function relativeFile(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function pageLocale(relative) {
  const first = relative.split('/')[0].toLowerCase();
  return localePaths.has(first) ? first : 'en';
}

function logicalRoute(relative, locale) {
  if (locale === 'en') return relative;
  return relative.split('/').slice(1).join('/');
}

function publicUrl(relative) {
  const normalized = relative.replaceAll(path.sep, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'index.html'.length)}`;
  return `/${normalized}`;
}

async function targetFor(route, definition) {
  const relative = definition.path ? `${definition.path}/${route}` : route;
  const candidate = path.join(root, ...relative.split('/'));
  try {
    await access(candidate);
    return publicUrl(relative);
  } catch {
    return definition.path ? `/${definition.path}/` : '/';
  }
}

async function languageMenu(file) {
  const relative = relativeFile(file);
  const current = pageLocale(relative);
  const route = logicalRoute(relative, current);
  const currentDef = localeDefs.find((item) => item.key === current) ?? localeDefs[0];
  const links = [];
  for (const definition of localeDefs) {
    const href = await targetFor(route, definition);
    links.push(`<a data-wd-language-link href="${href}" hreflang="${definition.htmlLang}" lang="${definition.htmlLang}"${definition.key === current ? ' aria-current="page"' : ''}>${definition.nativeName}</a>`);
  }
  return `<details class="wd-language-menu"><summary aria-label="${currentDef.label}" title="${currentDef.label}"><span class="wd-language-icon" aria-hidden="true">🌐</span><span>${currentDef.short}</span></summary><div class="wd-language-options">${links.join('')}</div></details>`;
}

let updated = 0;
for (const file of await walk(root)) {
  if (path.basename(file) === '404.html') continue;
  let html = await readFile(file, 'utf8');
  if (!html.includes('wd-global-header')) continue;

  html = html
    .replace(/<(nav|div|section)\b[^>]*class="[^"]*language-switcher[^"]*"[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<details\b[^>]*class="[^"]*wd-language-menu[^"]*"[^>]*>[\s\S]*?<\/details>/gi, '')
    .replace(/<style\b[^>]*id="wd-language-menu-style"[^>]*>[\s\S]*?<\/style>/gi, '');

  const menu = await languageMenu(file);
  html = html.replace(/(<header\b[^>]*class="[^"]*wd-global-header[^"]*"[^>]*>[\s\S]*?<nav\b[^>]*class="nav"[^>]*>[\s\S]*?<\/nav>)/i, `$1${menu}`);
  if (!html.includes('id="wd-language-menu-style"')) html = html.replace('</head>', `${style}</head>`);
  await writeFile(file, html, 'utf8');
  updated += 1;
}

console.log(`Polished language switcher on ${updated} shared-shell pages.`);