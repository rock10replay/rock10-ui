import { useState, useEffect, ReactNode } from 'react';
import { MapPin, Trophy, Share2, Check, Map } from 'lucide-react';
import { cn } from '../utils/cn';
import type { ArenaData } from './ArenaCard';

export interface ArenaProfileHeaderProps {
  arena: ArenaData;
  activeCourtsCount?: number;
  instagramUrl?: string;
  mapsUrl?: string;
  onShare?: () => void;
  shareCopied?: boolean;
  extraActions?: ReactNode;
  fallbackImage?: string;
  className?: string;
}

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
];

export function ArenaProfileHeader({
  arena,
  activeCourtsCount,
  instagramUrl,
  mapsUrl,
  onShare,
  shareCopied = false,
  extraActions,
  fallbackImage,
  className,
}: ArenaProfileHeaderProps) {
  const defaultFallback = fallbackImage || DEFAULT_FALLBACK_IMAGES[Math.abs(arena.id) % DEFAULT_FALLBACK_IMAGES.length];
  const localSlugImage = arena.slug ? `/Arenas/${arena.slug}.png` : undefined;

  const getInitialImage = (): string => {
    return arena.logo_url || arena.banner_url || localSlugImage || defaultFallback;
  };

  const [imgUrl, setImgUrl] = useState<string>(getInitialImage);

  useEffect(() => {
    setImgUrl(getInitialImage());
  }, [arena.logo_url, arena.banner_url, arena.slug, defaultFallback]);

  const handleImageError = () => {
    if (localSlugImage && imgUrl !== localSlugImage && (imgUrl === arena.logo_url || imgUrl === arena.banner_url)) {
      setImgUrl(localSlugImage);
    } else if (imgUrl !== defaultFallback) {
      setImgUrl(defaultFallback);
    }
  };

  const courtsCount = activeCourtsCount !== undefined ? activeCourtsCount : arena.total_quadras;

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border border-gray-150 dark:border-dark-border/40 p-4 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs flex flex-row justify-between items-center gap-4 select-none',
        className
      )}
    >
      <div className="flex items-center gap-3.5 text-left min-w-0 flex-1">
        {/* Logo / Avatar */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-border/60 shadow-xs shrink-0 bg-white flex items-center justify-center">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={`Logo ${arena.nome}`}
              onError={handleImageError}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Trophy className="w-7 h-7 text-primary-500" />
          )}
        </div>

        {/* Informações da Arena */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-800 dark:text-dark-text mb-1 m-0 break-words whitespace-normal leading-tight">
            {arena.nome}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-dark-text-muted">
            {(arena.cidade || arena.uf) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  {arena.cidade}
                  {arena.cidade && arena.uf ? ' - ' : ''}
                  {arena.uf}
                </span>
              </div>
            )}
            {courtsCount !== undefined && courtsCount > 0 && (
              <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200 dark:border-dark-border/40">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>
                  {courtsCount} {courtsCount === 1 ? 'quadra' : 'quadras'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações Sociais e Compartilhamento */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {/* Botão de Compartilhar */}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className={cn(
              'relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border transition-all duration-200 shadow-xs cursor-pointer touch-manipulation active:scale-95',
              shareCopied
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-gray-200 dark:border-dark-border/60 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light text-blue-600 dark:text-blue-400'
            )}
            title={shareCopied ? 'Link copiado!' : 'Compartilhar link da Arena'}
          >
            {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {shareCopied && (
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-md whitespace-nowrap pointer-events-none z-10 animate-fadeIn">
                Copiado!
              </span>
            )}
          </button>
        )}

        {/* Instagram */}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border border-gray-200 dark:border-dark-border/60 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light active:scale-95 transition-all duration-200 shadow-xs cursor-pointer touch-manipulation"
            title="Instagram da Arena"
          >
            <svg
              className="w-4 h-4 text-pink-600 dark:text-pink-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        )}

        {/* Google Maps / Localização */}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border border-gray-200 dark:border-dark-border/60 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light active:scale-95 transition-all duration-200 shadow-xs cursor-pointer touch-manipulation"
            title="Como Chegar (Google Maps)"
          >
            <Map className="w-4 h-4 text-primary-500" />
          </a>
        )}

        {extraActions}
      </div>
    </div>
  );
}

export default ArenaProfileHeader;
