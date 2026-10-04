import config from '@payload-config';
import { REST_DELETE,REST_GET,REST_OPTIONS,REST_PATCH,REST_POST,REST_PUT } from '@payloadcms/next/routes';
import { cmsConfigurationIssues,cmsUnavailableResponse } from '@/lib/cms-runtime';
import { getPayload } from 'payload';
import { limitPublicRequest, limitReads, requireSameOrigin, RequestSecurityError, securityFailure } from '@/lib/request-security';
import { secureResponseCookies } from '@/lib/security-policy';

const protect=(handler:ReturnType<typeof REST_GET>)=>async(...args:Parameters<typeof handler>)=>{
  if(cmsConfigurationIssues().length)return cmsUnavailableResponse();
  let [request,context]=args;
  try {
    const url=new URL(request.url), write=!['GET','HEAD','OPTIONS'].includes(request.method);
    if(url.pathname.toLowerCase().endsWith('/first-register'))throw new RequestSecurityError('An administrator must create accounts. Run npm run cms:admin privately for initial setup.',403);
    if(url.pathname.toLowerCase().endsWith('/forgot-password'))throw new RequestSecurityError('Password reset email is not configured. Contact your administrator.',503);
    if(url.search.length>8192)throw new RequestSecurityError('This query is too large.',400);
    const limit=url.searchParams.get('limit');
    if(limit!==null&&(!/^\d+$/.test(limit)||Number(limit)<1||Number(limit)>100))throw new RequestSecurityError('Use a page size between 1 and 100.',400);
    limitReads(request,'cms',240);
    if(write){
      requireSameOrigin(request);
      if(url.pathname==='/api/media'||url.pathname.startsWith('/api/media/')){
        const payload=await getPayload({config});const {user}=await payload.auth({headers:request.headers});
        if(user?.collection!=='users')throw new RequestSecurityError('Sign in before uploading or changing media.',401);
      }
      if(/\/(login|forgot-password|reset-password)$/.test(url.pathname))await limitPublicRequest(request,'authentication',20,60);
      if(request.headers.get('content-type')?.includes('application/json')){
        const maximum=512*1024;
        if(Number(request.headers.get('content-length'))>maximum)throw new RequestSecurityError('This request is too large.',413);
        const reader=request.body?.getReader(), chunks:Uint8Array[]=[];let size=0;
        if(reader){try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maximum){void reader.cancel();throw new RequestSecurityError('This request is too large.',413);}chunks.push(value);}}finally{reader.releaseLock();}}
        request=new Request(request.url,{method:request.method,body:Buffer.concat(chunks),headers:request.headers,signal:request.signal});
      }
    }
    const response=await handler(request,context);
    secureResponseCookies(response.headers,request);
    // Defense for legacy files uploaded before raster-only validation existed.
    if(url.pathname.startsWith('/api/media/file/'))response.headers.set('Content-Security-Policy',"default-src 'none'; sandbox");
    // REST responses can contain users, drafts, contact details or reset tokens.
    response.headers.set('Cache-Control','private, no-store');
    response.headers.set('Vary','Cookie, Authorization, Origin');
    return response;
  }catch(error){
    if(!(error instanceof RequestSecurityError)&&process.env.NODE_ENV==='development')console.error('CMS request failed',error instanceof Error?error.name:'unknown',error instanceof Error?error.stack?.split('\n').slice(1,5).join('\n'):'');
    return securityFailure(error);
  }
};
export const GET=protect(REST_GET(config));
export const POST=protect(REST_POST(config));
export const PATCH=protect(REST_PATCH(config));
export const PUT=protect(REST_PUT(config));
export const DELETE=protect(REST_DELETE(config));
export const OPTIONS=protect(REST_OPTIONS(config));
