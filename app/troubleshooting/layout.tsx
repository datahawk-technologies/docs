import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { troubleshootingSource } from '@/lib/source';
import { tabs } from '@/lib/tabs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tree={troubleshootingSource.pageTree}
      tabs={tabs}
    >
      {children}
    </DocsLayout>
  );
}