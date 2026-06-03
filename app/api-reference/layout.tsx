
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { apiReferenceSource, welcomeSource } from '@/lib/source';
import { tabs } from '@/lib/tabs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tree={welcomeSource.pageTree}
      tabs={tabs}
      sidebar={{ defaultOpenLevel: 0 }}
    >
      {children}
    </DocsLayout>
  );
}