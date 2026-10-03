export type KnowledgeSource = { id: string; title: string; text: string; keywords?: string; kind: 'answer' | 'document'; link?: string; label?: string };
export type AssistantReply = { status: 'matched' | 'conversation' | 'not-found' | 'disabled' | 'unavailable'; answer: string; sources: { id: string; title: string; kind: 'answer' | 'document'; excerpt: string }[]; link?: string; label?: string; resources?: {id:string;title:string;description:string;price:string;platforms:string[]}[] };
export const assistantDefaults = {
  enabled: true,
  welcomeMessage: 'Ask about High4Tech. I look up answers in our published studio knowledge and show you where they came from.',
  fallbackMessage: 'I couldn’t find a supported answer in the studio’s published knowledge. Try a more specific question, or contact our team.',
};
const stopWords = new Set('a an the is are was were be been being i me my we us our you your it its they their this that these those do does did can could would should will shall what which who how where when why please tell about of to for from with by on in at as and or have has had more some any much many know want like give show find explain provide offer together high4tech h4t'.split(' '));
const aliases: Record<string, string> = { services: 'service', capabilities: 'service', expertise: 'service', create: 'service', creates: 'service', creating: 'service', started: 'start', starting: 'start', began: 'start', begin: 'start', costs: 'price', cost: 'price', pricing: 'price', prices: 'price', tool: 'tool', tools: 'tool', buy: 'purchase', buying: 'purchase', purchases: 'purchase', brand: 'brand', branding: 'brand', websites: 'website', sites: 'website', website: 'website', apps: 'app', applications: 'app', existing: 'existing' };
Object.assign(aliases, { build: 'service', building: 'service', develop: 'service', development: 'service', web: 'website', webpage: 'website', site: 'website', fees: 'price', fee: 'price', contact: 'contact', contacting: 'contact', reach: 'contact', email: 'contact', book: 'book', booking: 'book', automation: 'automation', automations: 'automation' });
for (const word of 'help need looking interested business businesses company companies team get just really also there here able u'.split(' ')) stopWords.add(word);
for (const word of ['offer', 'provide']) stopWords.delete(word);
Object.assign(aliases, { offer: 'service', provide: 'service', make: 'service', making: 'service' });
const conversationalReplies: [RegExp, string][] = [
  [/^(hi|hii|hiii|hiya|hey|heyy|hello|helo|helllo|howdy|good (morning|afternoon|evening))( there| high4tech| team| bot)?$/, 'Hi! Nice to meet you. Ask me about High4Tech’s services, projects, tools, or how to get in touch.'],
  [/^(how are you|how r u|how are you doing|how is it going|hows it going|what s up|whats up)$/, 'I’m here and ready to help. What would you like to know about the studio?'],
  [/^(thanks|thank you|thankyou|ty|cheers)( so much| a lot)?$/, 'You’re welcome! Let me know if you’d like help with anything else about the studio.'],
  [/^(bye|goodbye|see you|see ya|take care)$/, 'See you soon! The studio is here whenever you’re ready to talk about your next idea.'],
  [/^(who are you|what are you|what is your name|whats your name|what s your name|are you a bot)$/, 'I’m the High4Tech studio assistant. I help you find answers in our published studio knowledge.'],
  [/^(help|help me|what can you do|how do i use this|how can you help( me)?)$/, 'Ask a question about High4Tech in your own words. I search our published answers and documents, show the source, and let you know when the studio needs to help directly.'],
];
function smallTalk(question: string): string | undefined {
  const normalized = question.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const withoutGreeting = normalized.replace(/^(hi|hey|hello)\s+/, '');
  return conversationalReplies.find(([pattern]) => pattern.test(normalized) || pattern.test(withoutGreeting))?.[1];
}
export function contactKnowledge(email: string, whatsapp: string): KnowledgeSource[] {
  const lines = [email && `Our contact email address is ${email}.`, whatsapp && `Reach the studio on WhatsApp: ${whatsapp}.`].filter(Boolean);
  return lines.length ? [{ id: 'studio-contact', title: 'How can I contact High4Tech?', text: lines.join('\n'), keywords: 'contact email address whatsapp phone number message', kind: 'answer', link: '/contact', label: 'Open Mail' }] : [];
}
// Correct one-character edits only when there is one unambiguous source term.
// Whole-token matching still rejects unsupported nouns and mixed-topic questions.
export function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const differences = [...a].map((char, i) => char === b[i] ? -1 : i).filter(i => i >= 0);
    return differences.length === 1 || (differences.length === 2 && differences[1] === differences[0] + 1 && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]]);
  }
  const shorter = a.length < b.length ? a : b, longer = a.length < b.length ? b : a;
  let i = 0, j = 0;
  while (i < shorter.length && j < longer.length) { if (shorter[i] === longer[j]) { i++; j++; } else { j++; if (j - i > 1) return false; } }
  return true;
}
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
  const none: AssistantReply = { status: 'not-found', answer: fallback, sources: [] };
  if (/ignore\b.{0,60}\b(instructions?|rules?|previous)|system\s*prompt|pretend\s+to|jailbreak/i.test(question)) return none;
  const conversation = smallTalk(question);
  if (conversation) return { status: 'conversation', answer: conversation, sources: [] };
  const phrased = question.replace(/^(hi|hey|hello)[!,\s]+/i, '').replace(/\b(i would like to|i'd like to|i am interested in|i'm interested in|help me understand|could you|can you|looking for|a little bit)\b/gi, ' ');
  const vocabulary = new Set(sources.flatMap(source => [...tokens(source.title + ' ' + source.text + ' ' + (source.keywords || ''))]));
  const query = new Set([...tokens(phrased)].map(token => {
    if (vocabulary.has(token) || token.length < 5 || /\d/.test(token)) return token;
    const corrections = [...vocabulary].filter(word => word.length >= 5 && !/\d/.test(word) && oneEditApart(token, word));
    return corrections.length === 1 ? corrections[0] : token;
  }));
  if (!query.size) return none;
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
