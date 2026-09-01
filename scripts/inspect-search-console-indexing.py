import argparse
import csv
import json
import os
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

PROPERTY = 'sc-domain:worlddiscoverydata.com'
INSPECTION_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'
DEFAULT_SITEMAP = Path('site/sitemap.xml')
DEFAULT_REQUEST_TIMEOUT = 12.0
CORE_DATA_PREFIX = 'https://worlddiscoverydata.com/data/'


def load_credentials():
    raw = os.environ.get('GOOGLE_SEARCH_CONSOLE_CREDENTIALS', '')
    if not raw:
        raise SystemExit('Missing GOOGLE_SEARCH_CONSOLE_CREDENTIALS secret')

    info = json.loads(raw)
    credentials = service_account.Credentials.from_service_account_info(
        info,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly'],
    )
    credentials.refresh(Request())
    return credentials


def read_sitemap_urls(path: Path):
    if not path.exists():
        raise SystemExit(f'Sitemap not found: {path}')

    root = ET.parse(path).getroot()
    namespace = ''
    if root.tag.startswith('{'):
        namespace = root.tag.split('}', 1)[0] + '}'

    urls = []
    for loc in root.findall(f'.//{namespace}loc'):
        if loc.text and loc.text.strip():
            urls.append(loc.text.strip())
    return urls


def cyclic_slice(items, offset, limit):
    if not items or limit <= 0:
        return []
    limit = min(limit, len(items))
    start = offset % len(items)
    return [items[(start + index) % len(items)] for index in range(limit)]


def select_urls(urls, args):
    if args.contains:
        filtered = [url for url in urls if args.contains in url]
        filtered = filtered[args.offset:]
        if args.limit >= 0:
            filtered = filtered[:args.limit]
        return filtered, 'filtered'

    if args.limit < 0:
        return urls[args.offset:], 'sequential'

    # Scheduled GitHub runs historically landed on large clusters of older
    # Internet-use country URLs. Balance each bounded batch so half of it
    # continuously samples the canonical English /data/ indicator surface.
    # This gives the team direct evidence about newly added indicators while
    # preserving broad sitemap rotation with the other half.
    if os.environ.get('GITHUB_ACTIONS') == 'true' and args.limit >= 2:
        priority = [url for url in urls if url.startswith(CORE_DATA_PREFIX)]
        priority_count = min(args.limit // 2, len(priority))
        priority_urls = cyclic_slice(priority, args.offset, priority_count)

        priority_set = set(priority_urls)
        general_pool = [url for url in urls if url not in priority_set]
        general_count = args.limit - len(priority_urls)
        general_urls = cyclic_slice(general_pool, args.offset, general_count)
        return priority_urls + general_urls, 'balanced-core-data'

    selected = urls[args.offset:]
    if args.limit >= 0:
        selected = selected[:args.limit]
    return selected, 'sequential'


def inspect_url(url, headers, language_code='en-US', timeout=DEFAULT_REQUEST_TIMEOUT):
    body = {
        'inspectionUrl': url,
        'siteUrl': PROPERTY,
        'languageCode': language_code,
    }
    response = requests.post(
        INSPECTION_ENDPOINT,
        headers=headers,
        json=body,
        timeout=timeout,
    )
    response.raise_for_status()
    return response.json()


def normalize_result(url, payload):
    result = payload.get('inspectionResult', {}) or {}
    index = result.get('indexStatusResult', {}) or {}

    return {
        'url': url,
        'inspectionResultLink': result.get('inspectionResultLink'),
        'verdict': index.get('verdict'),
        'coverageState': index.get('coverageState'),
        'indexingState': index.get('indexingState'),
        'robotsTxtState': index.get('robotsTxtState'),
        'pageFetchState': index.get('pageFetchState'),
        'googleCanonical': index.get('googleCanonical'),
        'userCanonical': index.get('userCanonical'),
        'lastCrawlTime': index.get('lastCrawlTime'),
        'crawledAs': index.get('crawledAs'),
        'referringUrls': index.get('referringUrls') or [],
        'sitemap': index.get('sitemap') or [],
    }


def write_csv(path: Path, rows):
    columns = [
        'url',
        'verdict',
        'coverageState',
        'indexingState',
        'robotsTxtState',
        'pageFetchState',
        'lastCrawlTime',
        'crawledAs',
        'googleCanonical',
        'userCanonical',
        'inspectionResultLink',
        'sitemap',
        'referringUrls',
        'error',
    ]

    with path.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        for row in rows:
            out = dict(row)
            out['sitemap'] = ' | '.join(out.get('sitemap') or [])
            out['referringUrls'] = ' | '.join(out.get('referringUrls') or [])
            writer.writerow({key: out.get(key) for key in columns})


def summarize(rows):
    summary = {
        'total': len(rows),
        'successfulInspections': 0,
        'errors': 0,
        'verdicts': {},
        'coverageStates': {},
        'indexingStates': {},
        'pageFetchStates': {},
    }

    for row in rows:
        if row.get('error'):
            summary['errors'] += 1
            continue
        summary['successfulInspections'] += 1
        for field, target in [
            ('verdict', 'verdicts'),
            ('coverageState', 'coverageStates'),
            ('indexingState', 'indexingStates'),
            ('pageFetchState', 'pageFetchStates'),
        ]:
            value = row.get(field) or 'UNKNOWN'
            summary[target][value] = summary[target].get(value, 0) + 1
    return summary


def main():
    parser = argparse.ArgumentParser(
        description='Inspect sitemap URLs with the Google Search Console URL Inspection API.'
    )
    parser.add_argument('--sitemap', default=str(DEFAULT_SITEMAP))
    parser.add_argument('--limit', type=int, default=100)
    parser.add_argument('--contains', default=None, help='Only inspect URLs containing this text.')
    parser.add_argument('--offset', type=int, default=0)
    parser.add_argument('--delay', type=float, default=0.15, help='Delay between API requests in seconds.')
    parser.add_argument('--timeout', type=float, default=DEFAULT_REQUEST_TIMEOUT, help='Per-request timeout in seconds.')
    parser.add_argument('--language', default='en-US')
    parser.add_argument('--json-output', default='search-console-indexing.json')
    parser.add_argument('--csv-output', default='search-console-indexing.csv')
    args = parser.parse_args()

    if args.timeout <= 0:
        raise SystemExit('--timeout must be greater than zero')

    credentials = load_credentials()
    headers = {
        'Authorization': f'Bearer {credentials.token}',
        'Content-Type': 'application/json',
    }

    urls = read_sitemap_urls(Path(args.sitemap))
    urls, selection_mode = select_urls(urls, args)

    if not urls:
        raise SystemExit('No sitemap URLs selected for inspection')

    rows = []
    for index, url in enumerate(urls, start=1):
        print(f'[{index}/{len(urls)}] Inspecting {url}', file=sys.stderr)
        try:
            payload = inspect_url(url, headers, args.language, args.timeout)
            row = normalize_result(url, payload)
            row['error'] = None
        except requests.HTTPError as exc:
            response = getattr(exc, 'response', None)
            error_text = str(exc)
            if response is not None and response.text:
                error_text = f'{error_text}; body={response.text[:1500]}'
            row = {'url': url, 'error': error_text}
        except requests.RequestException as exc:
            row = {'url': url, 'error': str(exc)}
        rows.append(row)
        if args.delay and index < len(urls):
            time.sleep(args.delay)

    output = {
        'property': PROPERTY,
        'sitemap': args.sitemap,
        'contains': args.contains,
        'offset': args.offset,
        'limit': args.limit,
        'selectionMode': selection_mode,
        'requestTimeoutSeconds': args.timeout,
        'summary': summarize(rows),
        'rows': rows,
    }

    json_path = Path(args.json_output)
    csv_path = Path(args.csv_output)
    json_path.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding='utf-8')
    write_csv(csv_path, rows)

    print(json.dumps(output['summary'], indent=2, ensure_ascii=False))
    print(f'Wrote {json_path} and {csv_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
