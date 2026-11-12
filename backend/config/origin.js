export function allowedOrigins(origin, production) {
  const configured = new URL(origin).origin;
  const allowed = new Set([configured]);
  const local = new URL(configured);
  if (!production && ["localhost", "127.0.0.1", "[::1]"].includes(local.hostname)) {
    for (const hostname of ["localhost", "127.0.0.1", "[::1]"]) {
      local.hostname = hostname;
      allowed.add(local.origin);
    }
  }
  return allowed;
}
