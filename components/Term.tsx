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
 *
 * Registered globally in mdx-components.tsx, no MDX import needed.
 */

import {
  useState,
  useId,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import { glossary } from '@/lib/glossary';

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

export function Term({
  name,
  children,
}: {
  name?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

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

  return (
    <span
      className="relative inline-block border-b border-dotted border-fd-muted-foreground/60 cursor-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? id : undefined}
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 p-3 rounded-lg border bg-fd-card shadow-lg text-sm font-normal text-fd-foreground"
        >
          <strong className="block mb-1 text-fd-foreground font-semibold">
            {def.title}
          </strong>
          <span className="block text-fd-muted-foreground leading-snug">
            {def.short}
          </span>
          <a
            href={`/help-center/knowledge-hub/glossary#${anchorId}`}
            className="block mt-2 text-fd-primary hover:underline text-xs no-underline"
          >
            Read more in glossary →
          </a>

          {/* Arrow pointing down to the term */}
          <span
            aria-hidden="true"
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-fd-card"
          />
        </span>
      )}
    </span>
  );
}
