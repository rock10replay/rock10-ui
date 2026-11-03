import React, { useState, useEffect } from 'react';
import { Bookmark, Star } from 'lucide-react';
import { cn } from '../utils/cn';

export interface FavoriteButtonProps {
  /** ID do vídeo opcional */
  videoId?: number;
  /** Estado inicial de favorito (não controlado) */
  initialFavorito?: boolean;
  /** Estado controlado de favorito */
  favorito?: boolean;
  /** Callback quando o estado de favorito muda */
  onFavoriteChange?: (isFavorito: boolean) => void;
  /** Função assíncrona opcional para persistir a mudança */
  onToggle?: (nextFavorito: boolean) => Promise<boolean> | void;
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Se true, exibe o texto ao lado do ícone */
  showText?: boolean;
  /** Se true (ou se showText for false), modo compacto de apenas ícone */
  iconOnly?: boolean;
  /** Se true, utiliza ícone de estrela ao invés de bookmark */
  useStarIcon?: boolean;
  /** Se true, botão fica desabilitado */
  disabled?: boolean;
  /** Label acessível customizada */
  ariaLabel?: string;
  /** Classes CSS adicionais */
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  videoId: _videoId,
  initialFavorito = false,
  favorito,
  onFavoriteChange,
  onToggle,
  size = 'sm',
  showText = false,
  iconOnly: _iconOnly = true,
  useStarIcon = true,
  disabled = false,
  ariaLabel,
  className,
}) => {
  const [internalFavorito, setInternalFavorito] = useState<boolean>(initialFavorito);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setInternalFavorito(initialFavorito);
  }, [initialFavorito]);

  const isFavorito = favorito !== undefined ? favorito : internalFavorito;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (disabled || isSubmitting) return;

    const nextState = !isFavorito;
    setInternalFavorito(nextState);
    onFavoriteChange?.(nextState);

    if (onToggle) {
      setIsSubmitting(true);
      try {
        const result = await onToggle(nextState);
        if (typeof result === 'boolean' && result !== nextState) {
          setInternalFavorito(result);
          onFavoriteChange?.(result);
        }
      } catch {
        // Reverte em caso de erro
        setInternalFavorito(!nextState);
        onFavoriteChange?.(!nextState);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const IconComponent = useStarIcon ? Star : Bookmark;

  const iconOnlySizeClasses = {
    sm: 'w-9 h-9 p-0 text-xs rounded-xl min-h-0 shrink-0 justify-center',
    md: 'w-10 h-10 p-0 text-sm rounded-xl min-h-0 shrink-0 justify-center',
    lg: 'w-12 h-12 p-0 text-base rounded-xl min-h-0 shrink-0 justify-center',
  };

  const textModeSizeClasses = {
    sm: 'px-3 py-1.5 min-h-[36px] text-xs rounded-xl',
    md: 'px-4 py-2 min-h-[40px] text-sm rounded-xl',
    lg: 'px-5 py-2.5 min-h-[44px] text-base rounded-xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const defaultAriaLabel = ariaLabel || (isFavorito ? 'Remover dos favoritos' : 'Salvar nos favoritos');

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isSubmitting}
      title={defaultAriaLabel}
      aria-label={defaultAriaLabel}
      aria-pressed={isFavorito}
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 font-bold transition-all duration-200 select-none cursor-pointer',
        'active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed',
        isFavorito
          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-500 dark:text-amber-400 shadow-xs shadow-amber-500/10 hover:bg-amber-500/25'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 dark:bg-dark-surface dark:hover:bg-dark-surface-light dark:text-dark-text-muted dark:border-dark-border',
        showText ? textModeSizeClasses[size] : iconOnlySizeClasses[size],
        className
      )}
    >
      <IconComponent
        size={iconSizes}
        className={cn(
          'transition-transform duration-200 shrink-0',
          isFavorito ? 'fill-current scale-110 text-amber-500 dark:text-amber-400' : 'text-current'
        )}
      />
      {showText && (
        <span className="text-xs font-semibold leading-none">
          {isFavorito ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
