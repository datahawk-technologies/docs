/**
 * IncidentStatusBanner — overall status shown above the incidents list.
 *
 * Installed at: components/IncidentStatusBanner.tsx
 * Used by:      app/incidents/[[...slug]]/page.tsx (landing view only)
 *
 * Answers one question in one glance: is something wrong right now?
 *
 * The state is derived, never hand-maintained. It counts entries whose
 * frontmatter says `status: "in-progress"`, so the banner cannot drift out of
 * sync with the list underneath it — the same field drives both. Opening an
 * incident is therefore the existing workflow: publish the entry with
 * `status: "in-progress"` (writing-rules section 3) and the banner follows on
 * the next build.
 *
 * Wording note: this page knows what we have logged, not live platform health.
 * "No incidents in progress" is a claim we can hold; "all systems operational"
 * would not be, since it would read as reassurance during anything we have not
 * written up yet.
 *
 * Colors follow the convention set in IncidentsList: blue for in-progress,
 * green for resolved. Red stays reserved for permanently lost data, and amber
 * for major severity, so neither signal gets blunted here. No emoji.
 *
 * The open-incident list is built from divs carrying list roles rather than a
 * <ul>: global.css styles `article .prose ul` with disc markers and a 3rem
 * indent, and that selector outranks Tailwind's list-none even under not-prose.
 */

import Link from 'next/link';
import type { IncidentEntry } from './IncidentsList';

// Parsed by hand rather than via `new Date(iso)`: the frontmatter dates are
// bare "YYYY-MM-DD", which Date reads as UTC midnight and can render as the
// previous day once a locale offset is applied.
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return iso;
  return `${name} ${Number(day)}, ${year}`;
}

function byDateDesc(a: IncidentEntry, b: IncidentEntry) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function StatusDot({ tone }: { tone: 'green' | 'blue' }) {
  const color = tone === 'green' ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-400';
  return (
    <span
      aria-hidden="true"
      className={`mt-1.5 size-2.5 shrink-0 rounded-full ${color}`}
    />
  );
}

export function IncidentStatusBanner({ entries }: { entries: IncidentEntry[] }) {
  const open = entries.filter((e) => e.status === 'in-progress').sort(byDateDesc);

  // ─── Something is open ────────────────────────────────────────────────
  if (open.length > 0) {
    return (
      <div
        role="status"
        className="not-prose mb-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40"
      >
        <StatusDot tone="blue" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            {open.length === 1
              ? '1 incident in progress'
              : `${open.length} incidents in progress`}
          </p>
          <div role="list" className="mt-2 space-y-1.5">
            {open.map((entry) => (
              <div role="listitem" key={entry.url} className="min-w-0 text-sm">
                <Link
                  href={entry.url}
                  className="font-medium text-blue-900 underline underline-offset-2 hover:no-underline dark:text-blue-200"
                >
                  {entry.title}
                </Link>
                {entry.dateRangeImpacted && (
                  <span className="ml-2 font-mono text-xs text-blue-800/80 dark:text-blue-300/80">
                    {entry.dateRangeImpacted}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── All clear ────────────────────────────────────────────────────────
  const latest = [...entries].sort(byDateDesc)[0];

  return (
    <div
      role="status"
      className="not-prose mb-8 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40"
    >
      <StatusDot tone="green" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-green-900 dark:text-green-200">
          No incidents in progress
        </p>
        {latest ? (
          <p className="mt-1 text-sm text-green-900/80 dark:text-green-200/75">
            Everything we have logged has been resolved. Most recent:{' '}
            <Link
              href={latest.url}
              className="underline underline-offset-2 hover:no-underline"
            >
              {formatDate(latest.date)}
            </Link>
            .
          </p>
        ) : (
          <p className="mt-1 text-sm text-green-900/80 dark:text-green-200/75">
            No incidents have been logged yet.
          </p>
        )}
      </div>
    </div>
  );
}
