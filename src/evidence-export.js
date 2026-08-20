function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function evidenceJson(evidence) {
  return JSON.stringify({
    schemaVersion: 1,
    type: 'revision-evidence',
    indicator: evidence.indicator,
    entity: evidence.entity,
    period: evidence.period,
    firstPublished: evidence.firstPublished,
    latestPublished: evidence.latestPublished,
    revision: evidence.revision,
    events: evidence.events,
    provenance: evidence.provenance
  }, null, 2);
}

export function evidenceCsv(evidence) {
  const header = ['entity_id','entity_name','indicator_id','indicator_name','period','from_vintage','to_vintage','from_value','to_value','absolute_revision','percentage_revision'];
  const rows = evidence.events.map((event) => [
    evidence.entity.id,
    evidence.entity.name,
    evidence.indicator.id,
    evidence.indicator.name,
    evidence.period,
    event.fromVintage,
    event.toVintage,
    event.fromValue,
    event.toValue,
    event.absoluteRevision,
    event.percentageRevision
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}
