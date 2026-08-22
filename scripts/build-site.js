import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderRobotsTxt, renderSitemap } from '../src/site-assets.js';

await import('./build-internet-use.mjs');

const root = resolve(process.cwd(), 'site');
const baseUrl = process.env.SITE_BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine/';

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? null;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readEvidencePayload(evidenceRoot, slug) {
  try {
    const raw = await readFile(resolve(evidenceRoot, slug, 'evidence.json'), 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isHttpUrl(value) {
  if (!hasText(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isDiscoveryReadyEvidence(payload, { jsonExists, csvExists }) {
  if (!payload || payload.status !== 'REAL' || !jsonExists || !csvExists) return false;
  const indicator = payload.indicator ?? {};
  const entity = payload.entity ?? {};
  const vintages = payload.vintages ?? {};
  return (
    hasText(indicator.code) &&
    hasText(indicator.name) &&
    hasText(indicator.unit) &&
    hasText(indicator.methodologyVersion) &&
    hasText(entity.code) &&
    hasText(entity.name) &&
    hasText(entity.type) &&
    Number.isInteger(payload.referenceYear) &&
    hasText(vintages?.a?.id) &&
    isHttpUrl(vintages?.a?.sourceUrl) &&
    hasText(vintages?.b?.id) &&
    isHttpUrl(vintages?.b?.sourceUrl) &&
    hasText(payload.methodologyNote) &&
    hasText(payload.license)
  );
}

async function evidenceRecords() {
  const evidenceRoot = resolve(root, 'evidence');
  const entries = await readdir(evidenceRoot, { withFileTypes: true });
  const records = [];
  let discoveryIncompleteExcluded = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const pagePath = resolve(evidenceRoot, slug, 'index.html');
    if (!(await fileExists(pagePath))) continue;
    const html = await readFile(pagePath, 'utf8');
    if (/noindex/i.test(html) || /DEMO FIXTURE|\bDEMO\b/i.test(html)) continue;

    const payload = await readEvidencePayload(evidenceRoot, slug);
    if (payload && payload.status !== 'REAL') continue;

    const jsonExists = await fileExists(resolve(evidenceRoot, slug, 'evidence.json'));
    const csvExists = await fileExists(resolve(evidenceRoot, slug, 'evidence.csv'));
    if (!isDiscoveryReadyEvidence(payload, { jsonExists, csvExists })) {
      discoveryIncompleteExcluded += 1;
      continue;
    }

    const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    const title = extract(html, /<title>([^<]+)<\/title>/i);
    const description = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (!canonical || !title || !description) {
      discoveryIncompleteExcluded += 1;
      continue;
    }

    records.push({
      slug,
      title,
      description,
      url: canonical,
      status: 'REAL',
      discoveryReady: true,
      indicator: payload.indicator,
      entity: payload.entity,
      referenceYear: payload.referenceYear,
      vintages: payload.vintages,
      methodologyNote: payload.methodologyNote,
      license: payload.license,
      distributions: {
        json: `${canonical}evidence.json`,
        csv: `${canonical}evidence.csv`
      }
    });
  }

  return { records, discoveryIncompleteExcluded };
}

async function main() {
  const { records, discoveryIncompleteExcluded } = await evidenceRecords();
  records.sort((a, b) => a.title.localeCompare(b.title));

  const evidenceIndex = {
    schemaVersion: '1.2',
    generatedAt: new Date().toISOString(),
    status: 'REAL_ONLY',
    count: records.length,
    records
  };
  await writeFile(resolve(root, 'evidence', 'index.json'), `${JSON.stringify(evidenceIndex, null, 2)}\n`);

  const staticRoutes = [
    '',
    'evidence/',
    'explore/',
    'indicators/',
    'indicators/real-gdp/',
    'indicators/internet-use/',
    'methodology/',
    'sources/',
    'archive/'
  ];
  const existingRoutes = [];
  for (const route of staticRoutes) {
    const page = resolve(root, route, 'index.html');
    if (await fileExists(page)) existingRoutes.push(route);
  }
  const evidenceRoutes = records.map((record) => `evidence/${record.slug}/`);
  const sitemap = renderSitemap(baseUrl, [...existingRoutes, ...evidenceRoutes]);
  await writeFile(resolve(root, 'sitemap.xml'), sitemap);
  await writeFile(resolve(root, 'robots.txt'), renderRobotsTxt(baseUrl));

  const build = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    evidenceCount: records.length,
    discoveryIncompleteExcluded,
    routes: [...existingRoutes, ...evidenceRoutes]
  };
  await writeFile(resolve(root, 'build.json'), `${JSON.stringify(build, null, 2)}\n`);
  console.log(`Built site discovery assets with ${records.length} REAL evidence records; excluded ${discoveryIncompleteExcluded} incomplete records.`);
}

await main();
