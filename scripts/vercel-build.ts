import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { cmsConfigurationIssues } from '../lib/cms-runtime';

function run(file:string,args:string[],nodeArgs:string[]=[]){
  const result=spawnSync(process.execPath,[...nodeArgs,path.resolve(file),...args],{stdio:'inherit',windowsHide:true,env:{...process.env,NODE_ENV:'production'}});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
const missing=cmsConfigurationIssues();
if(missing.length){
  console.log(`Building the public studio with bundled content. CMS configuration pending: ${missing.join(', ')}.`);
} else if(process.env.VERCEL){
  run('node_modules/payload/bin.js',['migrate']);
  run('scripts/seed-cms.ts',[],['--import','tsx']);
}
run('node_modules/payload/bin.js',['generate:importmap']);
run('node_modules/next/dist/bin/next',['build']);
