/**
 * IncidentFacts — small metadata block shown above an individual incident's
 * MDX body.
 *
 * Installed at: components/IncidentFacts.tsx
 * Used by:      app/incidents/[[...slug]]/page.tsx
 *
 * Server component - no client-side state. Mirrors the fields agreed in the
 * #cs process discussion: date range impacted, datasets impacted, and
 * whether the affected data was recoverable.
 *
 * Layout note: dataset names can be long, unbroken strings (for example
 * REPORT_MARKET_BEST_SELLER_RANK_AND_ESTIMATES_V7). They get their own
 * full-width row, and every cell carries min-w-0 + break-words so a long
 * name wraps inside its own column instead of overlapping the next one.
 */

export function IncidentFacts({
  dateRangeImpacted,
  datasetsImpacted,
  recoverable,
}: {
  dateRangeImpacted: string;
  datasetsImpacted: string[];
  recoverable: boolean;
}) {
  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6 p-4 rounded-xl border bg-fd-card/30">
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
            recoverable
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {recoverable ? 'Data recovered' : 'Data not recoverable'}
        </div>
      </div>

      {datasetsImpacted.length > 0 && (
        <div className="min-w-0 sm:col-span-2">
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
