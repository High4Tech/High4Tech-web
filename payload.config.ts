import path from 'node:path';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import sharp from 'sharp';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { collections,globals } from './cms/collections';
import { seedContent } from './cms/seed';
import { cmsConfigurationIssues } from './lib/cms-runtime';

// Runtime paths avoid bundling unrelated workspace files with the CMS config.
const directory=process.cwd();
const remoteDatabase=/^(libsql|https):\/\//.test(process.env.DATABASE_URL||'');
const cloudReady=remoteDatabase&&!cmsConfigurationIssues().length;
const blobToken=process.env.BLOB_READ_WRITE_TOKEN;
export default buildConfig({
  secret:process.env.PAYLOAD_SECRET||'',
  admin:{user:'users',importMap:{baseDir:directory},meta:{titleSuffix:'— High4Tech CMS'},components:{beforeDashboard:['/cms/components/StudioDashboard#StudioDashboard']}},
  collections,globals,sharp,
  db:sqliteAdapter({client:{url:process.env.DATABASE_URL||'file:./studio.db',authToken:process.env.DATABASE_AUTH_TOKEN},push:process.env.VERCEL||remoteDatabase?false:undefined,migrationDir:path.resolve(directory,'cms/migrations')}),
  plugins:[vercelBlobStorage({enabled:cloudReady,token:cloudReady?blobToken:undefined,collections:{media:true},alwaysInsertFields:true,clientUploads:true,addRandomSuffix:true})],
  typescript:{outputFile:path.resolve(directory,'payload-types.ts')},
  // Vercel seeds once during its build, rather than racing across cold starts.
  onInit:process.env.VERCEL||remoteDatabase?undefined:seedContent,
});
