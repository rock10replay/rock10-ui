import React, { ReactNode } from 'react';
import { Play, MapPin } from 'lucide-react';
import { cn } from '../utils/cn';

export interface HighlightVideoData {
  nome: string;
  poster?: string | null;
  arena_nome?: string;
  quadra_nome?: string;
  dthr?: string;
  [key: string]: any;
}

export interface HighlightVideoCardProps {
  title: string;
  metricName: string;
  value: number;
  icon: ReactNode;
  accentColor?: 'blue' | 'red' | 'purple' | 'emerald' | 'amber';
  video?: HighlightVideoData | null;
  isLoading?: boolean;
  onPlay?: () => void;
  className?: string;
}

const colorStyles = {
  blue: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
  },
  red: {
    border: 'border-l-red-500',
    iconBg: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    badge: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300',
  },
  purple: {
    border: 'border-l-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300',
  },
  emerald: {
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    border: 'border-l-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
  },
};

export const HighlightVideoCard: React.FC<HighlightVideoCardProps> = ({
  title,
  metricName,
  value,
  icon,
  accentColor = 'purple',
  video,
  isLoading = false,
  onPlay,
  className,
}) => {
  const cfg = colorStyles[accentColor] || colorStyles.purple;
  const hasVideo = !!video && value > 0;

  return (
    <div
      className={cn(
        'bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between border-l-4',
        cfg.border,
        className
      )}
    >
      {/* Header do Card */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-text-muted flex items-center gap-1.5">
            <span className={cn('p-1 rounded-md flex-shrink-0', cfg.iconBg)}>{icon}</span>
            <span className="truncate">{title}</span>
          </span>
          <span
            className={cn('text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0', cfg.badge)}
            title={metricName}
          >
            {hasVideo ? value.toLocaleString('pt-BR') : '0'}
          </span>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-2 mt-3">
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-light rounded-sm w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-dark-surface-light rounded-sm w-1/2"></div>
          </div>
        ) : hasVideo ? (
          <div className="mt-1">
            <h4
              className="text-sm font-bold text-gray-900 dark:text-dark-text line-clamp-1 hover:text-primary-600 transition-colors cursor-pointer"
              title={video.nome}
              onClick={onPlay}
            >
              {video.nome}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-text-muted mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {video.arena_nome}
                {video.quadra_nome ? ` • ${video.quadra_nome}` : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-gray-400 dark:text-dark-text-muted font-medium italic">
            Nenhum vídeo registrado no período
          </div>
        )}
      </div>

      {/* Mídia / Preview Miniatura */}
      <div className="px-4 pb-4">
        {hasVideo ? (
          <div
            onClick={onPlay}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onPlay?.()}
            aria-label={`Assistir ${video.nome}`}
            className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/90 cursor-pointer group flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {video.poster ? (
              <img
                src={video.poster}
                alt={video.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                <Play className="w-8 h-8 opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-dark-surface/90 text-gray-900 dark:text-dark-text flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
            {video.dthr && (
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                {new Date(video.dthr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-dark-surface-light border border-dashed border-gray-200 dark:border-dark-border flex items-center justify-center text-xs text-gray-400 font-medium">
            Sem reprodução
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightVideoCard;
