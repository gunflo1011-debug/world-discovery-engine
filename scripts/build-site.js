import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderRobotsTxt, renderSitemap } from '../src/site-assets.js';
import { buildInternetUseRegionDirectory } from './build-internet-use-region-directory.mjs';

await import('./build-internet-use.mjs');
await import('./build-internet-use-regions.mjs');

const root = resolve(process.cwd(), 'site');
const baseUrl = process.env.SITE_BASE_URL || 'https://worlddiscoverydata.com/';

function extract(html, pattern) { return html.match(pattern)?.[1]?.trim() ?? null; }
async function fileExists(path) { try { await access(path); return true; } catch { return false; } }
async function readEvidencePayload(evidenceRoot, slug) { try { return JSON.parse(await readFile(resolve(evidenceRoot, slug, 'evidence.json'), 'utf8')); } catch (error) { if (error?.code === 'ENOENT' || error instanceof SyntaxError) return null; throw error; } }
function hasText(value) { return typeof value === 'string' && value.trim().length > 0; }
function isHttpUrl(value) { if (!hasText(value)) return false; try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; } catch { return false; } }

function validateRealEvidence(payload, files) {
  if (!payload || payload.status !== 'REAL') return { ready: false, reasons: ['status_not_real'] };
  const reasons = [];
  const requiredText = [['indicator.code', payload.indicator?.code], ['indicator.name', payload.indicator?.name], ['indicator.unit', payload.indicator?.unit], ['indicator.methodologyVersion', payload.indicator?.methodologyVersion], ['entity.code', payload.entity?.code], ['entity.name', payload.entity?.name], ['entity.entityType', payload.entity?.entityType], ['first.vintage', payload.first?.vintage], ['latest.vintage', payload.latest?.vintage], ['methodologyNote', payload.methodologyNote], ['license', payload.license]];
  for (const [field, value] of requiredText) if (!hasText(value)) reasons.push(`missing_${field}`);
  if (!Number.isInteger(payload.referenceYear)) reasons.push('missing_referenceYear');
  if (!isHttpUrl(payload.first?.sourceUrl)) reasons.push('invalid_first.sourceUrl');
  if (!isHttpUrl(payload.latest?.sourceUrl)) reasons.push('invalid_latest.sourceUrl');
  if (!files.json) reasons.push('missing_evidence.json');
  if (!files.csv) reasons.push('missing_evidence.csv');
  return { ready: reasons.length === 0, reasons };
}

function machineRecord(record) {
  const payload = record.payload;
  const base = { slug: record.slug, title: record.title, description: record.description, demo: record.demo, noindex: record.noindex, discoveryReady: record.discovery.ready, url: record.url, machineReadable: { json: `${record.url}evidence.json`, csv: `${record.url}evidence.csv` } };
  if (!payload || payload.status !== 'REAL' || !record.discovery.ready) return base;
  return { ...base, status: payload.status, indicator: { code: payload.indicator.code, name: payload.indicator.name, unit: payload.indicator.unit, methodologyVersion: payload.indicator.methodologyVersion }, entity: { code: payload.entity.code, name: payload.entity.name, entityType: payload.entity.entityType }, referenceYear: payload.referenceYear, vintages: [payload.first, payload.latest].map((item) => ({ vintage: item.vintage, sourceUrl: item.sourceUrl })), methodologyNote: payload.methodologyNote, license: payload.license };
}

async function collectEvidence() {
  const evidenceRoot = resolve(root, 'evidence');
  const entries = await readdir(evidenceRoot, { withFileTypes: true });
  const records = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = resolve(evidenceRoot, entry.name);
    try {
      const html = await readFile(resolve(directory, 'index.html'), 'utf8');
      const payload = await readEvidencePayload(evidenceRoot, entry.name);
      const files = { json: await fileExists(resolve(directory, 'evidence.json')), csv: await fileExists(resolve(directory, 'evidence.csv')) };
      const discovery = validateRealEvidence(payload, files);
      records.push({ slug: entry.name, title: extract(html, /<h1[^>]*>(.*?)<\/h1>/s)?.replace(/<[^>]+>/g, '') || entry.name, description: extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i), demo: /\bDEMO\b/i.test(html) || (payload?.status && payload.status !== 'REAL'), noindex: /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html), url: `/evidence/${entry.name}/`, payload, files, discovery });
    } catch (error) { if (error?.code !== 'ENOENT') throw error; }
  }
  return records.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function internetUseDiscoveryRoutes() {
  const [rawData, rawRegionIndex] = await Promise.all([readFile(resolve(root, 'indicators', 'internet-use', 'data.json'), 'utf8'), readFile(resolve(root, 'indicators', 'internet-use', 'region', 'index.json'), 'utf8')]);
  const data = JSON.parse(rawData); const regionIndex = JSON.parse(rawRegionIndex);
  if (data?.status !== 'CURRENT_VERIFIED' || data?.coverage?.type !== 'official_same_year_snapshot') throw new Error('sitemap requires the accepted current internet-use snapshot');
  if (!Array.isArray(data.records) || !data.records.every((record) => /^[A-Z]{3}$/.test(record.code))) throw new Error('sitemap requires valid internet-use country codes');
  if (!Array.isArray(regionIndex?.regions) || !regionIndex.regions.every((region) => hasText(region.url))) throw new Error('sitemap requires the generated internet-use region index');
  const routes = [...data.records.map((record) => `/indicators/internet-use/country/${record.code.toLowerCase()}/`), ...regionIndex.regions.map((region) => region.url)];
  if (await fileExists(resolve(root, 'indicators', 'internet-use', 'history.json'))) {
    const history = JSON.parse(await readFile(resolve(root, 'indicators', 'internet-use', 'history.json'), 'utf8'));
    if (history?.status !== 'CURRENT_VERIFIED_HISTORY' || history?.indicator?.code !== data.indicator?.code || !Array.isArray(history.records)) throw new Error('sitemap requires valid internet-use history data');
    const currentCodes = new Set(data.records.map(record => record.code));
    for (const record of history.records) {
      if (!currentCodes.has(record.code) || !Array.isArray(record.observations) || record.observations.length < 2) throw new Error(`invalid internet-use history route ${record.code || 'unknown'}`);
      routes.push(`/indicators/internet-use/country/${record.code.toLowerCase()}/history/`);
    }
  }
  if (new Set(routes).size !== routes.length) throw new Error('duplicate internet-use discovery route');
  return routes;
}

async function existingStaticRoutes(routes) {
  const kept = [];
  for (const route of routes) {
    const relative = route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
    try { await access(resolve(root, relative)); kept.push(route); } catch {}
  }
  return kept;
}

export async function buildSite() {
  await buildInternetUseRegionDirectory();
  const [evidence, internetUseRoutes] = await Promise.all([collectEvidence(), internetUseDiscoveryRoutes()]);
  const staticRoutes = await existingStaticRoutes(['/', '/explore/', '/discoveries/', '/methodology/', '/sources/', '/archive/', '/status/', '/evidence/', '/indicators/', '/categories/economy/', '/indicators/gdp-per-capita/', '/indicators/internet-use/', '/indicators/internet-use/region/', '/indicators/real-gdp/', '/leaderboard/']);
  const indexableEvidence = evidence.filter((record) => !record.demo && !record.noindex && record.discovery.ready);
  const pagePaths = [...staticRoutes, ...indexableEvidence.map((record) => record.url), ...internetUseRoutes];
  const generatedAt = new Date().toISOString();
  const historyCount = internetUseRoutes.filter(path => path.endsWith('/history/')).length;
  await writeFile(resolve(root, 'robots.txt'), renderRobotsTxt({ baseUrl }), 'utf8');
  await writeFile(resolve(root, 'sitemap.xml'), renderSitemap({ baseUrl, pages: pagePaths.map((path) => ({ path })) }), 'utf8');
  await writeFile(resolve(root, 'evidence', 'index.json'), `${JSON.stringify({ schemaVersion: '1.2', generatedAt, evidence: indexableEvidence.map(machineRecord) }, null, 2)}\n`, 'utf8');
  await writeFile(resolve(root, 'build.json'), `${JSON.stringify({ generatedAt, baseUrl, publicRoutes: pagePaths.length, evidencePages: indexableEvidence.length, internetUseHistoryProfiles: historyCount, demoPagesExcluded: evidence.filter((item) => item.demo).length, noindexPagesExcluded: evidence.filter((item) => item.noindex).length, discoveryIncompleteExcluded: evidence.filter((item) => !item.demo && !item.noindex && !item.discovery.ready).length }, null, 2)}\n`, 'utf8');
  return { evidence: indexableEvidence, allEvidence: evidence, pagePaths, generatedAt };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await buildSite();
  console.log(`Built ${result.pagePaths.length} public routes (${result.evidence.length} indexable evidence pages).`);
}
