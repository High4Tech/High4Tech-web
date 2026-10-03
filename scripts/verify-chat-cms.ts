import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { getPayload } from 'payload';
import config from '../payload.config';
const payload=await getPayload({config,disableOnInit:true});
const origin=process.env.CMS_TEST_ORIGIN || 'http://127.0.0.1:3000';
const marker=`chat-test-${Date.now()}`;
let adminId:number|undefined, resourceId:number|undefined, projectId:number|undefined, serviceId:number|undefined;
const conversationIds=new Set<number>();
const headers=(cookie='')=>({'Content-Type':'application/json',Origin:origin,...(cookie?{Cookie:cookie}:{})});
const wait=()=>new Promise(resolve=>setTimeout(resolve,850));
async function guest(cookie:string,body:Record<string,unknown>){const response=await fetch(origin+'/api/chat',{method:'POST',headers:headers(cookie),body:JSON.stringify({requestId:randomUUID(),...body})});const data=await response.json();if(data.conversation)conversationIds.add(data.conversation.id);return {response,data,cookie:response.headers.get('set-cookie')?.split(';')[0] || cookie};}
try {
  const admin=await payload.create({collection:'users',data:{email:`${marker}@example.com`,password:randomBytes(24).toString('hex'),name:'Support verification'}});adminId=admin.id;
  const {token}=await payload.login({collection:'users',data:{email:admin.email,password:await (async()=>{const password=randomBytes(24).toString('hex');await payload.update({collection:'users',id:admin.id,data:{password}});return password;})()}});
  const staffCookie=`payload-token=${token}`;
  async function staff(id:number,action:string,message=''){const response=await fetch(origin+'/api/chat/admin',{method:'POST',headers:headers(staffCookie),body:JSON.stringify({id,action,message,requestId:randomUUID()})});const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;}
  const unauthorized=await fetch(origin+'/api/chat/admin');assert.equal(unauthorized.status,401);
  const resource=await payload.create({collection:'resources',draft:true,data:{title:marker+' Stock Desk',slug:marker,description:'Track stock and inventory alerts.',category:'Commerce',price:'Free',label:'Verification fixture',url:'https://example.com/',platforms:['shopify'],capabilities:'inventory stock alerts',videos:[{title:'Fixture video',url:'https://youtu.be/dQw4w9WgXcQ'}]}});resourceId=resource.id;
  const ask=async(question:string)=>(await fetch(origin+'/api/assistant',{method:'POST',headers:headers(),body:JSON.stringify({question})})).json();
  assert.ok(!(await ask('Shopify tools for stock alerts')).resources?.some((r:{id:string})=>r.id===marker),'Private tool drafts stay excluded');
  await payload.update({collection:'resources',id:resourceId,data:{_status:'published'}});
  assert.ok((await ask('I want shopfiy tools for stock alerts')).resources?.some((r:{id:string})=>r.id===marker));
  await payload.update({collection:'resources',id:resourceId,draft:true,data:{description:'Private rocket analysis',capabilities:'rocket space analysis',platforms:['android'],_status:'draft'}});
  assert.ok((await ask('Shopify tools for stock alerts')).resources?.some((r:{id:string})=>r.id===marker),'Private revision preserves published platform and capabilities');
  assert.ok(!(await ask('Android tools for rocket analysis')).resources?.some((r:{id:string})=>r.id===marker));
  const project=await payload.create({collection:'projects',data:{name:marker,slug:marker,type:'Demo',category:'Demo',year:'2026',description:'Fixture project',intro:'Fixture only',videos:[{url:'https://youtube.com/embed/dQw4w9WgXcQ'}],_status:'published'}});projectId=project.id;assert.equal(project.videos?.length,1);
  const service=await payload.create({collection:'services',data:{title:marker,slug:marker,short:'Fixture',description:'Fixture service',videos:[{url:'https://youtube.com/watch?v=dQw4w9WgXcQ'}],_status:'published'}});serviceId=service.id;assert.equal(service.videos?.length,1);
  await assert.rejects(()=>payload.update({collection:'services',id:service.id,data:{videos:[{url:'https://evil.example/embed/test'}]}}));
  assert.equal((await guest('',{question:'hello'})).response.status,428,'Contact details are required before chat');
  assert.equal((await guest('',{action:'profile',name:'Test',email:'invalid',phone:'no'})).response.status,400);
  const identity=await guest('',{action:'profile',name:'Verification visitor',email:'visitor@example.com',phone:'+92 325 6138361'});assert.equal(identity.response.status,200,JSON.stringify(identity.data));assert.equal(identity.data.conversation.visitorPhone,'+923256138361');
  const first=await guest(identity.cookie,{question:'hello'});assert.equal(first.response.status,200,JSON.stringify(first.data));assert.equal(first.data.mode,'cms');assert.equal(first.data.messages.length,2);assert.equal(first.data.messages[1].role,'assistant');assert.ok(!JSON.stringify(first.data).includes('visitorKey'));assert.ok(first.response.headers.get('set-cookie')?.includes('HttpOnly'));
  const id=first.data.conversation.id,cookie=first.cookie;
  assert.equal((await (await fetch(origin+'/api/chat')).json()).conversation,null);
  const own=await (await fetch(origin+'/api/chat',{headers:{Cookie:cookie}})).json();assert.equal(own.conversation.id,id);assert.equal(own.messages.length,2);assert.equal(own.conversation.visitorPhone,'+923256138361');
  const etagResponse=await fetch(origin+'/api/chat',{headers:{Cookie:cookie}});assert.ok(etagResponse.headers.get('etag'));const same=await fetch(origin+'/api/chat',{headers:{Cookie:cookie,'If-None-Match':etagResponse.headers.get('etag')!}});assert.equal(same.status,304,'Unchanged private history should not be downloaded again');assert.ok(same.headers.get('set-cookie')?.includes('Max-Age=31536000'));assert.ok(same.headers.get('cache-control')?.includes('no-store'));
  const isolated=await fetch(origin+'/api/chat',{headers:{'If-None-Match':etagResponse.headers.get('etag')!}});assert.equal(isolated.status,200,'Another visitor cannot reuse a private cached transcript');
  for(const collection of ['chat-conversations','chat-messages']){const r=await fetch(origin+`/api/${collection}`);assert.ok([401,403,404].includes(r.status));}
  const privateResponse=await fetch(origin+`/api/chat-conversations/${id}`,{headers:{Cookie:cookie}});assert.ok([401,403,404].includes(privateResponse.status));
  const foreign=await fetch(origin+'/api/chat',{method:'POST',headers:{...headers(cookie),Origin:'https://evil.example'},body:JSON.stringify({question:'hello',requestId:randomUUID()})});assert.equal(foreign.status,403);
  const large=await guest(cookie,{question:'x'.repeat(501)});assert.equal(large.response.status,400);
  await wait();const duplicateKey=randomUUID();const copies=await Promise.all([guest(cookie,{question:'hello',requestId:duplicateKey}),guest(cookie,{question:'hello',requestId:duplicateKey})]);for(const copy of copies)assert.equal(copy.response.status,200,JSON.stringify(copy.data));assert.equal((await payload.count({collection:'chat-messages',where:{requestKey:{equals:`${id}:${duplicateKey}`}}})).totalDocs,1);
  await wait();const handoff=await guest(cookie,{question:'Can I speak to a real human?'});assert.equal(handoff.data.conversation.status,'waiting');assert.equal(handoff.data.conversation.needsAttention,true);
  const profile=await guest(cookie,{action:'profile',name:'Verification visitor',email:'visitor@example.com',phone:'+923256138361'});assert.equal(profile.data.conversation.visitorEmail,'visitor@example.com');
  const inbox=await (await fetch(origin+'/api/chat/admin?filter=attention',{headers:headers(staffCookie)})).json();assert.ok(inbox.conversations.some((row:{id:number})=>row.id===id));assert.ok(!JSON.stringify(inbox).includes('visitorKey'));
  const filteredInbox=await (await fetch(origin+'/api/chat/admin?filter=closed&search=unrelated',{headers:headers(staffCookie)})).json();assert.ok(filteredInbox.alerts.some((row:{id:number})=>row.id===id),'Human alerts must appear even when current list filters exclude the visitor');
  const claim=await staff(id,'claim');assert.equal(claim.conversation.status,'human');assert.equal(claim.conversation.assignedTo,adminId);
  await wait();const humanMessage=await guest(cookie,{question:'What do your services include?'});assert.equal(humanMessage.data.messages.at(-1).role,'visitor','Bot must not reply in human mode');
  const replied=await staff(id,'reply','This is a live reply from our team.');assert.equal(replied.messages.at(-1).role,'staff');const received=await (await fetch(origin+'/api/chat',{headers:{Cookie:cookie}})).json();assert.equal(received.messages.at(-1).body,'This is a live reply from our team.');
  const impersonation=await fetch(origin+'/api/chat/admin',{method:'POST',headers:headers(cookie),body:JSON.stringify({id,action:'reply',message:'Forged',requestId:randomUUID()})});assert.equal(impersonation.status,401);
  await staff(id,'bot');await wait();const resumed=await guest(cookie,{question:'hello'});assert.equal(resumed.data.messages.at(-1).role,'assistant');
  for(let i=0;i<65;i++)await payload.create({collection:'chat-messages',data:{conversation:id,role:'visitor',body:`History fixture ${i}`,requestKey:`${id}:pagination:${i}`}});
  const latest=await (await fetch(origin+'/api/chat',{headers:{Cookie:cookie}})).json();assert.equal(latest.messages.length,60);assert.equal(latest.hasOlder,true);
  const earlier=await (await fetch(origin+`/api/chat?before=${latest.messages[0].id}`,{headers:{Cookie:cookie}})).json();assert.ok(earlier.messages.length>0);assert.ok(earlier.messages.at(-1).id<latest.messages[0].id);assert.equal(earlier.hasOlder,false);
  const foreignBefore=await (await fetch(origin+`/api/chat?before=${latest.messages[0].id}`)).json();assert.equal(foreignBefore.messages.length,0);
  await staff(id,'close');await wait();assert.equal((await guest(cookie,{question:'hello'})).response.status,409);
  const reset=await guest(cookie,{action:'new'});assert.equal(reset.data.conversation.visitorEmail,'visitor@example.com');assert.equal(reset.data.messages.length,0);const fresh=await guest(reset.cookie,{question:'hello'});assert.equal(fresh.response.status,200);assert.notEqual(fresh.data.conversation.id,id);assert.equal(fresh.data.messages.length,2);
  const history=await fetch(origin+`/api/chat/admin?id=${id}`,{headers:headers(staffCookie)});assert.equal((await history.json()).messages.at(-1).role,'system');
  const separate=await guest('',{action:'profile',name:'Another browser',email:'visitor@example.com',phone:'+923256138361'});assert.notEqual(separate.data.conversation.id,id);assert.equal(separate.data.messages.length,0,'Email alone never gives access to another visitor history');
  const separateReply=await guest(separate.cookie,{question:'Hello from a second browser'});assert.equal(separateReply.response.status,200);
  const allInbox=await (await fetch(origin+'/api/chat/admin',{headers:headers(staffCookie)})).json();assert.ok(allInbox.conversations.some((r:{id:number})=>r.id===separate.data.conversation.id),'New browser visitor must appear in inbox');assert.ok(['local','shared'].includes(allInbox.storage));
  const briefBody={name:'Verification visitor',email:'visitor@example.com',phone:'+923256138361',company:'Fixture',interest:'AI automation',budget:'Let’s discuss',message:'This test project brief should reach the support inbox.',requestId:randomUUID()};
  const postBrief=()=>fetch(origin+'/api/inquiries',{method:'POST',headers:headers(separate.cookie),body:JSON.stringify(briefBody)});
  const brief=await postBrief();assert.equal(brief.status,200);const delivered=await brief.json();assert.equal(delivered.conversation.channel,'inquiry');assert.equal(delivered.conversation.needsAttention,true);assert.ok(delivered.messages.some((m:{body:string})=>m.body.includes(briefBody.message)));
  assert.equal((await postBrief()).status,200,'Inquiry retries must not duplicate');assert.equal((await payload.count({collection:'chat-messages',where:{requestKey:{equals:`${delivered.conversation.id}:inquiry:${briefBody.requestId}`}}})).totalDocs,1);
  assert.equal((await fetch(origin+'/api/inquiries',{method:'POST',headers:{...headers(separate.cookie),Origin:'https://evil.example'},body:JSON.stringify(briefBody)})).status,403);
  console.log('PASS: required name/phone/email profiles, second-browser inbox delivery, private conditional history, direct Mail inquiry delivery/retry deduplication, persistent/resumable chats, visitor isolation, private REST access, CSRF and message limits, duplicate sends, published-only resources, safe videos, human requests, admin notification list, staff takeover/replies, bot resumption, resolution and new sessions.');
} finally {
  for(const id of conversationIds){try{await payload.delete({collection:'chat-conversations',id});}catch(error){if(!(error&&typeof error==='object'&&'status' in error&&error.status===404))throw error;}}
  for(const [collection,id] of [['resources',resourceId],['projects',projectId],['services',serviceId],['users',adminId]] as const)if(id){try{await payload.delete({collection,id});}catch(error){if(!(error&&typeof error==='object'&&'status' in error&&error.status===404))throw error;}}await payload.destroy();
}
