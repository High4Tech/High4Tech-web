import type { CollectionConfig, Access } from 'payload';
const staff: Access = ({ req }) => req.user?.collection === 'users';
const privateAccess = { read: staff, create: () => false, update: () => false, delete: staff };
// Visitors use the scoped chat endpoint. Direct REST/GraphQL writes cannot change
// ownership, assistant state, author roles, or impersonate a member of the team.
export const chatCollections: CollectionConfig[] = [
  { slug: 'chat-conversations', labels: { singular: 'Conversation', plural: 'Conversations' }, access: privateAccess,
    hooks: { beforeDelete: [async ({ req, id }) => { await req.payload.delete({ collection: 'chat-messages', where: { conversation: { equals: id } }, req, overrideAccess: true }); }] },
    admin: { group: 'Assistant', useAsTitle: 'visitorName', description: 'Use the live inbox on the dashboard to take over and reply.', defaultColumns: ['visitorName', 'status', 'needsAttention', 'lastMessageAt'] },
    fields: [
      { name: 'visitorKey', type: 'text', required: true, unique: true, index: true, admin: { hidden: true }, access: { read: () => false } },
      { name: 'visitorName', type: 'text', required: true, maxLength: 100 }, { name: 'visitorEmail', type: 'email', index: true },
      { name: 'visitorPhone', type: 'text', maxLength: 40, index: true },
      { name: 'channel', type: 'select', options: ['chat', 'inquiry'], defaultValue: 'chat' },
      { name: 'status', type: 'select', required: true, defaultValue: 'bot', options: ['bot', 'waiting', 'human', 'closed'], index: true },
      { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
      { name: 'needsAttention', type: 'checkbox', defaultValue: false, index: true },
      { name: 'handoffAt', type: 'date' }, { name: 'lastMessageAt', type: 'date', required: true, index: true },
      { name: 'preview', type: 'textarea', maxLength: 500 }, { name: 'lastVisitorAt', type: 'date' }, { name: 'lastInquiryAt', type: 'date' },
    ],
  },
  { slug: 'chat-messages', labels: { singular: 'Chat message', plural: 'Chat history' }, access: privateAccess,
    admin: { group: 'Assistant', useAsTitle: 'body', defaultColumns: ['conversation', 'role', 'body', 'createdAt'] },
    fields: [
      { name: 'conversation', type: 'relationship', relationTo: 'chat-conversations', required: true, index: true },
      { name: 'role', type: 'select', options: ['visitor', 'assistant', 'staff', 'system'], required: true },
      { name: 'body', type: 'textarea', required: true, maxLength: 6000 },
      { name: 'requestKey', type: 'text', required: true, unique: true, admin: { hidden: true } },
      { name: 'staffName', type: 'text' }, { name: 'reply', type: 'json',admin:{readOnly:true,components:{Field:'/cms/components/ReplyData#ReplyData'}} },
    ],
  },
];
