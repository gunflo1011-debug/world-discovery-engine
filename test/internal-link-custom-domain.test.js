import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditInternalLinks } from '../scripts/check-internal-links.mjs';

test('internal link audit resolves custom-domain root and nested routes inside siteRoot', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'world-discovery-links-'));
  try {
    await mkdir(join(dir, 'about'), { recursive: true });
    await writeFile(join(dir, 'index.html'), '<a href="./about/">About</a>', 'utf8');
    await writeFile(join(dir, 'about', 'index.html'), '<a href="../">Home</a>', 'utf8');
    await writeFile(join(dir, 'sitemap.xml'), `<?xml version="1.0"?><urlset><url><loc>https://worlddiscoverydata.com/</loc></url><url><loc>https://worlddiscoverydata.com/about/</loc></url></urlset>`, 'utf8');

    const result = await auditInternalLinks({
      siteRoot: pathToFileURL(`${dir}/`),
      baseUrl: 'https://worlddiscoverydata.com/'
    });

    assert.deepEqual(result, { pages: 2, checkedLinks: 2, orphanPages: 0 });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
