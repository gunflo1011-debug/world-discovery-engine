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
