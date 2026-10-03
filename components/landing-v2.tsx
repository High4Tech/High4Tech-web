'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, FolderOpen, Plus, Minus, Monitor, ArrowRight, Sparkles } from 'lucide-react';
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
        gsap.fromTo('.studio-bento .bento-card',{y:48,opacity:0,scale:.985},{y:0,opacity:1,scale:1,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.studio-bento',start:'top 78%',once:true}});
        gsap.to('.bento-orbit',{rotate:360,duration:22,repeat:-1,ease:'none'});
        gsap.to('.bento-spark',{y:-12,rotate:10,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'});
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
    <section className="studio-bento" aria-labelledby="bento-heading">
      <div className="bento-heading"><div><span className="eyebrow">02 / SERVICES &amp; EXPERTISE</span><h2 id="bento-heading">Digital design<br/>with a point of view<span className="orange">.</span></h2></div><p>Identity, interfaces, and interactive builds shaped together. The details move, but the idea stays clear.</p></div>
      <div className="bento-grid">
        <article className="bento-card bento-services bento-wide">
          <div className="bento-card-label"><span>[ THE WORK ]</span><ArrowRight size={15}/></div>
          <div className="bento-services-body"><div><h3>Make it useful.<br/><i>Make it yours.</i></h3><p>From first sketch to shipped experience, we keep the visual language and the technology in the same room.</p></div><div className="bento-service-list">{services.map((s,i)=><Link href={`/services/${s.slug}`} key={s.slug} data-cursor="EXPLORE"><span>0{i+1}</span><strong>{s.short}</strong><ArrowUpRight size={16}/></Link>)}</div></div>
        </article>
        <article className="bento-card bento-object" data-float>
          <div className="bento-card-label"><span>[ MOTION SYSTEMS ]</span><Sparkles size={14}/></div>
          <div className="bento-object-art"><div className="bento-orbit"><span/><span/><span/></div><div className="bento-spark">✳</div></div>
          <div className="bento-card-foot"><strong>Small moments.</strong><span>Big difference.</span></div>
        </article>
        <article className="bento-card bento-mascot">
          <div className="bento-card-label"><span>[ THE STUDIO ]</span><span>H4T®</span></div>
          <img src="/brand/mascots-cutout.svg" alt="High4Tech studio mascots" width="1536" height="1024" loading="lazy" />
          <div className="bento-mascot-caption"><strong>Good company.</strong><span>Curious by default.</span></div>
        </article>
        <article className="bento-card bento-toolbox bento-wide">
          <div className="bento-card-label"><span>[ EVERYDAY TOOLBOX ]</span><span>01 — 07</span></div>
          <div className="bento-toolbox-copy"><h3>The tools are part of the<br/><i>point of view.</i></h3><Link href="/tools-and-resources" className="bento-link" data-cursor="OPEN TOOL">Open the toolbox <ArrowUpRight size={16}/></Link></div>
          <div className="bento-tool-chips">{['Next.js','React','Three.js','GSAP','Payload','Figma','Vercel'].map((tool,i)=><span key={tool} style={{'--chip-delay':`${i*.04}s`} as React.CSSProperties}>{tool}</span>)}</div>
        </article>
        <article className="bento-card bento-signal">
          <div className="bento-card-label"><span>[ AVAILABLE WORLDWIDE ]</span><span className="bento-status"/></div>
          <div className="bento-signal-art"><span className="bento-signal-ring ring-a"/><span className="bento-signal-ring ring-b"/><span className="bento-signal-dot"/></div>
          <div className="bento-card-foot"><strong>One connected team.</strong><span>Wherever the idea starts.</span></div>
        </article>
      </div>
    </section>
    <section id="selected-work" className="work-cinema"><div className="work-cinema-top"><div><span className="eyebrow">03 / SELECTED PROJECTS</span><h2>Things we’ve<br/>set in motion<span className="orange">.</span></h2></div><Link href="/projects" className="folder-link" data-cursor="OPEN PROJECT"><FolderOpen size={19}/> Open the project folder <ArrowUpRight size={15}/></Link></div><div className="work-stage">{projects.map((p,i)=><Link href={`/projects/${p.slug}`} key={p.slug} className={`cinema-project work-card-${i===0?'first':'second'}`} data-cursor="OPEN PROJECT"><div className="cinema-media" style={{background:p.color}}><img src={p.image} width="1024" height="755" alt={`${p.name} interface and visual design`} loading="eager"/><span className="cinema-index">SELECTED / 0{i+1}</span></div><div className="cinema-caption"><div className="cinema-top-meta"><span>0{i+1} — 02</span><span>{p.year}</span></div><div><span className="eyebrow">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p></div><div className="cinema-open"><span>{p.type}</span><ArrowUpRight size={30}/></div></div></Link>)}</div><div className="work-cinema-foot"><span>GOOD WORK LEAVES A TRACE.</span><span>KEEP SCROLLING <ArrowDown size={13}/></span></div></section>
    <section className="landing-capabilities" id="capabilities"><div className="capability-preview"><span className="eyebrow">04 / WHAT WE BRING</span><h2>Different skills.<br/>One shared<br/><i>ambition.</i></h2><div className="changing-service-art" key={service}><Symbol kind={services[service].symbol}/><span>{services[service].number} / {services[service].short}</span></div><Link href="/services" className="text-link">Inside our capabilities <ArrowUpRight size={17}/></Link></div><div className="capability-accordion">{services.map((s,i)=><div className={`capability-item ${service===i?'is-open':''}`} key={s.slug}><button onClick={()=>setService(i)} onMouseEnter={()=>setService(i)} aria-expanded={service===i} aria-controls={`capability-${i}`}><span className="cap-no">0{i+1}</span><span>{s.short}</span>{service===i?<Minus size={21}/>:<Plus size={21}/>}</button><div className="capability-description" id={`capability-${i}`} hidden={service!==i}><p>{s.description}</p><div>{s.tags.map(t=><span key={t}>{t}</span>)}</div><Link href={`/services/${s.slug}`} className="text-link">Explore {s.short.toLowerCase()} <ArrowUpRight size={16}/></Link></div></div>)}</div></section>
    <section className="studio-collage"><div className="studio-collage-copy landing-reveal"><span className="eyebrow">05 / GOOD COMPANY</span><h2>SERIOUS<br/>ABOUT<br/><span>THE WORK.</span></h2><p>A little less serious about ourselves.<br/>Meet the curious minds behind the pixels.</p><Link href="/about" className="text-link" data-cursor="SAY HI">Come into the studio <ArrowUpRight size={18}/></Link></div><div className="studio-portrait" data-cursor="HEY YOU"><span className="portrait-stamp">HIGH4TECH<br/>PEOPLE DEPT.</span><img src="/brand/mascots-cutout.svg" alt="The two illustrated High4Tech studio mascots" width="1536" height="1024" loading="lazy"/><span className="portrait-caption">Nice to meet your next idea.</span><span className="portrait-star" aria-hidden="true">✳</span></div></section>
    <section className="desktop-invitation landing-reveal"><div><span className="eyebrow">THERE’S MORE INSIDE</span><h2>A studio you can<br/><i>step into.</i></h2><p>Open a folder. Get to know the work. Ask our assistant a question. High4Tech, arranged like a little desktop.</p><Link href="/desktop" className="button orange-button"><Monitor size={18}/> Enter High4Tech OS <ArrowUpRight size={18}/></Link></div><Link className="mini-desktop" href="/desktop" aria-label="Explore the High4Tech desktop"><div className="mini-menu">✳ &nbsp; High4Tech OS <span>Finder &nbsp; File &nbsp; View</span></div><div className="mini-desktop-logo">h<span>4</span>t.</div><div className="mini-folder"><i/>Projects</div><div className="mini-window"><div><i/><i/><i/>Work.folder</div><img src={projects[0].image} alt=""/><img src={projects[1].image} alt=""/></div><div className="mini-dock">⌂ &nbsp; ▣ &nbsp; ✳ &nbsp; ▤ &nbsp; ✉</div></Link></section>
    <section className="landing-tools"><div className="landing-section-head"><div><span className="eyebrow">06 / THE TOOLBOX</span><h2>A few useful things.</h2></div><Link href="/tools-and-resources" className="text-link">Open the toolbox <ArrowUpRight size={18}/></Link></div><div className="resource-grid">{resources.slice(0,3).map(r=><ResourceCard resource={r} key={r.id}/>)}</div></section>
    <section className="landing-journal"><div className="landing-section-head"><div><span className="eyebrow">07 / STUDIO NOTES</span><h2>Always a little curious.</h2></div><Link href="/newsroom" className="text-link">Read the newsroom <ArrowUpRight size={18}/></Link></div><div className="article-grid">{articles.map(a=><ArticleCard article={a} key={a.slug}/>)}</div></section>
  </div>;
}
