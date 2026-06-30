/**
 * ChangelogSidebar — custom sidebar widget for the Changelog tab.
 *
 * Installed at: components/ChangelogSidebar.tsx
 * Used by:      app/changelog/layout.tsx (passed via sidebar.banner prop)
 *
 * Shows:
 *   - 5 most recent releases
 *   - Subscribe section with both Email + RSS options
 *
 * The "Subscribe by email" button targets the SubscribeForm at the top of
 * the changelog landing, where users open the configured Google Form.
 */

import Link from 'next/link';
import { Rss } from 'lucide-react';
import { EmailSubscribeButton } from './EmailSubscribeButton';

export type LatestEntry = {
  title: string;
  date: string;   // ISO YYYY-MM-DD
  url: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ChangelogSidebar({ latestEntries }: { latestEntries: LatestEntry[] }) {
  return (
    <div className="px-3 pt-4 pb-2 space-y-5">
      {/* ─── Latest releases ─────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2 px-1">
          Latest releases
        </h3>
        <ul className="space-y-1">
          {latestEntries.map((entry) => (
            <li key={entry.url}>
              <Link
                href={entry.url}
                className="block px-2 py-1.5 rounded hover:bg-fd-accent transition no-underline"
              >
                <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground font-mono">
                  {formatDate(entry.date)}
                </div>
                <div className="text-sm text-fd-foreground line-clamp-2 leading-snug">
                  {entry.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/changelog"
          className="block px-2 py-1.5 mt-1 text-xs text-fd-primary hover:underline"
        >
          View all releases →
        </Link>
      </section>

      {/* ─── Subscribe section ───────────────────────────────── */}
      <section className="pt-4 border-t border-fd-border space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2 px-1">
          Subscribe
        </h3>

        {/* Email button — opens the SubscribeForm at the top of the page */}
        <EmailSubscribeButton />

        {/* RSS link — opens /feed.xml in a new tab */}
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-fd-accent transition text-sm font-medium text-fd-primary no-underline"
        >
          <Rss className="size-4 shrink-0" />
          Subscribe via RSS
        </a>

        <p className="text-xs text-fd-muted-foreground px-2 pt-2">
          Get notified when new releases ship.
        </p>
      </section>
    </div>
  );
}
