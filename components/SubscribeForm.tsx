'use client';

/**
 * SubscribeForm — slim collapsible HubSpot changelog subscription form.
 *
 * Installed at: components/SubscribeForm.tsx
 *
 * Renders as a single-line "Get changelog updates by email →" banner by default.
 * Clicking expands inline to reveal the HubSpot embedded form.
 *
 * Has id="subscribe" so the sidebar EmailSubscribeButton can target it
 * (either on this page or via navigation from another page using /changelog#subscribe).
 *
 * Spacing:
 *   mt-2  → tight to the page description above
 *   mb-10 → generous breathing room before the first changelog entry
 *
 * Colors:
 *   Summary banner: bg-[#78b7fc] (light blue brand color)
 *   Hover: opacity-90 (subtle darken)
 */

import { useEffect } from 'react';

const HUBSPOT_SCRIPT_SRC = 'https://js.hsforms.net/forms/embed/50340972.js';

export function SubscribeForm() {
  useEffect(() => {
    // Load the HubSpot script once
    const existing = document.querySelector(`script[src="${HUBSPOT_SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = HUBSPOT_SCRIPT_SRC;
      script.defer = true;
      document.body.appendChild(script);
    }

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
        <span className="text-base font-medium text-[#122c47]">
          📧 Get changelog updates by email
        </span>
        <span className="text-base text-[#122c47] group-open:rotate-90 transition-transform inline-block">
          →
        </span>
      </summary>

      <div className="px-4 py-4 border border-t-0 rounded-b-lg bg-fd-card/30">
        <p className="text-xs text-fd-muted-foreground mb-3">
          We only email when something ships. Unsubscribe anytime. Prefer an RSS reader?{' '}
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary hover:underline"
          >
            Subscribe via RSS
          </a>{' '}
          instead.
        </p>

        {/* HubSpot's v3 script auto-mounts the form into this div */}
        <div
          className="hs-form-frame"
          data-region="na1"
          data-form-id="3622c567-28f3-4045-95f5-1ac0cda13187"
          data-portal-id="50340972"
        />
      </div>
    </details>
  );
}
