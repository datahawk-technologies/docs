/* ════════════════════════════════════════════════════════════════
   DataHawk Documentation — Root Layout
   ════════════════════════════════════════════════════════════════
   Wraps EVERY page on the site (docs, home, everything).
   Handles: fonts, theme, global CSS imports.
   ════════════════════════════════════════════════════════════════ */

import './global.css';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { PostHog } from '@/components/PostHog';

export const metadata: Metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={poppins.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <PostHog />
        <RootProvider
          theme={{
            enabled: false,
            forcedTheme: 'light',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
