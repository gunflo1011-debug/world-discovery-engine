import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const SITE_ROOT = new URL("../site/", import.meta.url);

test("public status page matches the accepted internet-use coverage", async () => {
  const [html, rawData] = await Promise.all([
    readFile(new URL("status/index.html", SITE_ROOT), "utf8"),
    readFile(new URL("indicators/internet-use/data.json", SITE_ROOT), "utf8"),
  ]);
  const data = JSON.parse(rawData);
  const countryCount = data.records.length;
  const regions = new Set(data.records.map((record) => record.region?.code));

  assert.equal(data.coverage.type, "official_same_year_snapshot");
  assert.equal(data.observationYear, 2024);
  assert.ok(countryCount > 12, "status must describe the expanded official snapshot");
  assert.ok(!regions.has(undefined), "every status-counted record must have a region");

  assert.match(html, new RegExp(`\\b${countryCount} countries\\b`, "i"));
  assert.match(html, new RegExp(`\\b${regions.size} official regions\\b`, "i"));
  assert.match(html, /Search impressions[\s\S]*not yet instrumented/i);
  assert.doesNotMatch(html, /expand from one manually curated country\/indicator pair/i);
});
