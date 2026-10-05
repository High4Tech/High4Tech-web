'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, FileText, RotateCcw, Trash2, Plus, X } from './icons';
export type DesktopFile = { id: string; title: string; kind: 'blog' | 'message' | 'note' | 'document'; path?: string; body?: string; image?: string };
type Storage = { files: DesktopFile[]; trashed: DesktopFile[]; moveToTrash: (file: DesktopFile) => void; restore: (id: string) => void; add: (file: DesktopFile) => void; empty: () => void };
const StorageContext = createContext<Storage>({ files: [], trashed: [], moveToTrash: () => {}, restore: () => {}, add: () => {}, empty: () => {} });
export const useDesktopStorage = () => useContext(StorageContext);
const initialFiles: DesktopFile[] = [
  { id: 'welcome-note', title: 'A little room for ideas', kind: 'note', body: 'Your personal desk. Keep an idea here, revisit a story, or move an item to Trash. Only this browser changes.' },
  { id: 'studio-readme', title: 'Studio guide.txt', kind: 'document', body: 'Open an app from the dock. Drag a window by its title bar. Drag dock icons to reorder them. Visit Home for the agency overview; Studio introduces our people and process.' },
  { id: 'studio-welcome', title: 'Welcome to High4Tech', kind: 'message', body: 'Have something in mind? Tell us about your project. We bring design, development and automation into the same conversation.', path: '/contact' },
];
export function isDesktopFile(value: unknown): value is DesktopFile {
  if (!value || typeof value !== 'object') return false;
  const f = value as Record<string, unknown>;
  return typeof f.id === 'string' && f.id.length <= 150 && typeof f.title === 'string' && f.title.length <= 200 && typeof f.kind === 'string' && ['blog', 'message', 'note', 'document'].includes(f.kind) && (f.body === undefined || (typeof f.body === 'string' && f.body.length <= 2500)) && (f.path === undefined || (typeof f.path === 'string' && /^\/(newsroom\/[a-z0-9-]+|contact)$/.test(f.path)));
}
function validate(value: unknown): DesktopFile[] { return Array.isArray(value) ? value.filter(isDesktopFile).slice(0, 100) : []; }
export function DesktopStorageProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState(initialFiles), [trashed, setTrashed] = useState<DesktopFile[]>([]), [ready, setReady] = useState(false);
  useEffect(() => { try { const value = JSON.parse(localStorage.getItem('h4t-desktop-files-v1') || 'null'); if (value) { setFiles(validate(value.files)); setTrashed(validate(value.trashed)); } } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem('h4t-desktop-files-v1', JSON.stringify({ files, trashed })); } catch {} }, [files, trashed, ready]);
  function moveToTrash(file: DesktopFile) { setTrashed(current => current.some(f => f.id === file.id) ? current : [...current, file].slice(-100)); setFiles(current => current.filter(f => f.id !== file.id)); }
  function restore(id: string) { const item = trashed.find(f => f.id === id); if (item && item.kind !== 'blog') setFiles(current => current.some(f => f.id === id) ? current : [...current, item].slice(-100)); setTrashed(current => current.filter(f => f.id !== id)); }
  return <StorageContext.Provider value={{ files, trashed, moveToTrash, restore, add: file => setFiles(current => [...current, file].slice(-100)), empty: () => setTrashed([]) }}>{children}</StorageContext.Provider>;
}
export const desktopFileDragType = 'application/x-h4t-desktop-file';
export function fileDrag(event: React.DragEvent, file: DesktopFile) { event.dataTransfer.setData(desktopFileDragType, JSON.stringify(file)); event.dataTransfer.effectAllowed = 'move'; }
export function DraggableFile({ file, children, className, as: Tag = 'div' }: { file: DesktopFile; children: ReactNode; className?: string; as?: 'div' | 'article' }) {
  const { moveToTrash } = useDesktopStorage();
  const gesture = useRef<{ x: number; y: number; moved: boolean } | null>(null), blockedUntil = useRef(0), hover = useRef(false);
  const [ghost, setGhost] = useState<{ x: number; y: number; over: boolean } | null>(null);
  const overTrash = (x: number, y: number) => !!document.elementFromPoint(x, y)?.closest('[data-dock-id="trash"]');
  function signal(over: boolean) { if (hover.current !== over) { hover.current = over; window.dispatchEvent(new CustomEvent('h4t:file-drag', { detail: over })); } }
  function finish() { gesture.current = null; setGhost(null); signal(false); }
  useEffect(() => () => { if (hover.current) window.dispatchEvent(new CustomEvent('h4t:file-drag', { detail: false })); }, []);
  return <><Tag className={className} onDragStart={e => e.preventDefault()}
    onPointerDown={e => { if (e.button !== 0 || (e.target as Element).closest('.file-trash-action')) return; gesture.current = { x: e.clientX, y: e.clientY, moved: false }; }}
    onPointerMove={e => { const start = gesture.current; if (!start) return; if (!start.moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return; if (!start.moved) e.currentTarget.setPointerCapture(e.pointerId); start.moved = true; blockedUntil.current = Date.now() + 400; const over = overTrash(e.clientX, e.clientY); signal(over); setGhost({ x: e.clientX, y: e.clientY, over }); }}
    onPointerUp={e => { if (gesture.current?.moved) { blockedUntil.current = Date.now() + 400; if (overTrash(e.clientX, e.clientY)) moveToTrash(file); } finish(); }}
    onPointerCancel={finish} onLostPointerCapture={finish} onPointerLeave={() => { if (!gesture.current?.moved) gesture.current = null; }}
    onClickCapture={e => { if (Date.now() < blockedUntil.current) { e.preventDefault(); e.stopPropagation(); } }}>{children}</Tag>
    {ghost && createPortal(<div className={`desktop-file-ghost ${ghost.over ? 'over-trash' : ''}`} style={{ left: ghost.x + 14, top: ghost.y - 45 }} aria-hidden="true"><FileText size={22}/><span>{file.title}<small>{ghost.over ? 'Release to move to Trash' : 'Drag to the dock’s Trash'}</small></span></div>, document.body)}</>;
}
export function TrashAction({ file }: { file: DesktopFile }) { const { moveToTrash } = useDesktopStorage(); return <button className="file-trash-action" title="Move to personal Trash" aria-label={`Move ${file.title} to Trash`} onClick={() => moveToTrash(file)}><Trash2 size={15}/></button>; }
export function TrashWorkspace({ open }: { open: (path: string) => void }) {
  const { trashed, restore, empty } = useDesktopStorage(); const [confirm, setConfirm] = useState(false);
  return <div className="inner-page trash-workspace"><header><span className="inner-label">PERSONAL DESKTOP / TRASH</span><h1>A second chance<span>.</span></h1><p>Restore something you put aside, or clear your personal Trash.</p><small>This affects this browser only. Published CMS content stays available to everyone else.</small></header><div className="personal-files-toolbar"><span>{trashed.length} {trashed.length === 1 ? 'item' : 'items'}</span><button disabled={!trashed.length} onClick={() => setConfirm(true)}><Trash2 size={15}/>Empty Trash</button></div>{confirm && <div className="trash-confirm" role="alert"><p>Clear {trashed.length} items from your personal Trash? Hidden blog cards will return to your library.</p><button onClick={() => { empty(); setConfirm(false); }}>Clear personal Trash</button><button onClick={() => setConfirm(false)}>Cancel</button></div>}<div className="trash-file-list">{trashed.map(file => <article key={file.id}><FileText size={26}/><div><strong>{file.title}</strong><small>{file.kind}</small></div>{file.path && <button onClick={() => open(file.path!)} aria-label={`Open ${file.title}`}><ArrowUpRight size={17}/></button>}<button onClick={() => restore(file.id)}><RotateCcw size={15}/>Restore</button></article>)}</div>{!trashed.length && <div className="trash-empty"><Trash2 size={52}/><h2>Nothing left behind.</h2><p>Drag a story or personal file into the dock’s Trash,<br/>or use its Trash button.</p></div>}</div>;
}
export function PersonalDesk({ open }: { open: (path: string) => void }) {
  const { files, add } = useDesktopStorage(); const [editing, setEditing] = useState(false), [title, setTitle] = useState(''), [body, setBody] = useState(''), [reading, setReading] = useState<DesktopFile | null>(null); const editor = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (editing || reading) editor.current?.showModal(); else editor.current?.close(); }, [editing, reading]);
  return <section className="personal-desk"><div className="inner-section-top"><div><span className="inner-label">YOUR DESK</span><h2>Keep a thought here.</h2></div><button className="inner-link" onClick={() => { setTitle(''); setBody(''); setEditing(true); }}><Plus size={16}/>New note</button></div><div className="personal-file-grid">{files.map(file => <DraggableFile key={file.id} as="article" file={file}><button className="personal-file-open" onClick={() => setReading(file)}><FileText size={25}/><small>{file.kind}</small><strong>{file.title}</strong><p>{file.body?.slice(0, 105)}</p></button><TrashAction file={file}/></DraggableFile>)}</div><dialog className="desk-note-dialog" ref={editor} onCancel={() => { setEditing(false); setReading(null); }}><button className="desk-note-close" aria-label="Close note" onClick={() => { setEditing(false); setReading(null); }}><X size={18}/></button>{editing ? <form onSubmit={e => { e.preventDefault(); add({ id: crypto.randomUUID(), title: title.trim(), body: body.trim(), kind: 'note' }); setEditing(false); }}><span className="inner-label">PERSONAL NOTE / THIS BROWSER</span><h2>A space for an idea.</h2><label>Title<input required maxLength={120} value={title} onChange={e => setTitle(e.target.value)}/></label><label>Your note<textarea required maxLength={2500} rows={6} value={body} onChange={e => setBody(e.target.value)}/></label><button className="premium-action">Save note</button></form> : reading && <div><span className="inner-label">{reading.kind}</span><h2>{reading.title}</h2><p className="desk-note-body">{reading.body}</p>{reading.path && <button className="premium-action" onClick={() => { setReading(null); open(reading.path!); }}>Start a conversation <ArrowUpRight size={15}/></button>}</div>}</dialog></section>;
}
