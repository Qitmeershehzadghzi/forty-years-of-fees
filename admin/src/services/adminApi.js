export async function api(url, method = "GET", body) {
  const r = await fetch("/api" + url, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => {
    throw Error("Server returned an invalid response. Please retry.");
  });
  if (!r.ok) throw Error(d.error || "Request failed");
  return d;
}
