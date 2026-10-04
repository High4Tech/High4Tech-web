import { NextRequest, NextResponse } from 'next/server';
import { contentSecurityPolicy } from './lib/security-policy';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64');
  const csp = contentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  // A nonce-bearing HTML response must never be shared between visitors.
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'] };
