/* ════════════════════════════════════════════════════════════════
   DataHawk Documentation — Docs Section Layout (Notebook style)
   ════════════════════════════════════════════════════════════════
   
   Layout configuration:
   - nav.mode = 'top'      → full-width top navbar (spans over sidebar)
   - tabMode = 'navbar'    → tabs render in the navbar (not as dropdown)
   - tabs array            → the four DataHawk sections
   
   Effect: MrScraper-style top bar with logo + tabs + search + contact
   buttons all on one full-width row. Sidebar starts below.
   ════════════════════════════════════════════════════════════════ */

import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  // Spread out 'nav' so we can add the 'mode' property to it
  // without losing the title and links from baseOptions().
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      {...base}

      // Nav mode 'top' = full-width navbar (vs. default which is
      // offset right of the sidebar).
      nav={{ ...nav, mode: 'top' }}

      // Tab mode 'navbar' = tabs appear inline in the navbar
      // (vs. 'sidebar' which would put them in a dropdown).
      tabMode="navbar"

      // Connects the sidebar to your content folder structure.
      tree={source.pageTree}

      // The four section tabs. Each one's 'url' must match a folder
      // under content/docs/ (which you'll create next session).
      //
      // To add a tab:    add a new { title, url } entry
      // To remove a tab: delete its entry
      // To reorder:      rearrange the entries
      // To rename:       change the 'title' string
      tabs={[
        {
          title: 'Welcome',
          url: '/docs/getting-started',
        },
        {
          title: 'Help Center',
          url: '/docs/help-center',
        },
        {
          title: 'Troubleshooting',
          url: '/docs/troubleshooting',
        },
        {
          title: 'API Reference',
          url: '/docs/api',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}