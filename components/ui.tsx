'use client';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Plus } from 'lucide-react';
import { services, projects, resources, articles, faqs } from '@/lib/content';
import { useStudioContent } from './content-provider';
import { BookingButton } from './site-shell';

export function SectionHeading({ number, title, note, href, link }: { number: string; title: string; note?: string; href?: string; link?: string }) {
  return <div className="section-heading" data-reveal><div><span className="eyebrow"><span className="orange">{number} /</span> {note || 'THE STUDIO'}</span><h2>{title}</h2></div>{href && <Link className="text-link" href={href}>{link || 'Explore more'} <ArrowUpRight size={18} /></Link>}</div>;
}

export function Symbol({ kind, className = '' }: { kind: string; className?: string }) {
  return <div className={`symbol symbol-${kind} ${className}`} aria-hidden="true">{kind === 'flower' ? <svg viewBox="0 0 200 200"><defs><linearGradient id="petal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffc6a5" /><stop offset="1" stopColor="#F97328" /></linearGradient></defs>{Array.from({length:8},(_,i) => <ellipse key={i} cx="100" cy="58" rx="23" ry="48" fill="url(#petal)" transform={`rotate(${i*45} 100 100)`} />)}<circle cx="100" cy="100" r="18" fill="#fff6f0" /></svg> : kind === 'orbit' ? <div className="orbit-sculpture"><i /><i /><i /><b /></div> : kind === 'spark' ? <svg viewBox="0 0 200 200"><path d="M100 3Q115 85 197 100Q115 115 100 197Q85 115 3 100Q85 85 100 3Z" fill="currentColor" /><path d="M100 45Q110 90 155 100Q110 110 100 155Q90 110 45 100Q90 90 100 45Z" fill="#ffe5d4" /></svg> : kind === 'gradient' ? <div className="gradient-art"><i /><i /><i /></div> : kind === 'liquid' ? <div className="liquid-art">4</div> : kind === 'cube' ? <div className="cube-art"><i /><i /><i /></div> : <svg viewBox="0 0 200 200"><path d="M100 30v140M30 100h140M50 50l100 100M150 50L50 150" fill="none" stroke="currentColor" strokeWidth="25" strokeLinecap="round" /></svg>}</div>;
}

export function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return <Link href={`/projects/${project.slug}`} className="project-card" data-cursor="VIEW WORK" data-reveal><div className="project-image" style={{backgroundColor:project.color}}><img src={project.image} alt={`${project.name} project showing the interface design`} width="1024" height="755" loading="lazy" /><span className="project-open"><ArrowUpRight size={26} /></span><span className="project-image-index">0{index+1} / SELECTED WORK</span></div><div className="project-meta"><div><h3>{project.name}</h3><p>{project.type}</p></div><span className="tag">{project.category}</span></div></Link>;
}

export function ServiceRows() {
  const {services}=useStudioContent();
  return <div className="service-rows">{services.map(s => <Link href={`/services/${s.slug}`} className="service-row" key={s.slug} data-cursor="EXPLORE" data-reveal><span className="service-number">/{s.number}</span><div className="service-info"><h3>{s.short}<span className="orange">.</span></h3><div className="service-tags">{s.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><Symbol kind={s.symbol} /><span className="service-arrow"><ArrowUpRight size={28} /></span></Link>)}</div>;
}

export function ResourceCard({ resource }: { resource: typeof resources[number] }) {
  const content = <><div className={`resource-art art-${resource.icon}`}><Symbol kind={resource.icon} /><span className={`resource-price ${resource.price === 'Free' ? 'free' : ''}`}>{resource.price}</span>{resource.url && <span className="resource-open"><ArrowUpRight size={19} /></span>}</div><div className="resource-info"><span className="micro-label muted">{resource.category} / {resource.label}</span><h3>{resource.title}</h3><p>{resource.description}</p>{resource.url ? <span className="text-link">Explore tool <ArrowUpRight size={15} /></span> : <span className="preview-label">LINK TO BE ADDED</span>}</div></>;
  return resource.url ? <a className="resource-card" href={resource.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN TOOL" data-reveal>{content}</a> : <article className="resource-card resource-placeholder" data-reveal>{content}</article>;
}

export function ArticleArt({ kind }: { kind: string }) {
  return <div className={`article-art article-${kind}`} aria-hidden="true">{kind === 'type' ? <span>GOOD<br /><i>BY DESIGN.</i></span> : kind === 'orbit' ? <Symbol kind="orbit" /> : <><div className="interface-stack"><i /><i /><i /><i /></div><span className="art-small-type">IDEA →<br />INTERFACE.</span></>}</div>;
}
export function ArticleCard({ article }: { article: typeof articles[number] }) {
  return <Link className="article-card" href={`/blog/${article.slug}`} data-cursor="READ" data-reveal><ArticleArt kind={article.artwork} /><div className="article-meta"><span>{article.category}</span><span>{article.read}</span></div><h3>{article.title}</h3><ArrowUpRight className="article-arrow" size={23} /></Link>;
}
export function FAQ() {
  const {faqs}=useStudioContent();
  return <section className="faq-section wrap section-space"><SectionHeading number="07" title="A little clarity." note="COMMON QUESTIONS" /><div className="faq-list">{faqs.map((f,i) => <details key={f.question} data-reveal><summary><span className="faq-number">0{i+1}</span>{f.question}<Plus size={22} /></summary><p>{f.answer}</p></details>)}</div></section>;
}
export function ContactCTA() {
  return <section className="contact-cta wrap" data-reveal><span className="eyebrow"><span className="status-dot" /> YOUR NEXT CHAPTER</span><div className="cta-heading"><h2>GOT A<br />GOOD <span className="orange">IDEA?</span></h2><Link href="/contact" className="cta-circle" aria-label="Start your project" data-cursor="LET’S TALK"><ArrowUpRight strokeWidth={1.3} /></Link></div><div className="cta-bottom"><p>Let’s make it something<br />people remember.</p><BookingButton className="text-link">Or start with a conversation</BookingButton></div></section>;
}
export function Process() {
  const steps = [['Discover','Good questions first. We get to know your idea, your audience, and your ambition.'],['Define','A clear direction. We turn the brief into a plan, a journey, and a visual language.'],['Create','Bring it to life. Design and development move together, with room to test and refine.'],['Launch','Ready for the real world. We check the details and prepare for the next chapter.']];
  return <div className="process-grid">{steps.map(([title,desc],i) => <div className="process-step" key={title} data-reveal><div><span className="process-index">0{i+1}</span><ArrowRight size={19} /></div><h3>{title}<span className="orange">.</span></h3><p>{desc}</p></div>)}</div>;
}
export function PageIntro({ index, eyebrow, title, description, children }: { index: string; eyebrow: string; title: React.ReactNode; description: string; children?: React.ReactNode }) {
  return <section className="page-intro wrap"><div className="page-topline"><span className="eyebrow orange">{eyebrow}</span><span className="micro-label muted">HIGH4TECH / {index}</span></div><div className="page-intro-grid"><h1>{title}</h1><div className="page-description"><p>{description}</p>{children}</div></div></section>;
}
