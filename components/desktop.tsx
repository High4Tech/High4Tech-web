'use client';
import { StudioHome } from './studio-home';
import { ResourceTicket } from './resource-ticket';
import { DesktopStorageProvider, TrashWorkspace } from './desktop-storage';
import { StudioDock } from './studio-dock';
import { Trash2 } from './icons';
import { ResourceBrowser, ResourceDetail } from './resource-browser';
import { PageScroll } from './page-scroll';
import { StudioVideos } from './studio-videos';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, Wifi, Folder, Grid2X2, List, Home, Sparkles, Box, NotebookPen, Mail, CalendarDays, Send, Monitor, ChevronRight, MessageCircle, Command, X, PanelLeft, Minus, Maximize2, Sun, Moon, Clock3, Play, Pause, DollarSign, BrainCircuit, Gamepad2 } from '@/components/icons';
import { useStudioContent } from './content-provider';
import { Symbol, ResourceCard, ArticleArt } from './ui';
import { Pricing, PlayArea, BrandIcon } from './studio-sections';
import { AIZone } from './ai-zone';
import { StudioMail } from './studio-mail';
import { ContactWorkspace, CalendarWorkspace } from './contact-workspace';
import { NewsroomLibrary, NewsroomStory } from './newsroom';
import { MacIcon, Toolkit, Gallery, SafariPreview } from './studio-apps';
import { SoundToggle, playUiSound } from './sound';
import { StudioOverview, ProjectLibrary, ProjectCase, ExpertiseLibrary, ExpertiseDetail } from './inner-pages';
import { NewsroomStack } from './newsroom-stack';
import { VisitorPrompts } from './visitor-prompts';
import { StudioAssistant } from './studio-assistant';
import { DesktopCompanion, DesktopLoops, MascotFace, StudioIntro, StudioMusic } from './studio-extras';

const apps = [
  {id:'work',label:'Projects',path:'/projects',icon:Folder,color:'blue'},
  {id:'services',label:'Expertise',path:'/services',icon:Sparkles,color:'orange'},
  {id:'tools',label:'App Store',path:'/tools-and-resources',icon:Box,color:'cream'},
  {id:'studio',label:'The studio',path:'/about',icon:Monitor,color:'peach'},
  {id:'journal',label:'Newsroom',path:'/newsroom',icon:NotebookPen,color:'yellow'},
  {id:'contact',label:'Mail',path:'/mail',icon:Mail,color:'blue'},
  {id:'assistant',label:'Assistant',path:'/assistant',icon:Sparkles,color:'orb'},
  {id:'calendar',label:'Calendar',path:'/calendar',icon:CalendarDays,color:'calendar'},
  {id:'home',label:'Home',path:'/',icon:Home,color:'home'},
  {id:'gallery',label:'Gallery',path:'/gallery',icon:Grid2X2,color:'gallery'},
  {id:'safari',label:'Safari',path:'/safari',icon:Monitor,color:'safari'},
  {id:'toolkit',label:'Toolkit',path:'/toolkit',icon:Grid2X2,color:'toolkit'},
  {id:'ai',label:'AI Zone',path:'/ai-zone',icon:BrainCircuit,color:'ai'},
  {id:'pricing',label:'Pricing',path:'/pricing',icon:DollarSign,color:'pricing'},
  {id:'trash',label:'Trash',path:'/trash',icon:Trash2,color:'trash'},
  {id:'play',label:'Play',path:'/play',icon:Gamepad2,color:'play'},
];
type StudioWindow={id:string;path:string;x:number;y:number;z:number;minimized:boolean;maximized:boolean;positioned?:boolean;motion?:'minimize'|'restore'|'zoom'};
type OpenApp=(path:string)=>void;
function appFor(path:string){if(path==='/contact')return {...apps.find(a=>a.id==='contact')!,label:'Contact',path:'/contact'};if(path.startsWith('/blog'))path=path.replace('/blog','/newsroom');return apps.find(a=>path===a.path||(a.path!=='/'&&path.startsWith(a.path+'/')))||{id:'info',label:'Read me',path,icon:NotebookPen,color:'cream'};}
function createWindow(path:string,z:number,index=0):StudioWindow {return {id:`window-${z}`,path,x:index*24,y:index*20,z,minimized:false,maximized:false};}

export function DesktopShell(){return <DesktopStorageProvider><DesktopWorkspace/></DesktopStorageProvider>;}
function DesktopWorkspace(){
  const {projects,articles,settings,socials}=useStudioContent();
  const pathname=usePathname();const router=useRouter();
  const [windows,setWindows]=useState<StudioWindow[]>(()=>[createWindow(pathname==='/desktop'?'/':pathname,10)]);
  const routed=useRef(pathname);
  const topZ=useRef(11); const [clock,setClock]=useState(''); const [menu,setMenu]=useState('');
  const [spotlight,setSpotlight]=useState(false);const [query,setQuery]=useState('');const searchDialog=useRef<HTMLDialogElement>(null);
  const [sidebar,setSidebar]=useState(false);
  const [theme,setTheme]=useState<'light'|'dark'>('light');
  const [themeReady,setThemeReady]=useState(false);
  const active=[...windows].filter(w=>!w.minimized).sort((a,b)=>b.z-a.z)[0];
  const route=(path:string,replace=false)=>{routed.current=path;if(path!==pathname){if(replace)router.replace(path);else router.push(path);}};
  const open:OpenApp=(path)=>{setWindows(current=>{const existing=current.find(w=>appFor(w.path).id===appFor(path).id);return existing?current.map(w=>w.id===existing.id?{...w,path,minimized:false,motion:w.minimized?'restore':undefined,z:++topZ.current}:w):[...current,createWindow(path,++topZ.current,current.length%3)];});setMenu('');setSpotlight(false);setSidebar(false);route(path);};
  const navigateWindow=(id:string,path:string)=>{setWindows(current=>current.map(w=>w.id===id?{...w,path,z:++topZ.current}:w));setSidebar(false);route(path);};
  useEffect(()=>{if(pathname===routed.current)return;routed.current=pathname;if(pathname==='/desktop')return;setWindows(current=>{const currentWindow=[...current].filter(w=>!w.minimized).sort((a,b)=>b.z-a.z)[0];return currentWindow?current.map(w=>w.id===currentWindow.id?{...w,path:pathname,z:++topZ.current}:w):[createWindow(pathname,++topZ.current)];});},[pathname]);
  useEffect(()=>{const update=()=>setClock(new Date().toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}));update();const timer=setInterval(update,30000);const keys=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSpotlight(v=>!v);}if(e.key==='Escape'){setMenu('');setSpotlight(false);}};window.addEventListener('keydown',keys);return()=>{clearInterval(timer);window.removeEventListener('keydown',keys);};},[]);
  useEffect(()=>{if(spotlight){searchDialog.current?.showModal();setQuery('');}else searchDialog.current?.close();},[spotlight]);
  useEffect(()=>{const stored=window.localStorage.getItem('h4t-studio-theme');if(stored==='dark'||stored==='light')setTheme(stored);setThemeReady(true);},[]);
  useEffect(()=>{if(themeReady)window.localStorage.setItem('h4t-studio-theme',theme);},[theme,themeReady]);
  useEffect(()=>{const booking=()=>open('/calendar');window.addEventListener('high4tech:booking',booking);return()=>window.removeEventListener('high4tech:booking',booking);});
  function close(id:string){const remaining=windows.filter(w=>w.id!==id);setWindows(remaining);if(active?.id===id){const next=remaining.filter(w=>!w.minimized).sort((a,b)=>b.z-a.z)[0];route(next?.path||'/desktop',true);}}
  function focus(w:StudioWindow){setWindows(current=>current.map(item=>item.id===w.id?{...item,z:++topZ.current}:item));}
  function minimize(id:string){setWindows(current=>current.map(w=>w.id===id?{...w,motion:'minimize'}:w));}
  function zoom(id:string){setWindows(current=>current.map(w=>w.id===id?{...w,maximized:!w.maximized,motion:'zoom',z:++topZ.current}:w));}
  function showDesktop(){setWindows(current=>current.map(w=>({...w,minimized:true})));setMenu('');route('/desktop');}
  const results=[...apps.map(a=>({name:a.label,path:a.path,type:'Application'})),...projects.map(p=>({name:p.name,path:'/projects/'+p.slug,type:'Project'})),...articles.map(a=>({name:a.title,path:'/newsroom/'+a.slug,type:'Newsroom'}))].filter(r=>(r.name+' '+r.type).toLowerCase().includes(query.toLowerCase()));
  return <div className={`studio-os theme-${theme} ${windows.some(w=>w.maximized&&!w.minimized)?'has-maximized-window':''}`}>
    <div className="os-wallpaper" aria-hidden="true"><div className="wallpaper-side-glow left"/><div className="wallpaper-side-glow right"/><div className="wallpaper-fold one"/><div className="wallpaper-fold two"/><div className="wallpaper-glass-logo"><img src={settings.logo} alt=""/></div></div>
    <header className="os-menubar"><button onClick={()=>open("/")} className="os-system-mark" aria-label="Open Home"><img src={settings.mark} alt=""/></button><strong>{settings.agencyName} OS</strong><div className="os-menus">{['File','View','Help'].map(label=><div className="os-menu-wrap" key={label}><button aria-expanded={menu===label} onClick={()=>setMenu(menu===label?'':label)}>{label}</button>{menu===label&&<div className="os-menu-popover">{label==='File'?apps.slice(0,6).map(a=><button key={a.id} onClick={()=>open(a.path)}><a.icon size={14}/>{a.label}<ChevronRight size={12}/></button>):label==='View'?<><button onClick={showDesktop}>Show desktop</button><button onClick={()=>{setSpotlight(true);setMenu('');}}>Search the studio <span>⌘ K</span></button>{active&&<button onClick={()=>{zoom(active.id);setMenu('');}}>Toggle full window</button>}</>:<><button onClick={()=>{window.dispatchEvent(new Event("h4t:tour"));setMenu("");}}>Reset feature tips</button><button onClick={()=>open('/assistant')}>Ask the assistant</button><button onClick={()=>open('/contact')}>Contact the studio</button><a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp <ArrowUpRight size={13}/></a></>}</div>}</div>)}</div><div className="os-menu-right"><button className="menubar-pricing" data-tip="pricing" aria-label="Open Pricing" onClick={()=>open('/pricing')}><DollarSign size={15}/></button><button className="theme-toggle" data-tip="theme" aria-label={`Switch to ${theme==='light'?'dark':'light'} mode`} aria-pressed={theme==='dark'} onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={14}/>:<Sun size={14}/>}</button><SoundToggle/><button aria-label="Search the studio" onClick={()=>setSpotlight(true)}><Search size={14}/></button><Wifi size={15}/><time suppressHydrationWarning>{clock}</time><button onClick={()=>open("/")} className="os-home">Home</button></div></header>
    {menu&&<button className="os-menu-dismiss" aria-label="Close menu" onClick={()=>setMenu('')}/>}
    <main id="main" className="os-desktop" aria-label="High4Tech desktop">
      <StudioLivePanel open={open}/>
      <div className="desktop-shortcuts">{[apps[0],apps[1],apps[2],apps[4],apps[3]].map(a=><button className="desktop-shortcut" data-tip={a.id} key={a.id} onClick={()=>open(a.path)}><span className={`desktop-folder ${a.color}`}>{<a.icon size={31} strokeWidth={1.5}/>}</span><span>{a.label}</span></button>)}</div>
      {windows.map(w=><AppWindow key={w.id} window={w} active={active?.id===w.id} sidebar={sidebar} setSidebar={setSidebar} onFocus={()=>focus(w)} onClose={()=>close(w.id)} onMinimize={()=>minimize(w.id)} onZoom={()=>zoom(w.id)} onRestoreDrag={(x,y)=>setWindows(current=>current.map(item=>item.id===w.id?{...item,maximized:false,motion:undefined,positioned:true,x,y,z:++topZ.current}:item))} onMotionEnd={()=>setWindows(current=>current.map(item=>item.id===w.id?{...item,minimized:item.motion==='minimize'?true:item.minimized,motion:undefined}:item))} onMove={(x,y)=>setWindows(current=>current.map(item=>item.id===w.id?{...item,positioned:true,x,y}:item))} open={path=>navigateWindow(w.id,path)}/>)}
    </main>
    <aside className="minimized-tray" aria-label="Minimized windows">{windows.filter(w=>w.minimized).map(w=>{const app=appFor(w.path);return <button key={w.id} data-sound="open" aria-label={`Restore ${app.label}`} onClick={()=>{setWindows(current=>current.map(item=>item.id===w.id?{...item,minimized:false,motion:'restore',z:++topZ.current}:item));route(w.path);}}><span className="mini-window-preview"><i/><app.icon size={24} strokeWidth={1.25}/><b>{app.label}</b></span><small>{app.label}</small></button>;})}</aside>
    <VisitorPrompts open={open} activePath={active?.path||"/desktop"}/>
    <DesktopLoops kind="tools"/><DesktopCompanion/><StudioIntro/>
    <div className="dock-stage"><DesktopLoops kind="clients"/><StudioDock apps={apps} activeId={active?appFor(active.path).id:''} runningIds={windows.map(w=>appFor(w.path).id)} open={path=>open(path==='/mail'?path:windows.find(w=>appFor(w.path).id===appFor(path).id)?.path||path)} showDesktop={showDesktop}/></div>
    <dialog className="os-spotlight" ref={searchDialog} onCancel={()=>setSpotlight(false)} onClick={e=>{if(e.target===searchDialog.current)setSpotlight(false);}}><form onSubmit={e=>{e.preventDefault();if(results[0])open(results[0].path);}}><Search size={22}/><input autoFocus aria-label="Search apps and projects" placeholder="Search the studio…" value={query} onChange={e=>setQuery(e.target.value)}/><button type="button" onClick={()=>setSpotlight(false)} aria-label="Close search"><X size={18}/></button></form><div className="spotlight-results">{results.length?results.map(r=><button key={r.path} onClick={()=>open(r.path)}><span>{r.name}</span><small>{r.type}</small><ArrowUpRight size={15}/></button>):<p>No matches. Try “Projects”, “Design”, or “Mail”.</p>}</div><footer><span>↑ Find your next idea</span><span>ESC to close</span></footer></dialog>
  </div>;
}

function StudioLivePanel({open}:{open:OpenApp}){
  const {projects,resources,articles}=useStudioContent();
  const [now,setNow]=useState<Date|null>(null);
  useEffect(()=>{setNow(new Date());const timer=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(timer);},[]);
  const time=(zone:string)=>now?new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit'}).format(now):'—';
  return <aside className="studio-live-panel" aria-label="Live studio overview">
    <div className="live-clocks"><span className="live-panel-label">A STUDIO WITHOUT BORDERS</span><div className="clock-pair"><div><span><i/>YOUR TIME</span><strong>{now?now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}):'—'}</strong></div><div><span><i/>LONDON</span><strong>{time('Europe/London')}</strong></div></div></div>
    <button className="live-call" onClick={()=>open('/calendar')}><span><b>{now?.toLocaleDateString('en-US',{weekday:'long'})||'TODAY'}</b><strong>{now?.getDate()||'—'}</strong></span><small>Let’s talk <ArrowUpRight size={13}/></small></button>
    <NewsroomStack open={open}/><ResourceTicket open={open}/>
    <div className="live-stats"><button onClick={()=>open('/projects')}><span>PORTFOLIO</span><strong>{String(projects.length).padStart(2,'0')}</strong><small>Projects in Finder</small></button><button onClick={()=>open('/tools-and-resources')}><span>RESOURCES</span><strong>{String(resources.filter(r=>r.price==='Free').length).padStart(2,'0')}</strong><small>Free to explore</small></button></div>
    <StudioMusic/>
  </aside>;
}

function AppWindow({window:w,active,sidebar,setSidebar,onFocus,onClose,onMinimize,onZoom,onMove,onRestoreDrag,onMotionEnd,open}:{window:StudioWindow;active:boolean;sidebar:boolean;setSidebar:(v:boolean)=>void;onFocus:()=>void;onClose:()=>void;onMinimize:()=>void;onZoom:()=>void;onRestoreDrag:(x:number,y:number)=>void;onMotionEnd:()=>void;onMove:(x:number,y:number)=>void;open:OpenApp}){
  const {projects,services,articles,settings,socials}=useStudioContent();
  const frame=useRef<HTMLElement>(null);
  const normal=useRef<{left:number;top:number;width:number;height:number}|null>(null);
  const drag=useRef<{x:number;y:number;bx:number;by:number;restore:boolean;anchorX:number;anchorY:number}|null>(null);const app=appFor(w.path);
  useEffect(()=>{
    const element=frame.current;if(!element||w.maximized)return;
    const measure=()=>{normal.current={left:element.offsetLeft,top:element.offsetTop,width:element.offsetWidth,height:element.offsetHeight};};
    measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();
  },[w.maximized,app.id]);
  function startDrag(event:React.PointerEvent<HTMLElement>){
    if(event.button!==0||(event.target as HTMLElement).closest('button'))return;
    const bounds=normal.current;if(!bounds)return;
    const corner=event.currentTarget.dataset.windowCorner;
    const current=frame.current!.getBoundingClientRect();
    const anchorX=corner?(corner.includes('left')?12:bounds.width-12):Math.max(30,Math.min(bounds.width-30,(event.clientX-current.left)/current.width*bounds.width));
    const anchorY=corner?(corner.includes('bottom')?bounds.height-12:12):event.clientY-current.top;
    drag.current={x:event.clientX,y:event.clientY,bx:w.x,by:w.y,restore:w.maximized,anchorX,anchorY};
    event.currentTarget.setPointerCapture(event.pointerId);event.preventDefault();
  }
  function moveDrag(event:React.PointerEvent<HTMLElement>){
    const moving=drag.current,bounds=normal.current;if(!moving||!bounds)return;
    const desktopTop=frame.current!.parentElement!.getBoundingClientRect().top;
    const clamp=(x:number,y:number)=>({x:Math.max(96-bounds.width-bounds.left,Math.min(window.innerWidth-96-bounds.left,x)),y:Math.max(-bounds.top,Math.min(window.innerHeight-desktopTop-46-bounds.top,y))});
    if(moving.restore){
      if(Math.hypot(event.clientX-moving.x,event.clientY-moving.y)<5)return;
      const position=clamp(event.clientX-moving.anchorX-bounds.left,event.clientY-moving.anchorY-desktopTop-bounds.top);
      moving.restore=false;moving.x=event.clientX;moving.y=event.clientY;moving.bx=position.x;moving.by=position.y;
      onRestoreDrag(position.x,position.y);
    }else{const position=clamp(moving.bx+event.clientX-moving.x,moving.by+event.clientY-moving.y);onMove(position.x,position.y);}
  }
  const endDrag=()=>{drag.current=null;};
  const [search,setSearch]=useState('');const [list,setList]=useState(false);
  useEffect(()=>setSearch(''),[w.path]);
  const compact=['assistant','calendar','safari','contact','ai'].includes(app.id);
  const label=w.path.split('/').length>2?(projects.find(p=>w.path.endsWith(p.slug))?.name||services.find(s=>w.path.endsWith(s.slug))?.short||articles.find(a=>w.path.endsWith(a.slug))?.title||app.label):app.label;
  return <section ref={frame} className={`os-window ${active?'is-active':''} ${w.minimized?'is-minimized':''} ${w.motion?'window-'+w.motion:''} ${w.maximized?'is-maximized':''} ${w.positioned?'is-positioned':''} ${compact?'compact-window':''} app-${app.id} ${sidebar?'sidebar-open':''}`} style={{'--window-x':`${w.x}px`,'--window-y':`${w.y}px`,zIndex:w.z} as React.CSSProperties} onAnimationEnd={e=>{if(e.target===e.currentTarget)onMotionEnd();}} aria-label={`${app.label} window`} onPointerDown={onFocus} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
    {(['top-left','top-right','bottom-left','bottom-right'] as const).map(corner=><span key={corner} aria-hidden="true" className={`window-drag-corner corner-${corner}`} data-window-corner={corner} onPointerDown={startDrag}/>)}
    <header className="window-titlebar" data-tip="windows" onDoubleClick={e=>{if(!(e.target as HTMLElement).closest('button'))onZoom();}} onPointerDown={startDrag}>
      <div className="traffic-lights"><button className="close" aria-label={`Close ${app.label}`} onClick={onClose}><X size={9}/></button><button className="minimize" aria-label={`Minimize ${app.label}`} onClick={onMinimize}><Minus size={9}/></button><button className="maximize" aria-label={`${w.maximized?'Restore':'Maximize'} ${app.label}`} onClick={onZoom}><Maximize2 size={8}/></button></div><span><app.icon size={13}/>{label}</span><button className="window-sidebar-toggle" aria-label="Toggle sidebar" onClick={()=>setSidebar(!sidebar)}><PanelLeft size={15}/></button>
    </header>
    <div className="window-layout">{!compact&&<aside className="finder-sidebar"><span className="sidebar-label">FAVORITES</span>{apps.filter(a=>['home','work','services','tools','studio','journal','pricing'].includes(a.id)).sort((a,b)=>a.id==='home'?-1:b.id==='home'?1:0).map(a=><button key={a.id} data-tip={a.id} className={app.id===a.id?'selected':''} onClick={()=>open(a.path)}><a.icon size={16}/>{a.id==='tools'?'Tools & resources':a.label}{a.id==='work'&&<small>{projects.length}</small>}</button>)}<a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp"/>WhatsApp<ArrowUpRight size={11}/></a><div className="sidebar-brand"><img src={settings.logo} alt={settings.agencyName}/></div></aside>}
      <div className="window-main">{!compact&&<div className="finder-toolbar"><button aria-label="Back to folder" disabled={w.path===app.path} onClick={()=>open(app.path)}><ArrowLeft size={17}/></button><span className="finder-breadcrumb">High4Tech <ChevronRight size={12}/><strong>{app.label}</strong>{w.path!==app.path&&<><ChevronRight size={12}/><span>{label}</span></>}</span>{['work','tools','journal'].includes(app.id)&&w.path===app.path&&<><label className="finder-search"><Search size={13}/><input aria-label={`Search ${app.label}`} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"/></label>{app.id==='work'&&<button aria-label={list?'Show grid view':'Show list view'} onClick={()=>setList(!list)}>{list?<Grid2X2 size={17}/>:<List size={17}/>}</button>}</>}</div>}
        <PageScroll key={w.path} active={active&&!w.minimized&&w.motion!=='minimize'} native={['assistant','safari','contact','calendar'].includes(app.id)}><AppContent path={w.path} open={open} search={search} list={list}/></PageScroll>
        {!compact&&<footer className="window-status"><span><Folder size={11}/> High4Tech / {app.label.toLowerCase()}</span><span>{app.id==='work'?`${projects.length} projects`:'Made of ideas.'}</span></footer>}
      </div>
    </div>
  </section>;
}

function AppContent({path,open,search,list}:{path:string;open:OpenApp;search:string;list:boolean}){
  const {projects,services,resources,articles,settings}=useStudioContent();
  if(path==='/')return <StudioHome open={open}/>;
  if(path==='/trash')return <TrashWorkspace open={open}/>;
  if(path==='/ai-zone')return <AIZone open={open}/>;
  if(path==='/pricing')return <Pricing open={open}/>;
  if(path==='/play')return <PlayArea/>;
  if(path==='/gallery')return <Gallery open={open}/>;
  if(path==='/safari')return <SafariPreview open={open}/>;
  if(path==='/toolkit')return <Toolkit/>;
  if(path==='/assistant')return <Assistant open={open}/>;
  if(path==='/calendar')return <CalendarWorkspace open={open}/>;
  if(path.startsWith('/projects'))return path==='/projects'?<ProjectLibrary open={open} search={search} list={list}/>:<ProjectCase slug={path.split('/')[2]} open={open}/>;
  if(path.startsWith('/services'))return path==='/services'?<ExpertiseLibrary open={open}/>:<ExpertiseDetail slug={path.split('/')[2]} open={open}/>;
  if(path.startsWith('/tools-and-resources/')){const resource=resources.find(r=>path==='/tools-and-resources/'+r.id);return resource?<ResourceDetail resource={resource} open={open}/>:<p className="os-empty">That resource is no longer available.</p>;}
  if(path==='/tools-and-resources')return <ResourceBrowser open={open} search={search}/>;
  if(path==='/about')return <StudioOverview open={open}/>;
  if(path.startsWith('/newsroom')||path.startsWith('/blog')){const article=articles.find(a=>path.endsWith('/'+a.slug));return article?<NewsroomStory article={article} open={open}/>:<NewsroomLibrary open={open} search={search}/>;}
  if(path==='/mail')return <StudioMail/>;
  if(path==='/contact')return <ContactWorkspace/>;
  if(path==='/privacy'||path==='/terms')return <div className="os-reading"><span className="os-kicker">STUDIO NOTES / PREVIEW</span><h1>{path==='/privacy'?'Your privacy.':'A few ground rules.'}</h1><p>Inquiry forms let you review a draft, send a project brief to the support inbox, or open your email app. Assistant questions are sent to our server to search published studio knowledge. They are not sent to an external AI provider. When studio support is connected, conversations are saved for the team and associated with a private browser cookie. Name, phone number, and email are required to start chat. These self-reported details and a recent chat cache stay in your browser; a private cookie resumes the conversation on this browser. Email alone cannot recover another browser’s history. In preview mode, chat is not saved to the CMS.</p><p>External tools, social links, email, and WhatsApp open their respective services, whose own terms and privacy policies apply. No purchases or account creation take place on this website.</p><p>Final legal policies will be added before the public launch once the site’s services and integrations are finalized.</p><button className="os-button" onClick={()=>open('/contact')}>Contact the studio <ArrowUpRight size={15}/></button></div>;
  return <div className="os-reading"><h1>This folder is empty.</h1><p>That page could not be found.</p><Link href="/" className="os-button">Back to home <ArrowUpRight size={16}/></Link></div>;
}

function Assistant({open}:{open:OpenApp}){
  return <StudioAssistant open={open}/>;
}
