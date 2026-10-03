import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { defaultContent as content } from '../lib/studio-content';

const rows=(values:string[])=>values.map(value=>({value}));
export async function seedContent(payload:Payload){
  const settings=await payload.findGlobal({slug:'site-settings'});
  if(settings.contentSeeded){
    const contact=await payload.findGlobal({slug:'contact-info'});
    if(contact.whatsapp==='https://wa.link/p3t9vf')await payload.updateGlobal({slug:'contact-info',data:{whatsapp:content.socials.whatsapp}});
    return;
  }
  const catalogs={
    services:content.services.map(s=>({...s,tags:rows(s.tags),deliverables:rows(s.deliverables)})),
    projects:content.projects.map(p=>({...p,image:undefined,imagePath:p.image})),
    newsroom:content.articles.map(a=>({...a,paragraphs:rows(a.paragraphs)})),
    resources:content.resources.map(({id,...r})=>({...r,slug:id})),
    faqs:content.faqs,
    pricing:content.pricing.map(p=>({...p,items:rows(p.items)})),
    'ai-services':content.ai.map(a=>({...a,items:rows(a.items)})),
    'chatbot-data':content.knowledge,
  };
  type ContentCollection=keyof typeof catalogs;
  for(const [collection,documents] of Object.entries(catalogs) as [ContentCollection,Record<string,unknown>[]][]){
    const existing=await payload.count({collection});
    if(existing.totalDocs)continue;
    for(const [sortOrder,data] of documents.entries())await payload.create({collection,data:{...data,sortOrder,_status:'published'} as RequiredDataFromCollectionSlug<ContentCollection>});
  }
  await payload.updateGlobal({slug:'contact-info',data:{...content.socials,email:content.settings.email,calLink:'',welcomeSubject:content.settings.welcomeSubject,welcomeBody:content.settings.welcomeBody}});
  await payload.updateGlobal({slug:'assistant-settings',data:content.assistant});
  await payload.updateGlobal({slug:'site-settings',data:{...content.settings,logo:undefined,mark:undefined,logoPath:content.settings.logo,markPath:content.settings.mark,contentSeeded:true}});
}
