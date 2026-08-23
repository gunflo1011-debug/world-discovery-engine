import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine';
const widths = [360, 390, 430];
const sentinel = {
  path: '/indicators/internet-use/country/deu/',
  code: 'DEU',
  country: 'Germany',
  indicator: 'IT.NET.USER.ZS',
  year: 2024,
};

test.describe('internet-use country profile live smoke', () => {
  widths.forEach((width) => {
    test(`${width}px generated country profile is usable and source-faithful`, async ({ page }) => {
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', (error) => pageErrors.push(String(error)));

      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${BASE}${sentinel.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      expect(response?.ok()).toBeTruthy();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      expect((await nav.boundingBox())?.width || 0).toBeGreaterThan(40);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', `${BASE}${sentinel.path}`);
      expect((await page.title()).trim().length).toBeGreaterThan(10);
      expect(((await page.locator('meta[name="description"]').getAttribute('content')) || '').trim().length).toBeGreaterThan(40);

      await expect(page.getByRole('heading', { level: 1 })).toContainText(`${sentinel.country} internet use rate`);
      await expect(page.getByText(new RegExp(`${sentinel.indicator}`)).first()).toBeVisible();
      await expect(page.getByText(new RegExp(`${sentinel.year}`)).first()).toBeVisible();
      await expect(page.getByText(/not to a complete worldwide ranking/i)).toBeVisible();
      await expect(page.locator('a[href="../../data.json"]')).toBeVisible();
      await expect(page.locator('a[href="../../data.csv"]')).toBeVisible();
      await expect(page.locator('a[href="../../"]')).toBeVisible();

      const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      expect(structured['@type']).toBe('WebPage');
      expect(structured.mainEntity?.['@type']).toBe('PropertyValue');
      expect(structured.mainEntity?.propertyID).toBe(sentinel.indicator);
      expect(structured.about?.identifier).toBe(sentinel.code);

      await page.locator('body').click({ position: { x: 1, y: 1 } });
      await page.keyboard.press('Tab');
      const focusState = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) return null;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
        };
      });
      expect(focusState).not.toBeNull();
      expect(focusState?.visible).toBeTruthy();
      const hasOutline = focusState?.outlineStyle !== 'none' && focusState?.outlineWidth !== '0px';
      const hasFocusShadow = Boolean(focusState?.boxShadow && focusState.boxShadow !== 'none');
      expect(hasOutline || hasFocusShadow).toBeTruthy();

      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  });
});

test('AI discovery manifest and llms.txt are live and source-faithful', async ({ request }) => {
  const [manifestResponse, llmsResponse, evidenceResponse, internetResponse] = await Promise.all([
    request.get(`${BASE}/ai-index.json`),
    request.get(`${BASE}/llms.txt`),
    request.get(`${BASE}/evidence/index.json`),
    request.get(`${BASE}/indicators/internet-use/data.json`),
  ]);

  expect(manifestResponse.ok(), 'ai-index.json is unreachable').toBeTruthy();
  expect(llmsResponse.ok(), 'llms.txt is unreachable').toBeTruthy();
  expect(evidenceResponse.ok(), 'evidence index is unreachable').toBeTruthy();
  expect(internetResponse.ok(), 'internet-use source dataset is unreachable').toBeTruthy();

  const manifest = await manifestResponse.json();
  const llms = await llmsResponse.text();
  const evidence = await evidenceResponse.json();
  const internet = await internetResponse.json();

  expect(manifest.schemaVersion).toBe('1.0');
  expect(manifest.generatedFrom?.realEvidenceIndex).toBe(`${BASE}/evidence/index.json`);
  expect(manifest.generatedFrom?.internetUseDataset).toBe(`${BASE}/indicators/internet-use/data.json`);
  expect(manifest.trustPolicy?.preferStatuses).toEqual(['REAL', 'CURRENT_VERIFIED']);
  expect(manifest.trustPolicy?.excludeDemoFromPreferredDiscovery).toBe(true);
  expect(manifest.trustPolicy?.realGdpRevisionStatus).toMatch(/blocked/i);

  const manifestEvidence = manifest.collections?.evidence;
  expect(Array.isArray(manifestEvidence)).toBeTruthy();
  expect(manifestEvidence).toHaveLength(evidence.evidence.length);
  for (const record of manifestEvidence) {
    expect(record.status).toBe('REAL');
    const source = evidence.evidence.find((candidate) =>
      candidate.indicator?.code === record.indicator?.code &&
      candidate.entity?.code === record.entity?.code &&
      candidate.referenceYear === record.referenceYear);
    expect(source, `manifest evidence has no source record for ${record.entity?.code}`).toBeTruthy();
    expect(record.humanUrl).toBe(`${BASE}${source.url}`);
    expect(record.jsonUrl).toBe(`${BASE}${source.machineReadable.json}`);
    expect(record.csvUrl).toBe(`${BASE}${source.machineReadable.csv}`);
  }

  const aiInternet = manifest.collections?.internetUse;
  expect(aiInternet?.indicator?.code).toBe('IT.NET.USER.ZS');
  expect(aiInternet?.observationYear).toBe(internet.observationYear);
  expect(aiInternet?.countries).toHaveLength(internet.records.length);
  expect(aiInternet?.humanUrl).toBe(`${BASE}/indicators/internet-use/`);
  expect(aiInternet?.jsonUrl).toBe(`${BASE}/indicators/internet-use/data.json`);
  expect(aiInternet?.csvUrl).toBe(`${BASE}/indicators/internet-use/data.csv`);
  for (const record of internet.records) {
    const country = aiInternet.countries.find((candidate) => candidate.entity?.code === record.code);
    expect(country, `AI discovery country missing ${record.code}`).toBeTruthy();
    expect(country.status).toBe('CURRENT_VERIFIED');
    expect(country.observationYear).toBe(record.year);
    expect(country.value).toBe(record.value);
    expect(country.humanUrl).toBe(`${BASE}/indicators/internet-use/country/${record.code.toLowerCase()}/`);
    expect(country.jsonUrl).toBe(`${BASE}/indicators/internet-use/country/${record.code.toLowerCase()}/data.json`);
    expect(country.csvUrl).toBe(`${BASE}/indicators/internet-use/country/${record.code.toLowerCase()}/data.csv`);
  }

  expect(llms).toContain('# World Discovery Engine');
  expect(llms).toContain(`${BASE}/ai-index.json`);
  expect(llms).toContain(`${BASE}/evidence/index.json`);
  expect(llms).toContain(`${BASE}/indicators/internet-use/data.json`);
  expect(llms).toMatch(/Real-GDP revision publishing is blocked/i);
  for (const country of aiInternet.countries) {
    expect(llms).toContain(country.humanUrl);
    expect(llms).toContain(country.jsonUrl);
    expect(llms).toContain(country.csvUrl);
  }
});

test.describe('refreshed sources discovery page live smoke', () => {
  const machineLinks = [
    '/evidence/index.json',
    '/ai-index.json',
    '/llms.txt',
    '/indicators/internet-use/data.json',
    '/indicators/internet-use/data.csv',
    '/indicators/internet-use/country/index.json',
  ];

  widths.forEach((width) => {
    test(`${width}px sources page is usable and its machine access links resolve`, async ({ page }) => {
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', (error) => pageErrors.push(String(error)));

      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${BASE}/sources/`, { waitUntil: 'networkidle', timeout: 30000 });
      expect(response?.ok(), 'sources page is unreachable').toBeTruthy();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      expect((await nav.boundingBox())?.width || 0).toBeGreaterThan(40);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', `${BASE}/sources/`);
      expect((await page.title()).trim()).toContain('Sources, provenance & machine access');
      expect(((await page.locator('meta[name="description"]').getAttribute('content')) || '').trim().length).toBeGreaterThan(40);

      await expect(page.getByRole('heading', { level: 1 })).toContainText('Sources, provenance & machine access');
      await expect(page.getByText(/verified REAL population-revision evidence is published/i)).toBeVisible();
      await expect(page.getByText(/CURRENT_VERIFIED same-year observations/i)).toBeVisible();
      await expect(page.getByText(/Real-GDP revision publishing remains blocked/i)).toBeVisible();

      const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      expect(structured['@type']).toBe('WebPage');

      for (const target of machineLinks) {
        const link = page.locator(`a[href="..${target}"]`);
        await expect(link, `sources page link missing: ${target}`).toHaveCount(1);
        const targetResponse = await page.request.get(`${BASE}${target}`);
        expect(targetResponse.ok(), `sources machine target unreachable: ${target}`).toBeTruthy();
      }

      await page.locator('body').click({ position: { x: 1, y: 1 } });
      await page.keyboard.press('Tab');
      const focusState = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) return null;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
        };
      });
      expect(focusState).not.toBeNull();
      expect(focusState?.visible).toBeTruthy();
      const hasOutline = focusState?.outlineStyle !== 'none' && focusState?.outlineWidth !== '0px';
      const hasFocusShadow = Boolean(focusState?.boxShadow && focusState.boxShadow !== 'none');
      expect(hasOutline || hasFocusShadow).toBeTruthy();

      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  });
});
