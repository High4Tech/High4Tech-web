'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, DollarSign, Gamepad2, RotateCcw, X, CheckCheck } from '@/components/icons';
import { useStudioContent } from './content-provider';
import { ArticleArt } from './ui';
import { playUiSound } from './sound';

export function BrandIcon({name}:{name:'whatsapp'|'instagram'|'behance'|'spotify'|'applemusic'}){return <img className={`brand-icon brand-${name}`} src={`/icons/${name}.svg`} alt="" aria-hidden="true"/>;}

export { PricingCalculator as Pricing } from './pricing-calculator';

const symbols=['✳','✦','◈','●','✳','✦','◈','●'];
export function PlayArea(){
  const [deck,setDeck]=useState(symbols),[flipped,setFlipped]=useState<number[]>([]),[matched,setMatched]=useState<number[]>([]),[moves,setMoves]=useState(0),[started,setStarted]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  function reset(){if(timer.current)clearTimeout(timer.current);const next=[...symbols];for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]];}setDeck(next);setFlipped([]);setMatched([]);setMoves(0);setStarted(true);}
  function flip(i:number){if(!started||flipped.length===2||matched.includes(i)||flipped.includes(i))return;const next=[...flipped,i];setFlipped(next);if(next.length===2){setMoves(m=>m+1);if(deck[next[0]]===deck[next[1]]){setMatched(m=>[...m,...next]);setFlipped([]);playUiSound('accept');}else timer.current=setTimeout(()=>setFlipped([]),850);}}
  return <div className="play-area"><header><Gamepad2 size={34} strokeWidth={1.3}/><span className="os-kicker">PLAY AREA</span><h1>A little break.<br/>A fresh perspective.</h1><p>Small games for curious minds. Start with a round of Studio Pairs.</p></header><section className="memory-game"><div className="game-toolbar"><div><h2>Studio Pairs</h2><span>Find the four matching pairs.</span></div><span>{moves} {moves===1?'move':'moves'} · {matched.length/2}/4 pairs</span></div>{!started?<div className="game-start"><div aria-hidden="true">✳ ◈ ✦</div><button className="os-button" onClick={reset}>Let’s play <ArrowRight size={16}/></button></div>:<><div className="memory-grid">{deck.map((symbol,i)=><button key={i} className={`${flipped.includes(i)||matched.includes(i)?'revealed':''} ${matched.includes(i)?'matched':''}`} onClick={()=>flip(i)} disabled={matched.includes(i)||flipped.includes(i)||flipped.length===2} aria-label={`Card ${i+1}${flipped.includes(i)||matched.includes(i)?': '+symbol:''}${matched.includes(i)?', matched':''}`}><span>{flipped.includes(i)||matched.includes(i)?symbol:'4'}</span></button>)}</div><div className="game-result" role="status">{matched.length===deck.length?<><CheckCheck size={18}/> All paired up. Nicely done.</>:<span>A little observation goes a long way.</span>}<button onClick={reset}><RotateCcw size={14}/> New game</button></div></>}</section><p className="play-note">More little experiments will find a home here.</p></div>;
}
