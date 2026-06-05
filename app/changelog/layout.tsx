import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { changelogSource } from '@/lib/source';
import { tabs } from '@/lib/tabs';
import { ChangelogSidebar } from '@/components/ChangelogSidebar';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();

  // Compute latest 5 entries for the sidebar widget
  const latestEntries = changelogSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      date: (p.data as any).date ?? '',
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
      tree={changelogSource.pageTree}
      tabs={tabs}
      sidebar={{
        defaultOpenLevel: 0,
        banner: <ChangelogSidebar latestEntries={latestEntries} />,
      }}
    >
      {children}
    </DocsLayout>
  );
}