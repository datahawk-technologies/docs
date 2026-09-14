import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { incidentsSource } from '@/lib/source';
import { tabs } from '@/lib/tabs';
import { IncidentsSidebar } from '@/components/IncidentsSidebar';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// Points feed readers at the incidents feed (rather than the site-wide
// changelog feed set in app/layout.tsx) while browsing this tab.
export const metadata: Metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/incidents/feed.xml',
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tree={incidentsSource.pageTree}
      tabs={tabs}
      sidebar={{
        defaultOpenLevel: 0,
        banner: <IncidentsSidebar />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
