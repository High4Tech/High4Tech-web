import assert from 'node:assert/strict';
import { calculateBuild, type BuildCategory } from '../lib/pricing-calculator';

const base = { category: 'web' as BuildCategory, platform: 'wordpress', units: 5, complexity: 'essential', extras: [] as string[], support: 'none' };
assert.equal(calculateBuild(base).total, 650, 'Five-page WordPress build');
assert.equal(calculateBuild({ ...base, units: 7, extras: ['cms', 'cms', 'handoff'] }).total, 1080, 'Seven pages with one CMS add-on; AI add-ons excluded');
assert.equal(calculateBuild({ ...base, category: 'app', platform: 'android', units: 6, complexity: 'advanced' }).total, 3213, 'Six-screen advanced Android build');
const ai = calculateBuild({ ...base, category: 'ai', platform: 'integration', units: 4, extras: ['handoff', 'cms'], support: 'growth' });
assert.equal(ai.total, 2000, 'Four API connections plus handoff');
assert.equal(ai.firstYear, 4988, 'Build plus twelve months of Growth support');
assert.equal(calculateBuild({ ...base, units: Infinity }).units, 5, 'Non-finite scope defaults safely');
assert.equal(calculateBuild({ ...base, units: 100 }).units, 30, 'Scope remains within calculator range');
assert.equal(calculateBuild({ ...base, platform: 'ios', support: 'invalid' }).total, 650, 'Cross-category platform defaults safely');
console.log('Pricing examples and invalid-selection checks passed.');
