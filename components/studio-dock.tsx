'use client';
import { useEffect, useRef, useState } from 'react';
import { Monitor } from './icons';
import { MacIcon } from './studio-apps';
import { MascotFace } from './studio-extras';
import { desktopFileDragType, isDesktopFile, useDesktopStorage } from './desktop-storage';
type DockApp = { id: string; label: string; path: string; color: string; icon: typeof Monitor };
export function StudioDock({ apps, activeId, runningIds, open, showDesktop }: { apps: DockApp[]; activeId: string; runningIds: string[]; open: (path: string) => void; showDesktop: () => void }) {
  const defaults = ['home', ...apps.filter(a => !['home', 'pricing', 'trash'].includes(a.id)).map(a => a.id), 'desktop', 'trash'];
  const [order, setOrder] = useState(defaults), [ready, setReady] = useState(false), [dragging, setDragging] = useState(''), [dropTarget, setDropTarget] = useState(false), [announcement, setAnnouncement] = useState('');
  const gesture = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null), blockedUntil = useRef(0);
  const { trashed, moveToTrash } = useDesktopStorage();
  useEffect(() => { const onFileDrag = (e: Event) => setDropTarget((e as CustomEvent).detail === true); window.addEventListener('h4t:file-drag', onFileDrag); return () => window.removeEventListener('h4t:file-drag', onFileDrag); }, []);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem('h4t-dock-order-v1') || 'null'); if (Array.isArray(saved)) { const valid = [...new Set(saved.filter(id => defaults.includes(id)))]; setOrder([...valid, ...defaults.filter(id => !valid.includes(id))]); } } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem('h4t-dock-order-v1', JSON.stringify(order)); } catch {} }, [order, ready]);
  function reorder(source: string, target: string) { if (source === target) return; setOrder(current => { const from = current.indexOf(source), to = current.indexOf(target); if (from < 0 || to < 0) return current; const next = [...current]; next.splice(from, 1); next.splice(to, 0, source); return next; }); }
  function move(e: React.PointerEvent<HTMLElement>) { const start = gesture.current; if (!start) return; if (!start.moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return; if (!start.moved) e.currentTarget.setPointerCapture(e.pointerId); start.moved = true; blockedUntil.current = Date.now() + 400; setDragging(start.id); const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-dock-id]')?.dataset.dockId; if (target) reorder(start.id, target); }
  function end() { if (gesture.current?.moved) { blockedUntil.current = Date.now() + 400; setAnnouncement('Dock arrangement saved for this browser.'); } gesture.current = null; setDragging(''); }
  return <nav className={`os-dock personal-dock ${dragging ? 'dock-reordering' : ''}`} aria-label="Studio dock" onDragStart={e => e.preventDefault()} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
    <span className="sr-only" id="dock-reorder-help">Drag icons to arrange. With a focused icon, hold Alt and press Left or Right to move it.</span>
    {order.map(id => { const app = apps.find(a => a.id === id), desktop = id === 'desktop', trash = id === 'trash'; if (!app && !desktop) return null; const label = desktop ? 'Desktop' : app!.label;
      return <button key={id} data-dock-id={id} data-tip={id} className={`dock-item ${activeId === id ? 'dock-active' : ''} ${dragging === id ? 'dock-dragging' : ''} ${trash && dropTarget ? 'trash-drop-target' : ''}`} aria-label={desktop ? 'Show desktop' : `Open ${label}`} aria-describedby="dock-reorder-help" aria-pressed={activeId === id}
        onPointerDown={e => { if (e.button !== 0 || (e.pointerType === 'touch' && matchMedia('(max-width:700px)').matches)) return; gesture.current = { id, x: e.clientX, y: e.clientY, moved: false }; }}
        onKeyDown={e => { if (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const target = order[order.indexOf(id) + (e.key === 'ArrowLeft' ? -1 : 1)]; if (target) { reorder(id, target); setAnnouncement(`${label} moved ${e.key === 'ArrowLeft' ? 'left' : 'right'}.`); } } }}
        onClick={() => { if (Date.now() < blockedUntil.current) return; desktop ? showDesktop() : open(app!.path); }}
        onDragOver={e => { if (trash && e.dataTransfer.types.includes(desktopFileDragType)) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropTarget(true); } }} onDragLeave={() => setDropTarget(false)}
        onDrop={e => { if (!trash) return; e.preventDefault(); setDropTarget(false); try { const file: unknown = JSON.parse(e.dataTransfer.getData(desktopFileDragType)); if (isDesktopFile(file)) { moveToTrash(file); setAnnouncement(`${file.title} moved to personal Trash.`); } } catch {} }}>
        <span className={`dock-icon ${desktop ? 'desktop' : app!.color}`}>{desktop ? <Monitor size={28}/> : trash ? <MacIcon name="trash" full={trashed.length > 0}/> : id === 'toolkit' ? <MacIcon name="toolkit"/> : id === 'safari' ? <MacIcon name="safari"/> : id === 'gallery' ? <MacIcon name="photos"/> : id === 'tools' ? <MacIcon name="appstore"/> : id === 'work' ? <MacIcon name="finder"/> : id === 'assistant' ? <MascotFace/> : id === 'calendar' ? <><small suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small><b suppressHydrationWarning>{new Date().getDate()}</b></> : app && <app.icon size={30} strokeWidth={1.5}/>}</span>
        <span className="dock-tooltip">{label}{trash && trashed.length > 0 ? ` · ${trashed.length}` : ''}</span><i className={runningIds.includes(id) ? 'running' : ''}/>
      </button>;
    })}<span className="sr-only" role="status" aria-live="polite">{announcement}</span>
  </nav>;
}
