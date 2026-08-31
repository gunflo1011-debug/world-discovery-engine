(() => {
  const root = document.querySelector('[data-wdi-year-browser]');
  if (!root) return;

  const historyUrl = root.dataset.historyUrl;
  const currentYear = Number(root.dataset.currentYear);
  const unit = root.dataset.unit || '';
  const indicatorName = root.dataset.indicatorName || 'Indicator';
  const yearSelect = root.querySelector('[data-year-select]');
  const countrySelect = root.querySelector('[data-country-select]');
  const rowsTarget = document.querySelector('[data-country-rows]');
  const heading = document.querySelector('[data-country-heading]');
  const summary = document.querySelector('[data-country-summary]');
  const chart = root.querySelector('[data-history-chart]');
  const chartSummary = root.querySelector('[data-history-summary]');
  const highestCard = document.querySelector('[data-highest-card]');
  const middleCard = document.querySelector('[data-middle-card]');
  const lowestCard = document.querySelector('[data-lowest-card]');

  const formatValue = (value) => {
    if (!Number.isFinite(value)) return '—';
    if (unit.includes('US$')) {
      const abs = Math.abs(value);
      if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    if (unit === 'people') return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const digits = Math.abs(value) >= 100 ? 1 : 2;
    return value.toLocaleString('en-US', { maximumFractionDigits: digits });
  };

  const suffix = () => {
    if (unit.includes('%')) return '%';
    if (unit === 'years') return ' years';
    if (unit === 'births per woman') return ' births/woman';
    if (unit.includes('per 1,000')) return ' per 1,000';
    if (unit === 'per 100 people') return ' per 100 people';
    if (unit === 'metric tons per person') return ' t/person';
    if (unit === 'people per sq. km') return ' people/km²';
    return '';
  };

  const valueText = (value) => `${formatValue(value)}${suffix()}`;

  const fillCard = (card, record, label) => {
    if (!card || !record) return;
    const metric = card.querySelector('.metric');
    const name = card.querySelector('h3');
    const pill = card.querySelector('.pill');
    if (metric) metric.textContent = valueText(record.value);
    if (name) name.textContent = record.country;
    if (pill) pill.textContent = label;
  };

  const renderRows = (records, year) => {
    if (!rowsTarget) return;
    rowsTarget.replaceChildren();
    records.forEach((record, index) => {
      const tr = document.createElement('tr');
      const rank = document.createElement('td');
      rank.textContent = String(index + 1);
      const country = document.createElement('td');
      const strong = document.createElement('strong');
      strong.textContent = record.country;
      const meta = document.createElement('span');
      meta.className = 'muted';
      meta.textContent = `${record.code} · ${record.region?.name ?? ''}`;
      country.append(strong, document.createElement('br'), meta);
      const value = document.createElement('td');
      value.textContent = valueText(record.value);
      tr.append(rank, country, value);
      rowsTarget.append(tr);
    });

    if (heading) heading.textContent = `${indicatorName} by country in ${year}`;
    if (summary) summary.textContent = `Sorted from highest to lowest. ${records.length} countries have an official observation for ${year}; missing countries are omitted.`;

    const top = records[0];
    const low = records.at(-1);
    const middle = records[Math.floor(records.length / 2)];
    fillCard(highestCard, top, `HIGHEST · ${year}`);
    fillCard(middleCard, middle, `MIDDLE OBSERVATION · ${year}`);
    fillCard(lowestCard, low, `LOWEST · ${year}`);
  };

  const renderChart = (records, code) => {
    if (!chart) return;
    const points = records
      .filter((r) => r.code === code && Number.isFinite(r.value))
      .sort((a, b) => a.year - b.year);
    chart.replaceChildren();
    if (!points.length) {
      if (chartSummary) chartSummary.textContent = 'No historical observations available for this country.';
      return;
    }

    const width = 720;
    const height = 260;
    const padX = 48;
    const padTop = 24;
    const padBottom = 42;
    const values = points.map((p) => p.value);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) { min -= 1; max += 1; }
    const firstYear = points[0].year;
    const lastYear = points.at(-1).year;
    const x = (year) => padX + ((year - firstYear) / Math.max(1, lastYear - firstYear)) * (width - padX * 2);
    const y = (value) => padTop + (1 - (value - min) / (max - min)) * (height - padTop - padBottom);

    const ns = 'http://www.w3.org/2000/svg';
    chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', `${points[0].country} ${indicatorName} history from ${firstYear} to ${lastYear}`);

    const baseline = document.createElementNS(ns, 'line');
    baseline.setAttribute('x1', String(padX));
    baseline.setAttribute('x2', String(width - padX));
    baseline.setAttribute('y1', String(height - padBottom));
    baseline.setAttribute('y2', String(height - padBottom));
    baseline.setAttribute('stroke', 'currentColor');
    baseline.setAttribute('opacity', '0.25');
    chart.append(baseline);

    const polyline = document.createElementNS(ns, 'polyline');
    polyline.setAttribute('points', points.map((p) => `${x(p.year)},${y(p.value)}`).join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'currentColor');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    chart.append(polyline);

    points.forEach((p, index) => {
      if (points.length > 30 && index % 3 !== 0 && index !== points.length - 1) return;
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', String(x(p.year)));
      circle.setAttribute('cy', String(y(p.value)));
      circle.setAttribute('r', '3.5');
      circle.setAttribute('fill', 'currentColor');
      const title = document.createElementNS(ns, 'title');
      title.textContent = `${p.year}: ${valueText(p.value)}`;
      circle.append(title);
      chart.append(circle);
    });

    const addText = (text, tx, ty, anchor = 'start') => {
      const el = document.createElementNS(ns, 'text');
      el.setAttribute('x', String(tx));
      el.setAttribute('y', String(ty));
      el.setAttribute('text-anchor', anchor);
      el.setAttribute('font-size', '13');
      el.setAttribute('fill', 'currentColor');
      el.setAttribute('opacity', '0.75');
      el.textContent = text;
      chart.append(el);
    };
    addText(String(firstYear), padX, height - 14);
    addText(String(lastYear), width - padX, height - 14, 'end');
    addText(valueText(max), padX, padTop + 4);
    addText(valueText(min), padX, height - padBottom - 8);

    const first = points[0];
    const last = points.at(-1);
    const change = last.value - first.value;
    const sign = change > 0 ? '+' : '';
    if (chartSummary) {
      if (unit.includes('%')) {
        const relativeChange = first.value !== 0 ? (change / Math.abs(first.value)) * 100 : null;
        const relativeText = Number.isFinite(relativeChange)
          ? `; ${relativeChange > 0 ? '+' : ''}${relativeChange.toFixed(1)}% relative change`
          : '';
        chartSummary.textContent = `${last.country}: ${valueText(first.value)} in ${first.year} → ${valueText(last.value)} in ${last.year} (${sign}${formatValue(change)} percentage points${relativeText}).`;
      } else {
        chartSummary.textContent = `${last.country}: ${valueText(first.value)} in ${first.year} → ${valueText(last.value)} in ${last.year} (${sign}${formatValue(change)}${suffix()} change).`;
      }
    }
  };

  fetch(historyUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`History request failed: ${response.status}`);
      return response.json();
    })
    .then((historyData) => {
      const records = Array.isArray(historyData.records) ? historyData.records : [];
      const years = [...new Set(records.map((r) => Number(r.year)).filter(Number.isFinite))].sort((a, b) => b - a);
      if (!years.length) return;

      yearSelect.replaceChildren(...years.map((year) => {
        const option = document.createElement('option');
        option.value = String(year);
        option.textContent = String(year);
        return option;
      }));

      const countries = [...new Map(records.map((r) => [r.code, r.country])).entries()]
        .map(([code, country]) => ({ code, country }))
        .sort((a, b) => a.country.localeCompare(b.country));
      countrySelect.replaceChildren(...countries.map(({ code, country }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = country;
        return option;
      }));

      const params = new URLSearchParams(location.search);
      const requestedYear = Number(params.get('year'));
      const initialYear = years.includes(requestedYear) ? requestedYear : (years.includes(currentYear) ? currentYear : years[0]);
      yearSelect.value = String(initialYear);

      const renderYear = (year) => {
        const yearRecords = records
          .filter((r) => Number(r.year) === year && Number.isFinite(r.value))
          .sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
        renderRows(yearRecords, year);
        const url = new URL(location.href);
        if (year === currentYear) url.searchParams.delete('year'); else url.searchParams.set('year', String(year));
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      };

      yearSelect.addEventListener('change', () => renderYear(Number(yearSelect.value)));
      renderYear(initialYear);

      const defaultCountry = countries.find((c) => c.code === 'DEU') ?? countries[0];
      if (defaultCountry) {
        countrySelect.value = defaultCountry.code;
        renderChart(records, defaultCountry.code);
      }
      countrySelect.addEventListener('change', () => renderChart(records, countrySelect.value));
    })
    .catch((error) => {
      root.dataset.historyError = 'true';
      console.error(error);
    });
})();
