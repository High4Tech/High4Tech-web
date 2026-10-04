'use client';

import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import type Lenis from 'lenis';

const instances = new WeakMap<HTMLElement, Lenis>();
let documentScroll: Lenis | undefined;

/** Anchor buttons use the owning window's scroll, never the desktop behind it. */
export function scrollPageTo(target: HTMLElement) {
  const pane = target.closest<HTMLElement>('.window-scroll');
  const instance = pane ? instances.get(pane) : documentScroll;
  if (instance) instance.scrollTo(target, { offset: -24 });
  else target.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  });
}

function usePageMotion(wrapper: RefObject<HTMLDivElement | null>, content: RefObject<HTMLDivElement | null>, enabled: boolean, root = false) {
  useEffect(() => {
    if (!enabled || (!root && (!wrapper.current || !content.current))) return;
    let disposed = false;
    let teardown: (() => void) | undefined;
    // Satus/Lenis's shared GSAP clock, adapted for independently movable windows.
    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      const pane = wrapper.current;
      const page = content.current;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        ...(root ? {} : { wrapper: pane!, content: page! }),
        autoRaf: false,
        lerp: .105,
        smoothWheel: true,
        syncTouch: false,
        overscroll: false,
        anchors: { offset: -24 },
        respectReducedMotion: true,
        prevent: node => node.matches('textarea,select,[data-native-scroll]'),
        // Keep browser zoom and horizontal controls native.
        virtualScroll: ({ event }) => !event.ctrlKey && !event.shiftKey,
      });
      if (root) documentScroll = lenis;
      else instances.set(pane!, lenis);
      const update = (time: number) => lenis.raf(time * 1000);
      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);
      let ticking = false;
      const visibility = () => {
        if (document.hidden) {
          if (ticking) gsap.ticker.remove(update);
          ticking = false;
          lenis.stop();
        } else {
          lenis.start();
          if (!ticking) gsap.ticker.add(update);
          ticking = true;
          lenis.resize();
        }
      };
      visibility();
      document.addEventListener('visibilitychange', visibility);
      const media = gsap.matchMedia();
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const resize = new ResizeObserver(() => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => { lenis.resize(); ScrollTrigger.refresh(); }, 120);
      });
      if (!root && pane && page) { resize.observe(pane); resize.observe(page); }
      teardown = () => {
        clearTimeout(refreshTimer);
        resize.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        gsap.ticker.remove(update);
        media.revert();
        lenis.off('scroll', onScroll);
        lenis.destroy();
        if (root && documentScroll === lenis) documentScroll = undefined;
        if (!root && pane) instances.delete(pane);
      };
      if (!root && page) media.add('(prefers-reduced-motion: no-preference)', () => {
        const selectors = [
          '.os-page-heading', '.home-intro', '.home-bento > div', '.home-projects > button',
          '.project-folder-card', '.os-services > button', '.os-resource-grid > *',
          '.newsroom > header', '.newsroom-grid > button', '.installed-grid > a',
          '.gallery-grid > button', '.pricing-page > header', '.pricing-grid > article',
          '.os-reading > h1', '.os-reading > h2', '[data-az-reveal]',
        ].join(',');
        page.querySelectorAll<HTMLElement>(selectors).forEach(element => {
          gsap.fromTo(element, { y: 24, opacity: 0 }, {
            y: 0, opacity: 1, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity',
            scrollTrigger: { trigger: element, scroller: pane!, start: 'top 94%', once: true },
          });
        });
      }, page);
      ScrollTrigger.refresh();
    }).catch(() => {
      // Native scrolling and visible content remain usable if the enhancement fails.
      teardown?.();
    });
    return () => { disposed = true; teardown?.(); };
  }, [wrapper, content, enabled, root]);
}

export function PageScroll({ children, active, native = false }: { children: ReactNode; active: boolean; native?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  usePageMotion(wrapper, content, active && !native);
  return <div ref={wrapper} className="window-scroll" data-scroll-mode={native ? 'native' : 'smooth'}>
    {native ? children : <div ref={content} className="window-page-content">{children}</div>}
  </div>;
}

/** Safari's same-origin preview owns its own document and Lenis instance. */
export function PreviewScroll() {
  const unused = useRef<HTMLDivElement>(null);
  usePageMotion(unused, unused, true, true);
  return null;
}
