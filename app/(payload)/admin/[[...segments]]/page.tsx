import type { Metadata } from 'next';
import config from '@payload-config';
import { RootPage,generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';
import { cmsConfigurationIssues } from '@/lib/cms-runtime';
import { CMSSetup } from '@/components/cms-setup';
type Args={params:Promise<{segments:string[]}>;searchParams:Promise<{[key:string]:string|string[]}>};
export const dynamic='force-dynamic';
export const generateMetadata=async({params,searchParams}:Args):Promise<Metadata>=>cmsConfigurationIssues().length?{title:'Connect the CMS — High4Tech'}:generatePageMetadata({config,params,searchParams});
export default function AdminPage({params,searchParams}:Args){const missing=cmsConfigurationIssues();return missing.length?<CMSSetup missing={missing}/>:RootPage({config,params,searchParams,importMap});}
