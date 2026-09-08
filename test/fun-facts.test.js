import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const slug = 'horned-lizard-shoots-blood-from-eyes';
const locales = [
  { code: 'en', path: '', lang: 'en', phrase: 'This lizard can shoot blood from its eyes', more: 'More Fun Facts' },
  { code: 'de', path: 'de/', lang: 'de', phrase: 'Diese Echse kann Blut aus ihren Augen schießen', more: 'Mehr Fun Facts' },
  { code: 'es', path: 'es/', lang: 'es', phrase: 'Este lagarto puede lanzar sangre desde los ojos', more: 'Más datos curiosos' },
  { code: 'fr', path: 'fr/', lang: 'fr', phrase: 'Ce lézard peut projeter du sang depuis ses yeux', more: 'Plus de faits insolites' },
  { code: 'zh-Hans', path: 'zh-hans/', lang: 'zh-Hans', phrase: '这种蜥蜴能从眼部喷出血液', more: '查看更多趣味事实' }
];

test('fun facts are generated, localized, indexable and wired to navigation', async () => {
  // Some earlier tests intentionally regenerate the shared sitemap. Re-run the
  // Fun Facts generator here so this contract validates its own final output
  // instead of depending on test ordering.
  await import(`../scripts/build-fun-facts.mjs?test=${Date.now()}`);

  const [explore, navScript, sitemapScript, sitemap] = await Promise.all([
    readFile(new URL('explore/index.html', siteRoot), 'utf8'),
    readFile(new URL('../scripts/add-trends-navigation.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url), 'utf8'),
    readFile(new URL('sitemap.xml', siteRoot), 'utf8')
  ]);

  for (const locale of locales) {
    const [hub, detail] = await Promise.all([
      readFile(new URL(`${locale.path}fun-facts/index.html`, siteRoot), 'utf8'),
      readFile(new URL(`${locale.path}fun-facts/${slug}/index.html`, siteRoot), 'utf8')
    ]);
    const prefix = locale.path ? `/${locale.path.replace(/\/$/, '')}` : '';
    const hubUrl = `https://worlddiscoverydata.com${prefix}/fun-facts/`;
    const detailUrl = `${hubUrl}${slug}/`;

    assert.match(hub, new RegExp(`<html lang="${locale.lang}">`));
    assert.match(hub, new RegExp(`<link rel="canonical" href="${hubUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(hub, new RegExp(locale.phrase));
    assert.match(detail, new RegExp(`<html lang="${locale.lang}">`));
    assert.match(detail, new RegExp(`<link rel="canonical" href="${detailUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(detail, new RegExp(locale.phrase));
    assert.match(detail, new RegExp(locale.more));
    assert.match(detail, /National Park Service/);
    assert.match(detail, /"@type":"Article"/);
    assert.match(detail, new RegExp(`"inLanguage":"${locale.lang}"`));
    assert.match(detail, /hreflang="en"/);
    assert.match(detail, /hreflang="de"/);
    assert.match(detail, /hreflang="es"/);
    assert.match(detail, /hreflang="fr"/);
    assert.match(detail, /hreflang="zh-Hans"/);
    assert.match(detail, /hreflang="x-default"/);
    assert.match(sitemap, new RegExp(`<loc>${detailUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`));
  }

  assert.match(explore, /href="\.\.\/fun-facts\/"/);
  assert.match(navScript, /Fun Facts/);
  assert.match(sitemapScript, /'\/fun-facts\/'/);
});

test('released non-English Fun Facts do not fall back to English body copy', async () => {
  const german = await readFile(new URL(`de/fun-facts/${slug}/index.html`, siteRoot), 'utf8');
  assert.doesNotMatch(german, /Yes, really\.|Why this is so weird|What is actually happening\?|Claims checked against the sources above\.|← More Fun Facts/);
  assert.match(german, /Ja, wirklich\.|Warum das so erstaunlich ist|Was passiert dabei eigentlich\?|Die Aussagen wurden anhand der oben genannten Quellen geprüft\./);
});

test('curated Fun Facts meet the editorial quality baseline', async () => {
  const manifest = JSON.parse(await readFile(new URL('../scripts/fun-facts-manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.timezone, 'Europe/Berlin');
  assert.ok(Array.isArray(manifest.facts) && manifest.facts.length > 0);

  const slugs = new Set();
  const dailyCounts = new Map();
  const translationLocales = ['de', 'es', 'fr', 'zh-Hans'];
  const requiredEnglish = { title: 25, dek: 90, why: 120, context: 120, extra: 100 };
  const requiredTranslation = { title: 8, dek: 35, why: 35, context: 45, extra: 30 };

  for (const fact of manifest.facts) {
    assert.match(fact.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(fact.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!slugs.has(fact.slug), `Duplicate Fun Fact slug: ${fact.slug}`);
    slugs.add(fact.slug);

    const count = (dailyCounts.get(fact.date) || 0) + 1;
    dailyCounts.set(fact.date, count);
    assert.ok(count <= 2, `More than two Fun Facts published on ${fact.date}`);

    for (const [field, minimum] of Object.entries(requiredEnglish)) {
      assert.equal(typeof fact[field], 'string', `${fact.slug}: missing ${field}`);
      assert.ok(fact[field].trim().length >= minimum, `${fact.slug}: ${field} is too thin`);
    }

    const sources = [
      [fact.sourceLabel, fact.sourceUrl],
      [fact.source2Label, fact.source2Url],
      [fact.source3Label, fact.source3Url]
    ].filter(([, url]) => url);
    assert.ok(sources.length >= 2, `${fact.slug}: extraordinary claims need at least two serious sources`);
    for (const [label, url] of sources) {
      assert.ok(label && label.trim().length >= 8, `${fact.slug}: source label is missing or vague`);
      assert.match(url, /^https:\/\//, `${fact.slug}: source must use HTTPS`);
    }

    for (const locale of translationLocales) {
      const translation = fact.translations?.[locale];
      assert.ok(translation, `${fact.slug}: missing ${locale} translation`);
      for (const [field, minimum] of Object.entries(requiredTranslation)) {
        assert.equal(typeof translation[field], 'string', `${fact.slug}: ${locale}.${field} missing`);
        assert.ok(translation[field].trim().length >= minimum, `${fact.slug}: ${locale}.${field} is too thin`);
      }
    }
  }
});
