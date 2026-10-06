import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export type InputVariant = 'default' | 'filter';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  variant?: InputVariant;
  inputSize?: InputSize;
  fullWidth?: boolean;
  containerClassName?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default:
    'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text focus:bg-white dark:focus:bg-dark-bg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
  filter:
    'bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border text-gray-900 dark:text-dark-text shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-2.5 text-xs rounded-xl',
  md: 'h-10 px-3.5 text-sm rounded-xl',
  lg: 'h-12 px-4 text-base rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      clearable = false,
      onClear,
      variant = 'default',
      inputSize = 'md',
      fullWidth = true,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col', (label || error || helperText) && 'gap-1.5', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {startIcon && (
            <div className={cn(
              'absolute flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted',
              inputSize === 'sm' ? 'left-2.5' : 'left-3.5'
            )}>
              {startIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            value={value}
            className={cn(
              'w-full font-medium transition-all focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed',
              variantClasses[variant],
              sizeClasses[inputSize],
              startIcon && (inputSize === 'sm' ? 'pl-8' : 'pl-10'),
              (endIcon || (clearable && value)) && (inputSize === 'sm' ? 'pr-8' : 'pr-10'),
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-300',
              className
            )}
            {...props}
          />

          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'absolute p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer',
                inputSize === 'sm' ? 'right-2' : 'right-2.5'
              )}
            >
              <X className={cn(inputSize === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
            </button>
          )}

          {!clearable && endIcon && (
            <div className={cn(
              'absolute flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted',
              inputSize === 'sm' ? 'right-2.5' : 'right-3.5'
            )}>
              {endIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-gray-500 dark:text-dark-text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
