import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderRobotsTxt, renderSitemap } from '../src/site-assets.js';

const root = resolve(process.cwd(), 'site');
const baseUrl = process.env.SITE_BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine/';

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? null;
}

async function collectEvidence() {
  const evidenceRoot = resolve(root, 'evidence');
  const entries = await readdir(evidenceRoot, { withFileTypes: true });
  const records = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = resolve(evidenceRoot, entry.name, 'index.html');
    try {
      const html = await readFile(path, 'utf8');
      records.push({
        slug: entry.name,
        title: extract(html, /<h1[^>]*>(.*?)<\/h1>/s)?.replace(/<[^>]+>/g, '') || entry.name,
        description: extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
        demo: /\bDEMO\b/i.test(html),
        noindex: /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html),
        url: `/evidence/${entry.name}/`
      });
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }

  return records.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function existingStaticRoutes(routes) {
  const kept = [];
  for (const route of routes) {
    const relative = route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
    try {
      await access(resolve(root, relative));
      kept.push(route);
    } catch {
      // Sitemap must not advertise routes that are absent from the built site.
    }
  }
  return kept;
}

export async function buildSite() {
  const evidence = await collectEvidence();
  const staticRoutes = await existingStaticRoutes([
    '/',
    '/explore/',
    '/discoveries/',
    '/methodology/',
    '/sources/',
    '/archive/',
    '/status/',
    '/evidence/',
    '/indicators/',
    '/indicators/real-gdp/',
    '/leaderboard/'
  ]);
  const indexableEvidence = evidence.filter((record) => !record.demo && !record.noindex);
  const pagePaths = [
    ...staticRoutes,
    ...indexableEvidence.map((record) => record.url)
  ];
  const generatedAt = new Date().toISOString();

  await writeFile(resolve(root, 'robots.txt'), renderRobotsTxt({ baseUrl }), 'utf8');
  await writeFile(resolve(root, 'sitemap.xml'), renderSitemap({ baseUrl, pages: pagePaths.map((path) => ({ path })) }), 'utf8');
  await writeFile(resolve(root, 'evidence', 'index.json'), `${JSON.stringify({ schemaVersion: '1.0', generatedAt, evidence: indexableEvidence }, null, 2)}\n`, 'utf8');
  await writeFile(resolve(root, 'build.json'), `${JSON.stringify({ generatedAt, baseUrl, publicRoutes: pagePaths.length, evidencePages: indexableEvidence.length, demoPagesExcluded: evidence.filter((item) => item.demo).length, noindexPagesExcluded: evidence.filter((item) => item.noindex).length }, null, 2)}\n`, 'utf8');

  return { evidence: indexableEvidence, pagePaths, generatedAt };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await buildSite();
  console.log(`Built ${result.pagePaths.length} public routes (${result.evidence.length} indexable evidence pages).`);
}
