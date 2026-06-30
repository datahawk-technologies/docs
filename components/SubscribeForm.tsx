'use client';

/**
 * SubscribeForm — slim collapsible changelog subscription form.
 *
 * Installed at: components/SubscribeForm.tsx
 *
 * Renders as a single-line "Get changelog updates by email →" banner by default.
 * Clicking expands inline to link to the Google Form used to capture emails.
 *
 * Has id="subscribe" so the sidebar EmailSubscribeButton can target it
 * (either on this page or via navigation from another page using /changelog#subscribe).
 *
 * Spacing:
 *   mt-2  → tight to the page description above
 *   mb-10 → generous breathing room before the first changelog entry
 *
 */

import { useEffect } from 'react';
import { ExternalLink, Mail, Rss } from 'lucide-react';

const DEFAULT_SUBSCRIBE_FORM_URL = 'https://forms.gle/eZRV6oAabAkoByq37';
const subscribeFormUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_SUBSCRIBE_FORM_URL?.trim() ??
  DEFAULT_SUBSCRIBE_FORM_URL;

export function SubscribeForm() {
  useEffect(() => {
    // If the URL has #subscribe (e.g. came from sidebar button on another page),
    // open the details panel so the form is immediately visible.
    if (typeof window !== 'undefined' && window.location.hash === '#subscribe') {
      const details = document.getElementById('subscribe') as HTMLDetailsElement | null;
      if (details) details.open = true;
    }
  }, []);

  return (
    <details id="subscribe" className="subscribe-details not-prose mt-2 mb-16 group">
      <summary
        className="cursor-pointer flex items-center justify-between gap-2 px-4 py-4 rounded-lg border bg-[#faf7ef] hover:opacity-90 transition list-none [&::-webkit-details-marker]:hidden"
      >
        <span className="flex items-center gap-2 text-base font-medium text-[#122c47]">
          <Mail className="size-4 shrink-0" />
          Get changelog updates by email
        </span>
        <span className="text-base text-[#122c47] group-open:rotate-90 transition-transform inline-block">
          →
        </span>
      </summary>

      <div className="px-4 py-4 border border-t-0 rounded-b-lg bg-fd-card/30">
        <p className="text-sm text-fd-foreground mb-3">
          Join the changelog list to receive release updates by email. The form opens in a new tab and saves your email to our subscription list.
        </p>

        <a
          href={subscribeFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-[#0079fe] px-3 py-2 text-sm font-medium text-white no-underline transition hover:bg-[#ffd573] hover:text-[#122c47]"
        >
          Open subscription form
          <ExternalLink className="size-4 shrink-0" />
        </a>

        <p className="mt-3 text-xs text-fd-muted-foreground">
          Prefer an RSS reader?{' '}
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-fd-primary hover:underline"
          >
            <Rss className="size-3 shrink-0" />
            Subscribe via RSS
          </a>
          .
        </p>
      </div>
    </details>
  );
}
