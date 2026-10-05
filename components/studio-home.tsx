'use client';
import { ArrowRight, ArrowUpRight, BrainCircuit, Code2, Sparkles } from './icons';
import { useStudioContent } from './content-provider';
import { articleMedia, recentArticles } from '@/lib/editorial';
import { PersonalDesk, useDesktopStorage } from './desktop-storage';
import { ResourceTicket } from './resource-ticket';
export function StudioHome({ open }: { open: (path: string) => void }) {
  const { settings, projects, services, articles, resources } = useStudioContent(); const { trashed } = useDesktopStorage(); const latest = recentArticles(articles).find(article => !trashed.some(file => file.id === 'blog-' + article.slug));
  return <div className="inner-page home-launchpad"><header className="launchpad-header"><img src={settings.logo} alt={settings.agencyName}/><span><i/>OPEN TO IDEAS</span></header>
    <section className="launchpad-hero"><div><span className="inner-label">YOUR NEXT MOVE STARTS HERE</span><h1>{settings.headline}</h1><p>{settings.introduction}</p><button className="premium-action" onClick={() => open('/contact')}>Let’s build something <ArrowUpRight size={18}/></button></div><button className="launchpad-feature" onClick={() => open(projects[0] ? '/projects/' + projects[0].slug : '/projects')}>{projects[0] && <img src={projects[0].image} alt={projects[0].name}/>}<span><small>FROM THE WORK FOLDER</small><strong>{projects[0]?.name || 'Selected work'}</strong><ArrowUpRight size={24}/></span></button></section>
    <div className="launchpad-rail">{[{ label: 'Explore the work', path: '/projects', value: projects.length }, { label: 'Find your expertise', path: '/services', value: services.length }, { label: 'Open the App Store', path: '/tools-and-resources', value: resources.length }].map(item => <button key={item.path} onClick={() => open(item.path)}><span>{String(item.value).padStart(2, '0')}</span><strong>{item.label}</strong><ArrowRight size={20}/></button>)}</div>
    <div className="launchpad-mobile-resource"><ResourceTicket open={open}/></div>
    <section className="launchpad-next"><button onClick={() => open('/ai-zone')}><BrainCircuit size={30}/><small>AI & AUTOMATION</small><h2>Less busywork.<br/>More possibility.</h2><span>Explore the AI Zone <ArrowUpRight size={16}/></span></button><button onClick={() => open('/pricing')}><span className="launchpad-price-symbol">$</span><small>YOUR PROJECT, OUTLINED</small><h2>A little clarity<br/>before the leap.</h2><span>Build your estimate <ArrowUpRight size={16}/></span></button></section>
    {latest && <section className="launchpad-editorial"><button onClick={() => open('/newsroom/' + latest.slug)}><img src={articleMedia(latest)} alt=""/><div><span className="recent-blog-tag">Recent blog</span><h2>{latest.title}</h2><p>{latest.summary}</p><small>{latest.category} · {latest.read}</small></div><ArrowUpRight size={25}/></button></section>}
    <PersonalDesk open={open}/><footer className="launchpad-footer"><Sparkles size={22}/><span>Curious about the people behind the work?</span><button onClick={() => open('/about')}>Meet the studio <ArrowRight size={16}/></button><Code2 size={22}/></footer>
  </div>;
}
