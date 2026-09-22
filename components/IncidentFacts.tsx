/**
 * IncidentFacts — small metadata block shown above an individual incident's
 * MDX body.
 *
 * Installed at: components/IncidentFacts.tsx
 * Used by:      app/incidents/[[...slug]]/page.tsx
 *
 * Server component - no client-side state. Mirrors the fields agreed in the
 * #cs process discussion: date range impacted, datasets impacted, the
 * incident's status, and how severe it was.
 *
 * Layout note: dataset names can be long, unbroken strings (for example
 * REPORT_MARKET_BEST_SELLER_RANK_AND_ESTIMATES_V7). They get their own
 * full-width row, and every cell carries min-w-0 + break-words so a long
 * name wraps inside its own column instead of overlapping the next one.
 */

const STATUS_LABEL: Record<string, string> = {
  'in-progress': 'In progress',
  'resolved-no-data-impact': 'Resolved (no data impact)',
  'resolved-data-unrecoverable': 'Resolved (data unrecoverable)',
};

const STATUS_COLOR: Record<string, string> = {
  'in-progress': 'text-blue-700 dark:text-blue-400',
  'resolved-no-data-impact': 'text-green-700 dark:text-green-400',
  'resolved-data-unrecoverable': 'text-red-600 dark:text-red-400',
};

const SEVERITY_LABEL: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  low: 'Low',
};

export function IncidentFacts({
  dateRangeImpacted,
  datasetsImpacted,
  status,
  severity,
}: {
  dateRangeImpacted: string;
  datasetsImpacted: string[];
  status: string;
  severity: string;
}) {
  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 mb-6 p-4 rounded-xl border bg-fd-card/30">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground mb-1">
          Date range affected
        </div>
        <div className="text-sm text-fd-foreground break-words">{dateRangeImpacted}</div>
      </div>

      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground mb-1">
          Status
        </div>
        <div
          className={`text-sm font-medium break-words ${
            STATUS_COLOR[status] ?? 'text-fd-foreground'
          }`}
        >
          {STATUS_LABEL[status] ?? status}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground mb-1">
          Severity
        </div>
        <div
          className={`text-sm font-medium break-words ${
            severity === 'major' ? 'text-amber-700 dark:text-amber-400' : 'text-fd-foreground'
          }`}
        >
          {SEVERITY_LABEL[severity] ?? severity}
        </div>
      </div>

      {datasetsImpacted.length > 0 && (
        <div className="min-w-0 sm:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground mb-1.5">
            Datasets affected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {datasetsImpacted.map((dataset) => (
              <span
                key={dataset}
                className="max-w-full break-words rounded border border-fd-border px-2 py-0.5 text-xs text-fd-foreground"
              >
                {dataset}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
