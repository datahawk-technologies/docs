import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/* ════════════════════════════════════════════════════════════════
   DataHawk Documentation — Shared Top-Row Navbar
   ════════════════════════════════════════════════════════════════
   
   This file controls ONLY the TOP-row navbar:
   - Logo + brand text (left)
   - Search bar (auto-inserted by Fumadocs)
   - Contact + Dashboard buttons (right)
   
   The SECTION TABS (Getting Started, Help Center, etc.) are in
   the SECOND row, configured in app/docs/layout.tsx.
   ════════════════════════════════════════════════════════════════ */

export function baseOptions(): BaseLayoutProps {
  return {

    /* ─── BRAND / LOGO ─────────────────────────────────────────
       What appears at top-left of every page.
       
       To change the logo: replace public/DataHawk-favicon.svg
       To resize the logo: change width and height (try 24, 28, 32)
       To change brand text: edit the <span> below            */
    nav: {
      title: (
        <>
          <Image
            src="/logo.svg"
            alt="DataHawk"
            width={28}
            height={28}
            priority
          />
          <span style={{ fontWeight: 600 }}>DataHawk</span>
        </>
      ),
      url: '/',
    },

    /* ─── TOP-RIGHT CONTACT BUTTONS ────────────────────────────
       Buttons that appear in the top-right of the navbar.
       
       To change Contact destination:
       - mailto:  use 'mailto:support@datahawk.co'
       - URL:     use 'https://datahawk.co/contact'
       
       To add another button:
       - Add a new { text, url, external } entry to the array  */
    links: [
      {
        text: 'DataHawk App',
        url: 'https://analytics.datahawk.co/',
        external: true,
      },
    ],
    themeSwitch: {
      enabled: false,
    },
  };
}
