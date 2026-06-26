'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type ImageCarouselItem = {
  src: string;
  alt: string;
  caption?: ReactNode;
};

export type ImageCarouselProps = {
  images?: ImageCarouselItem[];
  label?: string;
  aspectRatio?: string;
  className?: string;
};

function isGif(src: string) {
  return src.split('?')[0].toLowerCase().endsWith('.gif');
}

export function ImageCarousel({
  images = [],
  label = 'Image carousel',
  aspectRatio = '16 / 9',
  className,
}: ImageCarouselProps) {
  const headingId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(
    () => images.filter((image) => Boolean(image?.src)),
    [images],
  );
  const count = items.length;
  const safeIndex = count === 0 ? 0 : Math.min(activeIndex, count - 1);
  const current = items[safeIndex];
  const hasMultiple = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!hasMultiple) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(safeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(safeIndex + 1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  if (!current) return null;

  return (
    <figure
      aria-labelledby={headingId}
      className={`not-prose my-8 overflow-hidden rounded-lg border border-fd-border bg-fd-card shadow-sm ${
        className ?? ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={hasMultiple ? 0 : undefined}
    >
      <span id={headingId} className="sr-only">
        {label}
      </span>

      <div
        className="relative overflow-hidden border-b border-fd-border bg-fd-muted/30"
        style={{ aspectRatio }}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain p-2"
          unoptimized={isGif(current.src)}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Show previous image"
              title="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-fd-border bg-fd-background/90 text-fd-foreground shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
              onClick={() => goTo(safeIndex - 1)}
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Show next image"
              title="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-fd-border bg-fd-background/90 text-fd-foreground shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
              onClick={() => goTo(safeIndex + 1)}
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {(current.caption || hasMultiple) && (
        <figcaption className="flex flex-col gap-3 px-4 py-3 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          {current.caption ? (
            <span className="text-fd-foreground">{current.caption}</span>
          ) : (
            <span className="sr-only">Carousel position</span>
          )}

          {hasMultiple && (
            <span className="shrink-0 text-xs">
              {safeIndex + 1} of {count}
            </span>
          )}
        </figcaption>
      )}

      {hasMultiple && (
        <div
          aria-label="Choose image"
          className="flex items-center justify-center gap-2 px-4 pb-4"
        >
          {items.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${count}`}
              aria-current={index === safeIndex ? 'true' : undefined}
              title={`Image ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-fd-border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary ${
                index === safeIndex ? 'bg-fd-primary' : 'bg-fd-muted'
              }`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </figure>
  );
}
