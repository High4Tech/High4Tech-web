'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Scan, Pause, Play, Plus } from '@/components/icons';
import { useEffect, useRef, useState, Component, type ReactNode } from 'react';

const Scene = dynamic(() => import('./hero-scene'), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function Hero({editorial=false}:{editorial?:boolean}) {
  const area = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const inspection = useRef({ x: -1000, y: -1000, active: false, full: false, reduced: false, paused: false });
  const [wireframe, setWireframe] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    setSupported(!!canvas.getContext('webgl2'));
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { inspection.current.reduced = mq.matches; };
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!area.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {rootMargin:'100px'});
    observer.observe(area.current);
    return () => observer.disconnect();
  }, []);
  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !matchMedia('(min-width: 601px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    if ((event.target as HTMLElement).closest('button')) { leave(); return; }
    const rect = area.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    Object.assign(inspection.current, { x, y, active: true });
    if (lens.current) { lens.current.style.transform = `translate(${x}px, ${y}px)`; lens.current.style.opacity = '1'; }
  }
  function leave() { inspection.current.active = false; if (lens.current) lens.current.style.opacity = '0'; }
  return <section className={`hero wrap ${editorial?'editorial-hero':''}`} aria-labelledby="hero-heading">
    <div className="hero-topline"><span className="eyebrow"><span className="status-dot" /> Independent minds. Shared ambition.</span><span className="eyebrow hero-index">DESIGN & DEVELOPMENT / EST. 2021</span></div>
    <div className="hero-grid">
      <div className="hero-copy">
        {editorial ? <h1 id="hero-heading" className="editorial-hero-title">Ideas<br/><span>in motion.</span><br/>Built to last<em>.</em></h1> : <h1 id="hero-heading" className="hero-title"><span>IDEAS INTO</span><span className="impact-line">IMPACT<span className="orange">.</span></span></h1>}
        <div className="hero-description"><span className="tiny-star">✳</span><p>Brand worlds with a pulse.<br />Websites with a point of view.<br /><span>Design and technology, moving together.</span></p></div>
        <div className="hero-actions"><Link href="/contact" className="button orange-button">Start something <ArrowUpRight size={18} /></Link><a href="#selected-work" className="text-link">See the work <ArrowDown size={18} /></a></div>
      </div>
      <div className={`hero-art ${ready ? 'scene-ready' : ''} ${wireframe ? 'full-xray' : ''}`} ref={area} onPointerMove={move} onPointerLeave={leave} data-cursor="X-RAY" aria-label="Interactive orange four sculpture. Move your pointer to reveal its wireframe, or use the X-ray button.">
        <div className="art-grid" aria-hidden="true" />
        <Plus className="crosshair crosshair-tl" size={14} /><Plus className="crosshair crosshair-br" size={14} />
        <div className="hero-fallback" aria-hidden="true">4</div>
        {supported && <SceneBoundary><Scene state={inspection} running={visible} onReady={() => setReady(true)} /></SceneBoundary>}
        <div className="xray-lens" ref={lens} aria-hidden="true"><span>X-RAY / 04</span><i /><b /></div>
        <div className="art-top-meta"><span className="micro-label">FORM / 004</span><span className="micro-label">BUILT DIFFERENT.</span></div>
        <div className="art-bottom-meta"><span className="micro-label">A LITTLE CURIOUS?<br /><span className="muted">MOVE TO LOOK BENEATH THE SURFACE.</span></span><div className="art-controls">
          <button className="inspect-button" aria-pressed={wireframe} onPointerEnter={leave} onClick={() => { const next = !wireframe; setWireframe(next); inspection.current.full = next; }}><Scan size={14} /> {wireframe ? 'Solid view' : 'X-ray'}</button>
          <button className="pause-button" aria-label={paused ? 'Play sculpture animation' : 'Pause sculpture animation'} aria-pressed={paused} onClick={() => { setPaused(!paused); inspection.current.paused = !paused; }}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
        </div></div>
      </div>
    </div>
    <div className="hero-bottom"><span>GOOD IDEAS DESERVE<br />GREAT EXECUTION.</span><a href="#selected-work" className="scroll-link">Scroll to discover <ArrowDown size={17} /></a><span className="hero-bottom-right">CREATIVE THINKING.<br />TECHNICAL PRECISION.</span></div>
  </section>;
}
