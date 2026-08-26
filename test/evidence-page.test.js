import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRevisionEvidencePage, evidenceSlug } from '../src/evidence-page.js';

const evidence = {
  entity: { id: 'DEU', name: 'Germany' },
  indicator: { id: 'NY.GDP.MKTP.KD.ZG', name: 'GDP growth', unit: '%' },
  period: '2024', methodologyVersion: 'wdi-v1',
  firstPublished: { vintage: '2025-01-01', value: 2 },
  latestPublished: { vintage: '2026-01-01', value: 1.5 },
  revision: { absolute: -0.5, percentage: -25, direction: 'down', eventCount: 1 },
  provenance: { source: 'World Bank WDI', sourceUrl: 'https://data.worldbank.org/', observationCount: 2, vintages: ['2025-01-01', '2026-01-01'] },
  events: [{ fromVintage: '2025-01-01', toVintage: '2026-01-01', fromValue: 2, toValue: 1.5, absoluteRevision: -0.5, percentageRevision: -25 }]
};

test('creates stable human-readable evidence slug', () => {
  assert.equal(evidenceSlug(evidence), 'germany-gdp-growth-2024');
});

test('renders canonical, provenance-safe structured metadata and transparent revision history', () => {
  const html = renderRevisionEvidencePage(evidence, { baseUrl: 'https://facts.example' });
  assert.match(html, /<link rel="canonical" href="https:\/\/facts\.example\/evidence\/germany-gdp-growth-2024\/">/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":"CreativeWork"/);
  assert.doesNotMatch(html, /"@type":"Dataset"/);
  assert.match(html, /"isBasedOn":"https:\/\/data\.worldbank\.org\/"/);
  assert.match(html, /-25% revision/);
  assert.match(html, /Methodology and provenance/);
  assert.match(html, /World Bank WDI/);
});
