'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from '@/components/icons';
import type { GlobeInstance } from 'globe.gl';

// Illustrative links, not a live cable map or a claim about studio locations.
const routes = [
  { name: 'Atlantic link', coords: [[-74,40],[-62,37],[-45,39],[-29,43],[-12,49],[0,51]] },
  { name: 'Europe to Asia', coords: [[0,51],[9,44],[24,36],[35,30],[45,20],[56,24],[67,25],[77,12],[95,5],[104,1]] },
  { name: 'Pacific link', coords: [[104,1],[119,15],[133,29],[140,36],[158,32],[178,28],[-164,29],[-145,33],[-122,38]] },
  { name: 'Southern link', coords: [[104,1],[113,-12],[123,-23],[140,-34],[151,-34]] },
  { name: 'Indian Ocean link', coords: [[18,-34],[35,-32],[48,-23],[60,-12],[67,4],[67,25]] },
  { name: 'Africa to Europe', coords: [[18,-34],[4,-17],[-10,1],[-20,22],[-13,39],[0,51]] },
  { name: 'Americas link', coords: [[-74,40],[-70,22],[-52,7],[-43,-23]] },
  { name: 'South Atlantic link', coords: [[-43,-23],[-24,-29],[-3,-31],[18,-34]] },
  { name: 'North Atlantic link', coords: [[-74,40],[-58,49],[-35,59],[-13,57],[0,51]] },
  { name: 'Arabian Sea link', coords: [[55,25],[59,18],[64,14],[71,10],[80,6],[93,1],[104,1]] },
  { name: 'East Asia link', coords: [[104,1],[112,6],[120,22],[127,29],[140,36]] },
  { name: 'Western Pacific link', coords: [[140,36],[147,22],[153,8],[157,-12],[151,-34]] },
];
const nodes = [{lat:40,lng:-74},{lat:51,lng:0},{lat:25,lng:67},{lat:1,lng:104},{lat:36,lng:140},{lat:38,lng:-122},{lat:-34,lng:151},{lat:-34,lng:18},{lat:-23,lng:-43}];
const initialView = { lat: 24, lng: 45, altitude: 1.65 };

export default function AIGlobe() {
  const host = useRef<HTMLDivElement>(null), instance = useRef<GlobeInstance | null>(null);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [rotating, setRotating] = useState(true);
  const rotation = useRef(true);
  useEffect(() => {
    if (!host.current) return;
    const element: HTMLDivElement = host.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    rotation.current = !reduced.matches; setRotating(!reduced.matches);
    let disposed = false, started = false, visible = false, globe: GlobeInstance | undefined;
    const visibility = () => { if (globe) { if (visible && !document.hidden) globe.resumeAnimation(); else globe.pauseAnimation(); } };
    const resize = new ResizeObserver(() => {
      if (globe && element.clientWidth && element.clientHeight) globe.width(element.clientWidth).height(element.clientHeight);
    });
    const lost = (event: Event) => { event.preventDefault(); setFailed(true); setReady(false); globe?.pauseAnimation(); };
    async function initialize() {
      if (started) return;
      started = true;
      try {
        const { default: Globe } = await import('globe.gl');
        if (disposed) return;
        globe = new Globe(element, { animateIn: !reduced.matches, rendererConfig: { antialias: true, alpha: true } })
          .width(element.clientWidth).height(element.clientHeight).backgroundColor('#00000000')
          .globeImageUrl('/ai/earth-dark.jpg').bumpImageUrl('/ai/earth-topology.png')
          .showAtmosphere(true).atmosphereColor('#f97328').atmosphereAltitude(.12)
          .pathsData(routes).pathPoints('coords').pathPointLat(p => p[1]).pathPointLng(p => p[0])
          .pathPointAlt(.008).pathColor((path: object) => routes.findIndex(route => route === path) % 3 === 0 ? '#f6d6bc' : '#f97328')
          .pathStroke(.75).pathLabel('name').pathDashLength(reduced.matches ? 1 : .28).pathDashGap(.04).pathDashAnimateTime(reduced.matches ? 0 : 8500)
          .pointsData(nodes).pointColor(() => '#ffae76').pointAltitude(.012).pointRadius(.32)
          .onGlobeReady(() => { if (!disposed) { setReady(true); visibility(); } });
        instance.current = globe;
        globe.pointOfView(initialView, 0);
        const controls = globe.controls();
        controls.enableZoom = false; controls.enablePan = false; controls.autoRotate = rotation.current; controls.autoRotateSpeed = .45;
        globe.renderer().setPixelRatio(Math.min(devicePixelRatio, 1.6));
        globe.renderer().domElement.addEventListener('webglcontextlost', lost);
        resize.observe(element); visibility();
      } catch { if (!disposed) { setFailed(true); setReady(false); } }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) void initialize();
      visibility();
    }, { threshold: .05 });
    const motion = () => { rotation.current = !reduced.matches; setRotating(!reduced.matches); if (globe) { globe.controls().autoRotate = rotation.current; globe.pathDashAnimateTime(reduced.matches ? 0 : 8500); globe.pathDashLength(reduced.matches ? 1 : .28); } };
    observer.observe(element); document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', motion);
    return () => {
      disposed = true; observer.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', motion);
      if (globe) { globe.renderer().domElement.removeEventListener('webglcontextlost', lost); globe._destructor(); }
      instance.current = null; element.replaceChildren();
    };
  }, []);
  function toggle() { rotation.current = !rotation.current; setRotating(rotation.current); if (instance.current) { instance.current.controls().autoRotate = rotation.current; instance.current.pathDashAnimateTime(rotation.current ? 8500 : 0); instance.current.pathDashLength(rotation.current ? .28 : 1); } }
  return <div className={`az-globe ${ready && !failed ? 'is-ready' : ''}`}>
    <div className="az-globe-viewport">
    <img className="az-globe-fallback" src="/ai/globe-fallback.svg" alt="An orange network connecting regions across a globe"/>
    <div ref={host} className="az-globe-canvas" role="img" aria-label="Interactive globe with illustrative global connections. Drag to rotate."/>
    </div>
    <div className="az-globe-top"><span><i/>CONNECTED POSSIBILITIES</span><span>01 / EARTH</span></div>
    <div className="az-globe-bottom"><span>{failed ? 'Global connections' : 'Drag to explore'}<small>Illustrative network</small></span><div><button aria-label={rotating ? 'Pause globe motion' : 'Resume globe motion'} aria-pressed={rotating} onClick={toggle} disabled={!ready || failed}>{rotating ? <Pause size={13}/> : <Play size={13}/>}</button><button aria-label="Reset globe view" disabled={!ready || failed} onClick={() => instance.current?.pointOfView(initialView,matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700)}><RotateCcw size={13}/></button></div></div>
  </div>;
}
