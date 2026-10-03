'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, RotateCcw } from 'lucide-react';
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
      playUiSound(reply.status === 'matched' ? 'notification' : 'click');
    } catch (error) {
      if (controller.current !== request) return;
      setMessages(current => [...current, { role: 'assistant', text: error instanceof Error && error.name !== 'AbortError' ? error.message : 'The request timed out. Please try again.', question, failed: true }]);
      playUiSound('error');
    } finally { clearTimeout(timeout); if (controller.current === request) { setBusy(false); lock.current = false; } }
  }
  function clear() { controller.current?.abort(); controller.current = null; lock.current = false; setBusy(false); setMessages([]); }
  return <div className="os-assistant"><div className="assistant-toolbar"><span><i/>Studio knowledge</span><button aria-label="Clear conversation" onClick={clear} disabled={!messages.length}><RotateCcw size={14}/>New conversation</button></div><div className="assistant-conversation" ref={history}><div className={`assistant-intro ${messages.length ? 'has-messages' : ''}`}><MascotFace/><span className="os-kicker">YOUR STUDIO COMPANION</span><h1>A little clarity.<br/>Straight from the studio.</h1><p>{assistant.enabled ? assistant.welcomeMessage : 'The assistant is paused. Our team is still here to help.'}</p></div>{!messages.length && assistant.enabled && <div className="assistant-prompts">{knowledge.slice(0, 3).map(item => <button key={item.question} onClick={() => void ask(item.question)}>{item.question}<ArrowUpRight size={13}/></button>)}</div>}<div className="os-messages" role="log" aria-live="polite">{messages.map((message, index) => <div key={index} className={`os-message ${message.role} ${message.failed ? 'failed' : ''}`}><small>{message.role === 'user' ? 'YOU' : 'HIGH4TECH ASSISTANT'}</small><p>{message.text}</p>{message.reply?.sources.map(source => <div className="assistant-source" key={source.id}><BookOpen size={13}/><span>{source.kind === 'document' ? 'Document' : 'Approved answer'} · {source.title}</span></div>)}{message.preview && <small className="assistant-preview-note">Bundled studio knowledge · CMS not connected</small>}{message.reply?.link && <button onClick={() => open(message.reply!.link!)}>{message.reply.label}<ArrowUpRight size={13}/></button>}{(message.reply?.status === 'not-found' || message.reply?.status === 'disabled' || message.failed) && <a className="assistant-contact" href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>Talk to our team<ArrowUpRight size={13}/></a>}{message.failed && <button disabled={busy} onClick={() => void ask(message.question!)}>Try again<RotateCcw size={12}/></button>}</div>)}{busy && <div className="assistant-thinking" role="status"><i/><i/><i/><span>Checking studio knowledge…</span></div>}</div></div><form className="assistant-compose" onSubmit={event => { event.preventDefault(); void ask(input); }}><input value={input} onChange={event => setInput(event.target.value)} aria-label="Ask the assistant" placeholder="Ask about the studio…" maxLength={500} disabled={!assistant.enabled}/><button aria-label="Send to assistant" disabled={!input.trim() || busy || !assistant.enabled}><ArrowRight size={18}/></button></form><div className="assistant-disclaimer">Answers from published studio sources · No conversation history is saved</div></div>;
}
