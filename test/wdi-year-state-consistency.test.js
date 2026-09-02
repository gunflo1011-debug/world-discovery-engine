import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const browserUrl = new URL('../site/wdi-year-browser.js', import.meta.url);
const generatorUrl = new URL('../scripts/build-wdi-data-browser.mjs', import.meta.url);

test('year switching updates all user-visible year state', async () => {
  const [browser, generator] = await Promise.all([
    readFile(browserUrl, 'utf8'),
    readFile(generatorUrl, 'utf8')
  ]);

  assert.match(generator, /id=\"quick-insights\"/, 'indicator pages must expose the quick-insights region');
  assert.match(browser, /syncPageYearState\(records, year\)/, 'year rendering must synchronize the rest of the page');
  assert.match(browser, /quickEyebrow\.textContent = `Quick answers · same-year \$\{year\} snapshot`/, 'quick-answer year label must follow selection');
  assert.match(browser, /Every value below comes from the same \$\{year\} snapshot/, 'quick-answer explanatory copy must follow selection');
  assert.match(browser, /heroIntro\.innerHTML = `Compare <strong>\$\{records\.length\} countries<\/strong> in the selected same-year \$\{year\} snapshot/, 'hero summary must follow selection');
  assert.match(browser, /fillInsightList\(highCard, records\.slice\(0, 5\)\)/, 'highest quick answers must be recalculated');
  assert.match(browser, /fillInsightList\(lowCard, records\.slice\(-5\)\.reverse\(\)\)/, 'lowest quick answers must be recalculated');
});
