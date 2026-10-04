import type { Metadata } from 'next';
import config from '@payload-config';
import { RootPage,generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';
import { cmsConfigurationIssues } from '@/lib/cms-runtime';
import { CMSSetup } from '@/components/cms-setup';
type Args={params:Promise<{segments:string[]}>;searchParams:Promise<{[key:string]:string|string[]}>};
export const dynamic='force-dynamic';
export const generateMetadata=async({params,searchParams}:Args):Promise<Metadata>=>cmsConfigurationIssues().length?{title:'Connect the CMS — High4Tech'}:generatePageMetadata({config,params,searchParams});
export default async function AdminPage({params,searchParams}:Args){
  const missing=cmsConfigurationIssues();
  if(missing.length)return <CMSSetup missing={missing}/>;
  if((await params).segments?.[0]==='create-first-user')return <main style={{maxWidth:560,margin:'15vh auto',padding:32,fontFamily:'system-ui'}}><img src="/brand/wordmark.png" width={150} alt="High4Tech"/><h1>Set up your administrator privately.</h1><p>Account registration is closed on the public website. In your server terminal, run <code>npm run cms:admin</code> to create the first account.</p><a href="/admin/login">Sign in with an existing account</a></main>;
  return RootPage({config,params,searchParams,importMap});
}
