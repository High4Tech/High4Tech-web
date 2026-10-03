import 'server-only';
import { getAssistantKnowledge } from './assistant-knowledge';
import { searchKnowledge } from './assistant-search';
import { searchResources } from './resource-search';
export async function answerAssistant(question: string) {
  const knowledge = await getAssistantKnowledge();
  if (!knowledge.settings.enabled) return { status: 'disabled' as const, answer: 'The studio assistant is currently paused. Please contact our team.', sources: [], mode: knowledge.mode };
  return { ...(searchResources(question, knowledge.resources) || searchKnowledge(question, knowledge.sources, knowledge.settings.fallbackMessage)), mode: knowledge.mode };
}
