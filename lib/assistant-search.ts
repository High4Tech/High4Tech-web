export type KnowledgeSource = { id: string; title: string; text: string; keywords?: string; kind: 'answer' | 'document'; link?: string; label?: string };
export type AssistantReply = { status: 'matched' | 'not-found' | 'disabled' | 'unavailable'; answer: string; sources: { id: string; title: string; kind: 'answer' | 'document'; excerpt: string }[]; link?: string; label?: string };
export const assistantDefaults = {
  enabled: true,
  welcomeMessage: 'Ask about High4Tech. I look up answers in our published studio knowledge and show you where they came from.',
  fallbackMessage: 'I couldn’t find a supported answer in the studio’s published knowledge. Try a more specific question, or contact our team.',
};
const stopWords = new Set('a an the is are was were be been being i me my we us our you your it its they their this that these those do does did can could would should will shall what which who how where when why please tell about of to for from with by on in at as and or have has had more some any much many know want like give show find explain provide offer together high4tech h4t'.split(' '));
const aliases: Record<string, string> = { services: 'service', capabilities: 'service', expertise: 'service', create: 'service', creates: 'service', creating: 'service', started: 'start', starting: 'start', began: 'start', begin: 'start', costs: 'price', cost: 'price', pricing: 'price', prices: 'price', tool: 'tool', tools: 'tool', buy: 'purchase', buying: 'purchase', purchases: 'purchase', brand: 'brand', branding: 'brand', websites: 'website', sites: 'website', website: 'website', apps: 'app', applications: 'app', existing: 'existing' };
export function tokens(text: string): Set<string> {
  const words = text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  return new Set(words.filter(word => !stopWords.has(word)).map(word => aliases[word] || (word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word)));
}
function passages(text: string): string[] {
  // Each returned passage is an exact slice of stored text, never model-generated.
  const blocks = text.split(/\n\s*\n/).map(value => value.trim()).filter(Boolean);
  return blocks.flatMap(block => {
    const chunks: string[] = [];
    let remaining = block;
    while (remaining.length > 1200) {
      let boundary = remaining.lastIndexOf('\n', 1200);
      if (boundary < 400) boundary = remaining.lastIndexOf('. ', 1200) + 1;
      if (boundary < 400) boundary = remaining.lastIndexOf(' ', 1200);
      if (boundary < 1) boundary = 1200;
      chunks.push(remaining.slice(0, boundary).trim()); remaining = remaining.slice(boundary).trim();
    }
    if (remaining) chunks.push(remaining);
    return chunks;
  });
}
export function searchKnowledge(question: string, sources: KnowledgeSource[], fallback = assistantDefaults.fallbackMessage): AssistantReply {
  const query = tokens(question);
  const none: AssistantReply = { status: 'not-found', answer: fallback, sources: [] };
  if (!query.size || /ignore\b.{0,60}\b(instructions?|rules?|previous)|system\s*prompt|pretend\s+to|jailbreak/i.test(question)) return none;
  const candidates = sources.flatMap(source => (source.kind === 'answer' ? [source.text.trim()] : passages(source.text)).map(excerpt => {
    const body = tokens(excerpt);
    const context = tokens(source.title + ' ' + (source.keywords || ''));
    const supported = new Set([...body, ...context]);
    const hits = [...query].filter(token => supported.has(token));
    // Unsupported parts of a mixed-topic question must not unlock a nearby answer.
    if (hits.length !== query.size || !excerpt) return null;
    const direct = [...query].filter(token => body.has(token)).length;
    const exact = question.trim().toLowerCase() === source.title.trim().toLowerCase();
    return { source, excerpt, score: (exact ? 20 : 0) + hits.length * 2 + direct + (source.kind === 'answer' ? 1 : 0) };
  }).filter(candidate => candidate !== null));
  candidates.sort((a, b) => b.score - a.score || a.source.id.localeCompare(b.source.id));
  const best = candidates[0];
  if (!best) return none;
  return { status: 'matched', answer: best.excerpt, sources: [{ id: best.source.id, title: best.source.title, kind: best.source.kind, excerpt: best.excerpt }], ...(best.source.link && /^\/(?!\/)/.test(best.source.link) ? { link: best.source.link, label: best.source.label || 'Explore more' } : {}) };
}
