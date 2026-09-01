import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const siteRoot = new URL('../site/', import.meta.url);
const base = 'https://worlddiscoverydata.com';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) out.push(...await htmlFiles(url));
    else if (extname(entry.name) === '.html') out.push(url);
  }
  return out;
}

function normalizeHref(value) {
  if (!value || /^(?:mailto:|tel:|javascript:|data:|#)/i.test(value)) return value;

  const hashIndex = value.indexOf('#');
  const hash = hashIndex >= 0 ? value.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  if (path !== 'index.html' && !path.endsWith('/index.html')) return value;

  const normalized = path === 'index.html'
    ? './'
    : path.slice(0, -'index.html'.length);

  return `${normalized}${query}${hash}`;
}

let changedFiles = 0;
let changedLinks = 0;
for (const file of await htmlFiles(siteRoot)) {
  let html = await readFile(file, 'utf8');
  const before = html;
  html = html.replace(/href=(['"])([^'"<>]+)\1/gi, (match, quote, href) => {
    const normalized = normalizeHref(href);
    if (normalized === href) return match;
    changedLinks += 1;
    return `href=${quote}${normalized}${quote}`;
  });
  if (html !== before) {
    await writeFile(file, html, 'utf8');
    changedFiles += 1;
  }
}

const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const verified = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED');
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const sitemap = await readFile(sitemapUrl, 'utf8');
const missing = verified
  .map((item) => `${base}/data/${item.slug}/`)
  .filter((url) => !sitemap.includes(`<loc>${url}</loc>`));
const indexLocs = [...sitemap.matchAll(/<loc>([^<]*\/index\.html(?:[?#][^<]*)?)<\/loc>/g)].map((match) => match[1]);

if (missing.length || indexLocs.length) {
  const details = [
    missing.length ? `Missing verified indicator URLs: ${missing.join(', ')}` : '',
    indexLocs.length ? `Non-canonical index.html sitemap URLs: ${indexLocs.join(', ')}` : ''
  ].filter(Boolean).join('\n');
  throw new Error(`SEO discovery validation failed.\n${details}`);
}

console.log(`SEO discovery finalized: ${verified.length} verified indicator URLs present; normalized ${changedLinks} index.html links across ${changedFiles} HTML files.`);
