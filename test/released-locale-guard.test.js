import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

const runNode = (script, cwd) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [script], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.on('error', reject);
  child.on('close', (code) => code === 0
    ? resolve({ stdout, stderr })
    : reject(new Error(`guard exited ${code}\n${stdout}\n${stderr}`)));
});

test('full-site-ready locale keeps reciprocal hreflang, sitemap entry and indexability', async () => {
  const root = await mkdtemp(join(tmpdir(), 'wd-released-locale-'));
  try {
    await mkdir(join(root, 'scripts'), { recursive: true });
    await mkdir(join(root, 'site', 'i18n'), { recursive: true });
    await mkdir(join(root, 'site', 'data', 'wdi'), { recursive: true });
    await mkdir(join(root, 'site', 'de'), { recursive: true });
    await copyFile(join(repoRoot, 'scripts', 'guard-incomplete-locales.mjs'), join(root, 'scripts', 'guard-incomplete-locales.mjs'));

    const config = {
      defaultLocale: 'en',
      locales: {
        en: { path: '', htmlLang: 'en', nativeName: 'English', indicatorNames: {} },
        de: {
          path: 'de',
          htmlLang: 'de',
          nativeName: 'Deutsch',
          fullSiteReady: true,
          indicatorNames: { population: 'Bevölkerung insgesamt' }
        }
      }
    };
    await writeFile(join(root, 'site', 'i18n', 'locales.json'), JSON.stringify(config));
    await writeFile(join(root, 'site', 'data', 'wdi', 'index.json'), JSON.stringify({ indicators: [{ slug: 'population' }] }));

    const english = '<!doctype html><html lang="en"><head><link rel="canonical" href="https://worlddiscoverydata.com/"><link rel="alternate" hreflang="en" href="https://worlddiscoverydata.com/"><link rel="alternate" hreflang="de" href="https://worlddiscoverydata.com/de/"></head><body><header><a href="/de/">Deutsch</a></header></body></html>';
    const german = '<!doctype html><html lang="de"><head><link rel="canonical" href="https://worlddiscoverydata.com/de/"><link rel="alternate" hreflang="en" href="https://worlddiscoverydata.com/"><link rel="alternate" hreflang="de" href="https://worlddiscoverydata.com/de/"></head><body><header><a href="/">English</a></header></body></html>';
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>https://worlddiscoverydata.com/</loc></url><url><loc>https://worlddiscoverydata.com/de/</loc></url></urlset>\n';
    await writeFile(join(root, 'site', 'index.html'), english);
    await writeFile(join(root, 'site', 'de', 'index.html'), german);
    await writeFile(join(root, 'site', 'sitemap.xml'), sitemap);

    const { stdout } = await runNode(join(root, 'scripts', 'guard-incomplete-locales.mjs'), root);
    const [afterEnglish, afterGerman, afterSitemap] = await Promise.all([
      readFile(join(root, 'site', 'index.html'), 'utf8'),
      readFile(join(root, 'site', 'de', 'index.html'), 'utf8'),
      readFile(join(root, 'site', 'sitemap.xml'), 'utf8')
    ]);

    assert.match(stdout, /Guarded 0 incomplete locales/);
    assert.equal(afterEnglish, english, 'released locale must not have its hreflang or language-switch label rewritten');
    assert.equal(afterGerman, german, 'released localized page must remain indexable and free of preview notices');
    assert.match(afterEnglish, /hreflang="de" href="https:\/\/worlddiscoverydata\.com\/de\/"/);
    assert.match(afterGerman, /hreflang="en" href="https:\/\/worlddiscoverydata\.com\/"/);
    assert.doesNotMatch(afterGerman, /noindex,follow|data-locale-preview/);
    assert.match(afterSitemap, /<loc>https:\/\/worlddiscoverydata\.com\/de\/<\/loc>/);
    assert.doesNotMatch(afterEnglish, /Deutsch · Vorschau/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
