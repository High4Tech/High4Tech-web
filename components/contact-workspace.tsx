'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Mail } from './icons';
import { ContactForm } from './contact-form';
import { useStudioContent } from './content-provider';

export function ContactWorkspace() {
  const { settings } = useStudioContent();
  return <div className="contact-workspace"><header><span className="inner-label">CONTACT THE STUDIO</span><h1>Tell us what<br/>you have in mind<span>.</span></h1><p>A new idea, a tricky problem or a project ready to move. Start here.</p><div className="contact-recipient"><Mail size={18}/><span>Your message goes to<strong>{settings.agencyName} Studio</strong><small>{settings.email}</small></span></div></header><section aria-label="Message form"><span className="inner-label">YOUR PROJECT BRIEF</span><ContactForm/></section></div>;
}

export function CalendarWorkspace({ open }: { open: (path: string) => void }) {
  const { settings } = useStudioContent();
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('A new website');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function shift(amount: number) { setMonth(m => new Date(m.getFullYear(), m.getMonth() + amount, 1)); }
  return <div className="booking-workspace"><header><span className="inner-label">LET’S FIND A STARTING POINT</span><h1>A little time.<br/>A bigger possibility<span>.</span></h1><p>Choose a preferred day to talk through your project.</p></header><div className="booking-panels"><section className="booking-context"><span className="booking-calendar-icon"><CalendarDays size={28}/></span><h2>Discovery conversation</h2><p>Introduce the idea. Ask a few questions. See where we could take it.</p><div><Clock3 size={17}/>30 minutes<span>Online</span></div><label>What would you like to discuss?<select value={topic} onChange={e => setTopic(e.target.value)}><option>A new website</option><option>Design & branding</option><option>An app or custom software</option><option>AI & automation</option><option>Something else</option></select></label><p className="booking-disclaimer">{settings.calLink ? 'Confirm live availability and reserve a time with our booking provider.' : 'Choose a preference. The studio will confirm availability with you — this is not a reservation.'}</p></section><section className="booking-month" aria-label="Preferred meeting date"><div className="booking-month-title"><h2>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2><div><button aria-label="Previous month" disabled={month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()} onClick={() => shift(-1)}><ArrowLeft size={18}/></button><button aria-label="Next month" onClick={() => shift(1)}><ArrowRight size={18}/></button></div></div><div className="booking-weekdays">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div><div className="booking-days">{Array.from({ length: offset }, (_, i) => <span key={'blank' + i}/>)}{Array.from({ length: days }, (_, i) => { const d = new Date(month.getFullYear(), month.getMonth(), i + 1); const value = iso(d); return <button key={value} disabled={d < today} aria-label={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} aria-pressed={date === value} className={value === iso(today) ? 'is-today' : ''} onClick={() => setDate(value)}>{i + 1}</button>; })}</div><div className="booking-selection">{date ? <><Check size={17}/>{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · preferred day</> : 'Select a day that works for you.'}</div>{settings.calLink ? <a className="premium-action" href={settings.calLink} target="_blank" rel="noopener noreferrer">Open live booking <ArrowUpRight size={18}/></a> : <button className="premium-action" disabled={!date} onClick={() => { sessionStorage.setItem('h4t-call-preference', JSON.stringify({ topic, date })); open('/contact'); }}>Request this day <ArrowUpRight size={18}/></button>}</section></div></div>;
}
