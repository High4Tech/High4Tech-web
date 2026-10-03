'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, SquarePen, UserRound } from 'lucide-react';
import { useStudioContent } from './content-provider';
import { MascotFace } from './studio-extras';
import { BrandIcon } from './studio-sections';
import { playUiSound } from './sound';
import type { AssistantReply } from '@/lib/assistant-search';
import type { ChatMessage, ChatSnapshot } from '@/lib/chat-types';
type Message = ChatMessage & { failed?: boolean; question?: string; requestId?: string; preview?: boolean };
export function StudioAssistant({ open }: { open: (path: string) => void }) {
  const { knowledge, assistant, socials } = useStudioContent();
  const [messages, setMessages] = useState<Message[]>([]), [input, setInput] = useState(''), [busy, setBusy] = useState(false), [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null), [error, setError] = useState(''), [profile, setProfile] = useState(false), [name, setName] = useState(''), [email, setEmail] = useState('');
  const history = useRef<HTMLDivElement>(null), lock = useRef(false), controller = useRef<AbortController | null>(null), epoch = useRef(0), sequence = useRef(-1), oldest = useRef<number | null>(null), more = useRef(false);
  const merge = useCallback((data: ChatSnapshot, replace = false, earlier = false) => {
    const first = data.messages[0]?.id;
    if(replace || oldest.current === null || earlier || first === oldest.current)more.current=Boolean(data.hasOlder);
    if(replace)oldest.current=first || null;else if(first)oldest.current=oldest.current===null?first:Math.min(oldest.current,first);
    setSnapshot({...data,hasOlder:more.current});
    setMessages(current => replace ? data.messages : [...new Map([...current.filter(m => m.id > 0), ...data.messages].map(m => [m.id, m])).values()].sort((a,b) => a.id-b.id));
  }, []);
  useEffect(() => {
    let active = true;
    const poll = async () => {
      if (lock.current || document.hidden) return;
      const revision = epoch.current;
      try { const response = await fetch('/api/chat', { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); if (active && revision === epoch.current) { if (data.mode === 'cms') merge(data); else setSnapshot(data); setError(''); } }
      catch { if (active) setError('Messages couldn’t connect. Try again, or contact the team on WhatsApp.'); }
    };
    void poll(); const timer = setInterval(poll, 3500); return () => { active = false; clearInterval(timer); controller.current?.abort(); };
  }, [merge]);
  useEffect(() => { history.current?.scrollTo({ top: history.current.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [messages.at(-1)?.id, busy]);
  async function send(action: 'send'|'handoff'|'profile'|'new', question = '', requestId = crypto.randomUUID()) {
    if (lock.current || !snapshot) return;
    lock.current = true; setBusy(true); setError(''); const revision = epoch.current;
    if (action === 'send') { setInput(''); setMessages(current => [...current.filter(m => !m.failed), { id: sequence.current--, role: 'visitor', body: question, createdAt: new Date().toISOString() }]); }
    const request = new AbortController(); controller.current = request; const timeout = setTimeout(() => request.abort(), 20000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, question, requestId, ...(action === 'profile' ? { name, email } : {}) }), signal: request.signal });
      const data = await response.json() as ChatSnapshot & { reply?: AssistantReply };
      if (!response.ok) throw new Error(data.error || 'Messages couldn’t connect. Please try again.');
      if (revision !== epoch.current) return;
      if (action === 'new') { epoch.current++; merge(data, true); }
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
  const status = snapshot?.conversation?.status || 'bot', human = status === 'human' || status === 'waiting', disabled = !snapshot || status === 'closed' || !assistant.enabled && !human;
  async function older() { const first = messages.find(m=>m.id>0); if (!first || busy) return; try { const r=await fetch(`/api/chat?before=${first.id}`); const data=await r.json(); if(!r.ok)throw Error(); merge(data,false,true); } catch { setError('Earlier messages couldn’t load. Please try again.'); } }
  return <div className="os-assistant assistant-live">
    <header className="assistant-toolbar"><button aria-label="New conversation" title="Start a new conversation" onClick={() => void send('new')} disabled={busy || !snapshot}><SquarePen size={19}/></button><div className="assistant-recipient"><span className="assistant-avatar"><MascotFace/></span><strong>High4Tech</strong><span><i/>{status === 'human' ? 'Studio team connected' : status === 'waiting' ? 'Waiting for the studio team' : status === 'closed' ? 'Conversation closed' : assistant.enabled ? 'Studio assistant' : 'Currently paused'}</span></div><button className="assistant-human" aria-label="Talk to a person" title="Talk to a person" onClick={() => void send('handoff')} disabled={busy || human || status === 'closed' || !snapshot}><UserRound size={18}/></button></header>
    {error && <div className="assistant-connection-error" role="alert">{error}<a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp</a></div>}
    {human && <div className="assistant-handoff-note"><span>{status === 'waiting' ? 'We’ve notified the team. Keep writing while you wait.' : 'A person is replying here. The assistant is paused.'}</span><a className="assistant-handoff-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp</a>{snapshot?.mode === 'cms' && <button onClick={()=>setProfile(!profile)}>Add your contact details</button>}</div>}
    {profile && <form className="assistant-profile" onSubmit={e=>{e.preventDefault();void send('profile');}}><input aria-label="Your name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required maxLength={100}/><input type="email" aria-label="Your email (optional)" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254}/><button className="os-button" disabled={busy}>Save</button></form>}
    <div className="assistant-conversation" ref={history}><div className="assistant-date">Studio messages</div>{snapshot?.hasOlder && <button className="assistant-history-button" onClick={()=>void older()}>Load earlier messages</button>}
      {!messages.length && <div className="assistant-intro"><h1>A conversation starts here.</h1><p>{assistant.enabled ? assistant.welcomeMessage : 'The assistant is paused. Our team is still here to help.'}</p></div>}
      {!messages.length && assistant.enabled && <div className="assistant-prompts"><button disabled={!snapshot || busy} onClick={()=>void send('send','Show me custom tools and resources')}>Find tools for my platform<ArrowUpRight size={13}/></button>{knowledge.slice(0, 2).map(item=><button key={item.question} disabled={!snapshot || busy} onClick={()=>void send('send',item.question)}>{item.question}<ArrowUpRight size={13}/></button>)}</div>}
      <div className="os-messages" role="log" aria-live="polite" aria-label="Conversation with High4Tech">{messages.map(message=><div key={message.id} className={`os-message ${message.role === 'visitor' ? 'user' : message.role} ${message.failed ? 'failed' : ''}`}><span className="message-author">{message.role === 'visitor' ? 'You' : message.role === 'staff' ? message.staffName || 'High4Tech team' : message.role === 'system' ? 'Studio messages' : 'High4Tech assistant'}</span><p>{message.body}</p>{message.reply?.resources?.map(resource=><button className="assistant-resource-result" key={resource.id} onClick={()=>open(`/tools-and-resources/${resource.id}`)}><span><small>{resource.platforms.join(' · ')} / {resource.price}</small><strong>{resource.title}</strong><span>{resource.description}</span></span><ArrowUpRight size={17}/></button>)}{message.reply?.sources.map(source=><div className="assistant-source" key={source.id}><BookOpen size={12}/><span>{source.title}</span></div>)}{message.reply?.link && <button onClick={()=>open(message.reply!.link!)}>{message.reply.label}<ArrowUpRight size={13}/></button>}{(message.reply?.status === 'not-found' || message.failed) && <a className="assistant-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>Talk to our team<ArrowUpRight size={13}/></a>}{message.failed && <button disabled={busy} onClick={()=>void send('send',message.question!,message.requestId)}>Try again<ArrowUpRight size={12}/></button>}</div>)}{busy && <div className="assistant-thinking" role="status" aria-label="Sending message"><i/><i/><i/></div>}</div>
    </div><div className="assistant-compose-area"><form className="assistant-compose" onSubmit={e=>{e.preventDefault();if(input.trim())void send('send',input.trim());}}><input value={input} onChange={e=>setInput(e.target.value)} aria-label="Ask the assistant" placeholder={status === 'closed' ? 'Start a new conversation to continue' : human ? 'Message the studio team' : 'Message High4Tech'} maxLength={500} disabled={disabled}/><button aria-label="Send message" disabled={!input.trim() || busy || disabled}><ArrowUp size={18}/></button></form><div className="assistant-disclaimer">{!snapshot ? 'Connecting to studio support…' : snapshot.mode === 'cms' ? 'Messages are saved for studio support · Private to you and our team' : 'Studio preview · Messages are not saved to the support inbox'}</div></div>
  </div>;
}
