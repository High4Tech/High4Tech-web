'use client';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from '@/components/icons';
const clips = { click:'click', open:'open', close:'off', minimize:'minimize', maximize:'maximize', accept:'accept', error:'error', notification:'notification', off:'off' } as const;
export type UiSound = keyof typeof clips;
let current: HTMLAudioElement | undefined;
let lastPlayed = 0;
export function playUiSound(kind:UiSound='click', force=false) {
  if(typeof window==='undefined'||(!force&&localStorage.getItem('h4t-sound')==='off'))return;
  current?.pause();
  current = new Audio(`/audio/ui/${clips[kind]}.mp3`);
  current.volume = kind==='notification'?.18:.32;
  lastPlayed=performance.now();
  void current.play().catch(()=>undefined);
}
export function ClickSounds(){
  useEffect(()=>{
    const click=(event:MouseEvent)=>{
      const el=(event.target as Element).closest<HTMLElement>('a,button,summary,input[type="checkbox"],input[type="radio"]');
      if(!el||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-sound="none"]')||performance.now()-lastPlayed<80)return;
      const explicit=el.dataset.sound as UiSound|undefined;
      playUiSound(explicit&&explicit in clips?explicit:el.matches('.close')?'close':el.matches('.minimize')?'minimize':el.matches('.maximize')?'maximize':el.matches('.dock-item,.desktop-shortcut,.settings-row,.project-folder-card')?'open':'click');
    };
    document.addEventListener('click',click);
    return()=>{document.removeEventListener('click',click);current?.pause();};
  },[]);
  return null;
}
export function SoundToggle(){
  const [enabled,setEnabled]=useState(true);
  useEffect(()=>setEnabled(localStorage.getItem('h4t-sound')!=='off'),[]);
  return <button className="sound-toggle" data-sound="none" aria-label={enabled?'Mute interface sounds':'Enable interface sounds'} aria-pressed={!enabled} onClick={()=>{const next=!enabled;playUiSound(next?'accept':'off',true);setEnabled(next);localStorage.setItem('h4t-sound',next?'on':'off');}}>{enabled?<Volume2 size={14}/>:<VolumeX size={14}/>}</button>;
}
