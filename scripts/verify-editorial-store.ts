import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { getPayload } from 'payload';
import { articleMedia } from '../lib/editorial';
import { defaultContent } from '../lib/studio-content';

// An isolated, disposable database. Never copies or changes visitor/CMS records.
const directory = path.resolve('outputs', `editorial-verify-${Date.now()}`);
await mkdir(directory, { recursive: true });
process.env.PAYLOAD_SECRET = randomBytes(48).toString('hex');
process.env.DATABASE_URL = `file:${path.join(directory, 'fixture.db').replaceAll('\\', '/')}`;
delete process.env.DATABASE_AUTH_TOKEN;
delete process.env.BLOB_READ_WRITE_TOKEN;
process.env.VERCEL = '1';
process.env.SITE_URL = 'http://127.0.0.1:3000';
Object.assign(process.env, { NODE_ENV: 'production' });
const { default: configPromise } = await import('../payload.config');
const config = await configPromise;
const media = config.collections.find(c => c.slug === 'media')!;
if (media.upload) media.upload.staticDir = path.join(directory, 'media');
const payload = await getPayload({ config, disableOnInit: true });
try {
  await payload.db.migrate();
  const card = await payload.create({ collection: 'media', data: { alt: 'Card fixture' }, filePath: path.resolve('public/brand/mark.png') });
  const banner = await payload.create({ collection: 'media', data: { alt: 'Banner fixture' }, filePath: path.resolve('public/brand/wordmark.png') });
  const draft = await payload.create({ collection: 'newsroom', draft: true, data: { title: 'Media fixture', slug: 'media-fixture', category: 'Studio', read: '1 min read', summary: 'Isolated media verification.', paragraphs: [{ value: 'First paragraph.' }, { value: 'Second paragraph.' }], cardImage: card.id, bannerImage: banner.id, bodyImages: [{ image: card.id, alt: 'In-article image', caption: 'Fixture caption', afterParagraph: 2 }] } });
  const anonymousDrafts = await payload.find({ collection: 'newsroom', overrideAccess: false, draft: false });
  assert.equal(anonymousDrafts.totalDocs, 0, 'Draft images/content remain private');
  await payload.update({ collection: 'newsroom', id: draft.id, data: { _status: 'published' } });
  const live = (await payload.find({ collection: 'newsroom', overrideAccess: false, draft: false, depth: 1 })).docs[0];
  assert.equal(typeof live.cardImage === 'object' && live.cardImage?.id, card.id);
  assert.equal(typeof live.bannerImage === 'object' && live.bannerImage?.id, banner.id);
  assert.equal(live.bodyImages?.[0].afterParagraph, 2);
  assert.equal(live.bodyImages?.[0].caption, 'Fixture caption');
  await payload.update({ collection: 'newsroom', id: draft.id, draft: true, data: { title: 'Private revision', cardImage: banner.id, _status: 'draft' } });
  const unchanged = (await payload.find({ collection: 'newsroom', overrideAccess: false, draft: false, depth: 1 })).docs[0];
  assert.equal(unchanged.title, 'Media fixture');
  assert.equal(typeof unchanged.cardImage === 'object' && unchanged.cardImage?.id, card.id);
  const resource = await payload.create({ collection: 'resources', data: { title: 'Paid tool fixture', slug: 'paid-fixture', description: 'Verification fixture.', category: 'Studio tools', platforms: ['shopify', 'pos'], capabilities: 'stock alerts', price: 'Paid', label: 'Demo', image: card.id, demoPrice: 79, videos: [{ title: 'Video fixture', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }], _status: 'published' } });
  const tool = await payload.findByID({ collection: 'resources', id: resource.id, depth: 1, overrideAccess: false });
  assert.equal(tool.demoPrice, 79);
  assert.equal(typeof tool.image === 'object' && tool.image?.id, card.id);
  assert.equal(tool.videos?.length, 1);
  assert.deepEqual(tool.platforms, ['shopify', 'pos']);
  const original = defaultContent.articles[0];
  assert.notEqual(articleMedia(original), articleMedia(original, true), 'Distinct fallback card/banner compositions');
  assert.equal(articleMedia({ ...original, image: '/legacy.png' }, true), '/legacy.png');
  assert.equal(articleMedia({ ...original, cardImage: '/card.png', bannerImage: '/banner.png' }), '/card.png');
  assert.equal(articleMedia({ ...original, cardImage: '/card.png', bannerImage: '/banner.png' }, true), '/banner.png');
  console.log('PASS: complete migration chain, separate card/banner media, positioned body images, private draft revisions, tool media/video/demo price, and legacy image fallback.');
} finally {
  await payload.destroy();
}
process.exit(0);
