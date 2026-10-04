export const resourcePlatforms = [
  { value: 'wordpress', label: 'WordPress' }, { value: 'shopify', label: 'Shopify' },
  { value: 'android', label: 'Android' }, { value: 'ios', label: 'iOS' },
  { value: 'custom', label: 'Custom' }, { value: 'pos', label: 'POS' },
  { value: 'other', label: 'Other' },
] as const;
export type ResourcePlatform = typeof resourcePlatforms[number]['value'];
export type StudioVideo = { title?: string; url: string };
export type StudioResource = { id: string; title: string; description: string; category: string; price: string; url: string | null; icon: string; label: string; platforms?: ResourcePlatform[]; capabilities?: string; videos?: StudioVideo[]; image?:string; demoPrice?:number };
export function platformsOf(value: unknown): ResourcePlatform[] {
  const platforms = Array.isArray(value) ? value.filter((p): p is ResourcePlatform => resourcePlatforms.some(option => option.value === p)) : [];
  return platforms.length ? platforms : ['custom'];
}
export function youtubeID(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const id = host === 'youtu.be' ? url.pathname.slice(1) : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host) ? (url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:embed|shorts)\/([^/]+)\/?$/.exec(url.pathname)?.[1]) : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
