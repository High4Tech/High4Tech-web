'use client';
import { useState } from 'react';
import { ArrowUpRight, BookOpen, Send } from 'lucide-react';
import type { AssistantReply } from '../../lib/assistant-search';
export function AssistantTest() {
  const [question, setQuestion] = useState(''), [reply, setReply] = useState<AssistantReply | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function test() {
    if (!question.trim() || busy) return;
    setBusy(true); setError(''); setReply(null);
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }), signal: AbortSignal.timeout(20_000) });
      const answer = await response.json();
      if (!response.ok) throw new Error(answer.answer || answer.error || 'The assistant couldn’t connect.');
      setReply(answer);
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="h4t-assistant-test"><div><span className="h4t-admin-eyebrow">TRY THE LIVE KNOWLEDGE</span><h3>What will visitors hear?</h3><p>This uses the same published sources as the website. Unsaved changes and drafts aren’t included.</p></div><form onSubmit={event => { event.preventDefault(); void test(); }}><input aria-label="Test a visitor question" placeholder="Ask a question from your knowledge files…" value={question} onChange={event => setQuestion(event.target.value)} maxLength={500}/><button type="submit" className="h4t-admin-button" disabled={busy || !question.trim()}><Send size={15}/>{busy ? 'Checking…' : 'Test answer'}</button></form>{error && <p role="alert" className="h4t-import-error">{error}</p>}{reply && <div className="h4t-test-result" aria-live="polite"><span className={`h4t-result-badge ${reply.status}`}>{reply.status === 'matched' ? 'Found in your knowledge' : reply.status === 'not-found' ? 'No supported answer' : 'Assistant paused'}</span><p>{reply.answer}</p>{reply.sources.map(source => <small key={source.id}><BookOpen size={13}/>{source.title}</small>)}</div>}<a href="/assistant" target="_blank" rel="noopener noreferrer">Open the assistant<ArrowUpRight size={13}/></a></section>;
}
