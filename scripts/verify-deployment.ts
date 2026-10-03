import assert from 'node:assert/strict';
import { cmsConfigurationIssues } from '../lib/cms-runtime';

assert.deepEqual(cmsConfigurationIssues({}),['PAYLOAD_SECRET']);
assert.deepEqual(cmsConfigurationIssues({VERCEL:'1'}),['PAYLOAD_SECRET','DATABASE_URL','DATABASE_AUTH_TOKEN','BLOB_READ_WRITE_TOKEN']);
assert.ok(cmsConfigurationIssues({VERCEL:'1',PAYLOAD_SECRET:'x'.repeat(48),DATABASE_URL:'file:./studio.db'}).includes('DATABASE_URL'));
assert.deepEqual(cmsConfigurationIssues({VERCEL:'1',PAYLOAD_SECRET:'x'.repeat(48),DATABASE_URL:'libsql://example.turso.io',DATABASE_AUTH_TOKEN:'test-fixture',BLOB_READ_WRITE_TOKEN:'vercel_blob_rw_teststore_testfixture'}),[]);
assert.deepEqual(cmsConfigurationIssues({PAYLOAD_SECRET:'x'.repeat(48),DATABASE_URL:'file:./studio.db'}),[]);

// Run against a production server started with VERCEL=1 and no cloud credentials.
const origin=process.env.DEPLOYMENT_TEST_ORIGIN;
if(origin){
  for(const route of ['/','/desktop','/contact','/newsroom','/admin']){
    const response:Response=await fetch(origin+route);
    assert.equal(response.status,200,`${route} must render without cloud credentials`);
    const html=await response.text();
    if(route==='/admin')assert.ok(html.includes('Connect its content manager.'),'Admin must explain configuration rather than fail');
  }
  const content=await fetch(origin+'/api/studio-content');
  assert.equal(content.status,200);
  const body=await content.json();
  assert.equal(body.settings.agencyName,'High4Tech');
  assert.ok(body.projects.length>0);
  assert.equal(body.socials.whatsapp,'https://wa.me/923256138361');
  assert.equal(body.settings.email,'high4tech360@gmail.com');
  const greetingResponse=await fetch(origin+'/api/assistant',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({question:'Hello!'})});
  assert.equal(greetingResponse.status,200);
  assert.equal((await greetingResponse.json()).status,'conversation');
  const assistantResponse=await fetch(origin+'/api/assistant',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({question:'What is the capital of France?'})});
  assert.equal(assistantResponse.status,200);
  const assistant=await assistantResponse.json();
  assert.equal(assistant.status,'not-found');
  assert.equal(assistant.mode,'preview');
  assert.deepEqual(assistant.sources,[]);
  const supportedResponse=await fetch(origin+'/api/assistant',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({question:body.knowledge[0].question})});
  assert.equal(supportedResponse.status,200);
  const supported=await supportedResponse.json();
  assert.equal(supported.status,'matched');
  assert.equal(supported.answer,body.knowledge[0].answer);
  assert.equal(supported.answer,supported.sources[0].excerpt);
  for(const [method,route] of [['GET','/api/users/me'],['POST','/api/users/first-register'],['POST','/api/projects']] as const){
    const response:Response=await fetch(origin+route,{method});
    assert.equal(response.status,503,`${method} ${route} must not initialize an unconfigured CMS`);
  }
}
console.log('PASS: deployment guards'+(origin?', public studio fallback and safe admin/API setup states.':'.'));
