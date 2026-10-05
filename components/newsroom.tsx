'use client';

import { TrashAction, DraggableFile, useDesktopStorage } from './desktop-storage';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from './icons';
import { useStudioContent } from './content-provider';
import { articleDate, articleMedia, recentArticles, type StudioArticle } from '@/lib/editorial';

type Open = (path: string) => void;

export function NewsroomLibrary({ open, search = '' }: { open: Open; search?: string }) {
  const { articles } = useStudioContent();
  const [category, setCategory] = useState('All');
  const {trashed}=useDesktopStorage();
  const ordered = recentArticles(articles).filter(a=>!trashed.some(f=>f.id==='blog-'+a.slug));
  const filtered = ordered.filter(a => (category === 'All' || a.category === category) && `${a.title} ${a.category} ${a.summary}`.toLowerCase().includes(search.toLowerCase()));
  const lead = filtered[0];
  return <div className="editorial-library">
    <header className="editorial-masthead"><div><span className="inner-label">THE HIGH4TECH EDIT</span><h1>Newsroom<span>.</span></h1></div><p>Ideas, experiments and a closer look<br/>at the work behind the screen.</p></header>
    <div className="editorial-navigation"><nav aria-label="Newsroom topics">{['All', ...new Set(articles.map(a => a.category))].map(c => <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}>{c === 'All' ? 'All stories' : c}</button>)}</nav><span>{String(filtered.length).padStart(2, '0')} stories</span></div>
    {lead ? <div className="editorial-front">
      <DraggableFile className='editorial-feature-wrap' file={{id:'blog-'+lead.slug,title:lead.title,kind:'blog',path:'/newsroom/'+lead.slug}}><TrashAction file={{id:'blog-'+lead.slug,title:lead.title,kind:'blog',path:'/newsroom/'+lead.slug}}/><button className="editorial-feature" onClick={() => open('/newsroom/' + lead.slug)}><div className="editorial-feature-image"><img src={articleMedia(lead)} alt=""/><span className="recent-blog-tag">{lead.slug === ordered[0]?.slug ? 'Recent blog' : lead.category}</span><span className="editorial-open"><ArrowUpRight size={23}/></span></div><div className="editorial-feature-copy"><span className="inner-label">{lead.category} · {lead.read}</span><h2>{lead.title}</h2><p>{lead.summary}</p><span className="editorial-date">{articleDate(lead)}</span></div></button></DraggableFile>
      <aside className="editorial-desk"><div className="editorial-desk-title"><span className="inner-label">ON THE READING DESK</span><ArrowUpRight size={19}/></div>{filtered.filter(a => a.slug !== lead.slug).slice(0, 3).map((a, i) => <button key={a.slug} onClick={() => open('/newsroom/' + a.slug)}><span className="editorial-index">0{i + 1}</span><div><small>{a.category}</small><h3>{a.title}</h3><span>{a.read}</span></div></button>)}<div className="editorial-studio-note"><img src="/brand/mark.png" alt=""/><p>Independent thinking.<br/>Shared openly.</p><button onClick={() => open('/about')}>Meet the studio <ArrowRight size={14}/></button></div></aside>
    </div> : <p className="os-empty">No stories match your search.</p>}
    {filtered.length > 1 && <><div className="editorial-section-heading"><h2>The latest reads</h2><span>FROM THE STUDIO</span></div><div className="editorial-card-grid">{filtered.slice(1).map(a => <DraggableFile className='editorial-card-wrap' key={a.slug} file={{id:'blog-'+a.slug,title:a.title,kind:'blog',path:'/newsroom/'+a.slug}}><TrashAction file={{id:'blog-'+a.slug,title:a.title,kind:'blog',path:'/newsroom/'+a.slug}}/><button className="editorial-story-card" onClick={() => open('/newsroom/' + a.slug)}><div><img loading="lazy" src={articleMedia(a)} alt=""/><span><ArrowUpRight size={20}/></span></div><small>{a.category} · {a.read}</small><h3>{a.title}</h3><p>{a.summary}</p></button></DraggableFile>)}</div></>}
    <footer className="editorial-footer"><img src="/brand/wordmark.png" alt="High4Tech"/><span>A notebook for what comes next.</span></footer>
  </div>;
}

export function NewsroomStory({ article, open }: { article: StudioArticle; open: Open }) {
  const { articles } = useStudioContent();
  const images = article.bodyImages || [];
  const figure = (image: typeof images[number], key: number) => <figure className="editorial-body-image" key={key}><img loading="lazy" src={image.url} alt={image.alt || ''}/>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>;
  return <article className="editorial-article">
    <button className="inner-back" onClick={() => open('/newsroom')}><ArrowLeft size={15}/>All stories</button>
    <header><span className="inner-label">{article.category} / {article.read}</span><h1>{article.title}</h1><p>{article.summary}</p><div><img src="/brand/mark.png" alt=""/><span>High4Tech Studio<small>{articleDate(article)}</small></span></div></header>
    <figure className="editorial-banner"><img src={articleMedia(article, true)} alt={`${article.title} — article banner`}/></figure>
    <div className="editorial-reading"><aside><span className="inner-label">IN THIS STORY</span><strong>{article.category}</strong><span>{article.read}</span><button onClick={() => open('/contact')}>Discuss an idea <ArrowUpRight size={15}/></button></aside><section className="editorial-prose">{article.paragraphs.map((p, i) => <div key={i}><p>{p}</p>{images.filter(image => image.afterParagraph === i + 1).map((image, j) => figure(image, j))}</div>)}{images.filter(image => image.afterParagraph > article.paragraphs.length).map((image, j) => figure(image, j))}<div className="editorial-signoff"><span>WRITTEN BY THE STUDIO</span><img src="/brand/wordmark.png" alt="High4Tech"/></div></section></div>
    <div className="editorial-related"><h2>Keep reading.</h2>{recentArticles(articles).filter(a => a.slug !== article.slug).slice(0, 2).map(a => <button onClick={() => open('/newsroom/' + a.slug)} key={a.slug}><img src={articleMedia(a)} alt=""/><div><small>{a.category}</small><strong>{a.title}</strong></div><ArrowUpRight size={20}/></button>)}</div>
  </article>;
}
