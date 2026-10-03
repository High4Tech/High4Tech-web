import 'server-only';
import { cache } from 'react';
import { defaultContent,type StudioContent } from './studio-content';
import { cmsConfigurationIssues } from './cms-runtime';

type Row=Record<string,unknown>;
const str=(value:unknown,fallback='')=>typeof value==='string'?value:fallback;
const strings=(value:unknown)=>Array.isArray(value)?value.map(item=>str((item as Row).value)):[];
const imageURL=(value:unknown,fallback='')=>value&&typeof value==='object'?str((value as Row).url,fallback):fallback;

export const getStudioContent=cache(async():Promise<StudioContent>=>{
  if(cmsConfigurationIssues().length)return defaultContent;
  const [{getPayload},{default:config}]=await Promise.all([import('payload'),import('@payload-config')]);
  const payload=await getPayload({config});
  const names=['services','projects','newsroom','resources','faqs','pricing','ai-services','chatbot-data'] as const;
  const results=await Promise.all(names.map(collection=>payload.find({collection,limit:500,depth:1,sort:'sortOrder',overrideAccess:false,draft:false})));
  const [services,projects,articles,resources,faqs,pricing,ai,knowledge]=results.map(result=>result.docs as unknown as Row[]);
  const [site,contact,assistant]=await Promise.all([payload.findGlobal({slug:'site-settings',depth:1}),payload.findGlobal({slug:'contact-info'}),payload.findGlobal({slug:'assistant-settings'})]);
  const settings=site as unknown as Row;
  const info=contact as unknown as Row;
  return {
    assistant:{enabled:assistant.enabled!==false,welcomeMessage:assistant.welcomeMessage||defaultContent.assistant.welcomeMessage,fallbackMessage:assistant.fallbackMessage||defaultContent.assistant.fallbackMessage},
    services:services.map((s,i)=>({slug:str(s.slug),number:String(i+1).padStart(2,'0'),title:str(s.title),short:str(s.short),description:str(s.description),tags:strings(s.tags),deliverables:strings(s.deliverables),symbol:str(s.symbol,'flower'),draft:Boolean(s.draft)})),
    projects:projects.map(p=>({slug:str(p.slug),name:str(p.name),type:str(p.type),category:str(p.category),year:str(p.year),image:imageURL(p.image,str(p.imagePath)),color:str(p.color,'#f5eee9'),description:str(p.description),source:'',intro:str(p.intro),images:Array.isArray(p.gallery)?p.gallery.map(item=>{const row=item as Row;return {url:imageURL(row.image,str(row.imagePath)),alt:str(row.alt,str(p.name))};}).filter(image=>image.url):[]})),
    articles:articles.map((a,i)=>({slug:str(a.slug),number:String(i+1).padStart(2,'0'),title:str(a.title),category:str(a.category),read:str(a.read),artwork:str(a.artwork,'type'),summary:str(a.summary),paragraphs:strings(a.paragraphs),image:imageURL(a.image),publishedAt:str(a.publishedAt)})),
    resources:resources.map(r=>({id:str(r.slug),title:str(r.title),description:str(r.description),category:str(r.category),price:str(r.price),url:str(r.url)||null,icon:str(r.icon,'tool'),label:str(r.label)})),
    faqs:faqs.map(f=>({question:str(f.question),answer:str(f.answer)})),
    socials:{instagram:str(info.instagram),linkedin:str(info.linkedin),behance:str(info.behance),whatsapp:str(info.whatsapp)},
    settings:{agencyName:str(settings.agencyName),studioName:str(settings.studioName),logo:imageURL(settings.logo,str(settings.logoPath,'/brand/wordmark.png')),mark:imageURL(settings.mark,str(settings.markPath,'/brand/mark.png')),headline:str(settings.headline),introduction:str(settings.introduction),aboutTitle:str(settings.aboutTitle),aboutText:str(settings.aboutText),email:str(info.email),calLink:str(info.calLink),welcomeSubject:str(info.welcomeSubject),welcomeBody:str(info.welcomeBody)},
    pricing:pricing.map(p=>({title:str(p.title),price:str(p.price),unit:str(p.unit),label:str(p.label),intro:str(p.intro),items:strings(p.items),sample:Boolean(p.sample)})),
    ai:ai.map(a=>({name:str(a.name),kind:str(a.kind),text:str(a.text),items:strings(a.items)})),
    knowledge:knowledge.map(k=>({question:str(k.question),answer:str(k.answer),keywords:str(k.keywords),link:str(k.link),label:str(k.label)})),
  };
});
