import assert from 'node:assert/strict';
import { getPayload } from 'payload';
import config from '../payload.config';

const payload = await getPayload({ config, disableOnInit: true });
const origin = process.env.CMS_TEST_ORIGIN || 'http://127.0.0.1:3000';
const marker = `Aurora-${Date.now()}`;
const question = `What does the ${marker} workflow take?`;
let documentID: number | undefined;
const ask = async (question: string) => {
  const response = await fetch(origin + '/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ question }) });
  assert.equal(response.status, 200);
  return response.json();
};
try {
  const document = await payload.create({ collection: 'knowledge-documents', draft: true, data: { title: marker + ' handbook', sourceName: 'verification.txt', content: `The ${marker} workflow takes 17 days.` } });
  documentID = document.id;
  assert.equal((await ask(question)).status, 'not-found', 'Draft knowledge must not answer');
  const anonymous = await fetch(origin + `/api/knowledge-documents/${documentID}`);
  assert.ok([401, 403, 404].includes(anonymous.status), 'Raw knowledge documents must require authentication');
  const anonymousVersions = await fetch(origin + '/api/knowledge-documents/versions');
  assert.ok([401, 403, 404].includes(anonymousVersions.status), 'Document versions must require authentication');
  await payload.update({ collection: 'knowledge-documents', id: documentID, data: { _status: 'published' } });
  const published = await ask(question);
  assert.equal(published.status, 'matched');
  assert.equal(published.answer, `The ${marker} workflow takes 17 days.`);
  assert.equal(published.sources[0].id, `document-${documentID}`);
  await payload.update({ collection: 'knowledge-documents', id: documentID, draft: true, data: { content: `The ${marker} workflow takes 99 days.`, _status: 'draft' } });
  assert.equal((await ask(question)).answer, published.answer, 'A private revision must preserve the published answer');
  const admins = await payload.find({ collection: 'users', limit: 1, select: { name: true, email: true } });
  if (admins.docs[0]) {
    const admin = { ...admins.docs[0], collection: 'users' as const, createdAt: '', updatedAt: '' };
    const draftCount = await payload.countVersions({ collection: 'knowledge-documents', where: { and: [{ 'version._status': { equals: 'draft' } }, { latest: { equals: true } }] }, user: admin, overrideAccess: false });
    assert.ok(draftCount.totalDocs >= 1, 'Admin dashboard must count private draft revisions');
  }
  assert.equal((await ask('What is the capital of France?')).status, 'not-found');
  const invalid = await fetch(origin + '/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'x'.repeat(501) }) });
  assert.equal(invalid.status, 400);
  const oversized = await fetch(origin + '/api/assistant', { method: 'POST', body: 'x'.repeat(5000) });
  assert.equal(oversized.status, 400);
  const foreign = await fetch(origin + '/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://unrelated.example' }, body: JSON.stringify({ question: 'Services?' }) });
  assert.equal(foreign.status, 403);
  await payload.delete({ collection: 'knowledge-documents', id: documentID }); documentID = undefined;
  assert.equal((await ask(question)).status, 'not-found', 'Deleted sources must stop answering');
  console.log('PASS: private drafts/documents, publication, source citations, private revisions, deletion, request limits and origin checks.');
} finally {
  if (documentID !== undefined) await payload.delete({ collection: 'knowledge-documents', id: documentID });
  await payload.destroy();
}
process.exit(0);
