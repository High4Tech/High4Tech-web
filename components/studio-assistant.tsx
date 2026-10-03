'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, SquarePen } from 'lucide-react';
import { useStudioContent } from './content-provider';
import { MascotFace } from './studio-extras';
import { BrandIcon } from './studio-sections';
import { playUiSound } from './sound';
import type { AssistantReply } from '@/lib/assistant-search';

type Message = { role: 'user' | 'assistant'; text: string; reply?: AssistantReply; question?: string; failed?: boolean; preview?: boolean };
export function StudioAssistant({ open }: { open: (path: string) => void }) {
  const { knowledge, assistant, socials } = useStudioContent();
  const [messages, setMessages] = useState<Message[]>([]), [input, setInput] = useState(''), [busy, setBusy] = useState(false);
  const history = useRef<HTMLDivElement>(null), lock = useRef(false), controller = useRef<AbortController | null>(null);
  useEffect(() => { history.current?.scrollTo({ top: history.current.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [messages, busy]);
  useEffect(() => () => controller.current?.abort(), []);
  async function ask(value: string) {
    const question = value.trim();
    if (!question || lock.current || !assistant.enabled) return;
    lock.current = true; setBusy(true); setInput('');
    setMessages(current => [...current, { role: 'user', text: question }]);
    const request = new AbortController(); controller.current = request;
    const timeout = setTimeout(() => request.abort(), 20_000);
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }), signal: request.signal });
      const reply = await response.json() as AssistantReply & { mode?: string; error?: string };
      if (!response.ok) throw new Error(reply.answer || reply.error || 'The assistant couldn’t connect. Please try again.');
      if (!reply.answer || !Array.isArray(reply.sources)) throw new Error('The assistant couldn’t read that response. Please try again.');
      setMessages(current => [...current, { role: 'assistant', text: reply.answer, reply, preview: reply.mode === 'preview' }]);
      playUiSound(reply.status === 'matched' || reply.status === 'conversation' ? 'notification' : 'click');
    } catch (error) {
      if (controller.current !== request) return;
      setMessages(current => [...current, { role: 'assistant', text: error instanceof Error && error.name !== 'AbortError' ? error.message : 'The request timed out. Please try again.', question, failed: true }]);
      playUiSound('error');
    } finally { clearTimeout(timeout); if (controller.current === request) { setBusy(false); lock.current = false; } }
  }
  function clear() { controller.current?.abort(); controller.current = null; lock.current = false; setBusy(false); setMessages([]); }
  return <div className="os-assistant">
    <header className="assistant-toolbar">
      <button aria-label="Clear conversation" title="New conversation" onClick={clear} disabled={!messages.length}><SquarePen size={19}/></button>
      <div className="assistant-recipient"><span className="assistant-avatar"><MascotFace/></span><strong>High4Tech</strong><span><i/>{assistant.enabled ? 'Studio assistant' : 'Currently paused'}</span></div>
      <span className="assistant-toolbar-spacer" aria-hidden="true"/>
    </header>
    <div className="assistant-conversation" ref={history}>
      <div className="assistant-date">Today · Studio messages</div>
      {!messages.length && <div className="assistant-intro"><h1>A conversation starts here.</h1><p>{assistant.enabled ? assistant.welcomeMessage : 'The assistant is paused. Our team is still here to help.'}</p></div>}
      {!messages.length && assistant.enabled && <div className="assistant-prompts">{knowledge.slice(0, 3).map(item => <button key={item.question} onClick={() => void ask(item.question)}>{item.question}<ArrowUpRight size={13}/></button>)}</div>}
      <div className="os-messages" role="log" aria-live="polite" aria-label="Conversation with High4Tech">
        {messages.map((message, index) => <div key={index} className={`os-message ${message.role} ${message.failed ? 'failed' : ''}`}>
          <span className="message-author">{message.role === 'user' ? 'You' : 'High4Tech assistant'}</span><p>{message.text}</p>
          {message.reply?.sources.map(source => <div className="assistant-source" key={source.id}><BookOpen size={12}/><span>{source.title}</span></div>)}
          {message.preview && message.reply?.status === 'matched' && <small className="assistant-preview-note">Studio guide · Preview</small>}
          {message.reply?.link && <button onClick={() => open(message.reply!.link!)}>{message.reply.label}<ArrowUpRight size={13}/></button>}
          {(message.reply?.status === 'not-found' || message.reply?.status === 'disabled' || message.failed) && <a className="assistant-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>Talk to our team<ArrowUpRight size={13}/></a>}
          {message.failed && <button disabled={busy} onClick={() => void ask(message.question!)}>Try again<ArrowUpRight size={12}/></button>}
        </div>)}
        {busy && <div className="assistant-thinking" role="status" aria-label="Checking studio knowledge"><i/><i/><i/><span className="message-author">Checking studio knowledge…</span></div>}
      </div>
    </div>
    <div className="assistant-compose-area"><form className="assistant-compose" onSubmit={event => { event.preventDefault(); void ask(input); }}><input value={input} onChange={event => setInput(event.target.value)} aria-label="Ask the assistant" placeholder="Message High4Tech" maxLength={500} disabled={!assistant.enabled}/><button aria-label="Send to assistant" disabled={!input.trim() || busy || !assistant.enabled}><ArrowUp size={18}/></button></form><div className="assistant-disclaimer">Studio knowledge · Conversation stays in this window</div></div>
  </div>;
}
