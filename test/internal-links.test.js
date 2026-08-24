import assert from 'node:assert/strict';
import test from 'node:test';

import { auditInternalLinks } from '../scripts/check-internal-links.mjs';

test('all sitemap pages have valid internal targets, fragments and inbound discovery paths', async () => {
  const result = await auditInternalLinks();
  assert.equal(result.pages, 216);
  assert.ok(result.checkedLinks > 2000);
  assert.equal(result.orphanPages, 0);
});
