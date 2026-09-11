# Worker 2 — `/compare/null` 404 diagnosis — 2026-09-11

## CEO assignment
Trace whether World Discovery itself deterministically generates `/compare/null` or localized variants. Do not hide arbitrary scanner traffic with blanket redirects.

## Evidence reviewed
- CEO Cloudflare evidence: 110 observed 404 requests across `/compare/null`, `/de/compare/null`, `/es/compare/null`, `/fr/compare/null`, and `/zh-hans/compare/null` in the cited 24h window. Counts are request evidence, not human-visit counts.
- Repository-wide code search for literal `compare/null` returned no match.
- The English country hub linker generates compare links only as `../../compare/?a=${encodeURIComponent(code)}` after rejecting empty country codes.
- Localized country hubs generate compare links only as `../../compare/?a=${encodeURIComponent(hub.code)}`; hubs originate from records that require a truthy `record.code`.
- English compare state uses query parameters and `history.replaceState(null, '', '?' + new URLSearchParams({a:codeA,b:codeB}).toString())`. The JavaScript `null` is the History API state argument, not a URL segment.
- Localized compare pages likewise use the `/LOCALE/compare/` root plus query-string state. No reviewed generator constructs `/compare/<value>` path routing.
- The branded 404 links users back to the valid `/compare/` route and does not synthesize localized versions of the missing path.

## Diagnosis
No deterministic site-side producer of `/compare/null` was reproduced from the current default-branch generators or static 404 surface. The observed localized path cluster is therefore **not sufficient evidence of an application bug**. It may be automated probing, external malformed links, or another source not represented in the current repository; Cloudflare request counts alone cannot distinguish these.

## Decision
**NO CODE FIX / NO REDIRECT.** A blanket redirect from `/compare/null` would mask malformed traffic and violate the CEO instruction to ship only after reproducing a site-side root cause.

## Regression opportunity
If this cluster persists or grows, add observability first: inspect Cloudflare request metadata/referrers/user agents for these exact paths (if available through the existing analytics workflow) and only change application code if a World Discovery referrer or deterministic internal generator is identified.

## Measurement gates
No title/canonical/noindex/sitemap/redirect changes were made. Inflation and Population Growth experiment boundaries remain unchanged. PNG remains on hold pending finalized post-boundary Search Console evidence.
