import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://worlddiscoverydata.com';
const routes = [
  { path: '/index.html' },
  { path: '/indicators/' },
  { path: '/indicators/real-gdp/', gdpScreening: true },
  {
    path: '/indicators/internet-use/',
    currentDataset: { indicatorCode: 'IT.NET.USER.ZS', observationYear: 2024 },
  },
  {
    path: '/evidence/germany-population-revision-2025/',
    evidence: { indicatorCode: 'SP.POP.TOTL', entityCode: 'DEU', referenceYear: 2023 },
  },
  {
    path: '/evidence/united-states-population-revision-2025/',
    evidence: { indicatorCode: 'SP.POP.TOTL', entityCode: 'USA', referenceYear: 2023 },
  },
];
const widths = [360, 390, 430];
const GDP_COUNTRIES = ['DEU','USA','CHN','IND','JPN','GBR','FRA','ITA','BRA','CAN','AUS','ESP','MEX','IDN','KOR'];
const GDP_VINTAGES = ['2025-01-28','2025-07-02'];

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current.trim()); current = '';
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

test.describe('mobile smoke tests', () => {
  test.describe.configure({ mode: 'parallel' });

  widths.forEach(width => {
    routes.forEach(routeConfig => {
      const route = routeConfig.path;
      test(`${width}px ${route} has usable mobile rendering`, async ({ page }, testInfo) => {
        const consoleErrors = [];
        const pageErrors = [];
        page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
        page.on('pageerror', error => pageErrors.push(String(error)));

        try {
          await page.setViewportSize({ width, height: 900 });
          if (routeConfig.currentDataset) {
            await page.addInitScript(() => {
              Object.defineProperty(navigator, 'share', {
                configurable: true,
                value: async (payload) => { window.__worldDiscoverySharedPayload = payload; },
              });
            });
          }
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

          if (routeConfig.gdpScreening) {
            await expect(page.getByText('SCREENING · FAIL CLOSED')).toBeVisible();
            await expect(page.getByText(/No GDP revision values are published/i)).toBeVisible();
            await expect(page.getByText(/15 \/ 15/)).toBeVisible();
            await expect(page.locator('a[href$="status.json"]').first()).toBeVisible();
            await expect(page.locator('a[href$="provenance.html"]').first()).toBeVisible();
            await expect(page.locator('a[href$="evidence.json"]')).toHaveCount(0);
            await expect(page.locator('a[href$="evidence.csv"]')).toHaveCount(0);

            const statusResponse = await page.request.get(`${BASE}/indicators/real-gdp/status.json`);
            expect(statusResponse.ok(), 'GDP status JSON unreachable').toBeTruthy();
            const statusText = await statusResponse.text();
            const status = JSON.parse(statusText);
            expect(status.schemaVersion).toBe('1.7');
            expect(status.indicator?.code).toBe('NY.GDP.MKTP.KD');
            expect(status.indicator?.name).toBe('GDP (constant 2015 US$)');
            expect(status.indicator?.referenceYear).toBe(2023);
            expect(status.screeningStatus).toBe('BLOCKED_METHODOLOGY_COMPARABILITY');
            expect(status.publishableRevisionData).toBe(false);
            expect(status.coverage).toEqual({ requested: 15, requestedCountryCodes: GDP_COUNTRIES, rowsPresentInBothVintages: 15, missing: [] });
            expect(status.methodologyGate?.releaseSpecificBaseAndValuationVerified).toBe(false);
            expect(status.methodologyGate?.releaseEvidenceAttestation?.attestationPresent).toBe(false);
            expect(status.promotionEvidenceContract?.state).toBe('MISSING_REVIEWED_RELEASE_SPECIFIC_ATTESTATION');
            expect(status.promotionEvidenceContract?.mustBindToExactArchiveSha256).toBe(true);
            expect(status.promotionEvidenceContract?.mustUseAuthoritativeReleaseSpecificWorldBankSources).toBe(true);
            expect(status.promotionEvidenceContract?.requiredBaseYear).toBe(2015);
            expect(status.promotionEvidenceContract?.requiredUnit).toBe('constant 2015 US$');
            expect(status.provenance?.releases?.map(r => r.vintage)).toEqual(GDP_VINTAGES);
            for (const release of status.provenance.releases) {
              expect(release.url).toMatch(/^https:\/\/databank\.worldbank\.org\/data\/download\/Archive\/WDI_excel_2025_/);
              expect(release.archiveSha256).toMatch(/^[0-9a-f]{64}$/);
              expect(release.archiveBytes).toBeGreaterThan(1_000_000);
              expect(release.member).toMatch(/\.xlsx$/i);
              expect(release.indicatorNameInArchive).toBe('GDP (constant 2015 US$)');
            }
            for (const forbidden of ['"rows"','"absoluteRevision"','"relativeRevision"','comparableRows']) {
              expect(statusText.includes(forbidden), `GDP public status leaked ${forbidden}`).toBeFalsy();
            }

            const provenanceResponse = await page.request.get(`${BASE}/indicators/real-gdp/provenance.html`);
            expect(provenanceResponse.ok(), 'GDP provenance page unreachable').toBeTruthy();
            const provenanceHtml = await provenanceResponse.text();
            expect(provenanceHtml).toContain(status.screenedAtUtc);
            expect(provenanceHtml).toContain('Presence is not a methodology-comparability claim.');
            expect(provenanceHtml).toContain(GDP_COUNTRIES.join(', '));
            for (const release of status.provenance.releases) {
              expect(provenanceHtml).toContain(release.archiveSha256);
              expect(provenanceHtml).toContain(release.url);
            }
          }

          if (routeConfig.currentDataset) {
            const htmlBytes = (await response.body()).byteLength;
            expect(htmlBytes, `${route} HTML exceeded its mobile performance budget`).toBeLessThan(110_000);
            expect(await page.locator('article').count(), `${route} rendered duplicate country cards`).toBeLessThan(10);
            await expect(page.locator('#country-profiles')).toHaveCount(0);

            const jsonLink = page.locator('a[href$="data.json"]');
            const csvLink = page.locator('a[href$="data.csv"]');
            await expect(jsonLink, `visible JSON data link missing on ${route}`).toHaveCount(1);
            await expect(csvLink, `visible CSV data link missing on ${route}`).toHaveCount(1);
            await expect(jsonLink).toBeVisible();
            await expect(csvLink).toBeVisible();

            const trust = page.locator('#comparison-trust');
            await expect(trust).toBeVisible();
            await expect(trust).toHaveAttribute('aria-label', 'Verify this comparison data');
            const sourceProof = trust.locator('a[href="#source-provenance"]');
            const methodologyProof = trust.locator('a[href="../../methodology/"]');
            await expect(sourceProof).toHaveText('Source, license and retrieval');
            await expect(methodologyProof).toHaveText('Validation methodology');
            expect((await page.request.get(new URL(await methodologyProof.getAttribute('href'), `${BASE}${route}`).href)).ok()).toBeTruthy();
            await sourceProof.focus();
            await sourceProof.press('Enter');
            await expect(page.locator('#source-provenance')).toBeFocused();
            expect(new URL(page.url()).hash).toBe('#source-provenance');

            const jsonHref = await jsonLink.getAttribute('href');
            const csvHref = await csvLink.getAttribute('href');
            const jsonResponse = await page.request.get(new URL(jsonHref, `${BASE}${route}`).href);
            const csvResponse = await page.request.get(new URL(csvHref, `${BASE}${route}`).href);
            expect(jsonResponse.ok(), `JSON data unreachable from ${route}`).toBeTruthy();
            expect(csvResponse.ok(), `CSV data unreachable from ${route}`).toBeTruthy();

            const payload = await jsonResponse.json();
            expect(payload.status, `JSON status mismatch for ${route}`).toBe('CURRENT_VERIFIED');
            expect(payload.indicator?.code, `JSON indicator mismatch for ${route}`).toBe(routeConfig.currentDataset.indicatorCode);
            expect(payload.indicator?.unit, `JSON unit mismatch for ${route}`).toBe('% of population');
            expect(payload.observationYear, `JSON observation year mismatch for ${route}`).toBe(routeConfig.currentDataset.observationYear);
            expect(payload.records.length, `JSON coverage is not materially broader for ${route}`).toBeGreaterThan(12);
            expect(payload.records.length, `JSON coverage count mismatch for ${route}`).toBe(payload.coverage?.countries);
            expect(payload.records.every(record => record.year === routeConfig.currentDataset.observationYear), `mixed observation years in ${route}`).toBeTruthy();
            expect(
              await page.locator('a[href^="./country/"]').count(),
              `${route} must link every country from both the region directory and comparison table`
            ).toBe(payload.records.length * 2);

            const tableRows = page.locator('#internet-table tbody tr');
            const visibleRows = () => tableRows.evaluateAll((items) => items.filter((item) => !item.hidden).length);
            const more = page.locator('#country-more');
            await expect(more).toBeVisible();
            await expect(more).toHaveText(`Show all ${payload.records.length} countries`);
            await expect(more).toHaveAttribute('aria-expanded', 'false');
            expect(await visibleRows(), `compact table row count mismatch for ${route}`).toBe(25);

            const tableJump = page.locator('#country-table-jump');
            await expect(tableJump).toBeVisible();
            await tableJump.focus();
            await tableJump.press('Enter');
            await expect(page.locator('#internet-table')).toBeFocused();
            expect(new URL(page.url()).hash).toBe('#internet-table');
            await expect(page.locator('#internet-table thead th[scope="col"]')).toHaveCount(4);
            await expect(page.locator('#internet-table tbody th[scope="row"]')).toHaveCount(payload.records.length);

            await more.click();
            await expect(more).toHaveText('Show top 25 countries');
            await expect(more).toHaveAttribute('aria-expanded', 'true');
            expect(await visibleRows(), `expanded table row count mismatch for ${route}`).toBe(payload.records.length);

            await page.locator('#country-search').fill('Germany');
            await expect(more).toBeHidden();
            expect(await visibleRows(), `filtered table row count mismatch for ${route}`).toBe(1);
            await expect(page.locator('#country-status')).toContainText('Showing 1 country');

            await page.locator('#country-clear').click();
            await expect(more).toBeVisible();
            expect(await visibleRows(), `cleared expanded table row count mismatch for ${route}`).toBe(payload.records.length);
            await more.click();
            expect(await visibleRows(), `re-collapsed table row count mismatch for ${route}`).toBe(25);

            await expect(page.locator('#compare-a option')).toHaveCount(payload.records.length + 1);
            await expect(page.locator('#compare-b option')).toHaveCount(payload.records.length + 1);
            await page.locator('#compare-a').selectOption('DEU');
            await page.locator('#compare-b').selectOption('FRA');
            await expect(page.locator('#compare-result')).toBeVisible();
            await expect(page.locator('#compare-result')).toContainText(/Germany|France/);
            await expect(page.locator('#compare-result')).toContainText('Germany ranks #');
            await expect(page.locator('#compare-result')).toContainText('France ranks #');
            await expect(page.locator('#compare-result')).toContainText('Europe & Central Asia');
            const compareLinks = page.locator('#compare-profile-links');
            await expect(compareLinks).toBeVisible();
            await expect(compareLinks).toHaveAttribute('aria-label', 'Selected country profiles');
            const germanyProfile = compareLinks.locator('a[href="./country/deu/"]');
            const franceProfile = compareLinks.locator('a[href="./country/fra/"]');
            await expect(germanyProfile).toHaveText('Open Germany profile →');
            await expect(franceProfile).toHaveText('Open France profile →');
            expect((await page.request.get(new URL(await germanyProfile.getAttribute('href'), `${BASE}${route}`).href)).ok()).toBeTruthy();
            expect((await page.request.get(new URL(await franceProfile.getAttribute('href'), `${BASE}${route}`).href)).ok()).toBeTruthy();
            expect(new URL(page.url()).searchParams.get('compare')).toBe('DEU,FRA');

            const shareLink = page.locator('#share-view');
            await shareLink.click();
            await expect(page.locator('#share-status')).toHaveText('Comparison shared.');
            const sharedPayload = await page.evaluate(() => window.__worldDiscoverySharedPayload);
            expect(sharedPayload.title).toBe(await page.title());
            expect(new URL(sharedPayload.url).searchParams.get('compare')).toBe('DEU,FRA');

            await page.locator('#region-filter').selectOption('ecs');
            await page.locator('#country-search').fill('no-such-country-zz');
            expect(await visibleRows(), `zero-result filter must hide every row on ${route}`).toBe(0);
            await expect(page.locator('#country-status')).toHaveAttribute('aria-live', 'polite');
            await expect(page.locator('#country-status')).toContainText(`No countries match these filters. Reset both filters to show all ${payload.records.length} countries.`);
            const emptyState = page.locator('#country-empty');
            const emptyReset = page.locator('#country-empty-reset');
            await expect(emptyState).toBeVisible();
            await expect(emptyState).toHaveAttribute('aria-labelledby', 'country-status');
            await expect(emptyReset).toHaveText(`Show all ${payload.records.length} countries`);
            expect(new URL(page.url()).searchParams.get('region')).toBe('ecs');
            expect(new URL(page.url()).searchParams.get('compare')).toBe('DEU,FRA');

            await emptyReset.click();
            await expect(emptyState).toBeHidden();
            await expect(page.locator('#country-search')).toBeFocused();
            await expect(page.locator('#country-search')).toHaveValue('');
            await expect(page.locator('#region-filter')).toHaveValue('');
            expect(await visibleRows(), `one-action reset must restore compact rows on ${route}`).toBe(25);
            expect(new URL(page.url()).searchParams.has('q')).toBeFalsy();
            expect(new URL(page.url()).searchParams.has('region')).toBeFalsy();
            expect(new URL(page.url()).searchParams.get('compare')).toBe('DEU,FRA');
            await expect(compareLinks).toBeVisible();

            const csv = (await csvResponse.text()).trim();
            const lines = csv.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
            expect(lines.length - 1, `CSV record count mismatch for ${route}`).toBe(payload.records.length);
            const header = lines[0];
            const codeIx = header.indexOf('country_code');
            const indicatorIx = header.indexOf('indicator_code');
            const yearIx = header.indexOf('observation_year');
            const valueIx = header.indexOf('value');
            expect(codeIx, `CSV country_code missing for ${route}`).toBeGreaterThanOrEqual(0);
            expect(indicatorIx, `CSV indicator_code missing for ${route}`).toBeGreaterThanOrEqual(0);
            expect(yearIx, `CSV observation_year missing for ${route}`).toBeGreaterThanOrEqual(0);
            expect(valueIx, `CSV value missing for ${route}`).toBeGreaterThanOrEqual(0);
            for (const record of payload.records) {
              const row = lines.slice(1).find(values => values[codeIx] === record.code);
              expect(row, `CSV row missing for ${record.code}`).toBeTruthy();
              expect(row[indicatorIx], `CSV indicator mismatch for ${record.code}`).toBe(routeConfig.currentDataset.indicatorCode);
              expect(Number(row[yearIx]), `CSV year mismatch for ${record.code}`).toBe(record.year);
              expect(Number(row[valueIx]), `CSV value mismatch for ${record.code}`).toBe(record.value);
            }
            await expect(page.getByText(/not a complete global ranking/i)).toBeVisible();
          }

          if (routeConfig.evidence) {
            const jsonLink = page.locator('a[href$="evidence.json"]');
            const csvLink = page.locator('a[href$="evidence.csv"]');
            await expect(jsonLink, `visible JSON evidence link missing on ${route}`).toHaveCount(1);
            await expect(csvLink, `visible CSV evidence link missing on ${route}`).toHaveCount(1);
            await expect(jsonLink).toBeVisible();
            await expect(csvLink).toBeVisible();
            const jsonHref = await jsonLink.getAttribute('href');
            const csvHref = await csvLink.getAttribute('href');
            const jsonResponse = await page.request.get(new URL(jsonHref, `${BASE}${route}`).href);
            const csvResponse = await page.request.get(new URL(csvHref, `${BASE}${route}`).href);
            expect(jsonResponse.ok(), `JSON evidence unreachable from ${route}`).toBeTruthy();
            expect(csvResponse.ok(), `CSV evidence unreachable from ${route}`).toBeTruthy();

            const payload = await jsonResponse.json();
            expect(payload.status, `JSON must be REAL for ${route}`).toBe('REAL');
            expect(payload.indicator?.code, `JSON indicator mismatch for ${route}`).toBe(routeConfig.evidence.indicatorCode);
            expect(payload.entity?.code, `JSON entity mismatch for ${route}`).toBe(routeConfig.evidence.entityCode);
            expect(payload.referenceYear, `JSON reference year mismatch for ${route}`).toBe(routeConfig.evidence.referenceYear);

            const csv = (await csvResponse.text()).trim();
            const lines = csv.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
            expect(lines.length, `CSV has no data rows for ${route}`).toBeGreaterThan(1);
            const header = lines[0];
            const entityIx = header.indexOf('entity_code');
            const indicatorIx = header.indexOf('indicator_code');
            const yearIx = header.indexOf('reference_year');
            expect(entityIx, `CSV entity_code missing for ${route}`).toBeGreaterThanOrEqual(0);
            expect(indicatorIx, `CSV indicator_code missing for ${route}`).toBeGreaterThanOrEqual(0);
            expect(yearIx, `CSV reference_year missing for ${route}`).toBeGreaterThanOrEqual(0);
            const identityMatches = lines.slice(1).some(values =>
              values[entityIx] === routeConfig.evidence.entityCode &&
              values[indicatorIx] === routeConfig.evidence.indicatorCode &&
              String(values[yearIx]) === String(routeConfig.evidence.referenceYear));
            expect(identityMatches, `CSV semantic identity mismatch for ${route}`).toBeTruthy();
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
    });
  });
});
