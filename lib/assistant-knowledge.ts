import 'server-only';
import { platformsOf } from './resource-platforms';
import { cmsConfigurationIssues } from './cms-runtime';
import { defaultContent } from './studio-content';
import { assistantDefaults, contactKnowledge, type KnowledgeSource } from './assistant-search';

export async function getAssistantKnowledge() {
  if (cmsConfigurationIssues().length) return {
    resources: defaultContent.resources, mode: 'preview' as const, settings: defaultContent.assistant,
    sources: [...contactKnowledge(defaultContent.settings.email, defaultContent.socials.whatsapp), ...defaultContent.knowledge.map((answer, index): KnowledgeSource => ({ id: `preview-${index}`, title: answer.question, text: answer.answer, keywords: answer.keywords, kind: 'answer', link: answer.link, label: answer.label }))],
  };
  const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('@payload-config')]);
  const payload = await getPayload({ config });
  const [settings, answers, documents, contact, resources] = await Promise.all([
    payload.findGlobal({ slug: 'assistant-settings' }),
    payload.find({ collection: 'chatbot-data', overrideAccess: false, draft: false, pagination: false, depth: 0, sort: 'sortOrder', where: { _status: { equals: 'published' } } }),
    // Document read access stays admin-only. This deliberate server-side read exposes
    // only a matched passage from the public, published version, never the raw file.
    payload.find({ collection: 'knowledge-documents', overrideAccess: true, draft: false, pagination: false, depth: 0, sort: 'sortOrder', where: { _status: { equals: 'published' } }, select: { title: true, content: true } }),
    payload.findGlobal({ slug: 'contact-info' }),
    payload.find({ collection: 'resources', overrideAccess: false, draft: false, pagination: false, depth: 0, sort: 'sortOrder', where: { _status: { equals: 'published' } } }),
  ]);
  const sources: KnowledgeSource[] = [
    ...contactKnowledge(contact.email, contact.whatsapp || ''),
    ...answers.docs.map(answer => ({ id: `answer-${answer.id}`, title: answer.question, text: answer.answer, keywords: answer.keywords, kind: 'answer' as const, link: answer.link || undefined, label: answer.label || undefined })),
    ...documents.docs.map(document => ({ id: `document-${document.id}`, title: document.title, text: document.content, kind: 'document' as const })),
  ];
  return { resources: resources.docs.map(r => ({id:r.slug,title:r.title,description:r.description,category:r.category,price:r.price,url:r.url || null,icon:r.icon || 'tool',label:r.label,platforms:platformsOf(r.platforms),capabilities:r.capabilities || ''})), mode: 'cms' as const, settings: { enabled: settings.enabled !== false, welcomeMessage: settings.welcomeMessage || assistantDefaults.welcomeMessage, fallbackMessage: settings.fallbackMessage || assistantDefaults.fallbackMessage }, sources };
}
