# Google Search Console acceptance

This procedure establishes the first decision-grade acquisition signal without adding analytics cookies or changing the public product experience.

## Property and file handoff

1. Create a **URL-prefix** property for:
   `https://gunflo1011-debug.github.io/world-discovery-engine/`
2. Choose **HTML file** verification.
3. Download the generated `google*.html` file.
4. Do not rename, edit, wrap, reformat, or paste the token into another file.
5. Provide the original file for placement directly in `site/`.

The repository intentionally does not contain a placeholder token. A placeholder cannot prove ownership and would weaken the acceptance contract.

## Repository acceptance

After receiving the file:

1. Place it directly at `site/googleTOKEN.html`.
2. Validate its name, location, and exact content:
   ```sh
   npm run validate:search-console -- site/googleTOKEN.html
   ```
3. Run the focused readiness guard:
   ```sh
   node --test test/search-console-readiness.test.js
   ```
4. Run the normal repository gate and commit the unchanged file.
5. Wait for CI and GitHub Pages to complete for the exact commit SHA.

The validator rejects renamed files, path traversal, HTML wrappers, mismatched tokens, extra lines, and files outside the root of `site/`.

## Live readback and ownership verification

Before clicking Verify in Search Console:

1. Fetch `https://gunflo1011-debug.github.io/world-discovery-engine/googleTOKEN.html`.
2. Require HTTP 200.
3. Require the body to equal exactly:
   `google-site-verification: googleTOKEN.html`
   A single terminal newline is acceptable.
4. Confirm that the deployed commit is the same SHA that passed CI and Pages.
5. Click **Verify** in Search Console.
6. Keep the file deployed; removing it can cause ownership verification to be lost.
7. Submit:
   `https://gunflo1011-debug.github.io/world-discovery-engine/sitemap.xml`

## Measurement baseline

When Search Console begins reporting data, record the property, date range, clicks, impressions, CTR, average position, indexed pages, top queries, and top landing pages. Until Search Console reports them, traffic and revenue remain `UNKNOWN / NOT INSTRUMENTED`; absence of data must not be reported as zero.
