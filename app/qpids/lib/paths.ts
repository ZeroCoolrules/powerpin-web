// Where Qpids Place lives. Inside PowerPin it is /qpids/...; on its own domain
// (middleware rewrites the host to /qpids) set NEXT_PUBLIC_QPIDS_ROOT=/ so
// links read /discover instead of /qpids/discover.
const ROOT = (process.env.NEXT_PUBLIC_QPIDS_ROOT ?? "/qpids").replace(/\/$/, "");

export function qp(path: string): string {
  const p = path.replace(/^\//, "");
  return p ? `${ROOT}/${p}` : ROOT || "/";
}
