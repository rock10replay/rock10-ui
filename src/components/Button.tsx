import { ButtonHTMLAttributes, ReactNode, forwardRef, isValidElement, createElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm shadow-primary-500/20',
        secondary:
          'bg-gray-100 hover:bg-gray-200 dark:bg-dark-surface-light dark:hover:bg-gray-700 text-gray-700 dark:text-dark-text border border-gray-200 dark:border-dark-border',
        outline:
          'border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface-light',
        ghost:
          'text-gray-600 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light',
        danger:
          'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/20',
        success:
          'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20',
        purple:
          'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-sm shadow-purple-600/20',
        link:
          'text-primary-500 hover:text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline p-0 h-auto font-semibold',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
        md: 'h-10 px-4 py-2 text-sm gap-2 rounded-xl',
        lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode | React.ComponentType<{ className?: string }>;
  rightIcon?: ReactNode | React.ComponentType<{ className?: string }>;
  icon?: ReactNode | React.ComponentType<{ className?: string }>;
}

function renderButtonIcon(icon?: ReactNode | React.ComponentType<{ className?: string }>, className = 'w-4 h-4') {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
    return createElement(icon as React.ComponentType<{ className?: string }>, { className });
  }
  return icon as ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const effectiveLeftIcon = renderButtonIcon(leftIcon || icon, size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4');
    const effectiveRightIcon = renderButtonIcon(rightIcon, size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          effectiveLeftIcon && <span className="shrink-0">{effectiveLeftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && effectiveRightIcon && <span className="shrink-0">{effectiveRightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
