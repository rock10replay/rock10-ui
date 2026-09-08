import { useEffect, useRef, useState, CSSProperties, KeyboardEvent } from 'react';
import { cn } from '../utils/cn';

export interface SponsorItem {
  id?: string | number;
  imageUrl: string;
  alt?: string;
  title?: string;
  linkUrl?: string;
  displayDurationMs?: number;
}

export interface SponsorCarouselProps {
  items: (string | SponsorItem)[];
  intervalMs?: number;
  height?: number | string;
  autoplay?: boolean;
  onItemClick?: (item: SponsorItem | string, index: number) => void;
  badgeText?: string | ((item: SponsorItem | string) => string);
  className?: string;
}

export function SponsorCarousel({
  items,
  intervalMs = 5000,
  height = 90,
  autoplay = true,
  onItemClick,
  badgeText,
  className,
}: SponsorCarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const normalizedItems: SponsorItem[] = items.map((it, idx) => {
    if (typeof it === 'string') {
      return { id: idx, imageUrl: it, alt: `Patrocinador ${idx + 1}` };
    }
    return it;
  });

  const currentItem = normalizedItems[current];

  // Ciclo automático com suporte a tempo customizado por item
  useEffect(() => {
    if (!autoplay || normalizedItems.length <= 1) return;

    const delay = currentItem?.displayDurationMs && currentItem.displayDurationMs > 0
      ? currentItem.displayDurationMs
      : intervalMs;

    timerRef.current = window.setTimeout(() => {
      setCurrent((prev) => (prev + 1) % normalizedItems.length);
    }, delay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [current, autoplay, normalizedItems.length, currentItem?.displayDurationMs, intervalMs]);

  if (!normalizedItems || normalizedItems.length === 0) return null;

  const rawCurrent = items[current];

  const handleClick = () => {
    if (onItemClick) {
      onItemClick(rawCurrent, current);
    } else if (currentItem?.linkUrl) {
      window.open(currentItem.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const resolvedBadge = typeof badgeText === 'function'
    ? badgeText(rawCurrent)
    : badgeText || currentItem?.title;

  const heightStyle: CSSProperties = typeof height === 'number'
    ? { height: `${height}px` }
    : { height };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={heightStyle}
      aria-label={currentItem?.title || currentItem?.alt || 'Patrocinadores'}
      className={cn(
        'relative w-full flex justify-center items-center overflow-hidden p-2 sm:p-4 box-border cursor-pointer group select-none',
        className
      )}
    >
      {normalizedItems.map((item, idx) => (
        <div
          key={item.id ?? item.imageUrl + idx}
          className={cn(
            'absolute inset-0 flex justify-center items-center opacity-0 scale-95 transition-all duration-500 ease-in-out pointer-events-none',
            idx === current && 'opacity-100 scale-100'
          )}
          aria-hidden={idx !== current}
        >
          <img
            src={item.imageUrl}
            alt={item.alt || item.title || `Patrocinador ${idx + 1}`}
            className="max-h-full max-w-[85%] sm:max-w-[65%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] select-none"
            loading="lazy"
          />
        </div>
      ))}

      {/* Badge discreto */}
      {resolvedBadge && (
        <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] sm:text-[10px] text-white/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {resolvedBadge}
        </div>
      )}
    </div>
  );
}

export default SponsorCarousel;
