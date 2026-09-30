/**
 * Small RFC 4180 reader. Quoted fields may contain commas and newlines.
 * Enough for the editorial CSVs. No third-party parser.
 */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }
    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

export function rowsToRecords(
  rows: string[][],
  columns: readonly string[],
): Record<string, string>[] {
  if (rows.length === 0) return [];
  const header = rows[0].map((cell) => cell.trim());
  const expected = columns.join(",");
  const actual = header.join(",");
  if (actual !== expected) {
    throw new Error(`CSV header must be exactly: ${expected}`);
  }
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    columns.forEach((column, index) => {
      record[column] = (row[index] ?? "").trim();
    });
    return record;
  });
}
