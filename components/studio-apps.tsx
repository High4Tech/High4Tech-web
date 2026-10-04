'use client';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, LockKeyhole, RotateCw, Search } from '@/components/icons';
import { useStudioContent } from './content-provider';

// Geometry from the supplied Figma icon pack. Assets are served locally.
export function MacIcon({name}:{name:'safari'|'finder'|'figma'|'photos'|'appstore'}) {
  if(name==='photos')return <span className="mac-icon mac-photos"><img src="/icons/figma/photos.png" alt=""/></span>;
  if(name==='appstore')return <span className="mac-icon mac-appstore"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M23 13 46 52M40 13 17 52M11 40h42" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"/></svg></span>;
  return <span className={`mac-icon mac-${name}`}><img src={`/icons/figma/${name}.svg`} alt=""/></span>;
}

export const studioStack=[
  {name:'Figma',icon:'figma',description:'Design & prototyping',url:'https://www.figma.com/'},
  {name:'React',icon:'react',description:'Interface components',url:'https://react.dev/'},
  {name:'Next.js',icon:'nextdotjs',description:'Web experiences',url:'https://nextjs.org/'},
  {name:'Three.js',icon:'threedotjs',description:'Interactive 3D',url:'https://threejs.org/'},
  {name:'GSAP',icon:'gsap',description:'Motion & animation',url:'https://gsap.com/'},
  {name:'TypeScript',icon:'typescript',description:'Thoughtful engineering',url:'https://www.typescriptlang.org/'},
];
export function Toolkit(){
  const [query,setQuery]=useState('');
  const filtered=studioStack.filter(t=>(t.name+' '+t.description).toLowerCase().includes(query.toLowerCase()));
  return <div className="installed-apps"><div className="installed-heading"><span className="os-kicker">THE CREATIVE TOOLKIT</span><h1>Made with good tools.</h1><p>Our everyday apps. A little design, a little code, a lot of possibility.</p></div><label className="installed-search"><Search size={16}/><input aria-label="Search toolkit" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search applications"/></label><div className="installed-grid">{filtered.map(t=><a href={t.url} target="_blank" rel="noopener noreferrer" key={t.name} aria-label={`${t.name} — ${t.description}. Open official website`}><span className={`installed-icon tech-${t.icon}`}>{t.icon==='figma'?<MacIcon name="figma"/>:<img src={`/icons/${t.icon}.svg`} alt=""/>}</span><strong>{t.name}</strong><small>{t.description}</small></a>)}</div>{!filtered.length&&<p className="os-empty">No applications match “{query}”.</p>}<footer>{studioStack.length} applications <span>Built into our creative process.</span></footer></div>;
}

export function Gallery({open}:{open:(path:string)=>void}){
  const {projects:catalog}=useStudioContent();
  const projects=catalog.flatMap(project=>[...(project.image?[{...project}]:[]),...(project.images||[]).map(image=>({...project,image:image.url}))]);
  const [selected,setSelected]=useState<number|null>(null);
  const back=useRef<HTMLButtonElement>(null);
  const photo=selected===null?null:projects[selected];
  useEffect(()=>{if(selected!==null)back.current?.focus();},[selected]);
  return <div className="studio-gallery" onKeyDown={e=>{if(selected===null||!projects.length)return;if(e.key==='Escape'){e.stopPropagation();setSelected(null);}if(e.key==='ArrowRight')setSelected((selected+1)%projects.length);if(e.key==='ArrowLeft')setSelected((selected-1+projects.length)%projects.length);}}>
    {photo?<><div className="gallery-controls"><button ref={back} onClick={()=>setSelected(null)}><ArrowLeft size={16}/> All photos</button><span>{selected!+1} / {projects.length}</span><button aria-label="Previous photo" onClick={()=>setSelected((selected!-1+projects.length)%projects.length)}><ArrowLeft size={16}/></button><button aria-label="Next photo" onClick={()=>setSelected((selected!+1)%projects.length)}><ArrowRight size={16}/></button></div><div className="gallery-viewer"><img src={photo.image} alt={`${photo.name} — project design`}/></div><div className="gallery-caption"><div><h1>{photo.name}</h1><p>{photo.type} · {photo.year}</p></div><button className="os-button" onClick={()=>open('/projects/'+photo.slug)}>View project <ArrowUpRight size={14}/></button></div></>:<><div className="gallery-heading"><div><span className="os-kicker">THE STUDIO LIBRARY</span><h1>All photos</h1></div><span>{projects.length} photos</span></div><div className="gallery-grid">{projects.map((p,i)=><button key={`${p.slug}-${i}`} onClick={()=>setSelected(i)} aria-label={`View ${p.name} photo`}><img src={p.image} alt={`${p.name} project preview`}/><span>{p.name}<small>{p.year}</small></span></button>)}</div><p className="gallery-footnote">A closer look at the things we make.</p></>}
  </div>;
}

export function SafariPreview({open}:{open:(path:string)=>void}){
  const frame=useRef<HTMLIFrameElement>(null);
  const [version,setVersion]=useState(0);
  useEffect(()=>{const message=(e:MessageEvent)=>{if(e.origin!==location.origin||e.source!==frame.current?.contentWindow||e.data?.type!=='h4t:preview-navigation')return;const path=e.data.path;if(typeof path==='string'&&/^\/(projects|services|about|contact|calendar|assistant|newsroom|blog|ai-zone|pricing|play|tools-and-resources|desktop)(\/[-a-z0-9]+)?$/.test(path))open(path);};window.addEventListener('message',message);return()=>window.removeEventListener('message',message);},[open]);
  return <div className="safari-app"><div className="safari-address"><span><LockKeyhole size={12}/> high4tech.studio <small>/ landing preview</small></span><button aria-label="Reload landing preview" onClick={()=>setVersion(v=>v+1)}><RotateCw size={14}/></button></div><iframe ref={frame} key={version} src="/preview" title="High4Tech landing page preview"/></div>;
}
