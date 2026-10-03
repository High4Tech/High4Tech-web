// One request at a time per polling loop, including slow networks. An interval
// must never invalidate a still-pending response by starting another request.
export function startChatPolling(task: () => Promise<void>, delay: number) {
  let stopped = false, running = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = async () => {
    if (stopped || running) return;
    clearTimeout(timer);
    if (document.hidden || !navigator.onLine) { timer = setTimeout(run, delay); return; }
    running = true;
    try { await task(); } finally { running = false; if (!stopped) timer = setTimeout(run, delay); }
  };
  const wake = () => { if (!document.hidden) void run(); };
  void run();
  window.addEventListener('online', wake);
  window.addEventListener('focus', wake);
  document.addEventListener('visibilitychange', wake);
  return () => { stopped = true; clearTimeout(timer); window.removeEventListener('online', wake); window.removeEventListener('focus', wake); document.removeEventListener('visibilitychange', wake); };
}
const recentResponses = new Map<string, { etag: string; data: unknown; savedAt: number }>();
export async function chatRequest(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 25000);
  try {
    const get = !options.method || options.method === 'GET';
    const cached = get ? recentResponses.get(url) : undefined;
    const headers = new Headers(options.headers);
    if (cached && Date.now() - cached.savedAt < 30000) headers.set('If-None-Match', cached.etag);
    if (!get) recentResponses.clear();
    const response = await fetch(url, { ...options, headers, credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
    if (response.status === 304 && cached) return cached.data;
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || (response.status === 401 ? 'Sign in to the dashboard again.' : 'The studio couldn’t connect. Please retry.'));
    if (get && response.headers.get('etag')) { if (recentResponses.size >= 8) recentResponses.delete(recentResponses.keys().next().value!); recentResponses.set(url, { etag: response.headers.get('etag')!, data, savedAt: Date.now() }); }
    return data;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The connection took too long. Your saved messages are safe. Please retry.');
    throw error;
  } finally { clearTimeout(timer); options.signal?.removeEventListener('abort', abort); }
}
