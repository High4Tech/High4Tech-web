// Shared validation only: no secrets or server state in this module.
export function safeExternalURL(value: unknown) {
  if (!value) return true;
  if (typeof value !== 'string' || /[\u0000-\u0020\u007f\\]/.test(value)) return false;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password && Boolean(url.hostname); } catch { return false; }
}
export function safeLocalPath(value: unknown) {
  if (!value) return true;
  if (typeof value !== 'string' || !/^\/(?!\/)/.test(value) || /[\u0000-\u0020\u007f\\]/.test(value)) return false;
  try { return new URL(value, 'https://studio.invalid').origin === 'https://studio.invalid'; } catch { return false; }
}
export function siteOrigin(request: Request) {
  // For deployment configure the canonical URL. Next normalizes request.url to
  // localhost in some adapters; the direct HTTP Host preserves the authority.
  // Never use forwarded host/protocol headers from an untrusted client.
  const configured = process.env.SITE_URL;
  if (configured) return new URL(configured).origin;
  const url = new URL(request.url), host = request.headers.get('host');
  if (!host) return url.origin;
  const target = new URL(`${url.protocol}//${host}`);
  if (target.host !== host || target.username || target.password || target.pathname !== '/') throw new Error('Invalid request host.');
  return target.origin;
}
export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  try { return new URL(origin).origin === siteOrigin(request) && origin === new URL(origin).origin; } catch { return false; }
}
export function secureCookies(request?: Request) {
  return Boolean(process.env.SITE_URL?.startsWith('https://') || (request && new URL(request.url).protocol === 'https:'));
}
export function secureResponseCookies(headers: Headers, request: Request) {
  if (!secureCookies(request)) return;
  const cookies = headers.getSetCookie();
  if (cookies.length) { headers.delete('set-cookie'); for (const cookie of cookies) headers.append('set-cookie', /;\s*Secure(?:;|$)/i.test(cookie) ? cookie : cookie + '; Secure'); }
}
export function contentSecurityPolicy(nonce: string, development = false) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    // React, GSAP and Payload use inline style attributes. Scripts remain nonce-only.
    "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob: https:",
    "font-src 'self' data:", `connect-src 'self' https://*.public.blob.vercel-storage.com${development ? ' ws: wss:' : ''}`,
    "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
    "frame-src 'self' https://www.youtube-nocookie.com https://open.spotify.com https://embed.music.apple.com https://cal.com",
    "worker-src 'self' blob:", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'",
  ].join('; ');
}
