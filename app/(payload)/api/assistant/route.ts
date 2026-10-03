import { answerAssistant } from '@/lib/assistant-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
async function readBody(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 4096) throw new Error('too-large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid');
  let size = 0, text = '';
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new Error('too-large'); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } finally { reader.releaseLock(); }
}
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  // Next can normalize request.url to localhost behind a proxy. Compare against
  // the actual HTTP Host so the site's own browser requests are not rejected.
  if (origin) {
    let allowed = false;
    try { const parsed = new URL(origin); allowed = ['http:', 'https:'].includes(parsed.protocol) && parsed.host === (request.headers.get('host') || new URL(request.url).host); } catch { /* Invalid/opaque origin. */ }
    if (!allowed) return json({ error: 'Use the assistant on the studio website.' }, 403);
  }
  let body: unknown;
  try { body = await readBody(request); }
  catch (error) { return json({ error: error instanceof Error && error.message === 'too-large' ? 'Your message is too long.' : 'Send a valid question.' }, 400); }
  const question = body && typeof body === 'object' && 'question' in body ? body.question : undefined;
  if (typeof question !== 'string' || !question.trim() || question.length > 500) return json({ error: 'Use a question between 1 and 500 characters.' }, 400);
  try {
    return json(await answerAssistant(question.trim()));
  } catch {
    // A connection failure must never cause a switch to stale bundled answers.
    return json({ status: 'unavailable', answer: 'The studio knowledge is temporarily unavailable. Please try again or contact our team.', sources: [] }, 503);
  }
}
