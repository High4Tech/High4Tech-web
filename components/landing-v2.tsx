'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, FolderOpen, Plus, Minus, Monitor } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './hero';
import { Symbol, ResourceCard, ArticleCard } from './ui';
import { projects, services, resources, articles } from '@/lib/content';

export function LandingV2(){
  const root=useRef<HTMLDivElement>(null);
  const [service,setService]=useState(0);
  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger);
    const mm=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      mm.add('(prefers-reduced-motion: no-preference)',()=>{
        const entrance=()=>gsap.fromTo('.brand-masthead span',{yPercent:105},{yPercent:0,duration:1.15,stagger:.05,ease:'power4.out'});
        const onIntro=()=>{entrance();ScrollTrigger.refresh();};
        if(sessionStorage.getItem('h4t-intro-v2'))entrance();
        window.addEventListener('h4t:intro-complete',onIntro);
        gsap.to('.brand-masthead',{yPercent:-12,opacity:.4,ease:'none',scrollTrigger:{trigger:'.brand-masthead',start:'top top',end:'bottom top',scrub:true}});
        gsap.fromTo('.manifesto-word',{color:'#d3d3ce'},{color:'#191919',stagger:.18,ease:'none',scrollTrigger:{trigger:'.motion-manifesto',start:'top 75%',end:'bottom 50%',scrub:1}});
        gsap.to('.manifesto-sticker',{rotation:15,y:-60,ease:'none',scrollTrigger:{trigger:'.motion-manifesto',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.utils.toArray<HTMLElement>('.landing-reveal').forEach(el=>gsap.from(el,{y:65,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'transform'}));
        gsap.to('.studio-portrait',{rotate:5,y:-35,ease:'none',scrollTrigger:{trigger:'.studio-collage',start:'top bottom',end:'bottom top',scrub:1}});
        return()=>window.removeEventListener('h4t:intro-complete',onIntro);
      });
      mm.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)',()=>{
        const sequence=gsap.timeline({scrollTrigger:{trigger:'.work-cinema',start:'top top',end:'+=125%',scrub:.8,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
        sequence.to('.work-card-first',{scale:.94,rotation:-2,opacity:.45,ease:'none'},.1).fromTo('.work-card-second',{yPercent:115,rotation:4},{yPercent:0,rotation:0,ease:'none'},.1);
      });
    },root);
    return()=>{mm.revert();ctx.revert();};
  },[]);
  return <div className="landing-v2" ref={root}>
    <div className="landing-brand-wrap"><div className="brand-masthead" aria-label="High4Tech">{'HIGH4TECH'.split('').map((letter,i)=><span key={i} className={letter==='4'?'orange':''}>{letter}</span>)}<sup>®</sup></div><div className="masthead-caption"><span>CREATIVE THINKING × TECHNICAL PRECISION</span><span>INDEPENDENT BY NATURE. DIFFERENT BY DESIGN.</span></div></div>
    <Hero editorial />
    <section className="motion-ticker" aria-label="High4Tech disciplines"><div className="ticker-track"><span>HIGH4TECH</span><i>✳</i><span>BRAND WORLDS</span><i>✳</i><span>WEB EXPERIENCES</span><i>✳</i><span>MOTION SYSTEMS</span><i>✳</i><span>HIGH4TECH</span><i>✳</i><span>BRAND WORLDS</span><i>✳</i><span>WEB EXPERIENCES</span><i>✳</i><span>MOTION SYSTEMS</span><i>✳</i></div></section>
    <section className="motion-manifesto"><span className="eyebrow">01 / THE POINT OF VIEW</span><div className="manifesto-type">{'Make the digital feel alive.'.split(' ').map((word,i)=><span className="manifesto-word" key={i}>{word} </span>)}<span className="manifesto-sticker" aria-hidden="true">✳</span></div><div className="manifesto-bottom"><p>We join identity, interface, and code early so the final experience feels like one idea — not a stack of deliverables.</p><Link href="/about" className="text-link" data-cursor="MEET US">Meet the studio <ArrowUpRight size={18}/></Link></div></section>
    <section className="statement-band"><span className="eyebrow">A LITTLE HIGHER / A LITTLE DIFFERENT</span><h2>Design should<br/><i>have a pulse.</i></h2><span className="statement-mark">H4T®</span></section>
    <section id="selected-work" className="work-cinema"><div className="work-cinema-top"><div><span className="eyebrow">02 / SELECTED PROJECTS</span><h2>Things we’ve<br/>set in motion<span className="orange">.</span></h2></div><Link href="/projects" className="folder-link" data-cursor="OPEN PROJECT"><FolderOpen size={19}/> Open the project folder <ArrowUpRight size={15}/></Link></div><div className="work-stage">{projects.map((p,i)=><Link href={`/projects/${p.slug}`} key={p.slug} className={`cinema-project work-card-${i===0?'first':'second'}`} data-cursor="OPEN PROJECT"><div className="cinema-media" style={{background:p.color}}><img src={p.image} width="1024" height="755" alt={`${p.name} interface and visual design`} loading="eager"/><span className="cinema-index">SELECTED / 0{i+1}</span></div><div className="cinema-caption"><div className="cinema-top-meta"><span>0{i+1} — 02</span><span>{p.year}</span></div><div><span className="eyebrow">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p></div><div className="cinema-open"><span>{p.type}</span><ArrowUpRight size={30}/></div></div></Link>)}</div><div className="work-cinema-foot"><span>GOOD WORK LEAVES A TRACE.</span><span>KEEP SCROLLING <ArrowDown size={13}/></span></div></section>
    <section className="landing-capabilities" id="capabilities"><div className="capability-preview"><span className="eyebrow">03 / WHAT WE BRING</span><h2>Different skills.<br/>One shared<br/><i>ambition.</i></h2><div className="changing-service-art" key={service}><Symbol kind={services[service].symbol}/><span>{services[service].number} / {services[service].short}</span></div><Link href="/services" className="text-link">Inside our capabilities <ArrowUpRight size={17}/></Link></div><div className="capability-accordion">{services.map((s,i)=><div className={`capability-item ${service===i?'is-open':''}`} key={s.slug}><button onClick={()=>setService(i)} onMouseEnter={()=>setService(i)} aria-expanded={service===i} aria-controls={`capability-${i}`}><span className="cap-no">0{i+1}</span><span>{s.short}</span>{service===i?<Minus size={21}/>:<Plus size={21}/>}</button><div className="capability-description" id={`capability-${i}`} hidden={service!==i}><p>{s.description}</p><div>{s.tags.map(t=><span key={t}>{t}</span>)}</div><Link href={`/services/${s.slug}`} className="text-link">Explore {s.short.toLowerCase()} <ArrowUpRight size={16}/></Link></div></div>)}</div></section>
    <section className="studio-collage"><div className="studio-collage-copy landing-reveal"><span className="eyebrow">04 / GOOD COMPANY</span><h2>SERIOUS<br/>ABOUT<br/><span>THE WORK.</span></h2><p>A little less serious about ourselves.<br/>Meet the curious minds behind the pixels.</p><Link href="/about" className="text-link" data-cursor="SAY HI">Come into the studio <ArrowUpRight size={18}/></Link></div><div className="studio-portrait" data-cursor="HEY YOU"><span className="portrait-stamp">HIGH4TECH<br/>PEOPLE DEPT.</span><img src="/brand/mascots.svg" alt="The two illustrated High4Tech studio mascots" width="1536" height="1024" loading="lazy"/><span className="portrait-caption">Nice to meet your next idea.</span><span className="portrait-star" aria-hidden="true">✳</span></div></section>
    <section className="desktop-invitation landing-reveal"><div><span className="eyebrow">THERE’S MORE INSIDE</span><h2>A studio you can<br/><i>step into.</i></h2><p>Open a folder. Get to know the work. Ask our assistant a question. High4Tech, arranged like a little desktop.</p><Link href="/desktop" className="button orange-button"><Monitor size={18}/> Enter High4Tech OS <ArrowUpRight size={18}/></Link></div><Link className="mini-desktop" href="/desktop" aria-label="Explore the High4Tech desktop"><div className="mini-menu">✳ &nbsp; High4Tech OS <span>Finder &nbsp; File &nbsp; View</span></div><div className="mini-desktop-logo">h<span>4</span>t.</div><div className="mini-folder"><i/>Projects</div><div className="mini-window"><div><i/><i/><i/>Work.folder</div><img src={projects[0].image} alt=""/><img src={projects[1].image} alt=""/></div><div className="mini-dock">⌂ &nbsp; ▣ &nbsp; ✳ &nbsp; ▤ &nbsp; ✉</div></Link></section>
    <section className="landing-tools"><div className="landing-section-head"><div><span className="eyebrow">05 / THE TOOLBOX</span><h2>A few useful things.</h2></div><Link href="/tools-and-resources" className="text-link">Open the toolbox <ArrowUpRight size={18}/></Link></div><div className="resource-grid">{resources.slice(0,3).map(r=><ResourceCard resource={r} key={r.id}/>)}</div></section>
    <section className="landing-journal"><div className="landing-section-head"><div><span className="eyebrow">06 / STUDIO NOTES</span><h2>Always a little curious.</h2></div><Link href="/blog" className="text-link">Read the journal <ArrowUpRight size={18}/></Link></div><div className="article-grid">{articles.map(a=><ArticleCard article={a} key={a.slug}/>)}</div></section>
  </div>;
}
