'use client';

/**
 * PageFeedback — "Last updated" timestamp + "Was this page helpful?" widget.
 *
 * Installed at: components/PageFeedback.tsx
 *
 * Usage in MDX (registered globally in mdx-components.tsx):
 *   <PageFeedback lastUpdated="2026-06-17" />
 *
 * Behavior:
 *   - Shows "Last updated: Mon DD, YYYY" in muted text
 *   - Two thumb buttons (👍 / 👎) for feedback
 *   - Click → state persists in localStorage per-page-URL
 *   - On 👎, optional text field for "What's missing?"
 *   - After submit, shows "Thanks for your feedback!"
 *
 * Backend: POSTs each vote to /api/feedback (fire-and-forget). That route
 * fans out to Slack #docs-gaps (on 👎 only) and PostHog (every vote).
 * localStorage still tracks local-browser state so a returning visitor
 * doesn't re-vote on the same page.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Rating = 'up' | 'down' | null;

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function PageFeedback({ lastUpdated }: { lastUpdated?: string }) {
  const pathname = usePathname();
  const storageKey = `pagefeedback:${pathname}`;
  const [rating, setRating] = useState<Rating>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Restore previous vote if user already voted on this page.
  // Reading localStorage in useEffect is the correct hydration-safe pattern:
  // we can't read it during render (SSR has no localStorage) or in a useState
  // initializer (same reason). The "set state in effect" lint rule fires
  // because of the three setState calls, but they're batched by React 18+
  // into a single render — this is legitimate one-time hydration sync.
  useEffect(() => {
    try {
      const prior = localStorage.getItem(storageKey);
      if (prior) {
        const parsed = JSON.parse(prior);
        if (parsed.rating === 'up' || parsed.rating === 'down') {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRating(parsed.rating);
          setSubmitted(true);
          setShowThanks(true);
        }
      }
    } catch {}
  }, [storageKey]);

  // Persist locally so a returning visitor doesn't re-vote on the same page.
  function persistLocal(r: Rating, c: string = '') {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ rating: r, comment: c, ts: Date.now() }),
      );
    } catch {}
  }

  // Fire-and-forget POST to /api/feedback. Called exactly once per vote so
  // Slack/PostHog don't see duplicate events for a single user action.
  function dispatchFeedback(r: Rating, c: string = '') {
    if (!r) return;
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: r,
        page: pathname,
        ...(c ? { comment: c } : {}),
      }),
      keepalive: true, // survive navigation away mid-request
    }).catch(() => {
      // Silently swallow — the user already saw their click registered locally.
    });
  }

  function handleVote(r: Rating) {
    setRating(r);
    persistLocal(r);
    if (r === 'up') {
      // 👍 has no follow-up step — dispatch immediately.
      dispatchFeedback('up');
      setShowThanks(true);
      setSubmitted(true);
    } else {
      // 👎 waits for the optional comment so Slack/PostHog receive one event.
      setShowThanks(false);
    }
  }

  function handleSubmitComment() {
    persistLocal(rating, comment);
    dispatchFeedback(rating, comment);
    setShowThanks(true);
    setSubmitted(true);
  }

  function handleSkipComment() {
    // User declined the comment — still send the 👎 so Slack hears about it.
    dispatchFeedback(rating);
    setShowThanks(true);
    setSubmitted(true);
  }

  return (
    <aside
      className="not-prose mt-12 pt-6 border-t border-fd-border flex flex-col gap-4 text-sm"
      aria-label="Page feedback"
    >
      {lastUpdated && (
        <div className="text-xs text-fd-muted-foreground">
          Last updated: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </div>
      )}

      {!submitted && (
        <div className="flex items-center gap-3">
          <span className="text-fd-foreground font-medium">Was this page helpful?</span>
          <button
            type="button"
            onClick={() => handleVote('up')}
            aria-label="Yes, this page was helpful"
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              rating === 'up'
                ? 'bg-fd-accent border-fd-primary'
                : 'bg-transparent hover:bg-fd-accent border-fd-border'
            }`}
          >
            👍 Yes
          </button>
          <button
            type="button"
            onClick={() => handleVote('down')}
            aria-label="No, this page was not helpful"
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              rating === 'down'
                ? 'bg-fd-accent border-fd-primary'
                : 'bg-transparent hover:bg-fd-accent border-fd-border'
            }`}
          >
            👎 No
          </button>
        </div>
      )}

      {rating === 'down' && !showThanks && (
        <div className="flex flex-col gap-2">
          <label htmlFor="feedback-comment" className="text-sm text-fd-muted-foreground">
            What was missing or unclear? (optional)
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Help us improve this page…"
            className="w-full p-2 rounded-lg border bg-transparent text-fd-foreground text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmitComment}
              className="px-3 py-1.5 rounded-lg bg-fd-primary text-fd-primary-foreground text-sm hover:opacity-90"
            >
              Send feedback
            </button>
            <button
              type="button"
              onClick={handleSkipComment}
              className="px-3 py-1.5 rounded-lg border text-sm hover:bg-fd-accent border-fd-border"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {showThanks && (
        <div className="text-sm text-fd-muted-foreground italic">
          Thanks for your feedback. {rating === 'down' && 'We\'ll review and improve this page.'}
        </div>
      )}
    </aside>
  );
}
