/**
 * ChangelogPager — Older / Newer release navigation footer.
 *
 * Installed at: components/ChangelogPager.tsx
 * Used by:      app/changelog/[[...slug]]/page.tsx (rendered at the bottom of each entry)
 *
 * Given the current entry's URL and the full list of dated entries,
 * finds the entries that come before (older) and after (newer) by date order,
 * and renders two clickable cards at the bottom of the page.
 *
 * Server component — no client-side state.
 */

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PagerEntry = {
  title: string;
  date: string;
  url: string;
};

export function ChangelogPager({
  currentUrl,
  allEntries,
}: {
  currentUrl: string;
  allEntries: PagerEntry[];
}) {
  // Sort by date descending (newest first → oldest last)
  const sorted = [...allEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const idx = sorted.findIndex((e) => e.url === currentUrl);
  if (idx === -1) return null;

  // In a newest-first list:
  //   idx - 1 = the next NEWER release (came after in time)
  //   idx + 1 = the next OLDER release (came before in time)
  const newer = idx > 0 ? sorted[idx - 1] : null;
  const older = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Nothing to show if this is the only entry
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="Changelog navigation"
      className="mt-12 pt-6 border-t border-fd-border grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {/* Older release (left) */}
      {older ? (
        <Link
          href={older.url}
          className="group flex flex-col gap-1 p-4 rounded-xl border bg-transparent hover:border-fd-primary transition no-underline"
        >
          <span className="text-xs text-fd-muted-foreground flex items-center gap-1">
            <ChevronLeft className="size-3" />
            Older release
          </span>
          <span className="text-sm font-medium text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition">
            {older.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {/* Newer release (right) */}
      {newer ? (
        <Link
          href={newer.url}
          className="group flex flex-col gap-1 p-4 rounded-xl border bg-transparent hover:border-fd-primary transition no-underline text-right sm:items-end"
        >
          <span className="text-xs text-fd-muted-foreground flex items-center gap-1 justify-end">
            Newer release
            <ChevronRight className="size-3" />
          </span>
          <span className="text-sm font-medium text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition">
            {newer.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
