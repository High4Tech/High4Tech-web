import path from 'node:path';
import { APIError, buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import sharp from 'sharp';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { collections,globals } from './cms/collections';
import { seedContent } from './cms/seed';
import { cmsConfigurationIssues } from './lib/cms-runtime';
import { MAX_IMAGE_BYTES } from './cms/media-security';

// Runtime paths avoid bundling unrelated workspace files with the CMS config.
const directory=process.cwd();
const remoteDatabase=/^(libsql|https):\/\//.test(process.env.DATABASE_URL||'');
const cloudReady=remoteDatabase&&!cmsConfigurationIssues().length;
const blobToken=process.env.BLOB_READ_WRITE_TOKEN;
export default buildConfig({
  secret:process.env.PAYLOAD_SECRET||'',
  // Until a delivery provider is configured, never log reset links or email
  // contents to hosting logs through Payload's development email adapter.
  email:()=>({name:'disabled-until-configured',defaultFromAddress:'high4tech360@gmail.com',defaultFromName:'High4Tech',sendEmail:async()=>{throw new APIError('Outbound email is not configured. Contact your administrator.',503);}}),
  maxDepth:3,defaultDepth:1,graphQL:{disable:true},
  upload:{abortOnLimit:true,requestSizeLimit:MAX_IMAGE_BYTES+256*1024,limits:{fileSize:MAX_IMAGE_BYTES,files:1,fields:40,fieldSize:512*1024}},
  admin:{user:'users',importMap:{baseDir:directory},meta:{titleSuffix:'— High4Tech CMS'},components:{beforeDashboard:['/cms/components/StudioDashboard#StudioDashboard'],beforeNavLinks:['/cms/components/ConversationView#InboxNav'],views:{conversations:{Component:'/cms/components/ConversationView#ConversationView',path:'/conversations',exact:true,meta:{title:'Live support inbox'}}}}},
  collections,globals,sharp,
  db:sqliteAdapter({transactionOptions:{behavior:'immediate'},client:{url:process.env.DATABASE_URL||'file:./studio.db',authToken:process.env.DATABASE_AUTH_TOKEN},push:process.env.VERCEL||remoteDatabase?false:undefined,migrationDir:path.resolve(directory,'cms/migrations')}),
  // Server uploads run byte validation before files enter public blob storage.
  plugins:[vercelBlobStorage({enabled:cloudReady,token:cloudReady?blobToken:undefined,collections:{media:true},alwaysInsertFields:true,clientUploads:false,addRandomSuffix:true})],
  typescript:{outputFile:path.resolve(directory,'payload-types.ts')},
  // Vercel seeds once during its build, rather than racing across cold starts.
  onInit:process.env.VERCEL||remoteDatabase?undefined:seedContent,
});
