'use client';
import { useField } from '@payloadcms/ui';
import { useRef, useState } from 'react';
import { FileUp, CheckCircle2 } from 'lucide-react';
import { importKnowledgeFile, MAX_KNOWLEDGE_BYTES } from '../../lib/knowledge-files';

export function KnowledgeImport() {
  const { value: existingText, setValue: setContent } = useField<string>({ path: 'content' });
  const { value: title, setValue: setTitle } = useField<string>({ path: 'title' });
  const { setValue: setSourceName } = useField<string>({ path: 'sourceName' });
  const [message, setMessage] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  async function read(file?: File) {
    if (!file) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (file.size > MAX_KNOWLEDGE_BYTES) throw new Error('Choose a file smaller than 256 KB. Split larger documents into separate sources.');
      if (existingText?.trim()) {
        if (!window.confirm('Importing a file replaces the text below. Continue?')) return;
      }
      let raw: string;
      try { raw = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer()); }
      catch { throw new Error('Export this document as UTF-8 text and try again.'); }
      const content = importKnowledgeFile(file.name, raw);
      setContent(content); setSourceName(file.name.slice(0, 200));
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').slice(0, 200));
      if (picker.current) picker.current.dataset.imported = 'true';
      setMessage(`${file.name} imported · ${content.length.toLocaleString()} characters. Review the text, then publish.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'This file couldn’t be imported.'); }
    finally { setBusy(false); if (picker.current) picker.current.value = ''; }
  }
  return <section className="h4t-import"><div><FileUp size={23}/><h3>Add a knowledge file</h3><p>TXT, Markdown, CSV, or JSON · UTF-8 · up to 256 KB.<br/>Its text is saved in your database. Publish only information visitors may see in an answer.</p></div><input ref={picker} type="file" accept=".txt,.md,.csv,.json" aria-label="Import a knowledge file" onChange={event => void read(event.target.files?.[0])}/><button type="button" className="h4t-admin-button" disabled={busy} onClick={() => picker.current?.click()}>{busy ? 'Reading…' : 'Choose a file'}</button>{message && <p className="h4t-import-success" role="status"><CheckCircle2 size={15}/>{message}</p>}{error && <p className="h4t-import-error" role="alert">{error}</p>}</section>;
}
