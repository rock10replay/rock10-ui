import { useState } from 'react';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

export interface CourtItem {
  id: number | string;
  nome: string;
  slug?: string;
}

export interface CourtSelectorProps<T extends CourtItem = CourtItem> {
  courts: T[];
  selectedCourt: T | null;
  onSelectCourt: (court: T | null) => void;
  allLabel?: string;
  title?: string;
  defaultCollapsed?: boolean;
  className?: string;
}

export function CourtSelector<T extends CourtItem = CourtItem>({
  courts,
  selectedCourt,
  onSelectCourt,
  allLabel = 'Todas as Quadras',
  title = 'Filtrar por Quadra:',
  defaultCollapsed = true,
  className,
}: CourtSelectorProps<T>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  return (
    <div
      className={cn(
        'border-b border-gray-150 dark:border-dark-border/40 transition-all duration-200 select-none',
        isCollapsed ? 'mb-3 sm:mb-4 pb-1.5 sm:pb-2' : 'mb-5 sm:mb-6 pb-3 sm:pb-4',
        className
      )}
    >
      {/* Gatilho para abrir/fechar acordeão */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'flex items-center justify-between cursor-pointer select-none group/quadras min-h-[38px] sm:min-h-[42px] py-1 active:opacity-80 transition-all touch-manipulation',
          !isCollapsed && 'mb-2'
        )}
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <LayoutGrid className="w-4 h-4 text-gray-500 shrink-0" />
          <h2 className="text-sm font-bold text-gray-600 dark:text-dark-text-muted m-0">
            {title}
          </h2>
          {isCollapsed && (
            <span className="text-xs text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-950/30 px-2.5 py-0.5 rounded-full animate-fadeIn ml-2">
              {selectedCourt ? selectedCourt.nome : allLabel}
            </span>
          )}
        </div>
        <div className="text-gray-400 group-hover/quadras:text-gray-600 dark:group-hover/quadras:text-dark-text transition-colors duration-150">
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Conteúdo expansível */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out overflow-hidden',
          isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {courts.length === 0 ? (
            <div className="text-xs text-gray-500 dark:text-dark-text-muted py-2">
              Nenhuma quadra disponível para esta arena.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 pt-2 pb-1">
              <button
                type="button"
                onClick={() => onSelectCourt(null)}
                className={cn(
                  'px-4.5 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer focus:outline-none active:scale-95 touch-manipulation',
                  selectedCourt === null
                    ? 'bg-primary-500 text-white border-primary-500 shadow-xs shadow-primary-500/10 hover:bg-primary-600 hover:border-primary-600'
                    : 'bg-gray-100 dark:bg-dark-surface-light text-gray-700 dark:text-dark-text border-transparent hover:bg-gray-200 dark:hover:bg-dark-surface-light/80'
                )}
              >
                {allLabel}
              </button>
              {courts.map((court) => {
                const isSelected = selectedCourt?.id === court.id;
                return (
                  <button
                    key={court.id}
                    type="button"
                    onClick={() => onSelectCourt(court)}
                    className={cn(
                      'px-4.5 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer focus:outline-none active:scale-95 touch-manipulation',
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500 shadow-xs shadow-primary-500/10 hover:bg-primary-600 hover:border-primary-600'
                        : 'bg-gray-100 dark:bg-dark-surface-light text-gray-700 dark:text-dark-text border-transparent hover:bg-gray-200 dark:hover:bg-dark-surface-light/80'
                    )}
                  >
                    {court.nome}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourtSelector;
