'use client';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Pause, Play } from './icons';

/** The supplied motion asset is shared by both campaigns; never carries sound. */
export function SurfaceFilm({ className = '', children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const updatePlayback = useRef<() => void>(() => {});
  const wanted = useRef(true), manual = useRef(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, disposed = false;
    const update = () => {
      if (visible && !document.hidden && wanted.current && (!motion.matches || manual.current)) {
        void video.play().catch(() => { if (!disposed) setPlaying(false); });
      } else video.pause();
    };
    updatePlayback.current = update;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(video);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      disposed = true; observer.disconnect(); video.pause();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      updatePlayback.current = () => {};
    };
  }, []);
  return <div className={`surface-film ${className}`}>
    <video ref={ref} muted loop playsInline preload="none" poster="/ai/neural-surface-poster.jpg"
      aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src="/ai/neural-surface.mp4" type="video/mp4" />
    </video>
    <div className="surface-film-shade" aria-hidden="true" />
    {children}
    <button className="surface-film-control" aria-label={playing ? 'Pause visual film' : 'Play visual film'} aria-pressed={playing}
      onClick={() => { wanted.current = !playing; manual.current = true; updatePlayback.current(); }}>
      {playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? 'Pause film' : 'Play film'}</span>
    </button>
  </div>;
}

/** Adapted from Agency-AI's ServiceCard pointer spotlight. See sources/templates/. */
export function useCardSpotlight(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = root.current;
    const motion = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!page) return;
    const move = (event: PointerEvent) => {
      if (!motion.matches) return;
      const card = (event.target as HTMLElement).closest<HTMLElement>('[data-premium-card]');
      if (!card || !page.contains(card)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    };
    page.addEventListener('pointermove', move, { passive: true });
    return () => page.removeEventListener('pointermove', move);
  }, [root]);
}
