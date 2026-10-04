'use client';

import { ArrowRight, ArrowUpRight, Check, Code2, Palette, TrendingUp } from './icons';
import { useStudioContent } from './content-provider';
import { Symbol } from './ui';

export function ExpertiseWorkspace({ open }: { open: (path: string) => void }) {
  const { services } = useStudioContent();
  return <div className="expertise-workspace"><header><span className="inner-label">OUR EXPERTISE / YOUR NEXT CHAPTER</span><div><h1>Different disciplines.<br/>One considered outcome<span>.</span></h1><p>Design, development and digital growth.<br/>Built to work beautifully together.</p></div></header><div className="capability-bento">{services.map((s, i) => {
    const Icon = [Palette, Code2, TrendingUp][i % 3];
    return <article className={`capability-tile capability-${i % 3}`} key={s.slug} data-inner-reveal>
      <div className="capability-tile-art" aria-hidden="true">{i % 3 === 0 ? <div className="design-specimen"><span className="design-specimen-stamp">H4T / DESIGN SYSTEM</span><div><b>Aa</b><i/></div><span>Character in every detail.</span><div className="design-specimen-swatches"><i/><i/><i/></div></div> : i % 3 === 1 ? <div className="code-specimen"><div><i/><i/><i/><span>studio.tsx</span></div><pre><span>const</span> experience = {'{'}<br/>&nbsp; idea: <em>"yours"</em>,<br/>&nbsp; craft: <em>"ours"</em>,<br/>&nbsp; possibilities: <span>Infinity</span><br/>{'}'};<br/><br/><small>// Built to move forward.</small></pre><span className="code-specimen-status"><i/>READY FOR WHAT’S NEXT</span></div> : <div className="growth-specimen"><div className="growth-orbit"><Symbol kind={s.symbol}/></div><span className="growth-specimen-label"><TrendingUp size={17}/>A clear direction.</span></div>}</div>
      <div className="capability-tile-copy"><div className="capability-tile-label"><span><Icon size={17}/>{s.number} / CAPABILITY</span><ArrowUpRight size={20}/></div><h2>{s.short}</h2><p>{s.description}</p><div className="capability-tags">{s.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => open('/services/' + s.slug)}>Explore {s.short.toLowerCase()} <ArrowRight size={17}/></button></div>
    </article>;
  })}</div><section className="capability-approach"><div><span className="inner-label">HOW WE GET THERE</span><h2>A shared process.<br/>A clearer next step.</h2></div><ol>{[{ title: 'Find the real question', text: 'Understand the people, the purpose and what success looks like.' }, { title: 'Make the idea tangible', text: 'Explore a direction through design, prototypes and useful conversations.' }, { title: 'Build. Refine. Move forward.', text: 'Bring the details together and prepare for the next chapter.' }].map((step, i) => <li key={step.title}><span>0{i + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><Check size={17}/></li>)}</ol></section><footer><p>Not sure where to start? Bring the idea.<br/>We’ll find the right combination of skills.</p><button className="premium-action" onClick={() => open('/contact')}>Start a conversation <ArrowUpRight size={18}/></button></footer></div>;
}
