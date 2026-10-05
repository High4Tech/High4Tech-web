'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from './icons';
import { useStudioContent } from './content-provider';
import { platformsOf, resourcePlatforms } from '@/lib/resource-platforms';
export function ResourceTicket({ open }: { open: (path: string) => void }) {
  const { resources } = useStudioContent();
  const [index, setIndex] = useState(0);
  const tool = resources.length ? resources[index % resources.length] : null;
  return <section className="resource-ticket" aria-label="Tools and resources cards"><header><span className="live-panel-label">TOOLS & RESOURCES</span><div><button aria-label="Previous tool card" disabled={resources.length < 2} onClick={() => setIndex(i => (i - 1 + resources.length) % resources.length)}><ArrowLeft size={13}/></button><button aria-label="Next tool card" disabled={resources.length < 2} onClick={() => setIndex(i => (i + 1) % resources.length)}><ArrowRight size={13}/></button></div></header>{tool ? <button className="resource-ticket-body" onClick={() => open('/tools-and-resources/' + tool.id)}><img src={tool.image || `/tools/${['gradient', 'liquid', 'cube'].includes(tool.icon) ? tool.icon : 'tool'}.svg`} alt={`${tool.title} preview`}/><span><small>{platformsOf(tool.platforms).map(p => resourcePlatforms.find(o => o.value === p)?.label).join(' · ')}</small><strong>{tool.title}</strong><em>{tool.price} <ArrowUpRight size={13}/></em></span></button> : <button className="resource-ticket-body" onClick={() => open('/tools-and-resources')}>Explore the App Store <ArrowUpRight size={15}/></button>}</section>;
}
