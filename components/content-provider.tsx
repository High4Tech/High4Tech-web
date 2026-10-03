'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultContent, type StudioContent } from '@/lib/studio-content';

const ContentContext = createContext<StudioContent>(defaultContent);
export function ContentProvider({content,children}:{content:StudioContent;children:React.ReactNode}){
  const [value,setValue]=useState(content);
  useEffect(()=>setValue(content),[content]);
  useEffect(()=>{
    const controller=new AbortController();
    const refresh=async()=>{if(document.visibilityState==='hidden')return;try{const response=await fetch('/api/studio-content',{cache:'no-store',signal:controller.signal});if(response.ok)setValue(await response.json());}catch{/* Keep the last successful content while offline. */}};
    const timer=setInterval(refresh,30000);
    window.addEventListener('focus',refresh);
    return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
export const useStudioContent=()=>useContext(ContentContext);
