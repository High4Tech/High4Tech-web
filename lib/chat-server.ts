import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { getPayload, type Payload, type PayloadRequest } from 'payload';
import config from '@payload-config';
import type { ChatConversation, ChatMessage } from './chat-types';
import type { ChatConversation as ConversationRow } from '../payload-types';
import type { VisitorProfile } from './chat-profile';
import { isSameOrigin, secureCookies } from './security-policy';
import { RequestSecurityError, securityFailure } from './request-security';

export const CHAT_COOKIE = 'h4t-chat';
export class ChatError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function chatJSON(body: unknown, status = 200, token?: string, request?: Request) {
  const text = JSON.stringify(body);
  const etag = request?.method === 'GET' && status === 200 ? '"' + createHash('sha256').update(text).digest('hex') + '"' : undefined;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', Vary: 'Cookie', ...(etag ? { ETag: etag } : {}), ...(token ? { 'Set-Cookie': `${CHAT_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secureCookies(request) ? '; Secure' : ''}` } : {}) };
  return new Response(etag && request?.headers.get('if-none-match') === etag ? null : text, { status: etag && request?.headers.get('if-none-match') === etag ? 304 : status, headers });
}
export function tokenFrom(request: Request) {
  const value = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(CHAT_COOKIE + '='))?.slice(CHAT_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : undefined;
}
export const newChatToken = () => randomBytes(32).toString('hex');
const visitorKey = (token: string) => createHash('sha256').update(token).digest('hex');
export function requireChatOrigin(request: Request) {
  if (isSameOrigin(request)) return;
  throw new ChatError('Use chat on the High4Tech website.', 403);
}
export async function chatBody(request: Request, limit = 4096): Promise<Record<string, unknown>> {
  if (Number(request.headers.get('content-length') || 0) > limit) throw new ChatError('Your message is too long.');
  const reader = request.body?.getReader();
  if (!reader) throw new ChatError('Send a valid message.');
  let size = 0, body = ''; const decoder = new TextDecoder();
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) { await reader.cancel(); throw new ChatError('Your message is too long.'); } body += decoder.decode(value, { stream: true }); } } finally { reader.releaseLock(); }
  try { const value = JSON.parse(body + decoder.decode()); if (value && typeof value === 'object' && !Array.isArray(value)) return value; } catch { /* Invalid JSON. */ }
  throw new ChatError('Send a valid message.');
}
export function messageText(value: unknown) { if (typeof value !== 'string' || !value.trim() || value.length > 500) throw new ChatError('Use a message between 1 and 500 characters.'); return value.trim(); }
export function requestID(value: unknown) { if (typeof value !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(value)) throw new ChatError('Send a valid message ID.'); return value; }
export async function chatPayload() { return getPayload({ config }); }
// SQLite/libSQL write transactions serialize the mode check, history append and
// inbox update across processes. A staff claim cannot race a bot response.
export async function chatTransaction<T>(payload: Payload, callback: (req: Partial<PayloadRequest>) => Promise<T>): Promise<T> {
  const transactionID = await payload.db.beginTransaction();
  if (!transactionID) throw new ChatError('Chat storage is unavailable. Please try again.', 503);
  try { const result = await callback({ transactionID }); await payload.db.commitTransaction(transactionID); return result; }
  catch (error) { await payload.db.rollbackTransaction(transactionID); throw error; }
}
export async function ownConversation(payload: Payload, token: string, req?: Partial<PayloadRequest>) {
  return (await payload.find({ collection: 'chat-conversations', where: { visitorKey: { equals: visitorKey(token) } }, limit: 1, depth: 0, overrideAccess: true, req })).docs[0];
}
export async function startConversation(payload: Payload, token: string, req: Partial<PayloadRequest>, profile: VisitorProfile) {
  return payload.create({ collection: 'chat-conversations', overrideAccess: true, req, data: { visitorKey: visitorKey(token), visitorName: profile.name, visitorEmail: profile.email, visitorPhone: profile.phone, channel: 'chat', status: 'bot', lastMessageAt: new Date().toISOString() } });
}
export function publicConversation(row: ConversationRow): ChatConversation {
  return { id: row.id, visitorName: row.visitorName, visitorEmail: row.visitorEmail, visitorPhone: row.visitorPhone, channel: row.channel, status: row.status, needsAttention: Boolean(row.needsAttention), handoffAt: row.handoffAt, lastMessageAt: row.lastMessageAt, preview: row.preview, assignedTo: typeof row.assignedTo === 'number' ? row.assignedTo : row.assignedTo?.id };
}
export async function chatSnapshot(payload: Payload, row: ConversationRow | undefined, before?: number) {
  if (!row) return { mode: 'cms' as const, conversation: null, messages: [] };
  const messages = await payload.find({ collection: 'chat-messages', overrideAccess: true, depth: 0, sort: '-id', limit: 60, where: { and: [{ conversation: { equals: row.id } }, ...(before ? [{ id: { less_than: before } }] : [])] } });
  return { mode: 'cms' as const, conversation: publicConversation(row), messages: messages.docs.reverse().map(({ id, role, body, createdAt, staffName, reply }): ChatMessage => ({ id, role, body, createdAt, staffName, reply: reply as ChatMessage['reply'] })), hasOlder: messages.hasNextPage };
}
export async function chatStaff(request: Request, payload: Payload) {
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== 'users') throw new ChatError('Sign in to the studio dashboard.', 401);
  return user;
}
export function wantsHuman(text: string) {
  if (/\b(?:don'?t|do not|no|not)\b.{0,25}\b(?:human|employee|person|agent|staff)\b/i.test(text)) return false;
  return /\b(?:human|employee|representative)\b|\b(?:talk|speak|chat|connect|transfer)\b.{0,40}\b(?:person|agent|someone|team|staff)\b/i.test(text);
}
export const chatFailure = (error: unknown) => error instanceof RequestSecurityError ? securityFailure(error) : chatJSON({ error: error instanceof ChatError ? error.message : 'Chat is temporarily unavailable. Please try again.' }, error instanceof ChatError ? error.status : 503);
