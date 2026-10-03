import type { AssistantReply } from './assistant-search';
export type ChatStatus = 'bot' | 'waiting' | 'human' | 'closed';
export type ChatMessage = { id: number; role: 'visitor' | 'assistant' | 'staff' | 'system'; body: string; createdAt: string; staffName?: string | null; reply?: AssistantReply | null };
export type ChatConversation = { id: number; visitorName: string; visitorEmail?: string | null; visitorPhone?: string | null; channel?: 'chat' | 'inquiry' | null; status: ChatStatus; needsAttention: boolean; lastMessageAt: string; handoffAt?: string | null; preview?: string | null; assignedTo?: number | null };
export type ChatSnapshot = { mode: 'cms' | 'preview'; conversation: ChatConversation | null; messages: ChatMessage[]; hasOlder?: boolean; error?: string };
