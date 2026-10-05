'use client';
import Link from 'next/link';
import { ScrollFilm } from './scroll-film';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Sparkles } from './icons';
import { useStudioContent } from './content-provider';
import { useCardSpotlight } from './campaign-media';
import { MascotFace } from './studio-extras';
import { BrandIcon } from './studio-sections';
import { studioStack } from './studio-apps';
import { ArticleArt } from './ui';

// Agency-AI's centered hero / framed media / service / work structure, reworked
// for High4Tech's editorial portfolio. Attribution: sources/templates/agency-ai.
export function LandingCampaign() {
  const { projects, services, resources, articles, settings, socials } = useStudioContent();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { root.current?.classList.toggle('lp-embedded', window.self !== window.top); }, []);
  useCardSpotlight(root);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-lp-hero]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity' });
      root.current?.querySelectorAll<HTMLElement>('[data-lp-reveal]').forEach(element => {
        gsap.fromTo(element, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
      root.current?.querySelectorAll<HTMLElement>('.lp-project-media img').forEach(image => {
        gsap.fromTo(image, { scale: 1.07 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom center', scrub: .5 } });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => media.revert();
  }, []);
  return <div className="landing-v2 lp-page" ref={root}>
    <header className="lp-nav lp-rail">
      <Link href="/desktop" className="lp-logo" aria-label="High4Tech studio"><img src={settings.logo} alt={settings.agencyName} width="145" height="45" /></Link>
      <nav aria-label="Landing navigation"><a href="#selected-work">Work <sup>{String(projects.length).padStart(2, '0')}</sup></a><a href="#capabilities">Expertise</a><Link href="/ai-zone">Applied AI</Link></nav>
      <Link href="/contact" className="lp-button lp-button-small">Let’s talk <ArrowUpRight size={15} /></Link>
    </header>
    <section className="lp-hero lp-rail">
      <span className="lp-label lp-availability" data-lp-hero><i /> INDEPENDENT CREATIVE TECHNOLOGY STUDIO</span>
      <h1 data-lp-hero>Ideas with presence.<br /><em>Built for impact.</em></h1>
      <p data-lp-hero>{settings.introduction}</p>
      <div className="lp-actions" data-lp-hero><Link href="/contact" className="lp-button lp-button-orange">Start a project <ArrowUpRight size={17} /></Link><a href="#selected-work" className="lp-inline">Explore our work <ArrowDown size={16} /></a></div>
    </section>
    <div className="lp-rail"><ScrollFilm label="HIGH4TECH / DESIGN IN MOTION" title="Give your ideas a little space." body="Design, technology and character. Connected by the way you move."/></div>
    <section className="lp-work lp-rail lp-section" id="selected-work">
      <div className="lp-section-heading" data-lp-reveal><div><span className="lp-label">01 / SELECTED WORK</span><h2>A point of view.<br /><em>Made tangible.</em></h2></div><Link href="/projects" className="lp-inline">All projects <ArrowUpRight size={17} /></Link></div>
      <div className="lp-project-grid">{projects.slice(0, 4).map((project, index) => <Link className="lp-project" href={`/projects/${project.slug}`} key={project.slug} data-lp-reveal data-cursor="VIEW PROJECT">
        <div className="lp-project-media" style={{ background: project.color }}><img src={project.image} alt={`${project.name} project preview`} loading="lazy" /><span className="lp-project-number">{String(index + 1).padStart(2, '0')} / {project.category}</span><span className="lp-project-open"><ArrowUpRight size={23} /></span></div>
        <div className="lp-project-caption"><div><h3>{project.name}</h3><p>{project.type}</p></div><span>{project.year}</span></div>
      </Link>)}</div>
    </section>
    <section className="lp-bento lp-rail" id="capabilities">
      <div className="lp-section-heading" data-lp-reveal><div><span className="lp-label">02 / THE STUDIO TOOLBOX</span><h2>Different skills.<br /><em>One shared ambition.</em></h2></div><p>Design, development, and thoughtful technology.<br />Made to work beautifully together.</p></div>
      <div className="lp-bento-grid">
        {services.slice(0, 3).map((service, index) => <Link href={`/services/${service.slug}`} className={`lp-service lp-service-${index}`} key={service.slug} data-premium-card data-lp-reveal>
          <div className="lp-card-top"><span>0{index + 1} / CAPABILITY</span><ArrowUpRight size={17} /></div>
          <div className="lp-service-art" aria-hidden="true">{index === 0 ? <div className="lp-keycaps"><i>THINK</i><i>MAKE</i><i>HIGH</i><i>4</i></div> : index === 1 ? <div className="lp-code-art"><div /><Code2 size={76} weight="duotone" /><span>01 10 01</span></div> : <div className="lp-growth-art"><svg viewBox="0 0 240 160"><path d="M15 135 C70 135 50 92 95 92 S140 42 185 42 S215 10 225 12" /><circle cx="95" cy="92" r="8" /><circle cx="185" cy="42" r="8" /><circle cx="225" cy="12" r="8" /></svg><i>↗</i></div>}</div>
          <div className="lp-service-copy"><h3>{service.short}</h3><p>{service.description}</p><span>{service.tags.slice(0, 2).join(' · ')}</span></div>
        </Link>)}
        <Link className="lp-ai-card" href="/ai-zone" data-premium-card data-lp-reveal><div className="lp-card-top"><span>APPLIED AI & AUTOMATION</span><ArrowUpRight size={18} /></div><img src="/ai/globe-fallback.svg" alt="Illustrative connected globe" loading="lazy" /><div><h3>A little less manual.<br />A lot more possible.</h3><p>Assistants, automations, and connected tools.<br />Built around how your business works.</p><span className="lp-inline">Step into AI Zone <ArrowRight size={16} /></span></div></Link>
        <Link className="lp-people-card" href="/about" data-premium-card data-lp-reveal><div className="lp-card-top"><span>THE PEOPLE BEHIND THE PIXELS</span><ArrowUpRight size={18} /></div><img src="/brand/mascots-cutout.svg" alt="High4Tech’s two studio mascots" loading="lazy" /><div><h3>Curious minds.<br />Good company.</h3><span>Meet the studio <ArrowRight size={15} /></span></div></Link>
        <div className="lp-toolkit" data-lp-reveal><div><strong>Tools of the trade.</strong><Link href="/toolkit">Inside the toolkit <ArrowUpRight size={13} /></Link></div><div className="lp-tech-list">{studioStack.map(tool => <Link key={tool.icon} href="/toolkit" aria-label={tool.name}><img src={tool.icon === 'figma' ? '/icons/figma/figma.svg' : `/icons/${tool.icon}.svg`} alt="" /><span>{tool.name}</span></Link>)}</div></div>
      </div>
    </section>
    <section className="lp-process lp-rail lp-section" data-lp-reveal><div className="lp-section-heading"><div><span className="lp-label">03 / BUILT TOGETHER</span><h2>From a good question<br /><em>to a great next step.</em></h2></div><p>A considered process.<br />Room for the unexpected.</p></div><div className="lp-process-grid">{[['Find the idea.', 'We start with your people, your goals, and what needs to change.'], ['Make it real.', 'Design and development shape one clear direction, with you in the loop.'], ['Move it forward.', 'We refine the details, prepare the launch, and help your team take over.']].map(([name, text], i) => <article key={name}><span>0{i + 1}</span><h3>{name}</h3><p>{text}</p></article>)}</div></section>
    <section className="lp-resources lp-rail" data-lp-reveal><div><span className="lp-label">USEFUL BY DESIGN</span><h2>A few good tools.</h2><Link href="/tools-and-resources" className="lp-inline">Open the App Store <ArrowUpRight size={15} /></Link></div><div>{resources.slice(0, 3).map(resource => <Link href={`/tools-and-resources/${resource.id}`} key={resource.id}><span><strong>{resource.title}</strong><small>{resource.category}</small></span><span className="lp-resource-price">{resource.price}</span><ArrowUpRight size={18} /></Link>)}</div></section>
    <section className="lp-news lp-rail lp-section"><div className="lp-section-heading" data-lp-reveal><div><span className="lp-label">04 / THE NEWSROOM</span><h2>Always a little curious.</h2></div><Link href="/newsroom" className="lp-inline">All studio notes <ArrowUpRight size={15} /></Link></div><div className="lp-news-grid">{articles.slice(0, 3).map(article => <Link href={`/blog/${article.slug}`} key={article.slug} data-lp-reveal>{article.image ? <img src={article.image} alt="" loading="lazy" /> : <ArticleArt kind={article.artwork} />}<span className="lp-label">{article.category} / {article.read}</span><h3>{article.title}</h3><ArrowUpRight size={19} /></Link>)}</div></section>
    <footer className="lp-footer lp-rail" data-lp-reveal><span className="lp-label"><Sparkles size={14} /> YOUR NEXT CHAPTER</span><h2>Let’s build<br /><em>what’s next.</em></h2><div className="lp-footer-actions"><Link href="/contact" className="lp-button lp-button-orange">Start a conversation <ArrowUpRight size={17} /></Link><Link href="/contact" className="lp-inline">{settings.email} <ArrowUpRight size={15} /></Link></div><div className="lp-footer-bottom"><img src={settings.logo} alt={settings.agencyName} /><span>© {new Date().getFullYear()} High4Tech</span><div><Link href="/desktop">Enter studio <ArrowUpRight size={14} /></Link><a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" />WhatsApp</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>
    <aside className="lp-assistant" aria-label="Studio support"><Link href="/assistant" aria-label="Ask the High4Tech assistant"><MascotFace /><span>Ask us</span></Link><a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Talk to the studio on WhatsApp"><BrandIcon name="whatsapp" /></a></aside>
  </div>;
}
