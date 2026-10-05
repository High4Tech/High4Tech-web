'use client';
import { useEffect, useRef, useState } from 'react';

/** Let’s Scroll's blob seek / queued-seek strategy, adapted to the existing film
 * and nested studio windows. One existing shot; no generated scene-chain claim. */
export function ScrollFilm({ title, body, label }: { title: string; body: string; label: string }) {
  const root = useRef<HTMLElement>(null), video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(true), [painted, setPainted] = useState(false);
  useEffect(() => {
    const section = root.current, film = video.current; if (!section || !film) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)'), phone = matchMedia('(max-width:700px)');
    let disposed = false, loading = false, visible = false, frame = 0, target = 0, blobURL = '';
    let request = new AbortController();
    const pane = section.closest<HTMLElement>('.window-scroll'), scrollRoot = pane || window;
    const allowed = () => enabled && !preference.matches && !phone.matches;
    function seek() { if (disposed || !allowed() || !visible || document.hidden || film!.readyState < 2 || film!.seeking || !Number.isFinite(film!.duration)) return; const next = Math.min(Math.max(0, target * film!.duration), Math.max(0, film!.duration - .05)); if (Math.abs(film!.currentTime - next) > .035) film!.currentTime = next; }
    function read() { frame = 0; const rect = section!.getBoundingClientRect(), top = pane?.getBoundingClientRect().top || 0, stage = section!.querySelector<HTMLElement>('.scroll-film-stage'); const travel = Math.max(1, rect.height - (stage?.offsetHeight || 400)); target = Math.max(0, Math.min(1, (top + (stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0) - rect.top) / travel)); section!.style.setProperty('--film-progress', String(target)); seek(); }
    function schedule() { if (!frame) frame = requestAnimationFrame(read); }
    function paintedFrame() { if (!disposed) setPainted(true); seek(); }
    function decoded() { if ('requestVideoFrameCallback' in film!) film!.requestVideoFrameCallback(paintedFrame); else requestAnimationFrame(paintedFrame); }
    async function load() { if (loading || !allowed()) return; loading = true; try { const response = await fetch('/ai/neural-surface.mp4', { signal: request.signal }); if (!response.ok) throw Error('Film unavailable'); const blob = await response.blob(); if (disposed) return; blobURL = URL.createObjectURL(blob); film!.src = blobURL; film!.load(); } catch { loading = false; } }
    function settingsChanged() { section!.classList.toggle('scroll-film-static', !allowed()); if (visible && allowed()) void load(); if (!allowed()) film!.pause(); schedule(); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { void load(); schedule(); } }, { root: pane, rootMargin: '200px' }); observer.observe(section);
    film.addEventListener('loadeddata', schedule); film.addEventListener('seeked', decoded);
    scrollRoot.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule, { passive: true }); document.addEventListener('visibilitychange', schedule); preference.addEventListener('change', settingsChanged); phone.addEventListener('change', settingsChanged);
    settingsChanged();
    return () => { disposed = true; request.abort(); observer.disconnect(); cancelAnimationFrame(frame); film.pause(); film.removeAttribute('src'); film.load(); if (blobURL) URL.revokeObjectURL(blobURL); film.removeEventListener('loadeddata', schedule); film.removeEventListener('seeked', decoded); scrollRoot.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule); preference.removeEventListener('change', settingsChanged); phone.removeEventListener('change', settingsChanged); };
  }, [enabled]);
  return <section ref={root} className="scroll-film" aria-label={label}><div className="scroll-film-stage"><img src="/ai/neural-surface-poster.jpg" alt="Orange sculptural motion study"/><video ref={video} className={painted ? 'painted' : ''} muted playsInline preload="none" aria-hidden="true"/><button className="scroll-film-mode" aria-pressed={enabled} onClick={() => { setPainted(false); setEnabled(v => !v); }}>{enabled ? 'Scroll to explore · pause motion' : 'Resume scroll motion'}</button><div className="scroll-film-copy"><small>{label}</small><h2>{title}</h2><p>{body}</p></div><div className="scroll-film-progress" aria-hidden="true"><i/></div></div></section>;
}
