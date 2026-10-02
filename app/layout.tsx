import type { Metadata } from 'next';
import '@fontsource/unbounded/latin-700.css';
import '@fontsource/unbounded/latin-900.css';
import './globals.css';
import './experience.css';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: { default: 'High4Tech — Ideas into impact.', template: '%s — High4Tech' },
  description: 'Design, development, and digital experiences with character. Explore High4Tech’s first website draft.',
  icons: { icon: '/brand/mark.png' },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
