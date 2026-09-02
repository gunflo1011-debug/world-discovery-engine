import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const SITE_ROOT = new URL("../site/", import.meta.url);

test("public status page describes current coverage without internal release telemetry", async () => {
  const html = await readFile(new URL("status/index.html", SITE_ROOT), "utf8");

  assert.match(html, /Current verified coverage/i);
  assert.match(html, /Verified indicators[\s\S]*30/i);
  assert.match(html, /Country directory[\s\S]*217/i);
  assert.match(html, /countries, territories and other geographic entities/i);
  assert.match(html, /Historical explorer[\s\S]*Available/i);
  assert.match(html, /Official source/i);
  assert.match(html, /Observation year stays visible/i);
  assert.match(html, /Missing data stays missing/i);
  assert.match(html, /Data catalog/i);
  assert.match(html, /Country profiles/i);
  assert.match(html, /Country comparison/i);

  assert.doesNotMatch(html, /Three verified data products are published/i);
  assert.doesNotMatch(html, /Search Console/i);
  assert.doesNotMatch(html, /Organic clicks/i);
  assert.doesNotMatch(html, /Readiness gates/i);
  assert.doesNotMatch(html, /growth engine/i);
  assert.doesNotMatch(html, /PENDING EXTERNAL VERIFICATION/i);
});
