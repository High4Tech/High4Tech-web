import { cmsConfigurationIssues } from '@/lib/cms-runtime';
import { parseVisitorProfile } from '@/lib/chat-profile';
import { ChatError, chatJSON, chatBody, chatFailure, chatPayload, chatSnapshot, chatTransaction, newChatToken, ownConversation, requestID, requireChatOrigin, startConversation, tokenFrom } from '@/lib/chat-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    requireChatOrigin(request);
    if (cmsConfigurationIssues().length) throw new ChatError('The online inbox isn’t connected yet. Use Open email app to contact the studio.', 503);
    const body = await chatBody(request, 16384), profile = parseVisitorProfile(body), key = requestID(body.requestId);
    if (!profile) throw new ChatError('Add your name, a valid email, and phone number.');
    const text = (field:string, max:number) => { const value=typeof body[field]==='string'?(body[field] as string).trim():''; if(value.length>max)throw new ChatError('Your inquiry is too long.'); return value; };
    const message=text('message',2500), interest=text('interest',100), company=text('company',150), budget=text('budget',100);
    if(message.length<10)throw new ChatError('Tell us a little more about your project.');
    const draft=`Project inquiry${company?` · ${company}`:''}\nInterest: ${interest}\nBudget: ${budget}\n\n${message}`;
    const token=tokenFrom(request)||newChatToken(),payload=await chatPayload();
    const row=await chatTransaction(payload,async req=>{
      const row=await ownConversation(payload,token,req)||await startConversation(payload,token,req,profile);
      if(row.status==='closed')throw new ChatError('Start a new conversation in Messages before sending another brief.',409);
      const duplicate=await payload.find({collection:'chat-messages',where:{requestKey:{equals:`${row.id}:inquiry:${key}`}},limit:1,req,overrideAccess:true});
      if(duplicate.docs.length)return row;
      if(row.lastInquiryAt && Date.now()-Date.parse(row.lastInquiryAt)<30000)throw new ChatError('Your brief reached us. Please wait before sending another.',429);
      const now=new Date().toISOString();
      await payload.create({collection:'chat-messages',req,overrideAccess:true,data:{conversation:row.id,role:'visitor',body:draft,requestKey:`${row.id}:inquiry:${key}`}});
      await payload.create({collection:'chat-messages',req,overrideAccess:true,data:{conversation:row.id,role:'system',body:'Your project brief reached the studio inbox. Our team will follow up here or using your contact details.',requestKey:`${row.id}:inquiry:${key}:receipt`}});
      return payload.update({collection:'chat-conversations',id:row.id,req,overrideAccess:true,data:{visitorName:profile.name,visitorEmail:profile.email,visitorPhone:profile.phone,channel:'inquiry',status:row.status==='human'?'human':'waiting',needsAttention:true,handoffAt:now,lastInquiryAt:now,lastMessageAt:now,preview:draft.slice(0,500)}});
    });
    return chatJSON(await chatSnapshot(payload,row),200,token,request);
  } catch(error){return chatFailure(error);}
}
