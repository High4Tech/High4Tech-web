import { tokens, oneEditApart, type AssistantReply } from './assistant-search';
import { platformsOf, resourcePlatforms, type StudioResource } from './resource-platforms';

const generic = new Set('tool resource plugin app list all catalog collection platform compatible hi hello hey available availability recommend recommendation use using used doing do manage managing track tracking support supporte work working suitable best good please have need want look looking find show help get lets'.split(' '));
const aliases: Record<string, string> = { stock: 'inventory', stocks: 'inventory', products: 'product', orders: 'order', payments: 'payment', point: 'pos', sale: 'pos', sales: 'pos', iphone: 'ios', ipad: 'ios', woocommerce: 'wordpress', wp: 'wordpress', shopfy: 'shopify', shopfiy: 'shopify', shopify: 'shopify', android: 'android' };
const normalize = (text: string) => new Set([...tokens(text)].map(term => aliases[term] || term));
export function searchResources(question: string, catalog: StudioResource[]): AssistantReply | undefined {
  if (/ignore|system prompt|forget.*instruction|pretend|jailbreak/i.test(question)) return undefined;
  const terms = [...normalize(question)];
  const platform = resourcePlatforms.find(p => terms.some(term => term === p.value || term.length >= 5 && oneEditApart(term, p.value)));
  if (!terms.some(term => ['tool', 'resource', 'plugin', 'app'].includes(term)) && !(platform && terms.every(term => generic.has(term) || term === platform.value))) return undefined;
  const price = terms.includes('free') ? 'Free' : terms.includes('paid') ? 'Paid' : undefined;
  const purpose = terms.filter(term => !generic.has(term) && !['free', 'paid'].includes(term) && !(platform && (term === platform.value || term.length >= 5 && oneEditApart(term, platform.value))));
  const resources = catalog.filter(resource => resource.url && (!price || resource.price === price) && (!platform || platformsOf(resource.platforms).includes(platform.value)) && purpose.every(term => {
    const source = normalize(`${resource.title} ${resource.description} ${resource.category} ${resource.capabilities || ''}`);
    return [...source].some(word => word === term || term.length >= 5 && oneEditApart(word, term));
  }));
  const scope = [price?.toLowerCase(), platform?.label].filter(Boolean).join(' ');
  if (!resources.length) return { status: 'not-found', answer: `There aren’t any published ${scope ? scope + ' ' : ''}tools matching that request yet. Try a different purpose or ask our team to help you find the right fit.`, sources: [], link: '/tools-and-resources', label: 'Browse the App Store' };
  return { status: 'matched', answer: `Here ${resources.length === 1 ? 'is a' : 'are the'} published ${scope ? scope + ' ' : ''}tool${resources.length === 1 ? '' : 's'} matching your request:`, sources: [], resources: resources.map(({ id, title, description, price, platforms }) => ({ id, title, description, price, platforms: platformsOf(platforms) })), link: '/tools-and-resources', label: 'Browse all tools' };
}
