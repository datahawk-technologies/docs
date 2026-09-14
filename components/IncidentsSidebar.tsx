/**
 * IncidentsSidebar — custom sidebar widget for the Incidents tab.
 *
 * Installed at: components/IncidentsSidebar.tsx
 * Used by:      app/incidents/layout.tsx (passed via sidebar.banner prop)
 *
 * Shows the 5 most recent incidents, an RSS subscribe link, and a pointer to
 * Support for anyone who needs to confirm impact on their own account.
 */

import Link from 'next/link';
import { Rss } from 'lucide-react';

export type LatestIncident = {
  title: string;
  date: string;   // ISO YYYY-MM-DD
  recoverable: boolean;
  url: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function IncidentsSidebar({ latestEntries }: { latestEntries: LatestIncident[] }) {
  return (
    <div className="px-3 pt-4 pb-2 space-y-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2 px-1">
          Latest incidents
        </h3>
        <ul className="space-y-1">
          {latestEntries.map((entry) => (
            <li key={entry.url}>
              <Link
                href={entry.url}
                className="block px-2 py-1.5 rounded hover:bg-fd-accent transition no-underline"
              >
                <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground font-mono flex items-center gap-1.5">
                  {formatDate(entry.date)}
                  {!entry.recoverable && (
                    <span className="text-red-600 dark:text-red-400">- Not recoverable</span>
                  )}
                </div>
                <div className="text-sm text-fd-foreground line-clamp-2 leading-snug">
                  {entry.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/incidents"
          className="block px-2 py-1.5 mt-1 text-xs text-fd-primary hover:underline"
        >
          View all incidents →
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

      <section className="pt-4 border-t border-fd-border space-y-1">
        <p className="text-xs text-fd-muted-foreground px-2">
          Wondering if a specific date range affected your account? Contact your
          account team or{' '}
          <Link href="/help-center/contact" className="text-fd-primary hover:underline">
            support
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
