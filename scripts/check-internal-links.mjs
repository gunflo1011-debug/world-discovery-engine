import { access, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const BASE_URL = 'https://gunflo1011-debug.github.io/world-discovery-engine/';
const DEFAULT_SITE_ROOT = new URL('../site/', import.meta.url);

const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&#38;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'");

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1]));
}

function anchorHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => decodeHtml(match[1]));
}

function idsIn(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => decodeHtml(match[1])));
}

function localFileUrl(url, siteRoot, base) {
  const relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
  return relative === '' || relative.endsWith('/')
    ? new URL(`${relative}index.html`, siteRoot)
    : new URL(relative, siteRoot);
}

export async function auditInternalLinks({ siteRoot = DEFAULT_SITE_ROOT, baseUrl = BASE_URL } = {}) {
  const base = new URL(baseUrl);
  const sitemap = await readFile(new URL('sitemap.xml', siteRoot), 'utf8');
  const locations = sitemapLocations(sitemap);
  const sitemapByPath = new Map();

  for (const location of locations) {
    const url = new URL(location);
    sitemapByPath.set(url.pathname, location);
    if (url.pathname.endsWith('/')) sitemapByPath.set(`${url.pathname}index.html`, location);
  }

  const inbound = new Map(locations.map((location) => [location, new Set()]));
  const failures = [];
  let checkedLinks = 0;

  for (const source of locations) {
    const sourceUrl = new URL(source);
    const sourceFile = localFileUrl(sourceUrl, siteRoot, base);
    const html = await readFile(sourceFile, 'utf8');

    for (const href of anchorHrefs(html)) {
      if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
      const target = new URL(href, sourceUrl);
      if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname)) continue;
      checkedLinks += 1;

      const targetFile = localFileUrl(target, siteRoot, base);
      try {
        await access(fileURLToPath(targetFile));
      } catch {
        failures.push(`${source} -> ${href} (missing ${target.pathname})`);
        continue;
      }

      if (target.hash && targetFile.pathname.endsWith('.html')) {
        const targetHtml = await readFile(targetFile, 'utf8');
        const id = decodeURIComponent(target.hash.slice(1));
        if (id && !idsIn(targetHtml).has(id)) failures.push(`${source} -> ${href} (missing fragment #${id})`);
      }

      const canonicalTarget = sitemapByPath.get(target.pathname);
      if (canonicalTarget && canonicalTarget !== source) inbound.get(canonicalTarget).add(source);
    }
  }

  const root = base.href;
  const orphans = locations.filter((location) => location !== root && inbound.get(location).size === 0);
  if (orphans.length) failures.push(...orphans.map((location) => `${location} (no inbound HTML link from another sitemap page)`));

  if (failures.length) {
    const preview = failures.slice(0, 30).map((failure) => `- ${failure}`).join('\n');
    throw new Error(`internal-link audit failed with ${failures.length} issue(s):\n${preview}${failures.length > 30 ? '\n- …' : ''}`);
  }

  return { pages: locations.length, checkedLinks, orphanPages: orphans.length };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = await auditInternalLinks();
  console.log(`Internal-link audit passed: ${result.pages} sitemap pages, ${result.checkedLinks} internal HTML links, ${result.orphanPages} orphan pages.`);
}
