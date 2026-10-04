'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, SquarePen, UserRound } from '@/components/icons';
import { useStudioContent } from './content-provider';
import { MascotFace } from './studio-extras';
import { BrandIcon } from './studio-sections';
import { playUiSound } from './sound';
import type { AssistantReply } from '@/lib/assistant-search';
import type { ChatMessage, ChatSnapshot } from '@/lib/chat-types';
import { hasVisitorProfile, parseVisitorProfile } from '@/lib/chat-profile';
import { readVisitorCache, writeVisitorCache } from '@/lib/chat-cache';
import { chatRequest, startChatPolling } from '@/lib/chat-client';
type Message = ChatMessage & { failed?: boolean; question?: string; requestId?: string; preview?: boolean };
export function StudioAssistant({ open }: { open: (path: string) => void }) {
  const { knowledge, assistant, socials } = useStudioContent();
  const [messages, setMessages] = useState<Message[]>([]), [input, setInput] = useState(''), [busy, setBusy] = useState(false), [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null), [error, setError] = useState(''), [profile, setProfile] = useState(false), [name, setName] = useState(''), [email, setEmail] = useState(''), [phone, setPhone] = useState(''), [previewReady, setPreviewReady] = useState(false);
  const history = useRef<HTMLDivElement>(null), lock = useRef(false), controller = useRef<AbortController | null>(null), epoch = useRef(0), sequence = useRef(-1), oldest = useRef<number | null>(null), more = useRef(false);
  const merge = useCallback((data: ChatSnapshot, replace = false, earlier = false) => {
    const first = data.messages[0]?.id;
    if(replace || oldest.current === null || earlier || first === oldest.current)more.current=Boolean(data.hasOlder);
    if(replace)oldest.current=first || null;else if(first)oldest.current=oldest.current===null?first:Math.min(oldest.current,first);
    setSnapshot({...data,hasOlder:more.current});
    setMessages(current => replace ? data.messages : [...new Map([...current.filter(m => m.id > 0), ...data.messages].map(m => [m.id, m])).values()].sort((a,b) => a.id-b.id));
  }, []);
  useEffect(() => {
    let active = true, initialized = false;
    const saved = readVisitorCache(), pollController = new AbortController();
    if (saved.profile) { setName(saved.profile.name); setEmail(saved.profile.email); setPhone(saved.profile.phone); }
    const stop = startChatPolling(async () => {
      if (lock.current) return;
      const revision = epoch.current;
      try {
        const data = await chatRequest('/api/chat', { signal: pollController.signal }) as ChatSnapshot;
        if (!active || revision !== epoch.current) return;
        if (data.mode === 'cms') {
          if (!initialized && data.conversation && saved.snapshot?.mode === 'cms' && data.conversation.id === saved.snapshot.conversation?.id && saved.snapshot) merge(saved.snapshot, true);
          merge(data);
          if (!initialized && data.conversation) { setName(data.conversation.visitorName); setEmail(data.conversation.visitorEmail || ''); setPhone(data.conversation.visitorPhone || ''); }
        } else {
          setSnapshot(data);
          if (!initialized && saved.snapshot?.mode === 'preview') { setMessages(saved.snapshot.messages); sequence.current=Math.min(-1,...saved.snapshot.messages.map(m=>m.id))-1; }
          if (saved.profile) setPreviewReady(true);
        }
        initialized = true; setError('');
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Messages couldn’t connect. Please retry.'); }
    }, 2000);
    return () => { active = false; stop(); pollController.abort(); controller.current?.abort(); };
  }, [merge]);
  useEffect(() => {
    if (!snapshot) return;
    const savedProfile = parseVisitorProfile({ name, email, phone });
    if (hasVisitorProfile(snapshot.conversation) || snapshot.mode === 'preview' && previewReady) writeVisitorCache(savedProfile, { ...snapshot, messages: messages.filter(m => !m.failed && (snapshot.mode === 'preview' || m.id > 0)) });
  }, [snapshot, messages, name, email, phone, previewReady]);
  useEffect(() => { history.current?.scrollTo({ top: history.current.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [messages.at(-1)?.id, busy]);
  async function send(action: 'send'|'handoff'|'profile'|'new', question = '', requestId = crypto.randomUUID()) {
    if (lock.current || !snapshot) return;
    if (action === 'profile' && !parseVisitorProfile({name,email,phone})) { setError('Add your name, a valid email, and phone number with country code.'); return; }
    if (action === 'profile' && snapshot.mode === 'preview') { setPreviewReady(true); setProfile(false); writeVisitorCache(parseVisitorProfile({name,email,phone}), snapshot); return; }
    if ((action === 'send' || action === 'handoff') && !(hasVisitorProfile(snapshot.conversation) || snapshot.mode === 'preview' && previewReady)) { setProfile(true); return; }
    lock.current = true; setBusy(true); setError(''); const revision = epoch.current;
    if (action === 'send') { setInput(''); setMessages(current => [...current.filter(m => !m.failed), { id: sequence.current--, role: 'visitor', body: question, createdAt: new Date().toISOString() }]); }
    const request = new AbortController(); controller.current = request; const timeout = setTimeout(() => request.abort(), 20000);
    try {
      const data = await chatRequest('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, question, requestId, ...(action === 'profile' ? { name, email, phone } : {}) }), signal: request.signal }) as ChatSnapshot & { reply?: AssistantReply };
      if (revision !== epoch.current) return;
      if (action === 'new') { epoch.current++; merge(data, true); writeVisitorCache(parseVisitorProfile({name,email,phone}), data); }
      else if (data.mode === 'cms') merge(data);
      else if (data.reply) { setSnapshot(data); setMessages(current => [...current, { id: sequence.current--, role: 'assistant', body: data.reply!.answer, reply: data.reply, createdAt: new Date().toISOString(), preview: true }]); }
      setProfile(false); playUiSound('notification');
    } catch (cause) {
      if (revision !== epoch.current) return;
      const body = cause instanceof Error && cause.name !== 'AbortError' ? cause.message : 'That request timed out. Try again.';
      setError(body);
      if (action === 'send') setMessages(current => [...current, { id: sequence.current--, role: 'system', body, createdAt: new Date().toISOString(), failed: true, question, requestId }]);
      playUiSound('error');
    } finally { clearTimeout(timeout); lock.current = false; setBusy(false); }
  }
  const status = snapshot?.conversation?.status || 'bot', human = status === 'human' || status === 'waiting';
  const ready = hasVisitorProfile(snapshot?.conversation) || snapshot?.mode === 'preview' && previewReady;
  const disabled = !snapshot || !ready || status === 'closed' || !assistant.enabled && !human;
  const needsProfile = snapshot && status !== 'closed' && !ready;
  async function older() { const first = messages.find(m=>m.id>0); if (!first || busy) return; try { const r=await fetch(`/api/chat?before=${first.id}`); const data=await r.json(); if(!r.ok)throw Error(); merge(data,false,true); } catch { setError('Earlier messages couldn’t load. Please try again.'); } }
  return <div className="os-assistant assistant-live">
    <header className="assistant-toolbar"><button aria-label="New conversation" title="Start a new conversation" onClick={() => void send('new')} disabled={busy || !snapshot}><SquarePen size={19}/></button><div className="assistant-recipient"><span className="assistant-avatar"><MascotFace/></span><strong>High4Tech</strong><span><i/>{status === 'human' ? 'Studio team connected' : status === 'waiting' ? 'Waiting for the studio team' : status === 'closed' ? 'Conversation closed' : assistant.enabled ? 'Studio assistant' : 'Currently paused'}</span></div><button className="assistant-human" aria-label="Talk to a person" title="Talk to a person" onClick={() => void send('handoff')} disabled={busy || human || status === 'closed' || !snapshot || !ready}><UserRound size={18}/></button></header>
    {error && <div className="assistant-connection-error" role="alert">{error}<a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp</a></div>}
    {human && <div className="assistant-handoff-note"><span>{status === 'waiting' ? 'We’ve notified the team. Keep writing while you wait.' : 'A person is replying here. The assistant is paused.'}</span><a className="assistant-handoff-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp</a><button onClick={()=>setProfile(!profile)}>Your profile</button></div>}
    {(needsProfile || profile) && <form className="assistant-profile assistant-profile-gate" onSubmit={e=>{e.preventDefault();void send('profile');}}><div className="assistant-profile-heading"><span className="assistant-avatar"><MascotFace/></span><h2>{ready ? 'Your studio profile.' : 'First, a little hello.'}</h2><p>{ready ? 'Keep your contact details up to date.' : 'Tell us who we’re speaking with. We’ll remember this browser so you can pick up where you left off.'}</p></div><label>Name<input name="name" autoComplete="name" aria-label="Your name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={100}/></label><label>Phone number<input name="tel" type="tel" autoComplete="tel" aria-label="Your phone number" placeholder="+92 300 1234567" value={phone} onChange={e=>setPhone(e.target.value)} required maxLength={40}/></label><label>Email<input name="email" type="email" autoComplete="email" aria-label="Your email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></label><small>{snapshot?.mode === 'preview' ? 'Preview mode: details stay in this browser. The online team inbox is not connected yet.' : 'Your details and messages are saved for studio support. Returning on this browser restores your chat; details are self-reported.'}</small><button className="os-button" disabled={busy || !snapshot}>{busy ? 'Connecting…' : ready ? 'Save profile' : 'Start conversation'}<ArrowUpRight size={15}/></button>{ready && <button type="button" className="os-text-button" onClick={()=>setProfile(false)}>Cancel</button>}</form>}
    <div className="assistant-conversation" ref={history} hidden={Boolean(needsProfile || profile)}><div className="assistant-date">Studio messages</div>{snapshot?.hasOlder && <button className="assistant-history-button" onClick={()=>void older()}>Load earlier messages</button>}
      {!messages.length && <div className="assistant-intro"><h1>A conversation starts here.</h1><p>{assistant.enabled ? assistant.welcomeMessage : 'The assistant is paused. Our team is still here to help.'}</p></div>}
      {!messages.length && assistant.enabled && <div className="assistant-prompts"><button disabled={!snapshot || !ready || busy} onClick={()=>void send('send','Show me custom tools and resources')}>Find tools for my platform<ArrowUpRight size={13}/></button>{knowledge.slice(0, 2).map(item=><button key={item.question} disabled={!snapshot || !ready || busy} onClick={()=>void send('send',item.question)}>{item.question}<ArrowUpRight size={13}/></button>)}</div>}
      <div className="os-messages" role="log" aria-live="polite" aria-label="Conversation with High4Tech">{messages.map(message=><div key={message.id} className={`os-message ${message.role === 'visitor' ? 'user' : message.role} ${message.failed ? 'failed' : ''}`}><span className="message-author">{message.role === 'visitor' ? 'You' : message.role === 'staff' ? message.staffName || 'High4Tech team' : message.role === 'system' ? 'Studio messages' : 'High4Tech assistant'}</span><p>{message.body}</p>{message.reply?.resources?.map(resource=><button className="assistant-resource-result" key={resource.id} onClick={()=>open(`/tools-and-resources/${resource.id}`)}><span><small>{resource.platforms.join(' · ')} / {resource.price}</small><strong>{resource.title}</strong><span>{resource.description}</span></span><ArrowUpRight size={17}/></button>)}{message.reply?.sources.map(source=><div className="assistant-source" key={source.id}><BookOpen size={12}/><span>{source.title}</span></div>)}{message.reply?.link && <button onClick={()=>open(message.reply!.link!)}>{message.reply.label}<ArrowUpRight size={13}/></button>}{(message.reply?.status === 'not-found' || message.failed) && <a className="assistant-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>Talk to our team<ArrowUpRight size={13}/></a>}{message.failed && <button disabled={busy} onClick={()=>void send('send',message.question!,message.requestId)}>Try again<ArrowUpRight size={12}/></button>}</div>)}{busy && <div className="assistant-thinking" role="status" aria-label="Sending message"><i/><i/><i/></div>}</div>
    </div><div className="assistant-compose-area" hidden={Boolean(needsProfile || profile)}><form className="assistant-compose" onSubmit={e=>{e.preventDefault();if(input.trim())void send('send',input.trim());}}><input value={input} onChange={e=>setInput(e.target.value)} aria-label="Ask the assistant" placeholder={status === 'closed' ? 'Start a new conversation to continue' : human ? 'Message the studio team' : 'Message High4Tech'} maxLength={500} disabled={disabled}/><button aria-label="Send message" disabled={!input.trim() || busy || disabled}><ArrowUp size={18}/></button></form><div className="assistant-disclaimer">{!snapshot ? 'Connecting to studio support…' : snapshot.mode === 'cms' ? 'Messages are saved for studio support · Private to you and our team' : 'Studio preview · Messages are not saved to the support inbox'}</div></div>
  </div>;
}
