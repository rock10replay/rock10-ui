import {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  forwardRef,
} from 'react';
import { cn } from '../utils/cn';

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full overflow-x-auto rounded-2xl bg-white dark:bg-dark-surface shadow-xs',
          bordered && 'border border-gray-200 dark:border-dark-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableContainer.displayName = 'TableContainer';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn('w-full text-left text-sm border-collapse', className)} {...props} />
));
Table.displayName = 'Table';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-gray-50/80 dark:bg-dark-surface-light/80 border-b border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-muted text-xs uppercase font-bold tracking-wider',
      className
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-gray-100 dark:divide-dark-border', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'transition-colors hover:bg-gray-50/60 dark:hover:bg-dark-surface-light/40 data-[state=selected]:bg-gray-50',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'px-6 py-4 text-left font-bold text-gray-600 dark:text-dark-text-muted select-none text-xs uppercase tracking-wider',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-6 py-4 align-middle text-gray-800 dark:text-dark-text text-sm font-medium', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
