import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  mobileLabel?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs py-1.5 px-2.5 sm:px-3 gap-1 sm:gap-1.5 rounded-xl',
  md: 'text-sm py-2 px-3 sm:px-4 gap-1.5 sm:gap-2 rounded-xl',
  lg: 'text-base py-2.5 px-4 sm:px-5 gap-2 rounded-2xl',
};

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  // Gera classes de grid mobile dinâmicas para 2, 3 ou 4 opções
  const mobileGridClass =
    options.length === 2
      ? 'grid-cols-2'
      : options.length === 3
      ? 'grid-cols-3'
      : options.length === 4
      ? 'grid-cols-4'
      : 'grid-flow-col auto-cols-fr';

  return (
    <div
      role="tablist"
      className={cn(
        'grid sm:flex items-center gap-1 p-1 bg-gray-100/90 dark:bg-dark-surface rounded-2xl border border-gray-200/70 dark:border-dark-border/70 shadow-xs select-none scrollbar-none',
        mobileGridClass,
        fullWidth ? 'w-full' : 'w-full sm:w-auto',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={option.disabled}
            title={option.title || option.label}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cn(
              'flex items-center justify-center font-bold transition-all duration-200 cursor-pointer whitespace-nowrap text-center outline-none',
              sizeClasses[size],
              isSelected
                ? 'bg-white dark:bg-dark-surface-light text-primary-600 dark:text-primary-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              option.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            {option.icon && <span className="shrink-0 flex items-center">{option.icon}</span>}
            {option.mobileLabel ? (
              <>
                <span className="inline sm:hidden">{option.mobileLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </>
            ) : (
              <span>{option.label}</span>
            )}
            {option.badge && <span className="shrink-0 ml-1">{option.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
