(() => {
  const table = document.getElementById('internet-table');
  const tools = document.getElementById('internet-tools');
  const status = document.getElementById('country-status');
  const search = document.getElementById('country-search');
  const region = document.getElementById('region-filter');
  const clear = document.getElementById('country-clear');
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

    if (!filtering && !expanded && rows.length > initialLimit) {
      status.textContent = `Showing the top ${initialLimit} of ${rows.length} countries by rank. Search or choose a region to narrow the table.`;
    } else if (!filtering && expanded) {
      status.textContent = `Showing all ${rows.length} countries.`;
    } else if (filtering && matches.length === 0) {
      more.hidden = true;
    }
  };

  search.addEventListener('input', compact);
  region.addEventListener('change', compact);
  clear.addEventListener('click', compact);
  more.addEventListener('click', () => {
    expanded = !expanded;
    compact();
  });
  compact();
})();
