import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { validateSearchConsoleVerification } from "../scripts/validate-search-console-verification.mjs";

const BASE_URL = "https://gunflo1011-debug.github.io/world-discovery-engine/";
const SITE_ROOT = new URL("../site/", import.meta.url);

function canonicalHref(html) {
  const tags = [...html.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi)].map(
    (match) => match[0],
  );
  assert.equal(tags.length, 1, "each sitemap page must have exactly one canonical link");
  const href = tags[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
  assert.ok(href, "canonical link must include href");
  return href;
}

test("Search Console verification files are accepted only when unchanged", () => {
  const filename = "google0123456789abcdef.html";
  const token = `google-site-verification: ${filename}`;

  assert.deepEqual(validateSearchConsoleVerification(filename, token), {
    filename,
    expected: token,
  });
  assert.doesNotThrow(() => validateSearchConsoleVerification(filename, `${token}\n`));
  assert.throws(
    () => validateSearchConsoleVerification("renamed.html", token),
    /unchanged google\*\.html filename/,
  );
  assert.throws(
    () => validateSearchConsoleVerification("../google0123456789abcdef.html", token),
    /unchanged google\*\.html filename/,
  );
  assert.throws(
    () => validateSearchConsoleVerification(filename, "<html>wrapped token</html>"),
    /single unchanged Google token line/,
  );
  assert.throws(
    () =>
      validateSearchConsoleVerification(
        filename,
        "google-site-verification: googleDIFFERENT.html",
      ),
    /single unchanged Google token line/,
  );
});

test("robots, sitemap and canonicals expose one consistent indexable URL set", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("robots.txt", SITE_ROOT), "utf8"),
    readFile(new URL("sitemap.xml", SITE_ROOT), "utf8"),
  ]);

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${BASE_URL}sitemap\\.xml$`, "m"));

  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locations.length > 180, "sitemap must retain the complete public corpus");
  assert.equal(new Set(locations).size, locations.length, "sitemap URLs must be unique");

  for (const location of locations) {
    const url = new URL(location);
    assert.equal(url.origin, new URL(BASE_URL).origin);
    assert.ok(location.startsWith(BASE_URL), `unexpected sitemap prefix: ${location}`);
    assert.equal(url.search, "", `sitemap URL must not contain a query: ${location}`);
    assert.equal(url.hash, "", `sitemap URL must not contain a fragment: ${location}`);

    const relativePath = url.pathname.slice(new URL(BASE_URL).pathname.length);
    const fileUrl = relativePath.endsWith("/")
      ? new URL(`${relativePath}index.html`, SITE_ROOT)
      : new URL(relativePath, SITE_ROOT);

    await access(fileURLToPath(fileUrl));
    const html = await readFile(fileUrl, "utf8");
    assert.equal(canonicalHref(html), location, `canonical mismatch for ${location}`);
  }
});
