import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { helpCenterSource } from '@/lib/source';
import type { ReactNode } from 'react';

const tabs = [
  { title: 'Welcome', url: '/welcome' },
  { title: 'Help Center', url: '/help-center' },
  { title: 'Troubleshooting', url: '/troubleshooting' },
  { title: 'API Reference', url: '/api-reference' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tree={helpCenterSource.pageTree}
      tabs={tabs}
    >
      {children}
    </DocsLayout>
  );
}