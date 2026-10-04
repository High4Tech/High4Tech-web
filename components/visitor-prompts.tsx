'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, DollarSign, Minus, Maximize2, X } from './icons';
import { MascotFace } from './studio-extras';
import { StudioAssistant } from './studio-assistant';
import { useStudioContent } from './content-provider';
const keys={start:'h4t-invite-start-v2',seen:'h4t-invite-seen-v2',pending:'h4t-invite-open-v2',closed:'h4t-invite-closed-v2',pricing:'h4t-pricing-seen-v2'};
/** Once per browser session: a greeting after 30s, pricing 30s after dismissal. */
export function VisitorPrompts({open,activePath}:{open:(path:string)=>void;activePath:string}){
 const {assistant}=useStudioContent();const [chat,setChat]=useState(false),[pricing,setPricing]=useState(false),[hasOpened,setHasOpened]=useState(false);const path=useRef(activePath),previousPath=useRef(activePath),openApp=useRef(open),enabled=useRef(assistant.enabled);
 const visible=useRef(chat);visible.current=chat;
 path.current=activePath;openApp.current=open;enabled.current=assistant.enabled;
 useEffect(()=>{if(chat)setHasOpened(true);},[chat]);
 function showChat(){sessionStorage.setItem(keys.seen,'yes');sessionStorage.setItem(keys.pending,'yes');setPricing(false);setChat(true);}
 function dismissChat(){setChat(false);sessionStorage.removeItem(keys.pending);sessionStorage.setItem(keys.closed,String(Date.now()));}
 useEffect(()=>{if(previousPath.current==='/assistant'&&activePath!=='/assistant')sessionStorage.setItem(keys.closed,String(Date.now()));previousPath.current=activePath;if(activePath==='/assistant')sessionStorage.setItem(keys.seen,'yes');if(activePath==='/pricing'){setPricing(false);sessionStorage.setItem(keys.pricing,'yes');}if(activePath==='/assistant'&&chat)dismissChat();},[activePath,chat]);
 useEffect(()=>{
  const start=Number(sessionStorage.getItem(keys.start))||Date.now();sessionStorage.setItem(keys.start,String(start));
  if(sessionStorage.getItem(keys.pending)&&enabled.current&&path.current!=='/assistant')setChat(true);
  const tick=()=>{
   if(document.hidden)return;
   if(!sessionStorage.getItem(keys.seen)&&Date.now()-start>=30000){
    sessionStorage.setItem(keys.seen,'yes');
    if(enabled.current&&path.current!=='/assistant'){sessionStorage.setItem(keys.pending,'yes');setChat(true);}else if(path.current!=='/assistant'){sessionStorage.setItem(keys.closed,String(Date.now()));}
   }
   const closed=Number(sessionStorage.getItem(keys.closed));
   if(closed&&Date.now()-closed>=30000&&!sessionStorage.getItem(keys.pricing)&&path.current!=='/assistant'&&!visible.current){
    sessionStorage.setItem(keys.pricing,'yes');if(path.current!=='/pricing')setPricing(true);
   }
  };
  const timer=setInterval(tick,500);document.addEventListener('visibilitychange',tick);tick();
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick);};
 },[]);
 return <>{assistant.enabled&&activePath!=='/assistant'&&!chat&&<button className="assistant-bubble" aria-label="Open floating assistant" onClick={showChat}><MascotFace/><span>Ask us anything</span></button>}{assistant.enabled&&activePath!=='/assistant'&&(chat||hasOpened)&&<aside hidden={!chat||activePath==='/assistant'} className="visitor-chat" aria-label="High4Tech assistant greeting" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();dismissChat();}}}><div className="visitor-chat-title"><span><MascotFace/><strong>Your studio assistant</strong></span><div className="visitor-chat-controls"><button aria-label="Expand assistant to studio window" onClick={()=>{dismissChat();openApp.current('/assistant');}}><Maximize2 size={15}/></button><button aria-label="Minimize assistant greeting" onClick={dismissChat}><Minus size={17}/></button></div></div><p className="visitor-chat-greeting" role="status">Hi there! Any questions about our work, tools or services? I’m here to help.</p><StudioAssistant open={next=>{dismissChat();openApp.current(next);}}/></aside>}{pricing&&<aside className="pricing-reminder visitor-pricing" aria-label="Pricing reminder" role="status"><button className="reminder-close" aria-label="Dismiss pricing reminder" onClick={()=>setPricing(false)}><X size={16}/></button><span className="pricing-symbol"><DollarSign size={22}/></span><div><strong>A starting point for your project.</strong><p>Explore our packages, or talk to the studio about a custom scope.</p><button className="os-button" onClick={()=>{setPricing(false);openApp.current('/pricing');}}>Explore pricing <ArrowRight size={14}/></button></div></aside>}</>;
}
