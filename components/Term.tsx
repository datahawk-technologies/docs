'use client';

/**
 * Term — inline glossary tooltip component.
 *
 * Installed at: components/Term.tsx
 *
 * Usage in MDX:
 *   The <Term>ASIN</Term> for this product is B0FB7PW98Q.        ← plain
 *   The **<Term>ASIN</Term>** is in column A.                    ← bold around Term
 *   The <Term>**ASIN**</Term> in your CSV...                     ← bold inside Term (also works)
 *   <Term name="ASIN">ASIN's</Term> sales history...             ← custom display vs key
 *
 * Behavior:
 *   - If term exists in glossary.ts: dotted-underline + tooltip on hover/focus/tap
 *   - If not found: renders children as plain text (no decoration)
 *   - Tooltip renders via a React Portal at <body> level. This is what
 *     lets the bubble escape ANY ancestor's overflow/clip context — Tabs,
 *     Accordions, code blocks, etc. Without portaling, the tooltip would
 *     get clipped at the first ancestor with overflow:hidden.
 *
 * Registered globally in mdx-components.tsx, no MDX import needed.
 */

import {
  useState,
  useId,
  useRef,
  useEffect,
  useLayoutEffect,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { glossary } from '@/lib/glossary';

// How long to keep the tooltip alive after the cursor leaves either the
// term or the tooltip body. Lets the cursor cross the visible gap between
// the two without the tooltip closing prematurely.
const CLOSE_DELAY_MS = 200;

// Width of the tooltip in px — must match Tailwind w-72 (288px) below.
const TOOLTIP_WIDTH_PX = 288;

// Vertical gap between the term and the tooltip body.
const TOOLTIP_GAP_PX = 8;

// useLayoutEffect logs a warning when run on the server. Use the effect
// only on the client so SSR stays quiet.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Walk through nested ReactNodes and pull all the text out.
// Lets us wrap <Term>**ASIN**</Term> and still find "ASIN" inside the <strong>.
function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement(node)) {
    const props = (node as ReactElement<{ children?: ReactNode }>).props;
    if (props?.children !== undefined) return extractText(props.children);
  }
  return '';
}

type TooltipPos = { top: number; left: number; arrowOffset: number };

export function Term({
  name,
  children,
}: {
  name?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel a pending close — called when cursor re-enters the term OR
  // enters the tooltip body. Keeps the tooltip visible while the user
  // is still in either zone (term, visible gap, or tooltip).
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Schedule a delayed close. The delay is the grace period during which
  // the user can move from the term to the tooltip without it disappearing.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  // Open immediately and cancel any pending close (cursor came back).
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  // Clean up the timer when the component unmounts.
  useEffect(() => {
    return () => cancelClose();
  }, []);

  // Position the tooltip relative to the trigger. Tries to center horizontally
  // above the term; clamps to the viewport so the bubble never overflows the
  // screen edges. Arrow tracks the term's center even when the bubble is
  // shifted to stay on-screen.
  const updatePos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportW = window.innerWidth;

    const desiredLeft = rect.left + rect.width / 2 - TOOLTIP_WIDTH_PX / 2;
    const minLeft = 8; // 8px from left edge
    const maxLeft = viewportW - TOOLTIP_WIDTH_PX - 8; // 8px from right edge
    const left = Math.max(minLeft, Math.min(desiredLeft, maxLeft));

    // Center of the term, in viewport coords — used for the arrow.
    const termCenter = rect.left + rect.width / 2;
    const arrowOffset = termCenter - left; // px from tooltip's left edge

    setPos({
      top: rect.top - TOOLTIP_GAP_PX, // tooltip's bottom edge sits 8px above term top
      left,
      arrowOffset,
    });
  };

  // Recompute position whenever the tooltip opens, the viewport changes, or
  // the page scrolls. Without this, scrolling would leave the bubble floating
  // in place while the term scrolls away.
  useIsoLayoutEffect(() => {
    if (!open) return;
    updatePos();
    const handler = () => updatePos();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [open]);

  // Resolve the lookup key:
  //   1. `name` prop if provided (lets display text differ from glossary key)
  //   2. Otherwise extract text from children, including from nested elements
  //      like <strong>, <em>, etc.
  const lookupKey = (name || extractText(children)).toUpperCase().trim();

  const def = glossary[lookupKey];

  // Term not in glossary → render children as plain text, no decoration
  if (!def) return <>{children}</>;

  // Anchor for "Read more" link in the full glossary
  const anchorId = lookupKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // "Read more" destination. Foundational concepts (ASIN, SKU, BSR, etc.)
  // override this via `def.readMore` to point at their richer Key Concepts
  // entry rather than the glossary's one-line definition.
  const readMoreHref =
    def.readMore ?? `/help-center/glossary#${anchorId}`;
  const readMoreLabel = def.readMore
    ? 'Read more →'
    : 'Read more in glossary →';

  // Portal target — only available on the client.
  const portalTarget =
    typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block border-b border-dotted border-fd-muted-foreground/60 cursor-help"
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        onFocus={openNow}
        onBlur={scheduleClose}
        tabIndex={0}
        aria-describedby={open ? id : undefined}
      >
        {children}
      </span>

      {open && pos && portalTarget &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            // position:fixed + computed top/left lets the tooltip escape any
            // ancestor's overflow context (Tabs, Accordions, code blocks…).
            // The pb-2/-mb-2 trick extends the hover hit area down into the
            // visible gap so the cursor can traverse without closing.
            className="fixed z-[9999] pb-2 -mb-2 text-sm font-normal text-fd-foreground pointer-events-auto"
            style={{
              top: pos.top, // tooltip's bottom edge anchored here via translateY below
              left: pos.left,
              width: TOOLTIP_WIDTH_PX,
              transform: 'translateY(-100%)', // shift up so the bubble sits ABOVE the term
            }}
          >
            <span className="block p-3 rounded-lg border bg-fd-card shadow-lg">
              <strong className="block mb-1 text-fd-foreground font-semibold">
                {def.title}
              </strong>
              <span className="block text-fd-muted-foreground leading-snug">
                {def.short}
              </span>
              <a
                href={readMoreHref}
                className="block mt-2 text-fd-primary hover:underline text-xs no-underline"
              >
                {readMoreLabel}
              </a>
            </span>

            {/* Arrow pointing down to the term — tracks the term's center
                even when the bubble is shifted to stay on-screen. */}
            <span
              aria-hidden="true"
              className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-fd-card"
              style={{
                bottom: '0.5rem',
                left: pos.arrowOffset - 6, // 6px = half of the 12px arrow width
              }}
            />
          </span>,
          portalTarget,
        )}
    </>
  );
}
