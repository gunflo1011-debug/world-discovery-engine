function parseRecord(record) {
  const fields = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < record.length; i += 1) {
    const ch = record[i];
    if (ch === '"') {
      if (quoted && record[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error('Unterminated quoted CSV field');
  fields.push(field);
  return fields;
}

export function parseCsv(text) {
  if (typeof text !== 'string') throw new Error('CSV input must be a string');
  const records = [];
  let record = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      record += ch;
      if (quoted && text[i + 1] === '"') {
        record += text[i + 1];
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      if (record.trim()) records.push(record);
      record = '';
    } else {
      record += ch;
    }
  }
  if (quoted) throw new Error('Unterminated quoted CSV record');
  if (record.trim()) records.push(record);
  if (!records.length) return [];

  const headers = parseRecord(records[0]).map((h, index) => index === 0 ? h.replace(/^\uFEFF/, '').trim() : h.trim());
  return records.slice(1).map((line) => {
    const values = parseRecord(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}
