import path from 'node:path';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import sharp from 'sharp';
import { collections,globals } from './cms/collections';
import { seedContent } from './cms/seed';

// Runtime paths avoid bundling unrelated workspace files with the CMS config.
const directory=process.cwd();
export default buildConfig({
  secret:process.env.PAYLOAD_SECRET||'',
  admin:{user:'users',importMap:{baseDir:directory},meta:{titleSuffix:'— High4Tech CMS'}},
  collections,globals,sharp,
  db:sqliteAdapter({client:{url:process.env.DATABASE_URL||'file:./studio.db'},migrationDir:path.resolve(directory,'cms/migrations')}),
  typescript:{outputFile:path.resolve(directory,'payload-types.ts')},
  onInit:seedContent,
});
