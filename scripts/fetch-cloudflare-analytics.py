import datetime
import json
import os
import urllib.error
import urllib.request


def main():
    token = os.environ.get('CLOUDFLARE_ANALYTICS_TOKEN', '').strip()
    if not token:
        raise SystemExit('Missing CLOUDFLARE_ANALYTICS_TOKEN secret')

    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
    start = now - datetime.timedelta(hours=24)
    start_s = start.isoformat().replace('+00:00', 'Z')
    end_s = now.isoformat().replace('+00:00', 'Z')

    ai_agents = [
        'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User',
        'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Bytespider',
        'meta-externalagent', 'Applebot-Extended',
    ]
    ai_or = ','.join('{userAgent_like:"%%%s%%"}' % agent for agent in ai_agents)

    query = '''
    query {
      viewer {
        zones {
          zoneTag
          total: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball"}
            limit: 1
          ) { count sum { edgeResponseBytes } }
          topPaths: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball"}
            limit: 20 orderBy: [count_DESC]
          ) { count dimensions { clientRequestPath } }
          countries: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball"}
            limit: 20 orderBy: [count_DESC]
          ) { count dimensions { clientCountryName } }
          statuses: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball"}
            limit: 30 orderBy: [count_DESC]
          ) { count dimensions { edgeResponseStatus } }
          notFoundPaths: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball", edgeResponseStatus: 404}
            limit: 50 orderBy: [count_DESC]
          ) { count dimensions { clientRequestPath } }
          serverErrorPaths: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball", edgeResponseStatus_geq: 500}
            limit: 50 orderBy: [count_DESC]
          ) { count dimensions { edgeResponseStatus clientRequestPath } }
          aiCrawlerRequests: httpRequestsAdaptiveGroups(
            filter: {datetime_geq: "%s", datetime_leq: "%s", requestSource: "eyeball", OR: [%s]}
            limit: 100 orderBy: [count_DESC]
          ) { count dimensions { userAgent clientRequestPath } sum { edgeResponseBytes } }
        }
      }
    }
    ''' % (
        start_s, end_s,
        start_s, end_s,
        start_s, end_s,
        start_s, end_s,
        start_s, end_s,
        start_s, end_s,
        start_s, end_s, ai_or,
    )

    payload = json.dumps({'query': query}).encode('utf-8')
    req = urllib.request.Request(
        'https://api.cloudflare.com/client/v4/graphql',
        data=payload,
        headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            result = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        raise SystemExit('Cloudflare GraphQL HTTP error %s: %s' % (exc.code, body[:3000]))

    if result.get('errors'):
        raise SystemExit('Cloudflare GraphQL errors: ' + json.dumps(result['errors']))

    zones = result.get('data', {}).get('viewer', {}).get('zones', []) or []
    if not zones:
        raise SystemExit('Token connected, but no zone analytics are visible.')
    if len(zones) != 1:
        raise SystemExit('Expected one accessible zone, found %d.' % len(zones))

    zone = zones[0]
    total_rows = zone.get('total') or []
    total_requests = sum(int(row.get('count', 0)) for row in total_rows)
    total_bytes = sum(int((row.get('sum') or {}).get('edgeResponseBytes', 0)) for row in total_rows)
    ai_rows = zone.get('aiCrawlerRequests') or []
    ai_requests = sum(int(row.get('count', 0)) for row in ai_rows)

    report = {
        'domain': 'worlddiscoverydata.com',
        'generatedAtUtc': end_s,
        'periodStartUtc': start_s,
        'periodEndUtc': end_s,
        'periodHours': 24,
        'note': 'HTTP request analytics. Requests are not the same as human visits/pageviews.',
        'totalHttpRequests': total_requests,
        'totalResponseBytes': total_bytes,
        'recognizedAiCrawlerRequests': ai_requests,
        'recognizedAiCrawlerRows': ai_rows,
        'topPaths': zone.get('topPaths') or [],
        'countries': zone.get('countries') or [],
        'statuses': zone.get('statuses') or [],
        'notFoundPaths': zone.get('notFoundPaths') or [],
        'serverErrorPaths': zone.get('serverErrorPaths') or [],
    }

    with open('cloudflare-analytics.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    def line_rows(rows, dimensions):
        out = []
        for row in rows[:20]:
            dims = row.get('dimensions') or {}
            label = ' | '.join(str(dims.get(d, '(unknown)')) for d in dimensions)
            out.append('- %s: %s requests' % (label, row.get('count', 0)))
        return out or ['- none']

    text = [
        '# Cloudflare daily analytics', '',
        'Period: %s to %s (UTC)' % (start_s, end_s), '',
        '## Verified totals',
        '- HTTP requests: %d' % total_requests,
        '- Recognized AI-crawler requests: %d' % ai_requests,
        '- Response bytes: %d' % total_bytes, '',
        'HTTP requests include assets and automated traffic and must not be interpreted as human visits or clicks.', '',
        '## HTTP statuses',
        *line_rows(zone.get('statuses') or [], ['edgeResponseStatus']), '',
        '## 404 paths',
        *line_rows(zone.get('notFoundPaths') or [], ['clientRequestPath']), '',
        '## 5xx paths',
        *line_rows(zone.get('serverErrorPaths') or [], ['edgeResponseStatus', 'clientRequestPath']), '',
        '## Top paths by HTTP requests',
        *line_rows(zone.get('topPaths') or [], ['clientRequestPath']), '',
        '## Countries by HTTP requests',
        *line_rows(zone.get('countries') or [], ['clientCountryName']), '',
        '## Recognized AI crawler activity',
        *line_rows(ai_rows, ['userAgent', 'clientRequestPath']), '',
        '## Data limits',
        '- This report uses Cloudflare GraphQL HTTP-request analytics, not RUM visitor counts.',
        '- AI detection uses known user-agent patterns and can be spoofed.',
    ]
    with open('cloudflare-analytics.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(text) + '\n')
    print('\n'.join(text))


if __name__ == '__main__':
    main()
