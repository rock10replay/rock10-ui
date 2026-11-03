import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../utils/cn';

export interface LikeButtonProps {
  /** ID do vídeo opcional */
  videoId?: number;
  /** Número inicial de curtidas */
  initialLikes?: number;
  /** Se o vídeo já inicia curtido */
  initialCurtido?: boolean;
  /** Estado controlado de curtido */
  curtido?: boolean;
  /** Função assíncrona opcional chamada para registrar a curtida e retornar a nova contagem */
  onLike?: () => Promise<number>;
  /** Callback opcional chamado quando o like muda localmente */
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Se true, mostra apenas o ícone */
  iconOnly?: boolean;
  /** Se true, desabilita o botão */
  disabled?: boolean;
  /** Se true, utiliza ícones do Lucide (Heart) ao invés de emoji */
  useLucide?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

export const LikeButton = ({
  initialLikes = 0,
  initialCurtido = false,
  curtido,
  onLike,
  onLikeChange,
  size = 'md',
  iconOnly = false,
  disabled = false,
  useLucide = true,
  className,
}: LikeButtonProps): JSX.Element => {
  const [likes, setLikes] = useState(initialLikes);
  const [internalCurtido, setInternalCurtido] = useState(initialCurtido);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    setInternalCurtido(initialCurtido);
  }, [initialCurtido]);

  const isCurtido = curtido !== undefined ? curtido : internalCurtido;

  const handleLike = async (): Promise<void> => {
    if (disabled || isAnimating) return;

    const nextCurtido = !isCurtido;
    const optimisticCount = nextCurtido ? likes + 1 : Math.max(0, likes - 1);
    if (nextCurtido) {
      setIsAnimating(true);
    }
    setInternalCurtido(nextCurtido);
    setLikes(optimisticCount);
    onLikeChange?.(optimisticCount, nextCurtido);

    if (onLike) {
      try {
        const serverCount = await onLike();
        setLikes(serverCount);
        if (serverCount !== optimisticCount) {
          onLikeChange?.(serverCount, nextCurtido);
        }
      } catch {
        // Reverte em caso de erro
        setInternalCurtido(!nextCurtido);
        setLikes(likes);
        onLikeChange?.(likes, !nextCurtido);
      } finally {
        setTimeout(() => setIsAnimating(false), 600);
      }
    } else {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Size mapping
  const iconOnlySizeClasses = {
    sm: 'w-9 h-9 p-0 text-xs rounded-xl min-h-0 shrink-0 justify-center',
    md: 'w-10 h-10 p-0 text-sm rounded-xl min-h-0 shrink-0 justify-center',
    lg: 'w-12 h-12 p-0 text-base rounded-xl min-h-0 shrink-0 justify-center',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm min-h-[32px] rounded-lg',
    md: 'px-3 py-2 text-base min-h-[40px] sm:min-h-[44px] rounded-lg',
    lg: 'px-4 py-3 text-lg min-h-[48px] sm:min-h-[52px] rounded-lg',
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const lucideIconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const countSizes = {
    sm: 'min-w-[16px] h-4 text-[10px] px-1',
    md: 'min-w-[20px] h-5 text-xs px-1.5',
    lg: 'min-w-[22px] h-[22px] text-xs px-2',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all duration-200 select-none border focus-visible:ring-3 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        isCurtido
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60'
          : 'bg-gray-100 dark:bg-dark-surface border-gray-300 dark:border-dark-border text-gray-600 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-surface-light hover:text-rose-500 dark:hover:text-rose-400',
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        isAnimating && 'animate-heartBeat',
        className
      )}
      onClick={handleLike}
      disabled={disabled}
      aria-label={isCurtido ? 'Descurtir vídeo' : 'Curtir vídeo'}
      aria-pressed={isCurtido}
    >
      <span className="relative flex items-center justify-center leading-none flex-shrink-0">
        {useLucide ? (
          <Heart
            className={cn(
              'transition-all duration-150',
              isCurtido
                ? 'fill-rose-500 text-rose-500 stroke-rose-500 scale-105'
                : 'stroke-current fill-transparent hover:scale-110',
              isAnimating && 'animate-iconPop'
            )}
            size={lucideIconSizes[size]}
          />
        ) : (
          <span
            className={cn(
              'flex items-center justify-center transition-transform duration-150',
              isAnimating && 'animate-iconPop'
            )}
          >
            {isCurtido ? '❤️' : '🤍'}
          </span>
        )}
        {isAnimating && (
          <>
            {useLucide ? (
              <>
                <Heart
                  className="absolute pointer-events-none opacity-0 animate-heartFloat1 fill-rose-500 text-rose-500"
                  size={lucideIconSizes[size] - 4}
                />
                <Heart
                  className="absolute pointer-events-none opacity-0 animate-heartFloat2 fill-rose-500 text-rose-500"
                  size={lucideIconSizes[size] - 4}
                />
                <Heart
                  className="absolute pointer-events-none opacity-0 animate-heartFloat3 fill-rose-500 text-rose-500"
                  size={lucideIconSizes[size] - 4}
                />
              </>
            ) : (
              <>
                <span
                  className={cn(
                    'absolute text-sm pointer-events-none opacity-0 animate-heartFloat1',
                    iconSizes[size]
                  )}
                >
                  ❤️
                </span>
                <span
                  className={cn(
                    'absolute text-sm pointer-events-none opacity-0 animate-heartFloat2',
                    iconSizes[size]
                  )}
                >
                  ❤️
                </span>
                <span
                  className={cn(
                    'absolute text-sm pointer-events-none opacity-0 animate-heartFloat3',
                    iconSizes[size]
                  )}
                >
                  ❤️
                </span>
              </>
            )}
          </>
        )}
      </span>

      {!iconOnly && (
        <span className="flex items-center gap-1.5">
          <span className="whitespace-nowrap">{isCurtido ? 'Curtido' : 'Curtir'}</span>
          {likes > 0 && (
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full bg-primary-600 text-white font-bold transition-all duration-150 animate-countBounce',
                countSizes[size]
              )}
            >
              {likes}
            </span>
          )}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
