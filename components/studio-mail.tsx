'use client';
import { useEffect,useRef,useState } from 'react';
import { Inbox,Send,PenSquare,Reply,ArrowLeft,Mail } from '@/components/icons';
import { useStudioContent } from './content-provider';
import { ContactForm } from './contact-form';

export function StudioMail(){
  const {settings}=useStudioContent();
  const [compose,setCompose]=useState(false),[read,setRead]=useState(false),[showMessage,setShowMessage]=useState(true);
  const reader=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(reader.current)reader.current.scrollTop=0;},[compose,showMessage]);
  useEffect(()=>{if(sessionStorage.getItem('h4t-call-preference'))setCompose(true);setRead(localStorage.getItem('h4t-welcome-read')==='yes');},[]);
  const reply=`mailto:${settings.email}?subject=${encodeURIComponent('Re: '+settings.welcomeSubject)}&body=${encodeURIComponent('Hi '+settings.agencyName+',\n\nI’d like to talk about a project.\n\n')}`;
  return <div className={`studio-mail ${compose?'is-composing':''} ${showMessage?'message-open':''}`}>
    <aside className="mail-mailboxes"><span>MAILBOXES</span><button className={!compose?'selected':''} onClick={()=>{setCompose(false);setShowMessage(false);}}><Inbox size={17}/>Inbox{!read&&<b>1</b>}</button><button onClick={()=>setCompose(true)}><PenSquare size={17}/>New message</button><button onClick={()=>setCompose(true)}><Mail size={17}/>Project brief</button><small>Welcome mail & project inquiries</small></aside>
    {!compose&&<div className="mail-message-list"><div className="mail-list-heading"><h1>Inbox</h1><span>1 message</span></div><button className={showMessage?'selected':''} onClick={()=>{setShowMessage(true);setRead(true);localStorage.setItem('h4t-welcome-read','yes');}}><span className={`mail-unread ${read?'is-read':''}`}/><div><strong>{settings.agencyName} Studio</strong><b>{settings.welcomeSubject}</b><p>A hello from the studio. Let’s talk about your next project.</p></div></button></div>}
    <div className="mail-reader" ref={reader}>{compose?<><header className="mail-reader-toolbar"><button onClick={()=>{setCompose(false);setShowMessage(true);}}><ArrowLeft size={16}/> Inbox</button><span>Project brief</span></header><div className="mail-compose-content"><div className="mail-address"><span>To</span><strong>{settings.email}</strong></div><h1>Tell us what’s on your mind.</h1><ContactForm/></div></>:showMessage?<><header className="mail-reader-toolbar"><button className="mail-mobile-back" onClick={()=>setShowMessage(false)}><ArrowLeft size={16}/> Inbox</button><span>Studio welcome</span><button onClick={()=>setCompose(true)} className="os-button" aria-label="Reply to High4Tech"><Reply size={16}/>Reply</button></header><article className="mail-letter"><div className="mail-sender"><img src={settings.mark} alt=""/><div><strong>{settings.agencyName} Studio</strong><span>{settings.email}</span><small>To you · Welcome message</small></div></div><h1>{settings.welcomeSubject}</h1>{settings.welcomeBody.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}<div className="mail-signature"><img src={settings.logo} alt={settings.agencyName}/><span>The studio team</span></div><button onClick={()=>setCompose(true)} className="os-button"><Reply size={16}/>Reply to the studio</button><a className="mail-direct-link" href={reply}><Send size={13}/> Email directly instead</a></article></>:<div className="mail-empty"><Inbox size={38} strokeWidth={1.2}/><p>Select a message to read it.</p></div>}</div>
  </div>;
}
