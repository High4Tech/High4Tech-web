import type { AdminViewServerProps, ServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { ConversationInbox } from './ConversationInbox';
export function ConversationView(props: AdminViewServerProps) {
  if (!props.user) return null;
  return <DefaultTemplate {...props} req={props.initPageResult.req} visibleEntities={props.initPageResult.visibleEntities}><div className="support-page"><a href="/admin" className="support-back">← Studio dashboard</a><ConversationInbox userId={props.user.id}/></div></DefaultTemplate>;
}
export function InboxNav({ user }: Pick<ServerProps, 'user'>) { return user ? <a className="h4t-inbox-nav" href="/admin/conversations"><MessageCircle size={16}/>Live support inbox<ArrowUpRight size={13}/></a> : null; }
