import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://worlddiscoverydata.com';
const widths = [360, 390, 430];
const regions = ['eas', 'ecs', 'lcn', 'mea', 'nac', 'sas', 'ssf'];

for (const width of widths) {
  for (const slug of regions) {
    test(`${width}px region ${slug} remains a usable same-year comparison`, async ({ page }) => {
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', (error) => pageErrors.push(String(error)));
      await page.setViewportSize({ width, height: 900 });
      const url = `${BASE}/indicators/internet-use/region/${slug}/`;
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      await expect(page.locator('nav').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Regional picture/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /How to use this comparison/i })).toBeVisible();
      await expect(page.locator('a[href="./data.json"]')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
}
