export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  let rows = [],
    row = [],
    cell = "",
    quoted = false,
    closedQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted) {
        quoted = false;
        closedQuote = true;
      } else {
        if (cell.length || closedQuote) throw Error("Unexpected CSV quote");
        quoted = true;
      }
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
      closedQuote = false;
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
      closedQuote = false;
    } else {
      if (closedQuote) throw Error("Unexpected text after CSV quote");
      cell += c;
    }
  }
  if (quoted) throw Error("Unclosed CSV quote");
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  const headers = rows.shift()?.map((x) => x.trim());
  if (!headers?.length || headers.some((h) => !h) || new Set(headers).size !== headers.length)
    throw Error("Invalid CSV headers");
  return rows.map((r, i) => {
    if (r.length !== headers.length)
      throw Error("CSV row " + (i + 2) + " has the wrong number of columns");
    return Object.fromEntries(
      headers.map((h, j) => [
        h,
        h === "sourceKeys"
          ? r[j]
              .split("|")
              .map((x) => x.trim())
              .filter(Boolean)
          : r[j],
      ]),
    );
  });
}
