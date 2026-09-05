import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const releasedLocales = {
  de: { path: 'de', htmlLang: 'de' },
  es: { path: 'es', htmlLang: 'es' },
  fr: { path: 'fr', htmlLang: 'fr' },
  'zh-Hans': { path: 'zh-hans', htmlLang: 'zh-Hans' }
};

const representativeRoutes = [
  '',
  'data/',
  'data/population/',
  'data/life-expectancy/',
  'countries/',
  'countries/deu/',
  'compare/',
  'methodology/',
  'sources/',
  'status/',
  'explore/',
  'explore/history.html',
  'impressum/',
  'datenschutz/'
];

const run = (command, args, cwd) => new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, CI: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.on('error', reject);
  child.on('close', (code) => code === 0
    ? resolve({ stdout, stderr })
    : reject(new Error(`${command} ${args.join(' ')} exited ${code}\n${stdout}\n${stderr}`)));
});

const canonicalFor = (path) => `https://worlddiscoverydata.com/${path}`;
const htmlPathFor = (root, path) => join(root, 'site', path, path.endsWith('.html') ? '' : 'index.html');

async function copyBuildFixture(root) {
  for (const directory of ['scripts', 'src', 'site', 'config']) {
    await cp(join(repoRoot, directory), join(root, directory), { recursive: true });
  }
  await cp(join(repoRoot, 'package.json'), join(root, 'package.json'));
}

test('a full build with all supported locales released produces indexable reciprocal SEO surfaces', { timeout: 180_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'wd-released-site-build-'));
  try {
    await copyBuildFixture(root);

    const localePath = join(root, 'site', 'i18n', 'locales.json');
    const config = JSON.parse(await readFile(localePath, 'utf8'));
    for (const locale of Object.keys(releasedLocales)) {
      assert.ok(config.locales[locale], `missing locale config for ${locale}`);
      config.locales[locale].fullSiteReady = true;
    }
    await writeFile(localePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

    const { stdout } = await run('npm', ['run', 'build'], root);
    assert.match(stdout, /Guarded 0 incomplete locales/, 'released build must not guard any supported locale');

    const hydrated = JSON.parse(await readFile(localePath, 'utf8'));
    const catalog = JSON.parse(await readFile(join(root, 'site', 'data', 'wdi', 'index.json'), 'utf8'));
    const indicatorSlugs = (catalog.indicators ?? []).map((item) => item.slug);
    assert.ok(indicatorSlugs.length > 0, 'released build must contain published indicators');

    const sitemap = await readFile(join(root, 'site', 'sitemap.xml'), 'utf8');

    for (const [locale, expected] of Object.entries(releasedLocales)) {
      const translated = indicatorSlugs.filter((slug) => hydrated.locales[locale].indicatorNames?.[slug]);
      assert.equal(translated.length, indicatorSlugs.length, `${locale}: released build must retain complete indicator translations`);

      for (const route of representativeRoutes) {
        const relative = `${expected.path}/${route}`;
        const file = htmlPathFor(root, relative);
        const html = await readFile(file, 'utf8');
        const canonical = canonicalFor(relative);
        const englishCanonical = canonicalFor(route);

        assert.match(html, new RegExp(`<html[^>]+lang="${expected.htmlLang}"`), `${relative}: wrong html lang`);
        assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${relative}: canonical must self-reference released locale`);
        assert.doesNotMatch(html, /noindex,follow|data-locale-preview="true"/, `${relative}: released locale must be indexable and preview-free`);
        assert.ok(html.includes('hreflang="en"'), `${relative}: released locale must retain English reciprocal alternate`);
        assert.ok(html.includes(`hreflang="${expected.htmlLang}"`), `${relative}: released locale must retain its own hreflang alternate`);
        if (sitemap.includes(`<loc>${englishCanonical}</loc>`)) {
          assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${relative}: released equivalent missing from sitemap while English route is indexed`);
        }
      }

      const englishHome = await readFile(join(root, 'site', 'index.html'), 'utf8');
      assert.ok(
        englishHome.includes(`hreflang="${expected.htmlLang}" href="https://worlddiscoverydata.com/${expected.path}/"`),
        `${locale}: English home must advertise released locale reciprocally`
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
