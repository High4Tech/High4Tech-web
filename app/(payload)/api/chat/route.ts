import { cmsConfigurationIssues } from '@/lib/cms-runtime';
import { answerAssistant } from '@/lib/assistant-response';
import { hasVisitorProfile, parseVisitorProfile } from '@/lib/chat-profile';
import { ChatError, chatJSON, chatBody, chatFailure, chatPayload, chatSnapshot, chatTransaction, messageText, newChatToken, ownConversation, requestID, requireChatOrigin, startConversation, tokenFrom, wantsHuman } from '@/lib/chat-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (cmsConfigurationIssues().length) return chatJSON({ mode: 'preview', conversation: null, messages: [] });
  try {
    const token = tokenFrom(request) || newChatToken(), payload = await chatPayload();
    const before = Number(new URL(request.url).searchParams.get('before')) || undefined;
    return chatJSON(await chatSnapshot(payload, await ownConversation(payload, token), before), 200, token, request);
  } catch (error) { return chatFailure(error); }
}
export async function POST(request: Request) {
  try {
    requireChatOrigin(request); const body = await chatBody(request);
    const action = body.action || 'send';
    if (!['send', 'handoff', 'new', 'profile'].includes(String(action))) throw new ChatError('Unknown chat action.');
    const previous = tokenFrom(request), token = action === 'new' ? newChatToken() : previous || newChatToken();
    const question = action === 'send' ? messageText(body.question) : action === 'handoff' ? 'I’d like to talk to a real human.' : '';
    const handoff = action === 'handoff' || wantsHuman(question);
    if (cmsConfigurationIssues().length) {
      if (action === 'new') return chatJSON({ mode: 'preview', conversation: null, messages: [] });
      if (handoff || action === 'profile') throw new ChatError('Live chat isn’t connected on this website yet. Please contact our team on WhatsApp or email.', 503);
      return chatJSON({ mode: 'preview', reply: await answerAssistant(question), conversation: null, messages: [] });
    }
    const payload = await chatPayload(), key = requestID(body.requestId);
    const initial = previous ? await ownConversation(payload, previous) : undefined;
    if (action === 'new') {
      const profile = initial && parseVisitorProfile({name:initial.visitorName,email:initial.visitorEmail,phone:initial.visitorPhone});
      const row = profile ? await chatTransaction(payload, req => startConversation(payload, token, req, profile)) : undefined;
      return chatJSON(await chatSnapshot(payload, row), 200, token, request);
    }
    const profile = action === 'profile' ? parseVisitorProfile(body) : null;
    if (action === 'profile' && !profile) throw new ChatError('Add your name, a valid email, and phone number with country code.');
    if (action !== 'profile' && !hasVisitorProfile(initial)) throw new ChatError('Add your name, phone number, and email before starting chat.', 428);
    if (initial?.status === 'closed') throw new ChatError('This conversation is closed. Start a new conversation.', 409);
    // Knowledge stays fresh and is read before the write lock. The transaction
    // rechecks takeover state, so staff and assistant never reply concurrently.
    const reply = question && !handoff && initial?.status === 'bot' ? await answerAssistant(question) : undefined;
    const row = await chatTransaction(payload, async req => {
      const conversation = await ownConversation(payload, token, req) || (profile ? await startConversation(payload, token, req, profile) : undefined);
      if (!conversation) throw new ChatError('Add your contact details before starting chat.', 428);
      if (conversation.status === 'closed') throw new ChatError('This conversation is closed. Start a new conversation.', 409);
      if (action === 'profile') return payload.update({ collection: 'chat-conversations', id: conversation.id, req, overrideAccess: true, data: { visitorName: profile!.name, visitorEmail: profile!.email, visitorPhone: profile!.phone } });
      if (!hasVisitorProfile(conversation)) throw new ChatError('Complete your contact details first.', 428);
      const duplicate = await payload.find({ collection: 'chat-messages', where: { requestKey: { equals: `${conversation.id}:${key}` } }, limit: 1, req, overrideAccess: true });
      if (duplicate.docs.length) return conversation;
      if (conversation.lastVisitorAt && Date.now() - Date.parse(conversation.lastVisitorAt) < 800) throw new ChatError('Please wait a moment before sending again.', 429);
      const now = new Date().toISOString();
      await payload.create({ collection: 'chat-messages', req, overrideAccess: true, data: { conversation: conversation.id, role: 'visitor', body: question, requestKey: `${conversation.id}:${key}` } });
      const waiting = handoff && conversation.status === 'bot';
      const assistantReply = waiting ? { status: 'conversation' as const, answer: 'I’ve let our team know you’d like to speak with a person. You can keep writing here; a team member will reply when available. For a quicker contact, use WhatsApp.', sources: [] } : conversation.status === 'bot' && !handoff ? reply : undefined;
      if (assistantReply) await payload.create({ collection: 'chat-messages', req, overrideAccess: true, data: { conversation: conversation.id, role: 'assistant', body: assistantReply.answer, reply: assistantReply, requestKey: `${conversation.id}:${key}:reply` } });
      return payload.update({ collection: 'chat-conversations', id: conversation.id, req, overrideAccess: true, data: { lastMessageAt: now, lastVisitorAt: now, preview: question, ...(waiting ? { status: 'waiting', needsAttention: true, handoffAt: now } : {}), ...(conversation.status === 'human' ? { needsAttention: true } : {}) } });
    });
    return chatJSON(await chatSnapshot(payload, row), 200, token, request);
  } catch (error) { return chatFailure(error); }
}
