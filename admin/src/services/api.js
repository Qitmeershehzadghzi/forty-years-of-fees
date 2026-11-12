export async function request(path, options = {}) {
  const res = await fetch("/api" + path, {credentials:"same-origin", ...options});
  const data = await res.json().catch(() => {throw Error("The server did not return a valid response.");});
  if (!res.ok) throw Error(data.error || "Request failed");
  return data;
}
export function downloadCSV(rows, name = "journey40-fees.csv", headers) {
  const keys = headers || [...new Set(rows.flatMap(r => Object.keys(r)))];
  const cell = v => '"' + String(v ?? "").replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"','""') + '"';
  const blob = new Blob([[keys.map(cell).join(","), ...rows.map(r => keys.map(k => cell(r[k])).join(","))].join("\r\n")], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
}
