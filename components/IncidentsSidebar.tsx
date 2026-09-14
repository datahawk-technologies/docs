/**
 * IncidentsSidebar — custom sidebar widget for the Incidents section.
 *
 * Installed at: components/IncidentsSidebar.tsx
 * Used by:      app/incidents/layout.tsx (passed via sidebar.banner prop)
 *
 * Three blocks: a way back to the full list, the RSS subscribe link, and a
 * pointer to Support.
 *
 * The recent-incidents list that used to live here was removed deliberately —
 * /incidents is already that list, and repeating it on every entry page was noise.
 * "All incidents" stays because the sidebar is otherwise the only route back
 * for a reader who landed on a single entry from search or a support link.
 */

import Link from 'next/link';
import { List, Rss } from 'lucide-react';

export function IncidentsSidebar() {
  return (
    <div className="px-3 pt-4 pb-2 space-y-5">
      <section>
        <Link
          href="/incidents"
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-fd-accent transition text-sm font-medium text-fd-foreground no-underline"
        >
          <List className="size-4 shrink-0" />
          All incidents
        </Link>
      </section>

      <section className="pt-4 border-t border-fd-border space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2 px-1">
          Subscribe
        </h3>

        {/* RSS link — opens /incidents/feed.xml in a new tab */}
        <a
          href="/incidents/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-fd-accent transition text-sm font-medium text-fd-primary no-underline"
        >
          <Rss className="size-4 shrink-0" />
          Subscribe via RSS
        </a>

        <p className="text-xs text-fd-muted-foreground px-2 pt-2">
          Get notified when we log a new incident.
        </p>
      </section>

      <section className="pt-4 border-t border-fd-border">
        <p className="text-xs text-fd-muted-foreground px-2">
          Wondering if a specific date range affected your account?{' '}
          <Link href="/help-center/contact" className="text-fd-primary hover:underline">
            Contact support
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
