'use client';

/**
 * IncidentsList — landing list for the Incidents history page.
 *
 * Installed at: components/IncidentsList.tsx
 *
 * Receives entries as a prop from the server component at
 * app/incidents/[[...slug]]/page.tsx. Renders a flat, newest-first list -
 * no month grouping or filters, since incident volume is low and customers
 * are usually scanning for one specific date range.
 *
 * No emoji anywhere (house style) - status is a plain-text, color-coded badge.
 */

import Link from 'next/link';

export type IncidentEntry = {
  title: string;
  description: string;
  date: string;
  dateRangeImpacted: string;
  datasetsImpacted: string[];
  recoverable: boolean;
  url: string;
};

function StatusBadge({ recoverable }: { recoverable: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        recoverable
          ? 'text-fd-muted-foreground border-fd-border bg-transparent'
          : 'text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-900 dark:bg-red-950/40'
      }`}
    >
      {recoverable ? 'Recovered' : 'Not recoverable'}
    </span>
  );
}

export function IncidentsList({ entries }: { entries: IncidentEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-fd-muted-foreground py-12 text-center not-prose">
        No incidents logged yet.
      </p>
    );
  }

  return (
    <div className="incidents-list not-prose space-y-3">
      {sorted.map((entry) => (
        <Link
          key={entry.url}
          href={entry.url}
          className="block p-4 rounded-xl border bg-transparent hover:border-fd-primary transition no-underline"
        >
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <StatusBadge recoverable={entry.recoverable} />
            <span className="text-xs font-mono text-fd-muted-foreground break-words">
              {entry.dateRangeImpacted}
            </span>
          </div>
          <div className="text-base font-medium text-fd-foreground mb-1 break-words">
            {entry.title}
          </div>
          <p className="text-sm text-fd-muted-foreground mb-2 break-words">
            {entry.description}
          </p>
          {entry.datasetsImpacted.length > 0 && (
            <p className="text-xs text-fd-muted-foreground break-words">
              Datasets affected: {entry.datasetsImpacted.join(', ')}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
