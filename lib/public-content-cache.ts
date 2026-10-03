let revision = 0;
let saved: { value: unknown; expires: number } | undefined;
let pending: Promise<unknown> | undefined;
export function invalidatePublicContent() { revision++; saved = undefined; pending = undefined; }
// Public website content only. Never cache transcripts, identity tokens, or
// private knowledge documents here. Other server instances refresh in 15s.
export async function cachedPublicContent<T>(load: () => Promise<T>): Promise<T> {
  if (saved && saved.expires > Date.now()) return saved.value as T;
  if (pending) return pending as Promise<T>;
  const version = revision;
  const task = load().then(value => { if (version === revision) saved = { value, expires: Date.now() + 15000 }; return value; });
  pending = task;
  try { return await task; } finally { if (pending === task) pending = undefined; }
}
