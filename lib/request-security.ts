import 'server-only';
import { createHash } from 'node:crypto';
import { getPayload, type PayloadRequest } from 'payload';
import config from '@payload-config';
import { cmsConfigurationIssues } from './cms-runtime';
import { isSameOrigin } from './security-policy';

export class RequestSecurityError extends Error {
  constructor(message: string, public status: number, public retryAfter?: number) { super(message); }
}
export const securityFailure = (error: unknown) => Response.json({ error: error instanceof RequestSecurityError ? error.message : 'The service is temporarily unavailable.' }, { status: error instanceof RequestSecurityError ? error.status : 503, headers: { 'Cache-Control': 'private, no-store', ...(error instanceof RequestSecurityError && error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {}) } });
export function requireSameOrigin(request: Request) {
  if (!isSameOrigin(request)) throw new RequestSecurityError('Use this feature on the High4Tech website.', 403);
}
const memory = new Map<string, { start: number; count: number }>();
export function memoryRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  let row = memory.get(key);
  if (!row || now - row.start >= windowMs) { row = { start: now, count: 0 }; memory.set(key, row); }
  if (++row.count > limit) throw new RequestSecurityError('Please wait before trying again.', 429, Math.max(1, Math.ceil((row.start + windowMs - now) / 1000)));
  if (memory.size > 2048) for (const [oldKey, old] of memory) { if (now - old.start >= windowMs) memory.delete(oldKey); }
  // Bound memory even when many cookies are fabricated. An overflow uses the
  // global cap, rather than retaining unbounded attacker-controlled keys.
  if (memory.size > 4096) memory.delete(memory.keys().next().value!);
}
export function requester(request: Request) {
  // Only enable this header if your hosting proxy strips client-supplied values
  // and writes its own. Otherwise requests safely share one anonymous bucket.
  const name = process.env.TRUSTED_CLIENT_IP_HEADER;
  const ip = name ? request.headers.get(name)?.trim() : undefined;
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)h4t-chat=([a-f0-9]{64})(?:;|$)/)?.[1];
  return createHash('sha256').update(ip || cookie || 'anonymous').digest('hex');
}
let nextCleanup = 0;
export async function limitPublicRequest(request: Request, scope: string, limit: number, globalLimit: number, windowMs = 60_000) {
  const now = Date.now();
  // Fast cap before allocating a DB connection; preview mode uses this too.
  memoryRateLimit(scope + ':global', globalLimit, windowMs, now);
  const key = `${scope}:${requester(request)}`;
  memoryRateLimit(key, limit, windowMs, now);
  if (cmsConfigurationIssues().length) return;
  const payload = await getPayload({ config });
  const transactionID = await payload.db.beginTransaction();
  if (!transactionID) throw new RequestSecurityError('The service is temporarily unavailable.', 503);
  const req: Partial<PayloadRequest> = { transactionID };
  try {
    for (const [bucket, maximum] of [[scope + ':global', globalLimit], [key, limit]] as const) {
      const row = (await payload.find({ collection: 'security-rate-limits', where: { key: { equals: bucket } }, limit: 1, depth: 0, overrideAccess: true, req })).docs[0];
      const start = row && now - row.windowStart < windowMs ? row.windowStart : now;
      const count = start === row?.windowStart ? row.count + 1 : 1;
      if (count > maximum) throw new RequestSecurityError('Please wait before trying again.', 429, Math.max(1, Math.ceil((start + windowMs - now) / 1000)));
      if (row) await payload.update({ collection: 'security-rate-limits', id: row.id, data: { windowStart: start, count }, overrideAccess: true, req });
      else await payload.create({ collection: 'security-rate-limits', data: { key: bucket, windowStart: start, count }, overrideAccess: true, req });
    }
    await payload.db.commitTransaction(transactionID);
  } catch (error) { await payload.db.rollbackTransaction(transactionID); throw error; }
  if (now >= nextCleanup) {
    nextCleanup = now + 3_600_000;
    // Longest window is one hour. Counter records contain no raw IP or contact data.
    await payload.delete({ collection: 'security-rate-limits', where: { windowStart: { less_than: now - 86_400_000 } }, overrideAccess: true }).catch(() => { nextCleanup = 0; });
  }
}
export function limitReads(request: Request, scope: string, perVisitor = 120) {
  memoryRateLimit(scope + ':global', 3000, 60_000);
  memoryRateLimit(`${scope}:${requester(request)}`, perVisitor, 60_000);
}
export function positiveID(value: string | null) {
  if (value === null) return undefined;
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1) throw new RequestSecurityError('Use a valid record ID.', 400);
  return id;
}
