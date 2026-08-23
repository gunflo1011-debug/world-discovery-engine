import { readFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ROOT = resolve(fileURLToPath(new URL("../site/", import.meta.url)));
const FILE_PATTERN = /^google[a-zA-Z0-9_-]+\.html$/;

export function validateSearchConsoleVerification(filename, content) {
  if (filename !== basename(filename) || !FILE_PATTERN.test(filename)) {
    throw new Error("Verification file must use the unchanged google*.html filename.");
  }

  const expected = `google-site-verification: ${filename}`;
  const accepted = content === expected || content === `${expected}\n` || content === `${expected}\r\n`;

  if (!accepted) {
    throw new Error("Verification file content must be the single unchanged Google token line.");
  }

  return { filename, expected };
}

export async function validateSearchConsoleVerificationFile(filePath) {
  const absolutePath = resolve(filePath);
  if (dirname(absolutePath) !== SITE_ROOT) {
    throw new Error("Verification file must be placed directly in site/.");
  }

  const content = await readFile(absolutePath, "utf8");
  return validateSearchConsoleVerification(basename(absolutePath), content);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npm run validate:search-console -- site/googleTOKEN.html");
    process.exitCode = 2;
  } else {
    try {
      const { filename } = await validateSearchConsoleVerificationFile(filePath);
      console.log(`Search Console verification file accepted: ${filename}`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
