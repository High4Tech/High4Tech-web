import { randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

try {
  await writeFile(new URL('../.env',import.meta.url),`PAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nDATABASE_URL=file:./studio.db\n`,{flag:'wx'});
  console.log('Local CMS configuration created. Start the site, then open /admin to create your admin account.');
} catch(error) {
  if(error.code==='EEXIST')console.log('Existing local configuration preserved.');
  else throw error;
}
