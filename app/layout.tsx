/* ════════════════════════════════════════════════════════════════
   DataHawk Documentation — Root Layout
   ════════════════════════════════════════════════════════════════
   
   This file wraps EVERY page on your docs site. Anything you put
   here applies globally: fonts, theme settings, page-wide CSS, etc.
   
   WHAT THIS FILE CURRENTLY DOES:
   1. Loads Poppins from Google Fonts and applies it to all text
   2. Disables dark mode (light mode only — no theme toggle)
   3. Sets up Fumadocs' shared providers for search, navigation, etc.
   
   WHEN TO EDIT THIS FILE:
   - Switching fonts        → change the Poppins import
   - Re-enabling dark mode  → flip 'enabled: false' to 'enabled: true'
   - Adding analytics       → add the script inside <body>
   - Adding meta tags       → add to <head> (not shown by default)
   ════════════════════════════════════════════════════════════════ */


/* ─── 1. IMPORTS ───────────────────────────────────────────────── */

// Pulls in your global CSS file (the one with all the color variables).
// Don't remove — without this, none of your brand colors would apply.
import './global.css';

// React type — just used for typing the props of the Layout component.
import type { ReactNode } from 'react';

// Next.js's built-in Google Fonts loader.
// To switch fonts: replace { Poppins } below with another font name
// from https://fonts.google.com — e.g. { Inter }, { Roboto }, { Geist }.
import { Poppins } from 'next/font/google';

// Fumadocs' provider — wires up theme switching, search, etc.
// Required wrapper around your page content.
import { RootProvider } from 'fumadocs-ui/provider/next';


/* ─── 2. FONT CONFIGURATION ────────────────────────────────────── */

const poppins = Poppins({
  // Which character sets to download.
  // 'latin' covers most Western European languages.
  // Add 'latin-ext' if you need extra accented characters (Ł, Ç, etc.)
  subsets: ['latin'],

  // Which font weights to load. Each weight is a separate file download.
  // 400 = regular, 500 = medium, 600 = semibold, 700 = bold.
  // Adding more weights makes pages slightly slower to load.
  weight: ['400', '500', '600', '700'],

  // CSS variable name. Lets you use Poppins from CSS too
  // (e.g., font-family: var(--font-poppins)).
  variable: '--font-poppins',
});


/* ─── 3. LAYOUT COMPONENT ──────────────────────────────────────── */

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"                          // Language of the site (for SEO + accessibility)
      className={poppins.className}      // Applies Poppins to the entire site
      suppressHydrationWarning            // Suppresses a harmless React warning about theme classes
    >
      <body className="flex flex-col min-h-screen">
        {/* ─── 4. FUMADOCS PROVIDER ──────────────────────────────
            Wraps your content with Fumadocs' shared features:
            - Theme handling (enabled/disabled below)
            - Search context
            - Navigation state
            
            The 'theme' prop controls dark mode behavior:
            
            CURRENT SETTING — dark mode is DISABLED:
              theme={{ enabled: false }}
            
            TO RE-ENABLE DARK MODE LATER:
              theme={{ enabled: true }}
              (and add back the .dark blocks in global.css)
            
            TO FORCE A SPECIFIC THEME PERMANENTLY:
              theme={{ forcedTheme: 'light' }}  // or 'dark'
            
            TO ALLOW USER CHOICE BUT DEFAULT TO LIGHT:
              theme={{ defaultTheme: 'light', enableSystem: false }}
            ──────────────────────────────────────────────────── */}
        <RootProvider
          theme={{
            enabled: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}