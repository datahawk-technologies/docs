'use client';

/**
 * ChangelogList — interactive landing for the per-release changelog.
 *
 * Installed at: components/ChangelogList.tsx
 *
 * Receives entries as a prop from the server component at app/changelog/[[...slug]]/page.tsx,
 * adds client-side filter chips, search, and monthly grouping.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Tag config ───────────────────────────────────────────────────────────
export type Tag =
  | 'new'
  | 'improvement'
  | 'fix'
  | 'breaking'
  | 'maintenance'
  | 'dashboard'
  | 'docs'
  | 'company';

const TAG_META: Record<Tag, { emoji: string; label: string; colour: string }> = {
  new:         { emoji: '✨', label: 'New',         colour: '#0079fe' },
  improvement: { emoji: '🚀', label: 'Improvement', colour: '#20549f' },
  fix:         { emoji: '🐛', label: 'Fix',         colour: '#78b7fc' },
  breaking:    { emoji: '⚠️', label: 'Breaking',    colour: '#dc2626' },
  maintenance: { emoji: '🔧', label: 'Maintenance', colour: '#64748b' },
  dashboard:   { emoji: '📊', label: 'Dashboard',   colour: '#20549f' },
  docs:        { emoji: '📚', label: 'Docs',        colour: '#64748b' },
  company:     { emoji: '🎉', label: 'Company',     colour: '#ffd573' },
};

export type ChangelogEntry = {
  title: string;
  description: string;
  date: string;
  tags: Tag[];
  url: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// ─── Main component ───────────────────────────────────────────────────────
export function ChangelogList({ entries }: { entries: ChangelogEntry[] }) {
  const [activeTag, setActiveTag] = useState<Tag | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (activeTag !== 'all' && !e.tags.includes(activeTag)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !e.title.toLowerCase().includes(q) &&
          !e.description.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [entries, activeTag, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ChangelogEntry[]>();
    filtered.forEach((e) => {
      const key = monthKey(e.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="changelog-list not-prose">
      {/* Search */}
      <input
        type="search"
        placeholder="🔍 Search releases…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg border bg-fd-card text-fd-foreground"
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag('all')}
          className={`px-3 py-1 rounded-full text-sm transition border ${
            activeTag === 'all'
              ? 'bg-fd-primary text-fd-primary-foreground border-fd-primary'
              : 'bg-fd-card hover:bg-fd-accent border-fd-border'
          }`}
        >
          All ({entries.length})
        </button>
        {(Object.keys(TAG_META) as Tag[]).map((tag) => {
          const count = entries.filter((e) => e.tags.includes(tag)).length;
          if (count === 0) return null;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition border ${
                activeTag === tag
                  ? 'bg-fd-primary text-fd-primary-foreground border-fd-primary'
                  : 'bg-fd-card hover:bg-fd-accent border-fd-border'
              }`}
            >
              {TAG_META[tag].emoji} {TAG_META[tag].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {grouped.length === 0 && (
        <p className="text-fd-muted-foreground py-12 text-center">
          No releases match your filter. Try clearing search or selecting a different tag.
        </p>
      )}

      {/* Grouped entries */}
      {grouped.map(([month, entriesInMonth]) => (
        <section key={month} className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground mb-3">
            {month}
          </h2>
          <div className="space-y-3">
            {entriesInMonth.map((entry) => (
              <Link
                key={entry.url}
                href={entry.url}
                className="block p-5 rounded-xl border bg-fd-card hover:border-fd-primary transition no-underline"
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${TAG_META[t].colour}22`,
                          color: TAG_META[t].colour,
                        }}
                      >
                        {TAG_META[t].emoji} {TAG_META[t].label}
                      </span>
                    ))}
                  </div>
                  <time className="text-xs text-fd-muted-foreground font-mono">
                    {formatDate(entry.date)}
                  </time>
                </div>

                <h3 className="text-lg font-semibold mb-1 text-fd-foreground">{entry.title}</h3>
                <p className="text-sm text-fd-muted-foreground mb-2">{entry.description}</p>

                <div className="text-sm text-fd-primary">Read more →</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
