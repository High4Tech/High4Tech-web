import { getPayload } from 'payload';
import config from '../payload.config';
import { seedContent } from '../cms/seed';

const payload=await getPayload({config,disableOnInit:true});
try {await seedContent(payload);console.log('CMS starting content checked. Existing edits are preserved.');}
finally {await payload.destroy();}
process.exit(0);
