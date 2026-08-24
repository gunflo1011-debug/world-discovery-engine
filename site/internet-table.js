(() => {
  const table = document.getElementById('internet-table');
  const tools = document.getElementById('internet-tools');
  const status = document.getElementById('country-status');
  const search = document.getElementById('country-search');
  const region = document.getElementById('region-filter');
  const clear = document.getElementById('country-clear');
  const compareA = document.getElementById('compare-a');
  const compareB = document.getElementById('compare-b');
  const compareResult = document.getElementById('compare-result');
  if (!table || !tools || !status || !search || !region || !clear) return;

  const rows = [...table.tBodies[0].rows];
  const initialLimit = 25;
  let expanded = false;
  const more = document.createElement('button');
  more.className = 'filter internet-more';
  more.type = 'button';
  more.id = 'country-more';
  more.setAttribute('aria-controls', 'internet-table');
  status.insertAdjacentElement('afterend', more);

  const empty = document.createElement('div');
  empty.id = 'country-empty';
  empty.className = 'empty-state internet-tool-status';
  empty.setAttribute('role', 'group');
  empty.setAttribute('aria-labelledby', 'country-status');
  empty.hidden = true;
  const emptyHint = document.createElement('p');
  emptyHint.textContent = 'Try another country name or reset both filters.';
  const emptyReset = document.createElement('button');
  emptyReset.className = 'filter';
  emptyReset.type = 'button';
  emptyReset.id = 'country-empty-reset';
  emptyReset.textContent = `Show all ${rows.length} countries`;
  empty.append(emptyHint, emptyReset);
  more.insertAdjacentElement('afterend', empty);

  const compareLinks = document.createElement('nav');
  compareLinks.id = 'compare-profile-links';
  compareLinks.className = 'filter-row';
  compareLinks.setAttribute('aria-label', 'Selected country profiles');
  compareLinks.hidden = true;
  compareResult?.insertAdjacentElement('afterend', compareLinks);

  const countriesByCode = new Map(rows.map((row) => [
    row.dataset.code.toUpperCase(),
    row.cells[1].textContent.trim(),
  ]));

  const renderCompareLinks = () => {
    if (!compareA || !compareB || !compareResult) return;
    const codes = [...new Set([compareA.value, compareB.value].filter((code) => countriesByCode.has(code)))];
    compareLinks.replaceChildren(...codes.map((code) => {
      const link = document.createElement('a');
      link.className = 'filter';
      link.href = `./country/${code.toLowerCase()}/`;
      link.textContent = `Open ${countriesByCode.get(code)} profile →`;
      return link;
    }));
    compareLinks.hidden = codes.length === 0;
  };

  const compact = () => {
    const filtering = Boolean(search.value.trim() || region.value);
    const matches = rows.filter((row) => !row.hidden);

    if (!filtering) {
      rows.forEach((row, index) => { row.hidden = !expanded && index >= initialLimit; });
    }

    more.hidden = filtering || rows.length <= initialLimit;
    more.setAttribute('aria-expanded', String(expanded));
    more.textContent = expanded
      ? `Show top ${initialLimit} countries`
      : `Show all ${rows.length} countries`;
    empty.hidden = !(filtering && matches.length === 0);

    if (!filtering && !expanded && rows.length > initialLimit) {
      status.textContent = `Showing the top ${initialLimit} of ${rows.length} countries by rank. Search or choose a region to narrow the table.`;
    } else if (!filtering && expanded) {
      status.textContent = `Showing all ${rows.length} countries.`;
    } else if (filtering && matches.length === 0) {
      more.hidden = true;
      status.textContent = `No countries match these filters. Reset both filters to show all ${rows.length} countries.`;
    }
  };

  search.addEventListener('input', compact);
  region.addEventListener('change', compact);
  clear.addEventListener('click', compact);
  emptyReset.addEventListener('click', () => clear.click());
  compareA?.addEventListener('change', renderCompareLinks);
  compareB?.addEventListener('change', renderCompareLinks);
  more.addEventListener('click', () => {
    expanded = !expanded;
    compact();
  });
  compact();
  renderCompareLinks();
})();
