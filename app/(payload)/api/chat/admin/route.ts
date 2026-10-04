import { cmsConfigurationIssues } from '@/lib/cms-runtime';
import { ChatError, chatJSON, chatBody, chatFailure, chatPayload, chatSnapshot, chatStaff, chatTransaction, messageText, publicConversation, requestID, requireChatOrigin } from '@/lib/chat-server';
import type { Where } from 'payload';
import { limitReads, positiveID } from '@/lib/request-security';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (cmsConfigurationIssues().length) return chatJSON({ error: 'Connect the CMS database to use the live inbox.' }, 503);
  try {
    const payload = await chatPayload(); await chatStaff(request, payload);
    limitReads(request,'inbox',240);
    const query = new URL(request.url).searchParams, id = positiveID(query.get('id'));
    if (id) { const row = await payload.findByID({ collection: 'chat-conversations', id, depth: 0 }); return chatJSON(await chatSnapshot(payload, row, positiveID(query.get('before'))), 200, undefined, request); }
    const where: Where = {}, filter = query.get('filter'), search = query.get('search')?.slice(0, 100);
    if (filter === 'attention') where.needsAttention = { equals: true }; else if (['bot', 'waiting', 'human', 'closed'].includes(filter || '')) where.status = { equals: filter };
    if (search) where.or = [{ visitorName: { contains: search } }, { visitorEmail: { contains: search } }, { visitorPhone: { contains: search } }, { preview: { contains: search } }];
    const [conversations, attention, alerts] = await Promise.all([payload.find({ collection: 'chat-conversations', where, sort: '-lastMessageAt', depth: 0, limit: 30, page: Math.max(1, Math.min(10000, Number(query.get('page')) || 1)) }), payload.count({ collection: 'chat-conversations', where: { needsAttention: { equals: true } } }), payload.find({ collection: 'chat-conversations', where: { needsAttention: { equals: true } }, sort: '-lastMessageAt', depth: 0, limit: 8 })]);
    return chatJSON({ storage: /^(libsql|https):\/\//.test(process.env.DATABASE_URL || '') ? 'shared' : 'local', conversations: conversations.docs.map(publicConversation), total: conversations.totalDocs, hasNextPage: conversations.hasNextPage, attention: attention.totalDocs, alerts: alerts.docs.map(publicConversation) }, 200, undefined, request);
  } catch (error) { return chatFailure(error); }
}
export async function POST(request: Request) {
  try {
    requireChatOrigin(request);
    if (cmsConfigurationIssues().length) throw new ChatError('Connect the CMS database to use the live inbox.', 503);
    const payload = await chatPayload(), user = await chatStaff(request, payload), body = await chatBody(request), id = Number(body.id), action = body.action;
    if (!Number.isSafeInteger(id) || id < 1 || !['claim', 'bot', 'close', 'seen', 'reply'].includes(String(action))) throw new ChatError('Choose a valid conversation and action.');
    const text = action === 'reply' ? messageText(body.message) : '', key = requestID(body.requestId);
    const row = await chatTransaction(payload, async req => {
      const row = await payload.findByID({ collection: 'chat-conversations', id, depth: 0, req });
      const owner = typeof row.assignedTo === 'number' ? row.assignedTo : row.assignedTo?.id;
      const duplicate = await payload.find({ collection: 'chat-messages', where: { requestKey: { equals: `${id}:staff:${key}` } }, limit: 1, req });
      if (duplicate.docs.length) return row;
      if (owner && owner !== user.id && action !== 'seen') throw new ChatError('Another team member owns this chat. They can return it to the assistant before you take over.', 409);
      if (action === 'reply' && (row.status !== 'human' || owner !== user.id)) throw new ChatError('Take over the conversation before replying.', 409);
      if (row.status === 'closed' && action !== 'seen') throw new ChatError('This conversation is closed.', 409);
      const bodyText = action === 'reply' ? text : action === 'claim' ? `${user.name || 'The High4Tech team'} joined the conversation.` : action === 'bot' ? 'The studio assistant is back. You can also ask for our team again.' : action === 'close' ? 'The team closed this conversation. Start a new one whenever you need us.' : '';
      if (bodyText) await payload.create({ collection: 'chat-messages', req, data: { conversation: id, role: action === 'reply' ? 'staff' : 'system', body: bodyText, staffName: user.name || 'High4Tech team', requestKey: `${id}:staff:${key}` } });
      return payload.update({ collection: 'chat-conversations', id, req, data: { needsAttention: false, ...(bodyText ? { lastMessageAt: new Date().toISOString(), preview: bodyText } : {}), ...(action === 'claim' ? { status: 'human', assignedTo: user.id } : action === 'bot' ? { status: 'bot', assignedTo: null } : action === 'close' ? { status: 'closed', assignedTo: null } : {}) } });
    });
    return chatJSON(await chatSnapshot(payload, row));
  } catch (error) { return chatFailure(error); }
}
