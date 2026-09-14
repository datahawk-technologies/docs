/**
 * IncidentsPager — Older / Newer incident navigation footer.
 *
 * Installed at: components/IncidentsPager.tsx
 * Used by:      app/incidents/[[...slug]]/page.tsx (rendered at the bottom of each entry)
 *
 * Same logic as ChangelogPager, adapted for the incidents list.
 * Server component - no client-side state.
 */

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PagerEntry = {
  title: string;
  date: string;
  url: string;
};

export function IncidentsPager({
  currentUrl,
  allEntries,
}: {
  currentUrl: string;
  allEntries: PagerEntry[];
}) {
  const sorted = [...allEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const idx = sorted.findIndex((e) => e.url === currentUrl);
  if (idx === -1) return null;

  const newer = idx > 0 ? sorted[idx - 1] : null;
  const older = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  if (!newer && !older) return null;

  return (
    <nav
      aria-label="Incidents navigation"
      className="mt-12 pt-6 border-t border-fd-border grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {older ? (
        <Link
          href={older.url}
          className="group flex flex-col gap-1 p-4 rounded-xl border bg-transparent hover:border-fd-primary transition no-underline"
        >
          <span className="text-xs text-fd-muted-foreground flex items-center gap-1">
            <ChevronLeft className="size-3" />
            Older incident
          </span>
          <span className="text-sm font-medium text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition">
            {older.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {newer ? (
        <Link
          href={newer.url}
          className="group flex flex-col gap-1 p-4 rounded-xl border bg-transparent hover:border-fd-primary transition no-underline text-right sm:items-end"
        >
          <span className="text-xs text-fd-muted-foreground flex items-center gap-1 justify-end">
            Newer incident
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
