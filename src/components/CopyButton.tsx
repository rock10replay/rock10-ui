import { useState, useCallback, ButtonHTMLAttributes, ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onCopy'> {
  text: string;
  label?: ReactNode;
  copiedLabel?: ReactNode;
  timeout?: number;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'xs' | 'sm' | 'md';
  onCopy?: (text: string) => void;
  onError?: (error: unknown) => void;
}

export function CopyButton({
  text,
  label,
  copiedLabel = 'Copiado!',
  timeout = 2000,
  variant = 'outline',
  size = 'sm',
  className,
  onCopy,
  onError,
  disabled,
  title,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled) return;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopy?.(text);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        console.error('Falha ao copiar texto:', err);
        onError?.(err);
      }
    },
    [text, disabled, timeout, onCopy, onError]
  );

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-1 gap-1 min-h-[26px]',
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-3.5 py-2 gap-2 min-h-[40px]',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  const variantStyles = {
    primary:
      'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-xs font-semibold rounded-xl border border-transparent',
    secondary:
      'bg-gray-100 hover:bg-gray-200 dark:bg-dark-surface-light dark:hover:bg-dark-border text-gray-800 dark:text-dark-text font-semibold rounded-xl border border-transparent',
    outline:
      'bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light text-gray-700 dark:text-dark-text border border-gray-200 dark:border-dark-border font-semibold rounded-xl shadow-xs',
    ghost:
      'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text font-semibold rounded-xl',
    icon:
      'p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light border border-transparent',
  };

  const isIconOnly = variant === 'icon' || (!label && !copiedLabel);

  const defaultAriaLabel = copied
    ? 'Texto copiado'
    : typeof label === 'string'
    ? label
    : 'Copiar texto';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      title={title || (copied ? 'Copiado!' : 'Copiar para a área de transferência')}
      aria-label={props['aria-label'] || defaultAriaLabel}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        variant !== 'icon' && sizeStyles[size],
        variantStyles[variant],
        copied && 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60',
        className
      )}
      {...props}
    >
      {copied ? (
        <Check className={cn(iconSizes[size], 'text-emerald-500 animate-in zoom-in-75 duration-150 shrink-0')} />
      ) : (
        <Copy className={cn(iconSizes[size], 'shrink-0')} />
      )}

      {!isIconOnly && (
        <span className="truncate">
          {copied ? copiedLabel : label}
        </span>
      )}
    </button>
  );
}

export default CopyButton;
