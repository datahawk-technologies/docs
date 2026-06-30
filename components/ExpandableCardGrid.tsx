'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Children,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ExpandableCardGridProps = {
  children: ReactNode;
  initialVisible?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
  className?: string;
};

function isRenderableChild(child: ReactNode) {
  if (child === null || child === undefined || typeof child === 'boolean') {
    return false;
  }

  return !(typeof child === 'string' && child.trim() === '');
}

export function ExpandableCardGrid({
  children,
  initialVisible = 9,
  showMoreLabel,
  showLessLabel = 'Show fewer',
  className,
}: ExpandableCardGridProps) {
  const gridId = useId();
  const [expanded, setExpanded] = useState(false);
  const items = useMemo(
    () => Children.toArray(children).filter(isRenderableChild),
    [children],
  );
  const visibleLimit = Math.max(1, Math.floor(initialVisible));
  const hasHiddenItems = items.length > visibleLimit;
  const hiddenCount = Math.max(0, items.length - visibleLimit);
  const visibleItems = expanded || !hasHiddenItems
    ? items
    : items.slice(0, visibleLimit);
  const buttonLabel = expanded
    ? showLessLabel
    : (showMoreLabel ?? `See ${hiddenCount} more`);

  return (
    <div className="expandable-card-grid">
      <div
        id={gridId}
        className={`card-grid${className ? ` ${className}` : ''}`}
      >
        {visibleItems}
      </div>

      {hasHiddenItems && (
        <div className="expandable-card-grid__actions">
          <button
            type="button"
            className="expandable-card-grid__button"
            aria-expanded={expanded}
            aria-controls={gridId}
            onClick={() => setExpanded((current) => !current)}
          >
            <span>{buttonLabel}</span>
            {expanded ? (
              <ChevronUp aria-hidden="true" className="size-4" />
            ) : (
              <ChevronDown aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
