export const MAX_KNOWLEDGE_BYTES = 256 * 1024;
export const MAX_KNOWLEDGE_CHARACTERS = 60_000;
const supported = ['txt', 'md', 'csv', 'json'];

// Import data as text. Never execute HTML, scripts, formulas, or document instructions.
export function importKnowledgeFile(name: string, raw: string): string {
  const extension = name.split('.').pop()?.toLowerCase() || '';
  if (!supported.includes(extension)) throw new Error('Choose a UTF-8 TXT, Markdown, CSV, or JSON file.');
  let text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (text.includes('\u0000')) throw new Error('This file contains binary data. Export it as UTF-8 text.');
  if (extension === 'json') {
    let data: unknown;
    try { data = JSON.parse(text); } catch { throw new Error('This JSON file is invalid. Check it and try again.'); }
    const flatten = (value: unknown, prefix = '', depth = 0): string[] => {
      if (depth > 12) throw new Error('This JSON is too deeply nested. Use a simpler document.');
      if (Array.isArray(value)) return value.flatMap(item => flatten(item, prefix, depth + 1).concat(''));
      if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => flatten(item, prefix ? `${prefix} / ${key}` : key, depth + 1));
      if (value === null) return [];
      return [prefix ? `${prefix}: ${String(value)}` : String(value)];
    };
    text = flatten(data).join('\n');
  }
  if (extension === 'csv') {
    const rows: string[][] = [];
    let row: string[] = [], cell = '', quoted = false;
    for (let index = 0; index < text.length; index++) {
      const char = text[index];
      if (char === '"') {
        if (quoted && text[index + 1] === '"') { cell += '"'; index++; }
        else quoted = !quoted;
      } else if (!quoted && (char === ',' || char === '\n')) {
        row.push(cell.trim()); cell = '';
        if (char === '\n') { rows.push(row); row = []; }
      } else cell += char;
    }
    if (quoted) throw new Error('A CSV quote is not closed. Check the file and try again.');
    row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
    const [headers, ...values] = rows.filter(item => item.some(Boolean));
    if (!headers?.length || !values.length) throw new Error('CSV needs a header row and at least one data row.');
    if (values.some(item => item.length !== headers.length)) throw new Error('CSV rows must have the same number of columns as the header.');
    text = values.map(item => item.map((value, index) => `${headers[index] || `Column ${index + 1}`}: ${value}`).join('\n')).join('\n\n');
  }
  text = text.replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!text) throw new Error('This file has no readable text.');
  if (text.length > MAX_KNOWLEDGE_CHARACTERS) throw new Error('Use a smaller file: at most 60,000 extracted characters.');
  return text;
}
