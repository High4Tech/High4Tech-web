'use client';
import { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { projects, resources, articles } from '@/lib/content';
import { ProjectCard, ResourceCard, ArticleCard } from './ui';

export function ProjectGallery() {
  const [filter,setFilter] = useState('All work');
  const filtered = projects.filter(p => filter === 'All work' || p.category === filter);
  return <><div className="filter-bar"><div className="filter-tabs" aria-label="Filter projects">{['All work','Websites','Applications'].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f}{f === 'All work' && <sup>02</sup>}</button>)}</div><span className="micro-label muted">{filtered.length} PROJECT{filtered.length===1?'':'S'}</span></div><div className="project-grid">{filtered.map((p,i) => <ProjectCard key={p.slug} project={p} index={i} />)}</div></>;
}
export function ResourceCatalog() {
  const [filter,setFilter] = useState('All tools');
  const [query,setQuery] = useState('');
  const filtered = resources.filter(r => (filter === 'All tools' || r.price===filter || r.category===filter) && `${r.title} ${r.description} ${r.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <><div className="filter-bar resource-filter"><div className="filter-tabs" aria-label="Filter resources">{['All tools','Free','Paid','Design','Development'].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="search-field"><Search size={16} /><input aria-label="Search tools and resources" placeholder="Find your next tool…" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</div></div><div className="catalog-count micro-label muted">{filtered.length} RESOURCE{filtered.length === 1 ? '' : 'S'} / HANDPICKED, NOT OVERCOMPLICATED.</div>{filtered.length ? <div className="resource-grid catalog-grid">{filtered.map(r => <ResourceCard key={r.id} resource={r} />)}</div> : <div className="empty-state"><Search size={38} strokeWidth={1} /><h2>A little too specific?</h2><p>No tools match this search. Try another term or explore everything.</p><button className="button orange-button" onClick={() => {setQuery('');setFilter('All tools');}}>Reset filters <ArrowUpRight size={17} /></button></div>}<div className="catalog-note"><span className="orange">↗</span><p>Free resources and tools worth exploring. Each link opens the creator’s platform. Our own paid tools will join the collection as their links are added.</p><Link href="/contact" className="text-link">Have a suggestion? <ArrowUpRight size={17} /></Link></div></>;
}
export function JournalGallery() {
  const [filter,setFilter] = useState('All notes');
  return <><div className="filter-bar"><div className="filter-tabs" aria-label="Filter journal">{['All notes','Design','Development','Studio'].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f}</button>)}</div><span className="preview-label">EDITORIAL PREVIEW</span></div><div className="article-grid">{articles.filter(a => filter === 'All notes' || a.category === filter).map(a => <ArticleCard key={a.slug} article={a} />)}</div></>;
}
