import {
  SelectHTMLAttributes,
  ReactNode,
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export type SelectVariant = 'default' | 'filter' | 'purple' | 'amber';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  variant?: SelectVariant;
  selectSize?: SelectSize;
  fullWidth?: boolean;
  containerClassName?: string;
  children?: ReactNode;
}

const variantClasses: Record<SelectVariant, string> = {
  default:
    'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text focus:bg-white dark:focus:bg-dark-bg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
  filter:
    'bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border text-gray-700 dark:text-dark-text shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-semibold',
  purple:
    'bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
  amber:
    'bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
};

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 pl-2.5 pr-7 text-xs rounded-xl',
  md: 'h-10 pl-3.5 pr-10 text-sm rounded-xl',
  lg: 'h-12 pl-4 pr-12 text-base rounded-xl',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      options,
      variant = 'default',
      selectSize = 'md',
      fullWidth = true,
      disabled,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col', (label || error || helperText) && 'gap-1.5', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [color-scheme:light] dark:[color-scheme:dark]',
              variantClasses[variant],
              sizeClasses[selectSize],
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-300',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-white text-gray-900 dark:bg-dark-surface dark:text-dark-text"
                  >
                    {opt.label}
                  </option>
                ))
              : Children.map(children, (child) => {
                  if (isValidElement(child) && child.type === 'option') {
                    const childProps = child.props as { className?: string };
                    return cloneElement(child, {
                      className: cn(
                        'bg-white text-gray-900 dark:bg-dark-surface dark:text-dark-text',
                        childProps.className
                      ),
                    } as any);
                  }
                  return child;
                })}
          </select>

          <div className="absolute right-2.5 pointer-events-none text-gray-400 dark:text-dark-text-muted">
            <ChevronDown className={cn(selectSize === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
          </div>
        </div>

        {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-gray-500 dark:text-dark-text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

