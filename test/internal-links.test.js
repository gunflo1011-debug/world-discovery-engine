import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { auditInternalLinks } from '../scripts/check-internal-links.mjs';

const execFileAsync = promisify(execFile);

test('all sitemap pages have valid internal targets, fragments and inbound discovery paths', async () => {
  // Earlier generator tests intentionally rebuild intermediate site states. Restore
  // the canonical post-build state before auditing: country time series are the
  // primary URLs and duplicate /history/ routes are retired from the sitemap.
  await execFileAsync(process.execPath, ['scripts/promote-internet-use-series.mjs'], {
    cwd: new URL('..', import.meta.url)
  });

  // The production build finishes with the shared site-shell pass. buildSite() tests
  // above intentionally exercise an earlier intermediate state, so restore the same
  // deployable shell here before checking crawlability/orphans. This keeps the link
  // audit independent of test-file ordering and tests the actual production state.
  await execFileAsync(process.execPath, ['scripts/apply-shared-site-shell.mjs'], {
    cwd: new URL('..', import.meta.url)
  });

  const result = await auditInternalLinks();
  const sitemap = await readFile(new URL('../site/sitemap.xml', import.meta.url), 'utf8');
  const sitemapPages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].length;
  assert.ok(sitemapPages > 180, 'sitemap must retain the complete public corpus');
  assert.equal(result.pages, sitemapPages);
  // Link volume is not a quality target. Require broad crawlable connectivity while
  // allowing canonical consolidation to remove duplicate /history/ routes and links.
  assert.ok(result.checkedLinks > sitemapPages * 4, 'public corpus must remain strongly internally connected');
  assert.equal(result.orphanPages, 0);
});
