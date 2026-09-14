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

  // Compute latest 5 entries for the sidebar widget
  const latestEntries = incidentsSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      date: (p.data as any).date ?? '',
      recoverable: (p.data as any).recoverable ?? true,
      url: p.url,
    }))
    .filter((e) => e.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tree={incidentsSource.pageTree}
      tabs={tabs}
      sidebar={{
        defaultOpenLevel: 0,
        banner: <IncidentsSidebar latestEntries={latestEntries} />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
