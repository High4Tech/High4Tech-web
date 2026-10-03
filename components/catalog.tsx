'use client';
import { ResourceBrowser } from './resource-browser';
import { useState } from 'react';
import { useStudioContent } from './content-provider';
import { ProjectCard, ArticleCard } from './ui';

export function ProjectGallery() {
  const {projects}=useStudioContent();
  const [filter,setFilter] = useState('All work');
  const filtered = projects.filter(p => filter === 'All work' || p.category === filter);
  return <><div className="filter-bar"><div className="filter-tabs" aria-label="Filter projects">{['All work','Websites','Applications'].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f}{f === 'All work' && <sup>02</sup>}</button>)}</div><span className="micro-label muted">{filtered.length} PROJECT{filtered.length===1?'':'S'}</span></div><div className="project-grid">{filtered.map((p,i) => <ProjectCard key={p.slug} project={p} index={i} />)}</div></>;
}
export function ResourceCatalog() { return <ResourceBrowser/>; }
export function JournalGallery() {
  const {articles}=useStudioContent();
  const [filter,setFilter] = useState('All notes');
  return <><div className="filter-bar"><div className="filter-tabs" aria-label="Filter journal">{['All notes','Design','Development','Studio'].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f}</button>)}</div><span className="preview-label">EDITORIAL PREVIEW</span></div><div className="article-grid">{articles.filter(a => filter === 'All notes' || a.category === filter).map(a => <ArticleCard key={a.slug} article={a} />)}</div></>;
}
