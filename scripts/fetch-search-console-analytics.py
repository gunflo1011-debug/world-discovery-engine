import datetime
import json
import os
from zoneinfo import ZoneInfo

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

TARGET = 'sc-domain:worlddiscoverydata.com'
LA = ZoneInfo('America/Los_Angeles')


def http_error_text(exc):
    response = getattr(exc, 'response', None)
    if response is not None:
        body = (response.text or '')[:2000]
        return f'{exc}; body={body}'
    return str(exc)


def main():
    raw = os.environ.get('GOOGLE_SEARCH_CONSOLE_CREDENTIALS', '')
    if not raw:
        raise SystemExit('Missing GOOGLE_SEARCH_CONSOLE_CREDENTIALS secret')

    info = json.loads(raw)
    credentials = service_account.Credentials.from_service_account_info(
        info,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly'],
    )
    credentials.refresh(Request())
    headers = {
        'Authorization': f'Bearer {credentials.token}',
        'Content-Type': 'application/json',
    }

    encoded = requests.utils.quote(TARGET, safe='')
    sites = requests.get('https://www.googleapis.com/webmasters/v3/sites', headers=headers, timeout=30)
    sites.raise_for_status()
    match = next((s for s in sites.json().get('siteEntry', []) if s.get('siteUrl') == TARGET), None)
    if not match:
        raise SystemExit('Connected, but target property not visible')

    sitemap_status = {'available': False, 'entries': [], 'error': None}
    try:
        response = requests.get(
            f'https://www.googleapis.com/webmasters/v3/sites/{encoded}/sitemaps',
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        entries = []
        for item in response.json().get('sitemap', []):
            entries.append({
                'path': item.get('path'),
                'lastSubmitted': item.get('lastSubmitted'),
                'lastDownloaded': item.get('lastDownloaded'),
                'isPending': item.get('isPending'),
                'isSitemapsIndex': item.get('isSitemapsIndex'),
                'type': item.get('type'),
                'warnings': item.get('warnings'),
                'errors': item.get('errors'),
                'contents': [
                    {
                        'type': c.get('type'),
                        'submitted': c.get('submitted'),
                        'indexed': c.get('indexed'),
                    }
                    for c in (item.get('contents') or [])
                ],
            })
        sitemap_status = {'available': True, 'entries': entries, 'error': None}
    except requests.HTTPError as exc:
        sitemap_status['error'] = http_error_text(exc)

    endpoint = f'https://www.googleapis.com/webmasters/v3/sites/{encoded}/searchAnalytics/query'

    def query(start_date, end_date, dimensions=None, limit=25000, data_state='final'):
        body = {
            'startDate': str(start_date),
            'endDate': str(end_date),
            'rowLimit': limit,
            'dataState': data_state,
        }
        if dimensions:
            body['dimensions'] = dimensions
        response = requests.post(endpoint, headers=headers, json=body, timeout=60)
        try:
            response.raise_for_status()
        except requests.HTTPError as exc:
            exc.response = response
            raise
        return response.json()

    today_utc = datetime.datetime.now(datetime.timezone.utc).date()
    final_end = today_utc - datetime.timedelta(days=2)
    final_start = final_end - datetime.timedelta(days=27)

    aggregate = query(final_start, final_end, [], 1, 'final').get('rows', [])
    agg = aggregate[0] if aggregate else {}

    dimensions = {}
    for dim in ['date', 'query', 'page', 'country', 'device', 'searchAppearance']:
        try:
            dimensions[dim] = query(final_start, final_end, [dim], 25000, 'final').get('rows', [])
        except requests.HTTPError as exc:
            dimensions[dim] = {'unavailable': http_error_text(exc)}

    detailed = query(final_start, final_end, ['date', 'page', 'query'], 25000, 'final').get('rows', [])
    with open('search-console-response.json', 'w', encoding='utf-8') as f:
        json.dump({'rows': detailed}, f)

    def clean_rows(rows, n=10):
        return rows[:n] if isinstance(rows, list) else rows

    now_utc = datetime.datetime.now(datetime.timezone.utc)
    now_la = now_utc.astimezone(LA)
    fresh_end = now_la.date()
    fresh_start = fresh_end - datetime.timedelta(days=2)

    fresh_error = None
    fresh_hourly = []
    fresh_metadata = {}
    try:
        # Google documents hourly_all for queries grouped by the HOUR dimension.
        # Do not combine date+hour: that combination currently returns HTTP 400.
        hourly_payload = query(fresh_start, fresh_end, ['hour'], 25000, 'hourly_all')
        fresh_hourly = hourly_payload.get('rows', [])
        fresh_metadata = hourly_payload.get('metadata', {}) or {}
    except requests.HTTPError as exc:
        fresh_error = http_error_text(exc)

    rolling = []
    cutoff_utc = now_utc - datetime.timedelta(hours=24)
    if fresh_error is None:
        for row in fresh_hourly:
            keys = row.get('keys') or []
            if not keys:
                continue
            try:
                hour = datetime.datetime.fromisoformat(keys[0]).astimezone(datetime.timezone.utc)
            except (TypeError, ValueError):
                continue
            if cutoff_utc <= hour <= now_utc:
                rolling.append(row)
        rolling.sort(key=lambda r: r.get('keys', [''])[0])

    if fresh_error is None:
        fresh_clicks = sum(float(r.get('clicks', 0)) for r in rolling)
        fresh_impressions = sum(float(r.get('impressions', 0)) for r in rolling)
        fresh_ctr = fresh_clicks / fresh_impressions if fresh_impressions else 0
        fresh_position = (
            sum(float(r.get('position', 0)) * float(r.get('impressions', 0)) for r in rolling) / fresh_impressions
            if fresh_impressions else 0
        )
    else:
        fresh_clicks = fresh_impressions = fresh_ctr = fresh_position = None

    calendar_error = None
    calendar_agg = {}
    try:
        rows = query(fresh_start, fresh_end, [], 1, 'all').get('rows', [])
        calendar_agg = rows[0] if rows else {}
    except requests.HTTPError as exc:
        calendar_error = http_error_text(exc)

    fresh_dimensions = {}
    for dim in ['query', 'page', 'country', 'device', 'searchAppearance']:
        try:
            fresh_dimensions[dim] = query(fresh_start, fresh_end, [dim], 25000, 'all').get('rows', [])
        except requests.HTTPError as exc:
            fresh_dimensions[dim] = {'unavailable': http_error_text(exc)}

    summary = {
        'property': TARGET,
        'propertyPermissionLevel': match.get('permissionLevel'),
        'sitemaps': sitemap_status,
        'startDate': str(final_start),
        'endDate': str(final_end),
        'clicks': float(agg.get('clicks', 0)),
        'impressions': float(agg.get('impressions', 0)),
        'ctr': float(agg.get('ctr', 0)),
        'averagePosition': float(agg.get('position', 0)) if agg else 0,
        'rowCounts': {k: len(v) if isinstance(v, list) else None for k, v in dimensions.items()},
        'topQueries': clean_rows(dimensions['query']),
        'topPages': clean_rows(dimensions['page']),
        'countries': clean_rows(dimensions['country']),
        'devices': clean_rows(dimensions['device']),
        'searchAppearance': clean_rows(dimensions['searchAppearance']),
        'daily': clean_rows(dimensions['date'], 40),
        'fresh24h': {
            'generatedAtUtc': now_utc.isoformat(),
            'available': fresh_error is None,
            'dataState': 'hourly_all',
            'timezone': 'America/Los_Angeles',
            'hourlyApiError': fresh_error,
            'metadata': fresh_metadata,
            'returnedHourlyRows': len(fresh_hourly),
            'rollingWindowStartUtc': cutoff_utc.isoformat(),
            'rollingWindowEndUtc': now_utc.isoformat(),
            'rolling24hRows': len(rolling),
            'clicks': fresh_clicks,
            'impressions': fresh_impressions,
            'ctr': fresh_ctr,
            'averagePosition': fresh_position,
            'hourly': rolling,
            'calendarWindowStart': str(fresh_start),
            'calendarWindowEnd': str(fresh_end),
            'calendarWindow': {
                'available': calendar_error is None,
                'dataState': 'all',
                'error': calendar_error,
                'clicks': float(calendar_agg.get('clicks', 0)) if calendar_error is None else None,
                'impressions': float(calendar_agg.get('impressions', 0)) if calendar_error is None else None,
                'ctr': float(calendar_agg.get('ctr', 0)) if calendar_error is None else None,
                'averagePosition': float(calendar_agg.get('position', 0)) if calendar_agg and calendar_error is None else (0 if calendar_error is None else None),
            },
            'topQueriesCalendarWindow': clean_rows(fresh_dimensions['query']),
            'topPagesCalendarWindow': clean_rows(fresh_dimensions['page']),
            'countriesCalendarWindow': clean_rows(fresh_dimensions['country']),
            'devicesCalendarWindow': clean_rows(fresh_dimensions['device']),
            'searchAppearanceCalendarWindow': clean_rows(fresh_dimensions['searchAppearance']),
        },
    }

    with open('search-console-baseline.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)

    print('SEARCH_CONSOLE_BASELINE_BEGIN')
    print(json.dumps(summary, indent=2))
    print('SEARCH_CONSOLE_BASELINE_END')


if __name__ == '__main__':
    main()
