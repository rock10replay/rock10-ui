import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  showEdges?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showEdges = true,
  maxVisiblePages = 5,
  className,
}: PaginationProps) {
  const pages = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const items: (number | string)[] = [];

    if (start > 1) {
      items.push(1);
      if (start > 2) items.push('...');
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) items.push('...');
      items.push(totalPages);
    }

    return items;
  }, [page, totalPages, maxVisiblePages]);

  if (totalPages <= 1 && totalItems === undefined) {
    return null;
  }

  const startRecord = pageSize ? Math.min((page - 1) * pageSize + 1, totalItems ?? 0) : null;
  const endRecord = pageSize && totalItems !== undefined ? Math.min(page * pageSize, totalItems) : null;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-gray-500 dark:text-dark-text-muted select-none',
        className
      )}
    >
      {totalItems !== undefined && (
        <div className="text-xs font-medium text-gray-500 dark:text-dark-text-muted">
          {pageSize && startRecord && endRecord ? (
            <span>
              Mostrando <strong className="font-bold text-gray-800 dark:text-dark-text">{startRecord}</strong>-
              <strong className="font-bold text-gray-800 dark:text-dark-text">{endRecord}</strong> de{' '}
              <strong className="font-bold text-gray-800 dark:text-dark-text">{totalItems}</strong> registros
            </span>
          ) : (
            <span>
              Total de <strong className="font-bold text-gray-800 dark:text-dark-text">{totalItems}</strong> registros
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        {showEdges && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            title="Primeira página"
            aria-label="Primeira página"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light disabled:opacity-40 disabled:pointer-events-none text-gray-600 dark:text-dark-text cursor-pointer transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Página anterior"
          aria-label="Página anterior"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light disabled:opacity-40 disabled:pointer-events-none text-gray-600 dark:text-dark-text cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }

            const isCurrent = p === page;

            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
                  isCurrent
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface-light'
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Próxima página"
          aria-label="Próxima página"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light disabled:opacity-40 disabled:pointer-events-none text-gray-600 dark:text-dark-text cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {showEdges && (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            title="Última página"
            aria-label="Última página"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-light disabled:opacity-40 disabled:pointer-events-none text-gray-600 dark:text-dark-text cursor-pointer transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
