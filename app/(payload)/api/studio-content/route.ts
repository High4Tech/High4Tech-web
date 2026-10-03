import { createHash } from 'node:crypto';
import { getStudioContent } from '@/lib/cms-content';
export const dynamic='force-dynamic';
export async function GET(request: Request){
  const body=JSON.stringify(await getStudioContent()), etag='"'+createHash('sha256').update(body).digest('hex')+'"';
  const headers={'Cache-Control':'public, max-age=0, must-revalidate',ETag:etag};
  if(request.headers.get('if-none-match')===etag)return new Response(null,{status:304,headers});
  return new Response(body,{headers:{...headers,'Content-Type':'application/json'}});
}
