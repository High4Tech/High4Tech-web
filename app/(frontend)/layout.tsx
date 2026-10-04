import type { Metadata } from 'next';
import '../globals.css';
import '../experience.css';
import '../studio.css';
import '../studio-premium.css';
import '../forms.css';
import '../interactions.css';
import '../assistant.css';
import '../ai-zone.css';
import '../windows.css';
import '../resources-chat.css';
import '../typography.css';
import { SiteShell } from '@/components/site-shell';
import { ContentProvider } from '@/components/content-provider';
import { getStudioContent } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: { default: 'High4Tech — Ideas into impact.', template: '%s — High4Tech' },
  description: 'Design, development, and digital experiences with character. Explore High4Tech’s first website draft.',
  icons: { icon: '/brand/mark.png' },
  robots: { index: false, follow: false },
};

export const dynamic='force-dynamic';
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content=await getStudioContent();
  return <html lang="en"><body><ContentProvider content={content}><SiteShell>{children}</SiteShell></ContentProvider></body></html>;
}
