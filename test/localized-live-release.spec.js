import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://worlddiscoverydata.com';
const widths = [360, 430];
const locales = [
  { path: 'de', lang: 'de', home: 'Entdecke die Welt durch Daten.', data: 'Globale Indikatoren entdecken', countries: 'Länder- und Territorienprofile', compare: 'Vergleichen' },
  { path: 'es', lang: 'es', home: 'Descubre el mundo a través de los datos.', data: 'Explora indicadores globales', countries: 'países y territorios', compare: 'Comparar' },
  { path: 'fr', lang: 'fr', home: 'Découvrez le monde à travers les données.', data: 'Explorer les indicateurs mondiaux', countries: 'pays et territoires', compare: 'Comparer' },
  { path: 'zh-hans', lang: 'zh-Hans', home: '用数据发现世界。', data: '探索全球指标', countries: '国家和地区', compare: '比较' },
];

const surfaces = [
  { suffix: '/', token: 'home' },
  { suffix: '/data/', token: 'data' },
  { suffix: '/countries/', token: 'countries' },
  { suffix: '/compare/', token: 'compare' },
  { suffix: '/methodology/' },
  { suffix: '/status/' },
  { suffix: '/explore/history.html' },
];

test.describe('localized live release smoke', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const locale of locales) {
    for (const width of widths) {
      for (const surface of surfaces) {
        const route = `/${locale.path}${surface.suffix}`;
        test(`${width}px ${route} stays usable and in-language`, async ({ page }) => {
          const consoleErrors = [];
          const pageErrors = [];
          page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
          page.on('pageerror', error => pageErrors.push(String(error)));

          await page.setViewportSize({ width, height: 900 });
          const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
          expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();
          await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
          await expect(page.locator('nav').first()).toBeVisible();

          const canonical = page.locator('link[rel="canonical"]');
          await expect(canonical).toHaveCount(1);
          expect(await canonical.getAttribute('href')).toContain(`/${locale.path}/`);

          const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          expect(overflow.scrollWidth, `horizontal overflow on ${route}`).toBeLessThanOrEqual(overflow.clientWidth + 1);

          const token = surface.token ? locale[surface.token] : null;
          if (token) await expect(page.locator('body')).toContainText(token);

          const body = await page.locator('body').innerText();
          expect(body).not.toContain('Open in English');
          expect(body).not.toContain('Auf Englisch öffnen');
          expect(body).not.toContain('Abrir en inglés');
          expect(body).not.toContain('Ouvrir en anglais');
          expect(body).not.toContain('用英语打开');
          expect(body).not.toContain('World Discovery Data');
          expect(body).not.toContain('World Discovery Engine');
          expect(pageErrors, `uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
          expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
        });
      }
    }
  }
});
