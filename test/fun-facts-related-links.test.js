import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const manifestUrl = new URL('../scripts/fun-facts-manifest.json', import.meta.url);
const locales = [
  { path: '', heading: 'More checked Fun Facts' },
  { path: 'de/', heading: 'Weitere geprüfte Fun Facts' },
  { path: 'es/', heading: 'Más datos curiosos verificados' },
  { path: 'fr/', heading: 'Autres faits insolites vérifiés' },
  { path: 'zh-hans/', heading: '更多已核实的趣味事实' }
];

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('Fun Fact detail pages cross-link to other localized facts without self-links', async () => {
  await import(`../scripts/build-fun-facts.mjs?related=${Date.now()}`);
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const facts = [...manifest.facts].sort((a,b)=>b.date.localeCompare(a.date));
  assert.ok(facts.length >= 3, 'Related links require at least three curated facts');

  for (const locale of locales) {
    const prefix = locale.path ? `/${locale.path.replace(/\/$/, '')}` : '';
    for (const fact of facts) {
      const detail = await readFile(new URL(`${locale.path}fun-facts/${fact.slug}/index.html`, siteRoot), 'utf8');
      assert.match(detail, new RegExp(escapeRegExp(locale.heading)));

      const expected = facts.filter(candidate => candidate.slug !== fact.slug).slice(0, 2);
      for (const candidate of expected) {
        const href = `${prefix}/fun-facts/${candidate.slug}/`;
        assert.match(detail, new RegExp(`href="${escapeRegExp(href)}"`));
      }

      const selfHref = `${prefix}/fun-facts/${fact.slug}/`;
      assert.doesNotMatch(detail, new RegExp(`href="${escapeRegExp(selfHref)}"`));
    }
  }
});
