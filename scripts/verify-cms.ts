import assert from 'node:assert/strict';
import path from 'node:path';
import { getPayload } from 'payload';
import config from '../payload.config';

// Temporary fixtures only: never creates a user or changes the seeded content.
const payload=await getPayload({config,disableOnInit:true});
const slug=`cms-check-${Date.now()}`;
const origin=process.env.CMS_TEST_ORIGIN||'http://127.0.0.1:3000';
let articleID:number|undefined;
let mediaID:number|undefined;
const publicContent=async()=>{
  const response=await fetch(`${origin}/api/studio-content`);
  assert.equal(response.status,200);
  return response.json();
};
try {
  const article=await payload.create({collection:'newsroom',draft:true,data:{title:'CMS verification draft',slug,category:'Studio',read:'1 min read',summary:'Temporary verification article.',paragraphs:[{value:'This temporary content checks the publishing workflow.'}],artwork:'type'}});
  articleID=article.id;
  assert.equal((await publicContent()).articles.some((a:{slug:string})=>a.slug===slug),false,'Draft must be hidden');
  const draftRead=await fetch(`${origin}/api/newsroom/${articleID}`);
  assert.equal(draftRead.status,404,'Anonymous readers must not access drafts');
  await payload.update({collection:'newsroom',id:articleID,data:{title:'CMS verification published',_status:'published'}});
  assert.equal((await publicContent()).articles.find((a:{slug:string})=>a.slug===slug)?.title,'CMS verification published','Publish must reach the website');
  await payload.update({collection:'newsroom',id:articleID,draft:true,data:{title:'Unpublished revision',_status:'draft'}});
  assert.equal((await publicContent()).articles.find((a:{slug:string})=>a.slug===slug)?.title,'CMS verification published','An unpublished revision must preserve the live version');
  for(const [url,method,body] of [
    ['/api/newsroom','POST',{title:'Unauthorized'}],
    [`/api/newsroom/${articleID}`,'PATCH',{title:'Unauthorized'}],
    ['/api/globals/contact-info','POST',{email:'unauthorized@example.com'}],
    ['/api/users','POST',{email:'unauthorized@example.com',password:'not-a-real-password'}],
  ] as const){
    const response=await fetch(origin+url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.ok(response.status===401||response.status===403,`${method} ${url} must require authentication: ${response.status}`);
  }
  const media=await payload.create({collection:'media',data:{alt:'Temporary upload verification'},filePath:path.resolve('public/brand/mark.png')});
  mediaID=media.id;
  assert.ok(media.url,'Upload must have a public URL');
  const image=await fetch(origin+media.url);
  assert.equal(image.status,200,'Uploaded images must be served');
  assert.ok(image.headers.get('content-type')?.startsWith('image/'));
  console.log('PASS: private drafts, published content, private revisions, protected writes, image upload and delivery.');
} finally {
  if(articleID!==undefined)await payload.delete({collection:'newsroom',id:articleID});
  if(mediaID!==undefined)await payload.delete({collection:'media',id:mediaID});
  await payload.destroy();
}
// Payload's CLI also exits explicitly after completing a command.
process.exit(0);
