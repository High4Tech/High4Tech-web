import { getStudioContent } from '@/lib/cms-content';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await getStudioContent(),{headers:{'Cache-Control':'no-store'}});}
