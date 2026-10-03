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
  for(const [method,route] of [['GET','/api/users/me'],['POST','/api/users/first-register'],['POST','/api/projects']] as const){
    const response:Response=await fetch(origin+route,{method});
    assert.equal(response.status,503,`${method} ${route} must not initialize an unconfigured CMS`);
  }
}
console.log('PASS: deployment guards'+(origin?', public studio fallback and safe admin/API setup states.':'.'));
