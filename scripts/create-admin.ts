import { getPayload } from 'payload';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import config from '../payload.config';

if (!process.stdin.isTTY) throw new Error('Run this command in your own interactive terminal. Credentials are never accepted through arguments or printed.');
let hide = false;
const output = new Writable({ write(chunk, _encoding, callback) { if (!hide) process.stdout.write(chunk); callback(); } });
const prompt = createInterface({ input: process.stdin, output, terminal: true });
const payload = await getPayload({ config, disableOnInit: true });
try {
  if ((await payload.count({ collection: 'users' })).totalDocs) throw new Error('An admin already exists. Create additional accounts from the authenticated dashboard.');
  const email = (await prompt.question('Admin email: ')).trim();
  process.stdout.write('Password (12–128 characters, hidden): '); hide = true;
  const password = await prompt.question('');
  process.stdout.write('\nConfirm password: ');
  const confirmation = await prompt.question(''); hide = false; process.stdout.write('\n');
  if (password !== confirmation || password.length < 12 || password.length > 128) throw new Error('Passwords must match and contain 12–128 characters.');
  const transactionID = await payload.db.beginTransaction();
  if (!transactionID) throw new Error('Database unavailable.');
  try {
    const req = { transactionID };
    if ((await payload.count({ collection: 'users', req })).totalDocs) throw new Error('An admin already exists.');
    await payload.create({ collection: 'users', req, data: { email, password, name: 'Studio administrator' } });
    await payload.db.commitTransaction(transactionID);
  } catch(error){await payload.db.rollbackTransaction(transactionID);throw error;}
  console.log('Administrator created. Sign in at /admin.');
} finally { prompt.close(); await payload.destroy(); }
