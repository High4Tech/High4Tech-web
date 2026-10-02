'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, Menu, X, MessageCircle, Send, Plus, CalendarDays, Check, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socials } from '@/lib/content';
import { DesktopShell } from './desktop';
import { LandingNav, LandingFooter, LandingActions, StudioLoader } from './landing-chrome';
import { ClickSounds } from './sound';

export function BookingButton({ className = 'button orange-button', children = 'Book a discovery call' }: { className?: string; children?: React.ReactNode }) {
  return <button className={className} onClick={() => window.dispatchEvent(new Event('high4tech:booking'))}>{children}<ArrowUpRight size={18} /></button>;
}


function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const mq = matchMedia('(min-width: 601px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const node = cursor.current;
    if (!node) return;
    const move = (event: PointerEvent) => {
      if (!mq.matches || event.pointerType !== 'mouse') { document.body.classList.remove('custom-pointer'); node.style.opacity = '0'; return; }
      const target = event.target as HTMLElement;
      const editable = target.closest('input, textarea, select, [contenteditable="true"]');
      const context = target.closest<HTMLElement>('[data-cursor]');
      const value = context?.dataset.cursor || '';
      const allowed = /X-RAY|PROJECT|WORK|MEET US|SAY HI|HEY YOU|OPEN TOOL|READ/.test(value);
      document.body.classList.toggle('custom-pointer', !editable && allowed);
      node.style.opacity = editable || !allowed ? '0' : '1';
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      node.dataset.mode = value === 'X-RAY' ? 'xray' : value ? 'label' : 'default';
      if (label.current) label.current.textContent = value;
    };
    const clear = () => { node.style.opacity = '0'; document.body.classList.remove('custom-pointer'); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', clear);
    window.addEventListener('blur', clear);
    mq.addEventListener('change', clear);
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', clear); window.removeEventListener('blur', clear); mq.removeEventListener('change', clear); document.body.classList.remove('custom-pointer'); };
  }, [pathname]);
  return <div ref={cursor} className="custom-cursor" aria-hidden="true"><div className="cursor-body"><span ref={label} /></div></div>;
}

function Chat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([{ role: 'assistant', text: 'Hey, curious mind. What would you like to explore? This is a preview of our studio assistant.' }]);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const history = useRef<HTMLDivElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (history.current) history.current.scrollTop = history.current.scrollHeight; }, [messages, pending]);
  function ask(value: string) {
    const text = value.trim(); if (!text || pending) return;
    setMessages(m => [...m, { role: 'user', text }]); setInput(''); setPending(true);
    timer.current = setTimeout(() => {
      const answer = /tool|resource|buy|paid/i.test(text) ? 'Our Tools & Resources page brings free and paid tools together. Each tool takes you to its own platform for use, pricing, and purchases.' : /call|book|contact|start/i.test(text) ? 'Let’s start with your idea. Visit Contact to prepare an inquiry, or use WhatsApp to reach the studio directly. The calendar is a preview for now.' : /cost|price|time|timeline/i.test(text) ? 'Scope shapes both timing and cost. Tell us what you’re working on, and the studio can discuss a suitable approach. This preview does not provide quotes.' : 'We bring design and development together: visual identity, UI/UX, custom websites, and app experiences. Explore Services or tell the studio about your idea.';
      setMessages(m => [...m, { role: 'assistant', text: answer }]); setPending(false);
    }, 650);
  }
  return <>
    {open && <section className="chat-panel" aria-label="Studio assistant preview" onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
      <header><span className="chat-avatar"><img src="/brand/mascots.svg" alt="" /></span><div><strong>Your curious companion.</strong><span>STUDIO ASSISTANT · PREVIEW</span></div><button aria-label="Close assistant" onClick={() => setOpen(false)}><X size={18} /></button></header>
      <div ref={history} className="chat-history" role="log" aria-live="polite">{messages.map((m, i) => <p key={i} className={`chat-message ${m.role}`}>{m.text}</p>)}{pending && <p className="chat-message assistant">Thinking<span className="thinking">…</span></p>}</div>
      <div className="chat-suggestions">{['What do you do?', 'Explore tools', 'Start a project'].map(q => <button key={q} disabled={pending} onClick={() => ask(q)}>{q}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); ask(input); }}><input aria-label="Message the studio assistant" placeholder="Ask a little something…" value={input} onChange={e => setInput(e.target.value)} maxLength={500} /><button disabled={pending || !input.trim()} aria-label="Send message"><Send size={17} /></button></form>
      <Link className="chat-human" href="/contact" onClick={() => setOpen(false)}>Prefer a human? Talk to the studio <ArrowUpRight size={13} /></Link>
    </section>}
    <div className="floating-actions"><a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="whatsapp-button" aria-label="Contact High4Tech on WhatsApp"><MessageCircle size={20} /></a><button className="chat-launcher" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close studio assistant' : 'Open studio assistant'}>{open ? <X size={21} /> : <><span className="chat-dot" />Let’s talk <Plus size={17} /></>}</button></div>
  </>;
}

function BookingDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState('A new website');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const open = () => { setReady(false); dialog.current?.showModal(); };
    window.addEventListener('high4tech:booking', open);
    return () => window.removeEventListener('high4tech:booking', open);
  }, []);
  return <dialog className="booking-dialog" ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
    <div className="dialog-content"><button className="dialog-close" aria-label="Close booking preview" onClick={() => dialog.current?.close()}><X size={22} /></button><span className="eyebrow orange">A FIRST CONVERSATION</span><CalendarDays size={42} strokeWidth={1} /><h2>Big ideas.<br />Small beginnings.</h2><p>A discovery call is a chance to talk about what you have in mind and see where we can take it.</p><label htmlFor="call-topic">What’s on your mind?</label><select id="call-topic" value={topic} onChange={e => setTopic(e.target.value)}><option>A new website</option><option>Design & branding</option><option>An app or custom software</option><option>Something else</option></select>
      {ready ? <div className="booking-feedback" role="status"><Check size={20} /><p>This is the booking preview. No meeting has been scheduled. Share your idea with the studio to arrange a time.</p></div> : <button className="button orange-button" onClick={() => setReady(true)}>Explore a discovery call <ArrowUpRight size={17} /></button>}
      <Link className="text-link" href={`/contact?interest=${encodeURIComponent(topic)}`} onClick={() => dialog.current?.close()}>Send a project inquiry <ArrowUpRight size={16} /></Link><span className="preview-label">CALENDAR PREVIEW</span>
    </div>
  </dialog>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { window.scrollTo({top:0,behavior:'instant'}); }, [pathname]);
  if(pathname!=='/') return <><DesktopShell /><ClickSounds /></>;
  return <><a href="#main" className="skip-link">Skip to content</a><LandingNav /><main id="main">{children}</main><LandingFooter /><LandingActions /><Cursor /><StudioLoader /><ClickSounds /></>;
}
