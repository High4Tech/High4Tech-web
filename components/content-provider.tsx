'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { startChatPolling } from '@/lib/chat-client';
import { defaultContent, type StudioContent } from '@/lib/studio-content';

const ContentContext = createContext<StudioContent>(defaultContent);
export function ContentProvider({content,children}:{content:StudioContent;children:React.ReactNode}){
  const [value,setValue]=useState(content);
  useEffect(()=>setValue(content),[content]);
  useEffect(()=>{
    const controller=new AbortController();
    // Cache only published website content. Chat credentials/history are handled
    // separately; they never enter this public content cache.
    const store=(data:StudioContent)=>{try{localStorage.setItem('h4t-public-content-v1',JSON.stringify({savedAt:Date.now(),content:data}));}catch{}};
    // The server snapshot wins while online. Offline refresh can recover the
    // last successful public snapshot from this browser.
    const restore=()=>{try{const saved=JSON.parse(localStorage.getItem('h4t-public-content-v1')||'null');if(saved && Date.now()-saved.savedAt<86400000 && Array.isArray(saved.content?.services))setValue(saved.content);}catch{}};
    if(navigator.onLine)store(content);else restore();
    window.addEventListener('offline',restore);
    const stop=startChatPolling(async()=>{try{const response=await fetch('/api/studio-content',{signal:controller.signal});if(response.ok){const data=await response.json();setValue(data);store(data);}}catch{if(!navigator.onLine)restore();}},30000);
    return()=>{controller.abort();stop();window.removeEventListener('offline',restore);};
  },[content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
export const useStudioContent=()=>useContext(ContentContext);
