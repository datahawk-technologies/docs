/**
 * Read a file's last-commit date from git, with a filesystem mtime fallback.
 *
 * Used by the catchall page.tsx files to feed `<PageFeedback lastUpdated=...>`
 * automatically — authors never write `lastUpdated` in frontmatter.
 *
 * Returns: ISO date string (YYYY-MM-DD), or '' if neither lookup works.
 *
 * Notes:
 *   - Runs at build time during static generation; not on user requests.
 *   - In-process cache prevents repeated git invocations for the same file.
 *   - On Vercel, the deploy must have `git fetch --unshallow` history or the
 *     last commit will be the deploy commit. The `vercel.json` doesn't need
 *     changes for this to work — Vercel keeps the latest commit by default.
 */

import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';

const cache = new Map<string, string>();

export function getLastModified(absPath: string): string {
  const cached = cache.get(absPath);
  if (cached !== undefined) return cached;

  let date = '';

  // Primary: last commit that touched this file
  try {
    const stdout = execSync(`git log -1 --format=%cs -- "${absPath}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    date = stdout.trim();
  } catch {
    // git not available, file untracked, or shallow clone — fall through
  }

  // Fallback: filesystem mtime
  if (!date) {
    try {
      const stat = statSync(absPath);
      date = stat.mtime.toISOString().slice(0, 10);
    } catch {
      // file doesn't exist — give up
    }
  }

  cache.set(absPath, date);
  return date;
}
