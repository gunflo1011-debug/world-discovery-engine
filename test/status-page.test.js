import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const SITE_ROOT = new URL("../site/", import.meta.url);

test("public status page matches current published product coverage", async () => {
  const [html, rawInternet, rawGdp] = await Promise.all([
    readFile(new URL("status/index.html", SITE_ROOT), "utf8"),
    readFile(new URL("indicators/internet-use/data.json", SITE_ROOT), "utf8"),
    readFile(new URL("indicators/gdp-per-capita/data.json", SITE_ROOT), "utf8"),
  ]);
  const internet = JSON.parse(rawInternet);
  const gdp = JSON.parse(rawGdp);
  const internetCountryCount = internet.records.length;
  const regions = new Set(internet.records.map((record) => record.region?.code));

  assert.equal(internet.coverage.type, "official_same_year_snapshot");
  assert.equal(internet.observationYear, 2024);
  assert.equal(gdp.coverage.type, "official_same_year_snapshot");
  assert.equal(gdp.observationYear, 2024);
  assert.ok(!regions.has(undefined), "every status-counted internet record must have a region");

  assert.match(html, new RegExp(`\\b${internetCountryCount}\\b`));
  assert.match(html, new RegExp(`\\b${gdp.records.length}\\b`));
  assert.match(html, /Seven official regions/i);
  assert.match(html, /Three verified data products are published/i);
  assert.match(html, /Search Console connection[\s\S]*PASS/i);
  assert.match(html, /Organic clicks are currently[\s\S]*<strong>0<\/strong>/i);
  assert.doesNotMatch(html, /PENDING EXTERNAL VERIFICATION/i);
  assert.doesNotMatch(html, /Search impressions[\s\S]*not yet instrumented/i);
});
