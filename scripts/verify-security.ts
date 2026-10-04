import assert from 'node:assert/strict';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getPayload } from 'payload';
import config from '../payload.config';
import { contentSecurityPolicy, isSameOrigin, safeExternalURL, safeLocalPath, secureCookies, secureResponseCookies } from '../lib/security-policy';

const origin = process.env.CMS_TEST_ORIGIN || 'http://127.0.0.1:3000';
const marker = `security-${Date.now()}`;
const payload = await getPayload({ config, disableOnInit: true });
const counterIDs = new Set<number>(), mediaIDs = new Set<number>();
let adminID: number | undefined;
const cookie = `h4t-chat=${randomBytes(32).toString('hex')}`;
const headers = (auth = cookie) => ({ Origin: origin, 'Content-Type': 'application/json', Cookie: auth });
const post = (route: string, body: unknown, extra: Record<string,string> = {}, auth = cookie) => fetch(origin + route, { method: 'POST', headers: { ...headers(auth), ...extra }, body: JSON.stringify(body) });
try {
  for (const path of ['/services', '/brand/mark.png', '/assistant?topic=tools']) assert.equal(safeLocalPath(path), true);
  for (const path of ['//evil.example', '/\\evil.example', '/\nevil.example', 'javascript:alert(1)']) assert.equal(safeLocalPath(path), false);
  for (const link of ['javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/\n', 'https://example.com\\@evil.example']) assert.equal(safeExternalURL(link), false);
  assert.equal(safeExternalURL('https://cal.com/high4tech'), true);
  const request = new Request('https://studio.example/api/chat', {headers:{Origin:'https://studio.example'}});
  assert.equal(isSameOrigin(request), true); assert.equal(secureCookies(request), true);
  const sessionHeaders=new Headers();sessionHeaders.append('Set-Cookie','payload-token=fixture; HttpOnly; SameSite=Lax');sessionHeaders.append('Set-Cookie','payload-lng=en; Secure');secureResponseCookies(sessionHeaders,request);
  assert.equal(sessionHeaders.getSetCookie().length,2);assert.ok(sessionHeaders.getSetCookie().every(cookie=>cookie.includes('; Secure')));assert.ok(!sessionHeaders.getSetCookie()[1].includes('Secure; Secure'));
  assert.equal(isSameOrigin(new Request(request, {headers:{Origin:'http://studio.example'}})), false);
  assert.equal(isSameOrigin(new Request(request, {headers:{Origin:'https://studio.example', 'Sec-Fetch-Site':'cross-site'}})), false);
  const previousSite=process.env.SITE_URL;process.env.SITE_URL='https://studio.example';
  assert.equal(isSameOrigin(new Request(request, {headers:{Host:'evil.example', Origin:'https://evil.example'}})), false);
  if(previousSite)process.env.SITE_URL=previousSite;else delete process.env.SITE_URL;
  assert.ok(!contentSecurityPolicy('fixture').match(/script-src[^;]*unsafe-(inline|eval)/));

  for (const path of ['/desktop', '/admin/login']) {
    const response = await fetch(origin + path); assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
    const csp = response.headers.get('content-security-policy') || '';
    assert.ok(csp.includes("frame-ancestors 'self'"));
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1]; assert.ok(nonce);
    const html = await response.text();
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(match => !match[1].includes('application/ld+json'));
    assert.ok(scripts.length > 0);
    for (const script of scripts) assert.ok(script[1].includes(`nonce="${nonce}"`), `${path} scripts must use the request nonce`);
    assert.ok(response.headers.get('cache-control')?.includes(csp.includes('unsafe-eval')?'no-cache':'no-store'));
    const second = await fetch(origin + path); assert.notEqual(second.headers.get('content-security-policy'), csp, 'Nonces must change on each request');
  }
  for (const route of ['/api/chat', '/api/assistant', '/api/inquiries', '/api/users/login']) {
    assert.equal((await post(route, {question:'Hello',requestId:randomUUID()}, {Origin:'https://evil.example'})).status, 403);
    assert.equal((await post(route, {question:'Hello'}, {Origin:origin, 'Sec-Fetch-Site':'cross-site'})).status, 403);
    assert.equal((await fetch(origin+route,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status, 403);
  }
  assert.equal((await post('/api/users/first-register',{email:'intruder@example.com',password:randomBytes(24).toString('hex')})).status,403);
  assert.equal((await post('/api/users/forgot-password',{email:'not-an-admin@example.com'})).status,503);
  for (const route of ['/api/users', '/api/chat-conversations', '/api/chat-messages', '/api/knowledge-documents', '/api/security-rate-limits']) assert.ok([401,403,404].includes((await fetch(origin+route)).status), route+' must stay private');
  assert.equal((await fetch(origin+'/api/chat/admin')).status,401);
  assert.equal((await fetch(origin+'/api/chat?before=-1')).status,400);
  assert.equal((await fetch(origin+'/api/services?limit=0')).status,400);
  assert.equal((await fetch(origin+'/api/services?limit=100000')).status,400);
  assert.equal((await post('/api/services',{text:'x'.repeat(512*1024)})).status,413);
  const guest = await fetch(origin+'/api/chat'); assert.equal(guest.status,200);
  assert.ok(guest.headers.get('set-cookie')?.includes('HttpOnly'));
  assert.ok(guest.headers.get('cache-control')?.includes('no-store'));

  const password = randomBytes(24).toString('hex');
  const admin = await payload.create({collection:'users',data:{email:`${marker}@example.com`,password,name:'Security verification'}}); adminID=admin.id;
  const login = await post('/api/users/login',{email:admin.email,password}); assert.equal(login.status,200);
  assert.equal((await login.json()).token, undefined, 'REST must not expose bearer tokens');
  const staffCookie = login.headers.get('set-cookie')?.split(';')[0]; assert.ok(staffCookie); assert.ok(staffCookie.startsWith('payload-token='));
  assert.ok(login.headers.get('set-cookie')?.includes('HttpOnly'));
  const self = await fetch(origin+'/api/users/me',{headers:{Cookie:staffCookie}}); assert.equal(self.status,200); const user=await self.json();
  assert.ok(!JSON.stringify(user).match(/"(?:hash|salt|resetPasswordToken)"/));
  assert.ok(self.headers.get('cache-control')?.includes('no-store'));
  await assert.rejects(()=>payload.update({collection:'users',id:adminID!,data:{password:'short'}}));
  const pixels = await sharp({create:{width:32,height:32,channels:3,background:'#f97328'}}).png().toBuffer();
  const anonymousUpload=new FormData();anonymousUpload.set('_payload',JSON.stringify({alt:marker}));anonymousUpload.set('file',new Blob([new Uint8Array(pixels)],{type:'image/png'}),marker+'.png');
  assert.equal((await fetch(origin+'/api/media',{method:'POST',headers:{Origin:origin},body:anonymousUpload})).status,401,'Anonymous files must be rejected before decoding');
  async function upload(data:Buffer,mime:string,name:string){const form=new FormData();form.set('_payload',JSON.stringify({alt:marker}));form.set('file',new Blob([new Uint8Array(data)],{type:mime}),name);return fetch(origin+'/api/media',{method:'POST',headers:{Origin:origin,Cookie:staffCookie!},body:form});}
  const valid = await upload(pixels,'image/png',`${marker}.png`); assert.equal(valid.status,201,await valid.clone().text());
  const uploaded = (await valid.json()).doc; mediaIDs.add(uploaded.id);
  assert.equal(uploaded.mimeType,'image/webp'); assert.ok(uploaded.filename.endsWith('.webp'));
  const image=await fetch(origin+uploaded.url); assert.equal(image.status,200); assert.ok(image.headers.get('content-security-policy')?.includes('sandbox')); assert.equal((await sharp(Buffer.from(await image.arrayBuffer())).metadata()).format,'webp');
  assert.equal((await upload(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),'image/svg+xml',`${marker}.svg`)).status,400);
  assert.equal((await upload(Buffer.from('<html><script>alert(1)</script></html>'),'image/png',`${marker}-fake.png`)).status,400);
  assert.equal((await upload(Buffer.alloc(4*1024*1024+1),'image/png',`${marker}-large.png`)).status,413);
  const dimensions = await sharp({create:{width:6000,height:5000,channels:3,background:'#000000'}}).png().toBuffer();
  assert.equal((await upload(dimensions,'image/png',`${marker}-dimensions.png`)).status,400);
  // Simulate a counter written by another worker: rejection must use DB state,
  // even though this Node server has not seen any requests with that cookie.
  const visitorKey=createHash('sha256').update(cookie.slice('h4t-chat='.length)).digest('hex');
  const counter=await payload.create({collection:'security-rate-limits',data:{key:`assistant:${visitorKey}`,windowStart:Date.now(),count:60}}); counterIDs.add(counter.id);
  const blocked=await post('/api/assistant',{question:'Hello'}); assert.equal(blocked.status,429); assert.ok(Number(blocked.headers.get('retry-after'))>0);
  for(let i=0;i<5;i++)assert.equal((await post('/api/users/login',{email:admin.email,password:'incorrect-password'}, {},staffCookie)).status,401);
  const locked=await post('/api/users/login',{email:admin.email,password}, {},staffCookie); assert.ok([401,403].includes(locked.status),'Five failed attempts must lock the account');
  console.log('PASS: nonce CSP and headers, strict origins, private account bootstrap/data, safe cookies and login responses, password validation/lockout, bounded CMS queries/body, real raster uploads/re-encoding, SVG/fake/oversized/pixel rejection, shared DB rate limits and retry headers.');
} finally {
  for(const id of mediaIDs)await payload.delete({collection:'media',id});
  for(const id of counterIDs)await payload.delete({collection:'security-rate-limits',id});
  if(adminID)await payload.delete({collection:'users',id:adminID});
  await payload.destroy();
}
process.exit(0);
