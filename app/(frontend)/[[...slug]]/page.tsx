import { ResourceDetail } from '@/components/resource-browser';
import { LandingV2 } from '@/components/landing-v2';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStudioContent } from '@/lib/cms-content';
import { ServicesPage, ServiceDetail, ProjectsPage, ProjectDetail, ResourcesPage, AboutPage, JournalPage, ArticlePage, ContactPage, PolicyPage } from '@/components/pages';

export async function generateMetadata({params}: {params:Promise<{slug?:string[]}>}): Promise<Metadata> {
  const {services,projects,articles,resources}=await getStudioContent();
  const {slug=[]} = await params;
  const path=slug.join('/');
  const names:Record<string,string> = {'':'Studio','services':'Services','projects':'Selected work','tools-and-resources':'Tools & resources','about':'The studio','blog':'Newsroom','newsroom':'Newsroom','ai-zone':'AI Zone','pricing':'Pricing','play':'Play area','contact':'Let’s talk','privacy':'Privacy preview','terms':'Site terms preview','desktop':'High4Tech OS','assistant':'Studio assistant','calendar':'Let’s talk','gallery':'Gallery','safari':'Safari','toolkit':'Toolkit','preview':'Landing preview'};
  const title = names[path] || services.find(s=>slug[0]==='services'&&s.slug===slug[1])?.title || projects.find(p=>slug[0]==='projects'&&p.slug===slug[1])?.name || articles.find(a=>(slug[0]==='blog'||slug[0]==='newsroom')&&a.slug===slug[1])?.title || resources.find(r=>slug[0]==='tools-and-resources'&&r.id===slug[1])?.title || 'Page not found';
  return {title};
}
export default async function Page({params}: {params:Promise<{slug?:string[]}>}) {
  const {services,projects,articles,resources}=await getStudioContent();
  const {slug=[]} = await params;
  const path=slug.join('/');
  if(path==='') return null;
  if(path==='preview') return <LandingV2/>;
  if(['desktop','assistant','calendar','gallery','safari','toolkit','preview','newsroom','ai-zone','pricing','play'].includes(path)) return null;
  if(path==='services') return <ServicesPage />;
  if(path==='projects') return <ProjectsPage />;
  if(path==='tools-and-resources') return <ResourcesPage />;
  if(path==='about') return <AboutPage />;
  if(path==='blog') return <JournalPage />;
  if(path==='contact') return <ContactPage />;
  if(path==='privacy'||path==='terms') return <PolicyPage type={path} />;
  if(slug.length===2) {
    if(slug[0]==='tools-and-resources'){const resource=resources.find(r=>r.id===slug[1]);if(resource)return <ResourceDetail resource={resource}/>;}
    if(slug[0]==='services') {const service=services.find(s=>s.slug===slug[1]);if(service) return <ServiceDetail service={service} />;}
    if(slug[0]==='projects') {const project=projects.find(p=>p.slug===slug[1]);if(project) return <ProjectDetail project={project} />;}
    if((slug[0]==='blog'||slug[0]==='newsroom')) {const article=articles.find(a=>a.slug===slug[1]);if(article) return <ArticlePage article={article} />;}
  }
  notFound();
}
