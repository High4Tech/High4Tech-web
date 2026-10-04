import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
const nextConfig: NextConfig = {
  devIndicators: false, poweredByHeader:false,
  async headers(){return [{source:'/:path*',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'X-Frame-Options',value:'SAMEORIGIN'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    {key:'Strict-Transport-Security',value:'max-age=31536000'},
  ]}];},
};
export default withPayload(nextConfig);
