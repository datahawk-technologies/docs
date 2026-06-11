'use client';

/**
 * EmailSubscribeButton — sidebar button that targets the top SubscribeForm.
 *
 * Installed at: components/EmailSubscribeButton.tsx
 * Used by:      components/ChangelogSidebar.tsx
 *
 * Behavior:
 *   - On the /changelog landing page (where SubscribeForm renders):
 *     opens the <details id="subscribe"> panel and scrolls to it.
 *   - On any other page in the changelog tab (individual release pages):
 *     navigates to /changelog#subscribe — the SubscribeForm's useEffect
 *     auto-opens the panel on mount.
 *
 * Single source of truth: the actual HubSpot form is only embedded once,
 * in SubscribeForm at the top of the changelog landing.
 */

import { useRouter, usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';

export function EmailSubscribeButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const details = document.getElementById('subscribe') as HTMLDetailsElement | null;

    if (details) {
      // SubscribeForm is on this page — open + scroll to it
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Not on the landing — navigate to /changelog#subscribe
      // The SubscribeForm's useEffect will pick up the hash and auto-open
      router.push('/changelog#subscribe');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-fd-accent transition text-sm font-medium text-fd-primary text-left"
    >
      <Mail className="size-4 shrink-0" />
      Subscribe by email
    </button>
  );
}
