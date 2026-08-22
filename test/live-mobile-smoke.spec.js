import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine';
const routes = ['/index.html', '/evidence/germany-population-revision-2025/'];
const widths = [360, 390, 430];

for (const width of widths) {
  for (const route of routes) {
    test(`${width}px ${route} has usable mobile rendering`, async ({ page }, testInfo) => {
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', error => pageErrors.push(String(error)));

      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth, `horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const nav = page.locator('nav').first();
      if (await nav.count()) {
        await expect(nav).toBeVisible();
        const box = await nav.boundingBox();
        expect(box?.width || 0, 'navigation should have visible width').toBeGreaterThan(40);
      }

      expect(pageErrors, `uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
      expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([]);

      await page.screenshot({ path: testInfo.outputPath(`mobile-${width}.png`), fullPage: true });
    });
  }
}
