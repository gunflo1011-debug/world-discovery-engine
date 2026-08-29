import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://worlddiscoverydata.com';
const widths = [360, 390, 430];
const sentinel = {
  path: '/indicators/internet-use/country/deu/',
  code: 'DEU',
  country: 'Germany',
  indicator: 'IT.NET.USER.ZS',
};

function releaseUrl(path) {
  const url = new URL(path, BASE);
  url.searchParams.set('release', process.env.GITHUB_SHA || String(Date.now()));
  return url.href;
}

test.describe('primary internet-use country time-series live smoke', () => {
  widths.forEach((width) => {
    test(`${width}px country series is usable, canonical and source-faithful`, async ({ page }) => {
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
      await expect(page.locator('nav').first()).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${BASE}${sentinel.path}`);
      expect((await page.title()).trim().length).toBeGreaterThan(10);
      expect(((await page.locator('meta[name="description"]').getAttribute('content')) || '').trim().length).toBeGreaterThan(40);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${sentinel.country} internet penetration over time`);
      await expect(page.getByText(/latest verified observation/i).first()).toBeVisible();
      await expect(page.getByRole('heading', { name: /Historical trend/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Year-by-year internet penetration/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Source and methodology/i })).toBeVisible();
      await expect(page.getByText(new RegExp(sentinel.indicator)).first()).toBeVisible();
      await expect(page.getByText(/Missing years are not backfilled, averaged or interpolated/i)).toBeVisible();
      await expect(page.locator('a[href="./data.json"]')).toBeVisible();
      await expect(page.locator('a[href="./data.csv"]')).toBeVisible();

      const payloadResponse = await page.request.get(releaseUrl(`${sentinel.path}data.json`));
      const csvResponse = await page.request.get(releaseUrl(`${sentinel.path}data.csv`));
      expect(payloadResponse.ok()).toBeTruthy();
      expect(csvResponse.ok()).toBeTruthy();
      const payload = await payloadResponse.json();
      const csv = await csvResponse.text();
      const observations = payload.observations;
      const latest = observations.at(-1);

      expect(payload.schemaVersion).toBe('1.1');
      expect(payload.status).toBe('CURRENT_VERIFIED');
      expect(payload.indicator?.code).toBe(sentinel.indicator);
      expect(payload.entity?.code).toBe(sentinel.code);
      expect(payload.entity?.name).toBe(sentinel.country);
      expect(Array.isArray(observations)).toBeTruthy();
      expect(observations.length).toBeGreaterThan(2);
      expect(payload.period?.firstYear).toBe(observations[0].year);
      expect(payload.period?.latestYear).toBe(latest.year);
      expect(payload.observation).toEqual({ year: latest.year, value: latest.value });
      expect(payload.product).toEqual({
        type: 'country-time-series',
        primary: true,
        latestObservationIsSummary: true,
        missingYearsInterpolated: false,
      });
      expect(payload.humanUrl).toBe(`${BASE}${sentinel.path}`);
      expect(csv.trim().split(/\r?\n/)).toHaveLength(observations.length + 1);

      const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      const graph = structured['@graph'] || [];
      const dataset = graph.find((entry) => entry['@type'] === 'Dataset');
      expect(dataset).toBeTruthy();
      expect(dataset.variableMeasured?.propertyID).toBe(sentinel.indicator);
      expect(dataset.about?.identifier).toBe(sentinel.code);
      expect(dataset.temporalCoverage).toBe(`${payload.period.firstYear}/${payload.period.latestYear}`);

      const legacy = await page.request.get(releaseUrl(`${sentinel.path}history/`));
      expect(legacy.ok()).toBeTruthy();
      const legacyHtml = await legacy.text();
      expect(legacyHtml).toMatch(/noindex,follow/i);
      expect(legacyHtml).toContain(`rel="canonical" href="${BASE}${sentinel.path}"`);

      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  });
});

test('AI discovery endpoints remain live and point to canonical country URLs', async ({ request }) => {
  const [manifestResponse, llmsResponse, historyResponse] = await Promise.all([
    request.get(releaseUrl('/ai-index.json')),
    request.get(releaseUrl('/llms.txt')),
    request.get(releaseUrl('/indicators/internet-use/history.json')),
  ]);
  expect(manifestResponse.ok()).toBeTruthy();
  expect(llmsResponse.ok()).toBeTruthy();
  expect(historyResponse.ok()).toBeTruthy();

  const manifest = await manifestResponse.json();
  const llms = await llmsResponse.text();
  const history = await historyResponse.json();
  expect(manifest.schemaVersion).toBe('1.2');
  expect(history.status).toBe('CURRENT_VERIFIED_HISTORY');
  expect(history.indicator?.code).toBe(sentinel.indicator);
  expect(history.records.length).toBeGreaterThan(100);
  expect(llms).toContain('# World Discovery Data');
  expect(llms).toContain(`${BASE}/ai-index.json`);
  expect(llms).toContain(`${BASE}/indicators/internet-use/country/deu/`);
});
