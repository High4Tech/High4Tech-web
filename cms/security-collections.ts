import type { CollectionConfig } from 'payload';

// Private counters are shared by all app instances using the same database.
export const securityCollections: CollectionConfig[] = [{
  slug: 'security-rate-limits', admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'windowStart', type: 'number', required: true },
    { name: 'count', type: 'number', required: true },
  ],
}];
