import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://gunflo1011-debug.github.io/world-discovery-engine';
const routes = [
  '/index.html',
  '/indicators/',
  '/indicators/real-gdp/',
  '/evidence/germany-population-revision-2025/',
  '/evidence/united-states-population-revision-2025/',
];
const widths = [360, 390, 430];

for (const width of widths) {
  for (const route of routes) {
    test(`${width}px ${route} has usable mobile rendering`, async ({ page }, testInfo) => {
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', error => pageErrors.push(String(error)));

      try {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
        expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();

        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(overflow.scrollWidth, `horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);

        const nav = page.locator('nav').first();
        await expect(nav, `navigation missing on ${route}`).toHaveCount(1);
        await expect(nav, `navigation hidden on ${route}`).toBeVisible();
        const box = await nav.boundingBox();
        expect(box?.width || 0, 'navigation should have visible width').toBeGreaterThan(40);

        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical, `canonical missing on ${route}`).toHaveCount(1);
        const canonicalHref = await canonical.getAttribute('href');
        expect(canonicalHref, `canonical must be absolute on ${route}`).toMatch(/^https:\/\//);

        const title = (await page.title()).trim();
        expect(title.length, `title too short on ${route}`).toBeGreaterThan(10);
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect((description || '').trim().length, `meta description too short on ${route}`).toBeGreaterThan(40);

        if (route.startsWith('/evidence/') && route !== '/evidence/') {
          const jsonLink = page.locator('a[href$="evidence.json"]');
          const csvLink = page.locator('a[href$="evidence.csv"]');
          await expect(jsonLink, `visible JSON evidence link missing on ${route}`).toHaveCount(1);
          await expect(csvLink, `visible CSV evidence link missing on ${route}`).toHaveCount(1);
          await expect(jsonLink).toBeVisible();
          await expect(csvLink).toBeVisible();
          const jsonHref = await jsonLink.getAttribute('href');
          const csvHref = await csvLink.getAttribute('href');
          expect((await page.request.get(new URL(jsonHref, `${BASE}${route}`).href)).ok(), `JSON evidence unreachable from ${route}`).toBeTruthy();
          expect((await page.request.get(new URL(csvHref, `${BASE}${route}`).href)).ok(), `CSV evidence unreachable from ${route}`).toBeTruthy();
        }

        await page.locator('body').click({ position: { x: 1, y: 1 } });
        await page.keyboard.press('Tab');
        const focusState = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body || el === document.documentElement) return null;
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
            boxShadow: style.boxShadow,
          };
        });
        expect(focusState, `Tab did not reach an interactive element on ${route}`).not.toBeNull();
        expect(focusState?.visible, `focused element is not visible on ${route}: ${JSON.stringify(focusState)}`).toBeTruthy();
        const hasOutline = focusState?.outlineStyle !== 'none' && focusState?.outlineWidth !== '0px';
        const hasFocusShadow = Boolean(focusState?.boxShadow && focusState.boxShadow !== 'none');
        expect(hasOutline || hasFocusShadow, `no visible keyboard focus indicator on ${route}: ${JSON.stringify(focusState)}`).toBeTruthy();

        expect(pageErrors, `uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
        expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
      } finally {
        await page.screenshot({ path: testInfo.outputPath(`mobile-${width}-${route.replace(/[^a-z0-9]+/gi, '-')}.png`), fullPage: true }).catch(() => {});
      }
    });
  }
}
