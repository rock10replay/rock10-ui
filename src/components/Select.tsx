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
  selectSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
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

    const sizeClasses = {
      sm: 'h-8 pl-2.5 pr-8 text-xs rounded-lg',
      md: 'h-10 pl-3.5 pr-10 text-sm rounded-xl',
      lg: 'h-12 pl-4 pr-12 text-base rounded-xl',
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
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
              'w-full appearance-none bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text font-medium transition-all focus:outline-none focus:bg-white dark:focus:bg-dark-bg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 dark:disabled:bg-dark-surface disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [color-scheme:light] dark:[color-scheme:dark]',
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

          <div className="absolute right-3 pointer-events-none text-gray-400 dark:text-dark-text-muted">
            <ChevronDown className="w-4 h-4" />
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
