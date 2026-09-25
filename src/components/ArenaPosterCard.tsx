import { useState, useEffect, ReactNode } from 'react';
import { MapPin, ArrowRight, LayoutGrid } from 'lucide-react';
import { cn } from '../utils/cn';
import type { ArenaData } from './ArenaCard';

export interface ArenaPosterCardProps {
  arena: ArenaData;
  courtCount?: number;
  isMostAccessed?: boolean;
  accessRank?: 1 | 2;
  rankBadge?: ReactNode;
  hasLive?: boolean;
  actionText?: string;
  onClick?: (arena: ArenaData) => void;
  fallbackImage?: string;
  className?: string;
}

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
];

export function ArenaPosterCard({
  arena,
  courtCount,
  isMostAccessed,
  accessRank,
  rankBadge,
  hasLive,
  actionText = 'Ver Replay',
  onClick,
  fallbackImage,
  className,
}: ArenaPosterCardProps) {
  const defaultFallback = fallbackImage || DEFAULT_FALLBACK_IMAGES[Math.abs(arena.id) % DEFAULT_FALLBACK_IMAGES.length];
  const localSlugImage = arena.slug ? `/Arenas/${arena.slug}.png` : undefined;

  const getInitialImage = (): string => {
    return arena.banner_url || arena.logo_url || localSlugImage || defaultFallback;
  };

  const [imgUrl, setImgUrl] = useState<string>(getInitialImage);

  useEffect(() => {
    setImgUrl(getInitialImage());
  }, [arena.banner_url, arena.logo_url, arena.slug, defaultFallback]);

  const handleImageError = () => {
    if (localSlugImage && imgUrl !== localSlugImage && (imgUrl === arena.banner_url || imgUrl === arena.logo_url)) {
      setImgUrl(localSlugImage);
    } else if (imgUrl !== defaultFallback) {
      setImgUrl(defaultFallback);
    }
  };

  const displayCourtCount = courtCount !== undefined ? courtCount : arena.total_quadras;

  return (
    <div
      onClick={() => onClick?.(arena)}
      className={cn(
        'group relative h-56 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/60 dark:border-dark-border/40 shadow-md hover:shadow-xl dark:shadow-none bg-white dark:bg-dark-surface cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      {/* Badges de Destaque / Ranking no Topo */}
      {rankBadge ? (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 select-none animate-fadeIn">
          {rankBadge}
        </div>
      ) : accessRank === 1 ? (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 select-none animate-fadeIn border border-amber-300/30">
          🔥 1ª mais acessada por você
        </div>
      ) : accessRank === 2 ? (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 select-none animate-fadeIn border border-sky-300/30">
          ⚡ 2ª mais acessada por você
        </div>
      ) : isMostAccessed ? (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 select-none animate-fadeIn border border-amber-300/30">
          🔥 Mais acessada por você
        </div>
      ) : null}

      {/* Badge AO VIVO no Topo Direito */}
      {hasLive && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-red-600/95 hover:bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 select-none animate-pulse border border-red-300/40 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>AO VIVO</span>
        </div>
      )}

      {/* Imagem de Fundo com gradiente escuro */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgUrl}
          onError={handleImageError}
          alt={arena.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 transition-opacity duration-300 group-hover:opacity-95" />
      </div>

      {/* Conteúdo do Card */}
      <div className="relative z-10 h-full w-full p-4 sm:p-6 flex flex-col justify-end text-white">
        <div className="mb-2 sm:mb-4">
          {/* Marcação de Arena Offline posicionada acima do nome */}
          {(arena.is_online === false || arena.status_conexao === 'offline') && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/95 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold shadow-xs border border-rose-300/40 tracking-wider uppercase mb-1.5 select-none animate-fadeIn w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs shrink-0" />
              Offline
            </div>
          )}

          <h3 className="text-sm sm:text-xl md:text-2xl font-heading font-extrabold tracking-tight group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
            {arena.nome}
          </h3>

          {(arena.cidade || arena.uf) && (
            <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2.5 text-white/80 text-[10px] sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-primary-400" />
              <span className="truncate">
                {arena.cidade}
                {arena.cidade && arena.uf ? ' - ' : ''}
                {arena.uf}
              </span>
            </div>
          )}

          {displayCourtCount !== undefined && (
            <div className="flex items-center gap-1.5 mt-1 sm:mt-2 text-white/70 text-[9px] sm:text-xs font-semibold">
              <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-400" />
              <span>
                {displayCourtCount} {displayCourtCount === 1 ? 'Quadra' : 'Quadras'}
              </span>
            </div>
          )}
        </div>

        {/* Barra de Ação Inferior */}
        <div className="flex items-center justify-between border-t border-white/10 pt-2 sm:pt-4 mt-0.5 sm:mt-1">
          <span className="text-xs sm:text-sm font-bold text-primary-400 group-hover:text-primary-300 transition-colors duration-200">
            {actionText}
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary-500 group-hover:bg-primary-600 flex items-center justify-center transition-all duration-300 shadow-md group-hover:translate-x-1">
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArenaPosterCard;
