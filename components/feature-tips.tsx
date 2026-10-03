'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const tips:Record<string,[string,string]>={
  ai:['Make room for better work','Explore assistants, automations, and an example workflow. Click its steps to see how it works.'],
  pricing:['A clear place to start','Explore sample packages, then ask the studio for a proposal tailored to your project.'],
  play:['Take a little break','Studio Pairs is ready to play. Match the symbols and see how few moves you need.'],
  services:['From idea to launch','Explore a capability to see the services and deliverables we can bring to your project.'],
  studio:['Meet the studio','A little about our people, approach, and the ideas behind High4Tech.'],
  journal:['Thoughts in progress','Open a note to read it. Use the search field to find a topic.'],
  contact:['Start a conversation','Prepare an inquiry here, then review and send it through your own email app.'],
  calendar:['Make time for an idea','Choose a topic and preferred date to prepare a call request. Live booking is coming later.'],
  home:['Your studio home','Services, selected work, and studio notes live here. Scroll inside the window to explore.'],
  work:['A folder full of ideas','Open a project folder for the story behind the work. Gallery lets you browse the images.'],
  tools:['A few useful things','App Store holds free resources and paid tools. Each opens on its own platform.'],
  gallery:['The bigger picture','Click a photo to open it. Use the arrows to browse, or jump into its project.'],
  safari:['A different view','The landing page lives inside Safari. Its links open the matching studio apps.'],
  toolkit:['Our everyday applications','Explore the tech behind the studio. Each icon opens its official website.'],
  assistant:['Meet your companion','Ask about the studio, work, or tools. This preview uses a local studio guide.'],
  music:['Your soundtrack, your choice','Press Play for studio ambient, or load a Spotify or Apple Music share link. Music stays off until you choose.'],
  windows:['Make room for ideas','Drag the title bar to move a window. Red closes, yellow minimizes, and green expands. Restore windows from the side tray or dock.'],
  theme:['Make yourself at home','Light or dark: your appearance choice is saved for your next visit.'],
  desktop:['Your creative desktop','Your windows are tucked away in the dock. Click an app to bring it back.'],
};
const key='h4t-feature-tips-v1';
export function FeatureTips(){
  const [tip,setTip]=useState<{id:string;x:number;y:number}|null>(null);
  useEffect(()=>{
    let seen=new Set<string>();let disabled=false;
    try{const saved=JSON.parse(localStorage.getItem(key)||'{}');seen=new Set(saved.seen||[]);disabled=!!saved.disabled;}catch{}
    const save=()=>localStorage.setItem(key,JSON.stringify({seen:[...seen],disabled}));
    const clicked=(e:MouseEvent)=>{
      const el=(e.target as Element).closest<HTMLElement>('[data-tip]');
      if(disabled||!el||!tips[el.dataset.tip!]||seen.has(el.dataset.tip!)||document.querySelector('.studio-boot'))return;
      const id=el.dataset.tip!;seen.add(id);save();const r=el.getBoundingClientRect();
      setTip({id,x:Math.max(12,Math.min(r.left+r.width/2-155,innerWidth-322)),y:r.top>innerHeight/2?Math.max(40,r.top-208):Math.min(innerHeight-220,r.bottom+12)});
    };
    const reset=()=>{disabled=false;seen.clear();save();setTip({id:'home',x:Math.max(12,Math.min(365,innerWidth-322)),y:76});};
    const disable=()=>{disabled=true;save();setTip(null);};
    const dismiss=()=>setTip(null);
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')dismiss();};
    document.addEventListener('click',clicked);window.addEventListener('h4t:tour',reset);window.addEventListener('h4t:tips-off',disable);window.addEventListener('resize',dismiss);document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('click',clicked);window.removeEventListener('h4t:tour',reset);window.removeEventListener('h4t:tips-off',disable);window.removeEventListener('resize',dismiss);document.removeEventListener('keydown',escape);};
  },[]);
  if(!tip)return null;
  return <aside className="feature-ticket" style={{left:tip.x,top:tip.y}} aria-label="Studio tip" role="status"><span className="ticket-eyebrow">A LITTLE POINTER <i>✳</i></span><button className="ticket-close" aria-label="Dismiss tip" onClick={()=>setTip(null)}><X size={15}/></button><h2>{tips[tip.id][0]}</h2><p>{tips[tip.id][1]}</p><footer><button onClick={()=>window.dispatchEvent(new Event('h4t:tips-off'))}>Skip all tips</button><button onClick={()=>setTip(null)}>Got it</button></footer></aside>;
}
