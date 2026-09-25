import { useState, useEffect, ReactNode } from 'react';
import { MapPin, Trophy, Share2, Check, Map, LayoutGrid, ArrowLeft, Radio } from 'lucide-react';
import { cn } from '../utils/cn';
import type { ArenaData } from './ArenaCard';

export interface ArenaProfileHeaderProps {
  arena: ArenaData;
  activeCourtsCount?: number;
  instagramUrl?: string;
  mapsUrl?: string;
  onShare?: () => void;
  shareCopied?: boolean;
  onBack?: () => void;
  onViewLives?: () => void;
  hasActiveLives?: boolean;
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
  onBack,
  onViewLives,
  hasActiveLives = false,
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
        'bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border border-gray-200 dark:border-dark-border/40 p-4 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs flex flex-row justify-between items-center gap-4 select-none',
        className
      )}
    >
      <div className="flex items-center gap-2.5 sm:gap-3.5 text-left min-w-0 flex-1">
        {/* Botão Escolher outra Arena (Apenas Seta dentro do Card) */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200/80 dark:border-dark-border/60 bg-white/90 dark:bg-dark-surface/90 hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-700 dark:text-dark-text active:scale-95 transition-all duration-200 shadow-xs cursor-pointer touch-manipulation shrink-0"
            title="Escolher outra arena"
            aria-label="Escolher outra arena"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-dark-text-muted" />
          </button>
        )}

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
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-800 dark:text-dark-text m-0 break-words whitespace-normal leading-tight">
              {arena.nome}
            </h1>
            {arena.is_online !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider select-none shrink-0',
                  arena.is_online
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    arena.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  )}
                />
                {arena.is_online ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
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
                <LayoutGrid className="w-3.5 h-3.5 text-primary-500 shrink-0" />
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
        {/* Botão Ver Lives */}
        {onViewLives && (
          <button
            type="button"
            onClick={onViewLives}
            className={cn(
              'relative flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:px-2.5 sm:h-8.5 rounded-lg border transition-all duration-200 shadow-xs cursor-pointer touch-manipulation active:scale-95 text-xs font-bold',
              hasActiveLives
                ? 'border-red-500 bg-red-600 text-white hover:bg-red-700 shadow-sm'
                : 'border-gray-200 dark:border-dark-border/60 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light text-red-600 dark:text-red-400'
            )}
            title={hasActiveLives ? 'Arena com transmissão ao vivo! Ver lives' : 'Ver transmissões e lives da Arena'}
            aria-label="Ver transmissões e lives da Arena"
          >
            <Radio className={cn('w-4 h-4 shrink-0', hasActiveLives ? 'text-white animate-pulse' : 'text-red-600 dark:text-red-400')} />
            <span className="hidden sm:inline">Lives</span>
            {hasActiveLives && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        )}

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
