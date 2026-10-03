type Environment=Record<string,string|undefined>;

// Only variable names are returned. Values and credentials never leave the server.
export function cmsConfigurationIssues(env:Environment=process.env):string[]{
  const issues:string[]=[];
  if(!env.PAYLOAD_SECRET||env.PAYLOAD_SECRET.length<32||env.PAYLOAD_SECRET==='replace-with-a-long-random-secret')issues.push('PAYLOAD_SECRET');
  if(env.VERCEL||/^(libsql|https):\/\//.test(env.DATABASE_URL||'')){
    if(!/^(libsql|https):\/\//.test(env.DATABASE_URL||''))issues.push('DATABASE_URL');
    if(!env.DATABASE_AUTH_TOKEN)issues.push('DATABASE_AUTH_TOKEN');
    if(!/^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(env.BLOB_READ_WRITE_TOKEN||''))issues.push('BLOB_READ_WRITE_TOKEN');
  }
  return issues;
}

export function cmsUnavailableResponse(){
  return Response.json({error:'CMS setup is incomplete. Configure the server environment before using the admin or content API.',missing:cmsConfigurationIssues()},{status:503,headers:{'Cache-Control':'no-store','Retry-After':'60'}});
}
