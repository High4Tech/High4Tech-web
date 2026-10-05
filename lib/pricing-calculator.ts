export const buildCategories = [
  { id: 'web', label: 'Web', description: 'Websites, stores & custom platforms', platforms: [
    { id: 'wordpress', label: 'WordPress', base: 650, unit: 'pages', included: 5, extra: 90 },
    { id: 'shopify', label: 'Shopify', base: 950, unit: 'templates', included: 5, extra: 120 },
    { id: 'custom', label: 'Custom / Next.js', base: 1490, unit: 'pages', included: 5, extra: 150 },
    { id: 'pos', label: 'POS web app', base: 2200, unit: 'screens', included: 5, extra: 180 },
  ] },
  { id: 'app', label: 'App', description: 'Mobile products & connected experiences', platforms: [
    { id: 'android', label: 'Android', base: 2200, unit: 'screens', included: 5, extra: 180 },
    { id: 'ios', label: 'iOS', base: 2500, unit: 'screens', included: 5, extra: 200 },
    { id: 'cross-platform', label: 'iOS + Android', base: 3200, unit: 'screens', included: 5, extra: 240 },
  ] },
  { id: 'ai', label: 'AI & automation', description: 'Assistants, workflows & system integrations', platforms: [
    { id: 'workflow', label: 'Workflow automation', base: 990, unit: 'workflow steps', included: 5, extra: 100 },
    { id: 'assistant', label: 'Knowledge chatbot', base: 1490, unit: 'knowledge sources', included: 5, extra: 80 },
    { id: 'integration', label: 'API integrations', base: 1200, unit: 'connections', included: 2, extra: 250 },
  ] },
] as const;
export type BuildCategory = typeof buildCategories[number]['id'];
export const complexityLevels = [{ id: 'essential', label: 'Essential', factor: 1, text: 'Focused scope, standard interactions.' }, { id: 'advanced', label: 'Advanced', factor: 1.35, text: 'More custom logic and interaction.' }, { id: 'bespoke', label: 'Bespoke', factor: 1.8, text: 'Complex flows and a tailored visual system.' }] as const;
export const buildExtras = [
  { id: 'cms', label: 'Content management', cost: 250, categories: ['web', 'app'] },
  { id: 'accounts', label: 'Customer accounts', cost: 400, categories: ['web', 'app'] },
  { id: 'checkout', label: 'Payment integration', cost: 350, categories: ['web', 'app'] },
  { id: 'handoff', label: 'Human handoff inbox', cost: 300, categories: ['ai'] },
  { id: 'dashboard', label: 'Reporting dashboard', cost: 400, categories: ['ai'] },
  { id: 'review', label: 'Approval & review flow', cost: 250, categories: ['ai'] },
] as const;
export const supportPlans = [
  { id: 'none', label: 'Build only', price: 0, hours: 0, items: ['Project handover', '30-day defect-fix window'] },
  { id: 'care', label: 'Care', price: 99, hours: 2, items: ['Updates & backup checks', 'Up to 2 support hours / month', 'Response within 2 business days'] },
  { id: 'growth', label: 'Growth', price: 249, hours: 6, items: ['Everything in Care', 'Up to 6 support hours / month', 'Response within 1 business day'] },
  { id: 'partner', label: 'Partner', price: 499, hours: 12, items: ['Everything in Growth', 'Up to 12 support hours / month', 'Priority during business hours'] },
] as const;
export function calculateBuild(input: { category: BuildCategory; platform: string; units: number; complexity: string; extras: string[]; support: string }) {
  const category = buildCategories.find(c => c.id === input.category) || buildCategories[0];
  const platform = category.platforms.find(p => p.id === input.platform) || category.platforms[0];
  const complexity = complexityLevels.find(c => c.id === input.complexity) || complexityLevels[0];
  const support = supportPlans.find(s => s.id === input.support) || supportPlans[0];
  const units = Math.max(platform.included, Math.min(30, Math.round(Number.isFinite(input.units) ? input.units : platform.included)));
  const scope = (units - platform.included) * platform.extra;
  const extras = buildExtras.filter(e => (e.categories as readonly string[]).includes(category.id) && input.extras.includes(e.id));
  const complexityCost = Math.round((platform.base + scope) * (complexity.factor - 1));
  const total = platform.base + scope + complexityCost + extras.reduce((sum, e) => sum + e.cost, 0);
  return { category, platform, units, complexity, support, extras, scope, complexityCost, total, firstYear: total + support.price * 12 };
}
