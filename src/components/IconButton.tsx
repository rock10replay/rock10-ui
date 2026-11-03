import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ícone a ser exibido (emoji, SVG ou ReactNode) */
  icon: ReactNode;
  /** Variante visual do botão */
  variant?: IconButtonVariant;
  /** Tamanho do botão */
  size?: IconButtonSize;
  /** Se true, exibe apenas o ícone em formato circular */
  rounded?: boolean | 'full' | 'xl';
  /** Label para acessibilidade (obrigatório) */
  ariaLabel: string;
  /** Se true, botão fica desabilitado */
  disabled?: boolean;
  /** Se true, mostra estado de loading */
  loading?: boolean;
}

export const IconButton = ({
  icon,
  variant = 'primary',
  size = 'md',
  rounded = false,
  ariaLabel,
  disabled = false,
  loading = false,
  className = '',
  ...props
}: IconButtonProps): JSX.Element => {
  
  // Base classes for the button
  const baseClasses = "relative inline-flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all select-none -webkit-tap-highlight-color-transparent outline-none focus-visible:ring-3 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 duration-150";

  // Variant classes
  const variantClasses = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text border border-gray-300 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-dark-surface-light hover:-translate-y-0.5",
    ghost: "bg-transparent text-gray-600 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-gray-800 dark:hover:text-dark-text",
    danger: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5",
  };

  // Size classes (with mobile-first heights)
  const sizeClasses = rounded === 'xl' ? {
    sm: "w-9 h-9 rounded-xl p-0 text-base shrink-0",
    md: "w-10 h-10 rounded-xl p-0 text-lg shrink-0 sm:w-11 sm:h-11",
    lg: "w-12 h-12 rounded-xl p-0 text-xl shrink-0 sm:w-13 sm:h-13",
  } : rounded ? {
    sm: "w-8 h-8 rounded-full p-0 text-base",
    md: "w-10 h-10 rounded-full p-0 text-lg sm:w-11 sm:h-11", // enhanced touch target on mobile
    lg: "w-12 h-12 rounded-full p-0 text-xl sm:w-13 sm:h-13", // enhanced touch target on mobile
  } : {
    sm: "px-3 py-1.5 text-sm rounded-md min-h-[32px]",
    md: "px-4 py-2 text-base rounded-md min-h-[40px] sm:min-h-[44px]", // optimal mobile tap height
    lg: "px-6 py-3 text-lg rounded-lg min-h-[48px] sm:min-h-[52px]", // larger tap targets for key actions
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && "pointer-events-none",
        className
      )}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" role="status" aria-hidden="true" />
      ) : (
        <span className="flex items-center justify-center leading-none">{icon}</span>
      )}
    </button>
  );
};

export default IconButton;
