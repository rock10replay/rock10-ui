import { ReactNode } from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface FilterBarProps {
  title?: string;
  hasActiveFilters?: boolean;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterBar({
  title = 'Filtros',
  hasActiveFilters = false,
  activeFiltersCount,
  onClearFilters,
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-dark-surface p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-dark-border shadow-xs space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text">
            {title}
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              {activeFiltersCount !== undefined
                ? `${activeFiltersCount} ${activeFiltersCount === 1 ? 'ativo' : 'ativos'}`
                : 'Filtro Ativo'}
            </span>
          )}
        </div>

        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
        {children}
      </div>
    </div>
  );
}

export default FilterBar;
