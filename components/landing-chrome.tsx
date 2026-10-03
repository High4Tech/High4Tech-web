'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, X, Menu, Monitor, MessageCircle, Bot } from 'lucide-react';
import gsap from 'gsap';
import { useStudioContent } from './content-provider';
import { SoundToggle } from './sound';

export function StudioLoader() {
  const [show,setShow] = useState(true);
  const [progress,setProgress] = useState(0);
  const element = useRef<HTMLDivElement>(null);
  const sequence = useRef<gsap.core.Timeline | null>(null);
  const finish = () => { sequence.current?.kill(); sessionStorage.setItem('h4t-intro-v2','seen'); document.body.style.overflow=''; setShow(false); window.dispatchEvent(new Event('h4t:intro-complete')); };
  useEffect(() => {
    if(sessionStorage.getItem('h4t-intro-v2') || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    const previous = document.body.style.overflow;
    document.body.style.overflow='hidden';
    const count={value:0};
    const timeline=gsap.timeline({onComplete:finish}); sequence.current=timeline;
    timeline.fromTo('.intro-wordmark',{clipPath:'inset(0 100% 0 0)',y:20},{clipPath:'inset(0 0% 0 0)',y:0,duration:1.1,ease:'power3.out'},.12)
      .to(count,{value:100,duration:1.65,ease:'power2.inOut',onUpdate:()=>setProgress(Math.round(count.value))},0)
      .to('.intro-rule-fill',{scaleX:1,duration:1.65,ease:'power2.inOut'},0)
      .to(element.current,{yPercent:-102,duration:.8,ease:'power4.inOut'},1.85);
    return () => {timeline.kill();document.body.style.overflow=previous;};
  // Intro lifecycle runs once per page mount; completion also supports the skip control.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return show ? <div ref={element} className="studio-intro" role="dialog" aria-modal="true" aria-label="Opening High4Tech"><div className="intro-top"><span>HIGH4TECH® — INDEPENDENT CREATIVE STUDIO</span><button onClick={finish} autoFocus>Skip intro <ArrowUpRight size={14} /></button></div><div className="intro-center"><div className="intro-wordmark">HIGH<span>4</span>TECH<sup>®</sup></div><p>A LITTLE DIFFERENT BY DESIGN.</p></div><div className="intro-bottom"><div><span>SETTING THE SCENE</span><strong>{String(progress).padStart(3,'0')}<small> / 100</small></strong></div><div className="intro-rule"><i className="intro-rule-fill" /></div></div></div> : null;
}

export function LandingNav() {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>80);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
  useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[open]);
  return <><header className={`landing-nav ${scrolled?'is-scrolled':''}`}><Link className="landing-nav-mark" href="/" aria-label="High4Tech home"><img src="/brand/wordmark.png" width="143" height="43" alt="High4Tech" /></Link><nav aria-label="Landing navigation"><a href="#selected-work">Work <sup>02</sup></a><a href="#capabilities">Expertise</a><Link href="/about">Studio</Link><Link href="/tools-and-resources">Tools</Link></nav><Link className="landing-enter" href="/desktop"><Monitor size={14} /> Enter studio <ArrowUpRight size={14} /></Link><button className="landing-menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="landing-mobile-nav" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button></header>{open&&<nav className="landing-mobile-nav" id="landing-mobile-nav" aria-label="Landing mobile navigation">{[['/projects','Selected work'],['/services','Expertise'],['/about','The studio'],['/tools-and-resources','Tools & resources'],['/desktop','Enter High4Tech OS'],['/contact','Start a project']].map(([href,label],i)=><Link key={href} href={href} onClick={()=>setOpen(false)}><span>0{i+1}</span>{label}<ArrowUpRight size={22}/></Link>)}</nav>}</>;
}

export function LandingFooter() {
  const {socials,settings}=useStudioContent();
  return <footer className="landing-footer"><div className="lf-top"><span className="eyebrow">A GOOD PLACE TO START</span><Link href="/contact" className="lf-invitation" data-cursor="LET’S TALK">LET’S MAKE<br /><span>SOMETHING</span> MOVE.<ArrowUpRight /></Link><div className="lf-contact"><a href={`mailto:${settings.email}`}>{settings.email} ↗</a><Link href="/calendar">Or start with a conversation <ArrowUpRight size={16}/></Link></div></div><div className="lf-links"><span>INDEPENDENT MINDS.<br/>UNEXPECTED POSSIBILITIES.</span><div><Link href="/projects">Work</Link><Link href="/services">Expertise</Link><Link href="/newsroom">Newsroom</Link><Link href="/desktop">High4Tech OS ↗</Link></div><div><a href={socials.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><button onClick={()=>{sessionStorage.removeItem('h4t-intro-v2');location.reload();}}>Replay the intro <ArrowDown size={13}/></button></div><div className="lf-signature" aria-hidden="true">HIGH<span>4</span>TECH<sup>®</sup></div><div className="lf-bottom"><span>© {new Date().getFullYear()} HIGH4TECH</span><span>MADE OF IDEAS. BUILT WITH INTENTION.</span><a href="#main">BACK TO TOP ↑</a></div></footer>;
}

export function LandingActions(){const {socials}=useStudioContent();return <div className="landing-actions"><SoundToggle/><Link className="assistant-action" href="/assistant" aria-label="Open High4Tech assistant"><span className="assistant-mascot-face"><img src="/brand/mascots-cutout.svg" alt=""/></span><span>Assistant</span><ArrowUpRight size={14}/></Link><a className="agent-action" href={socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Talk to a High4Tech agent"><Bot size={17}/><span>Agent</span><ArrowUpRight size={14}/></a></div>;}
