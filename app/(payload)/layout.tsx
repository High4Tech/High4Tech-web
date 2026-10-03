import config from '@payload-config';
import '@payloadcms/next/css';
import './custom.css';
import './support.css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';
import { cmsConfigurationIssues } from '@/lib/cms-runtime';

export const viewport={width:'device-width',initialScale:1};
const serverFunction:ServerFunctionClient=async(args)=>{
  'use server';
  if(cmsConfigurationIssues().length)throw new Error('CMS setup is incomplete. Configure the server environment first.');
  return handleServerFunctions({...args,config,importMap});
};
export default function PayloadLayout({children}:{children:React.ReactNode}){
  if(cmsConfigurationIssues().length)return <html lang="en"><body>{children}</body></html>;
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;
}
