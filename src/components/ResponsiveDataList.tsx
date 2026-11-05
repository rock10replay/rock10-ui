import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface ResponsiveDataListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Container para listagens responsivas em formato de cards para dispositivos móveis (< md: 768px).
 * Em telas desktop, a tabela tradicional pode ser exibida enquanto este container fica oculto,
 * ou pode envolver os cards com espaçamento vertical padronizado.
 */
export const ResponsiveDataList = forwardRef<HTMLDivElement, ResponsiveDataListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-3.5 md:hidden w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResponsiveDataList.displayName = 'ResponsiveDataList';

export interface DataCardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  bordered?: boolean;
  children: ReactNode;
}

/**
 * Card individual representando uma linha da tabela no mobile.
 * Elimina o scroll horizontal desajeitado e agrupa informações com tipografia clara e ações rápidas.
 */
export const DataCard = forwardRef<HTMLDivElement, DataCardProps>(
  ({ className, selected = false, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white dark:bg-dark-surface rounded-2xl p-4 transition-all duration-150 shadow-xs relative',
          bordered && 'border border-gray-150 dark:border-dark-border',
          selected && 'ring-2 ring-primary-500/80 bg-primary-50/30 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DataCard.displayName = 'DataCard';

export interface DataCardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  checkbox?: ReactNode;
  actions?: ReactNode;
}

export const DataCardHeader = forwardRef<HTMLDivElement, DataCardHeaderProps>(
  ({ className, title, subtitle, badge, checkbox, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-2.5 pb-3 border-b border-gray-100 dark:border-dark-border', className)}
        {...props}
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {checkbox && <div className="pt-0.5 shrink-0">{checkbox}</div>}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-bold text-sm text-gray-900 dark:text-dark-text truncate">
                {title}
              </div>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
            {subtitle && (
              <div className="text-xs text-gray-500 dark:text-dark-text-muted mt-0.5 truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="shrink-0 ml-1.5 flex items-center gap-1">
            {actions}
          </div>
        )}
      </div>
    );
  }
);
DataCardHeader.displayName = 'DataCardHeader';

export interface DataCardBodyProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

export const DataCardBody = forwardRef<HTMLDivElement, DataCardBodyProps>(
  ({ className, columns = 2, children, ...props }, ref) => {
    const colsClass =
      columns === 1
        ? 'grid-cols-1'
        : columns === 3
        ? 'grid-cols-3'
        : 'grid-cols-2';

    return (
      <div
        ref={ref}
        className={cn('grid gap-2.5 pt-3 text-xs', colsClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DataCardBody.displayName = 'DataCardBody';

export interface DataCardFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  colSpan?: 1 | 2 | 3;
  align?: 'left' | 'right';
  highlight?: boolean;
}

export const DataCardField = forwardRef<HTMLDivElement, DataCardFieldProps>(
  ({ className, label, value, colSpan = 1, align = 'left', highlight = false, ...props }, ref) => {
    const spanClass =
      colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : 'col-span-1';
    const alignClass = align === 'right' ? 'text-right items-end' : 'text-left items-start';

    return (
      <div
        ref={ref}
        className={cn('flex flex-col min-w-0', spanClass, alignClass, className)}
        {...props}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-dark-text-muted">
          {label}
        </span>
        <div
          className={cn(
            'mt-0.5 text-xs text-gray-800 dark:text-dark-text font-medium truncate w-full',
            highlight && 'font-bold text-gray-900 dark:text-white',
            align === 'right' && 'text-right'
          )}
        >
          {value}
        </div>
      </div>
    );
  }
);
DataCardField.displayName = 'DataCardField';

export interface DataCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const DataCardFooter = forwardRef<HTMLDivElement, DataCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mt-3 pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between gap-2 text-xs flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DataCardFooter.displayName = 'DataCardFooter';
