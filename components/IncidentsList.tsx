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
 * No emoji anywhere (house style) - status and severity are plain-text,
 * color-coded badges.
 */

import Link from 'next/link';

export type Severity = 'low' | 'minor' | 'major';

export type IncidentStatus =
  | 'in-progress'
  | 'resolved-no-data-impact'
  | 'resolved-data-unrecoverable';

export type IncidentEntry = {
  title: string;
  description: string;
  date: string;
  dateRangeImpacted: string;
  datasetsImpacted: string[];
  status: IncidentStatus;
  severity: Severity;
  url: string;
};

const STATUS_STYLE: Record<IncidentStatus, string> = {
  'in-progress':
    'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:bg-blue-950/40',
  'resolved-no-data-impact':
    'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-900 dark:bg-green-950/40',
  'resolved-data-unrecoverable':
    'text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-900 dark:bg-red-950/40',
};

export const STATUS_LABEL: Record<IncidentStatus, string> = {
  'in-progress': 'In progress',
  'resolved-no-data-impact': 'Resolved (no data impact)',
  'resolved-data-unrecoverable': 'Resolved (data unrecoverable)',
};

function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

// Severity deliberately avoids red — red means "your data is gone" on this page,
// and two competing reds would blunt that signal.
const SEVERITY_STYLE: Record<Severity, string> = {
  major: 'text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-900 dark:bg-amber-950/40',
  minor: 'text-slate-700 border-slate-200 bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900/40',
  low: 'text-fd-muted-foreground border-fd-border bg-transparent',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  major: 'Major impact',
  minor: 'Minor impact',
  low: 'Low impact',
};

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_STYLE[severity]}`}
    >
      {SEVERITY_LABEL[severity]}
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
            <StatusBadge status={entry.status} />
            <SeverityBadge severity={entry.severity} />
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
