'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowUpRight } from '@/components/icons';
import { DesktopShell } from './desktop';
import { ClickSounds } from './sound';
import { PreviewScroll } from './page-scroll';

export function BookingButton({ className = 'button orange-button', children = 'Book a discovery call' }: { className?: string; children?: React.ReactNode }) {
  return <button className={className} onClick={() => window.dispatchEvent(new Event('high4tech:booking'))}>{children}<ArrowUpRight size={18} /></button>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname=usePathname();
  if(pathname==='/preview')return <LandingPreview>{children}</LandingPreview>;
  return <><a href="#main" className="skip-link">Skip to studio</a><DesktopShell /><ClickSounds /></>;
}

function LandingPreview({children}:{children:React.ReactNode}){
  useEffect(()=>{
    sessionStorage.setItem('h4t-intro-v2','true');
    const timer=setTimeout(()=>window.dispatchEvent(new Event('h4t:intro-complete')),120);
    const navigate=(e:MouseEvent)=>{const link=(e.target as Element).closest('a');if(!link||window.parent===window)return;const url=new URL(link.href);if(url.pathname===location.pathname&&url.hash)return;if(url.origin===location.origin){e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'h4t:preview-navigation',path:url.pathname},location.origin);}};
    const booking=()=>window.parent.postMessage({type:'h4t:preview-navigation',path:'/calendar'},location.origin);
    document.addEventListener('click',navigate,true);window.addEventListener('high4tech:booking',booking);
    return()=>{clearTimeout(timer);document.removeEventListener('click',navigate,true);window.removeEventListener('high4tech:booking',booking);};
  },[]);
  return <main id="main" className="standalone-preview"><PreviewScroll/>{children}<ClickSounds/></main>;
}
