import { useState, useRef, useEffect, useMemo, ReactNode } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export type MultiSelectVariant = 'default' | 'filter';
export type MultiSelectSize = 'sm' | 'md' | 'lg';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  badge?: ReactNode;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  allSelectedLabel?: string;
  emptyLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  clearAllLabel?: string;
  variant?: MultiSelectVariant;
  selectSize?: MultiSelectSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  dropdownClassName?: string;
  /** Formatação personalizada do texto de exibição no botão do gatilho */
  formatDisplayValue?: (selectedOptions: MultiSelectOption[], totalOptions: number) => string;
}

const variantTriggerClasses: Record<MultiSelectVariant, string> = {
  default:
    'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text focus:bg-white dark:focus:bg-dark-bg hover:border-gray-300 dark:hover:border-dark-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
  filter:
    'bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border text-gray-800 dark:text-dark-text shadow-sm hover:border-gray-300 dark:hover:border-dark-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-semibold',
};

const sizeClasses: Record<MultiSelectSize, string> = {
  sm: 'h-8 px-2.5 text-xs rounded-xl',
  md: 'h-10 px-3.5 text-sm rounded-xl',
  lg: 'h-12 px-4 text-base rounded-xl',
};

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Selecionar opções...',
  allSelectedLabel = 'Todos selecionados',
  emptyLabel = 'Nenhuma opção encontrada',
  searchable = true,
  searchPlaceholder = 'Buscar...',
  showSelectAll = true,
  selectAllLabel = 'Selecionar Todos',
  clearAllLabel = 'Limpar',
  variant = 'default',
  selectSize = 'md',
  fullWidth = true,
  disabled = false,
  className,
  containerClassName,
  dropdownClassName,
  formatDisplayValue,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Foca no input de busca ao abrir
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Tecla Escape para fechar
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mapa de opções para acesso rápido
  const optionMap = useMemo(() => {
    return new Map(options.map((opt) => [opt.value, opt]));
  }, [options]);

  // Opções selecionadas
  const selectedOptions = useMemo(() => {
    return value
      .map((val) => optionMap.get(val))
      .filter((opt): opt is MultiSelectOption => Boolean(opt));
  }, [value, optionMap]);

  // Opções filtradas pela busca
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  // Alterna uma opção
  const toggleOption = (optValue: string | number) => {
    if (disabled) return;
    const isSelected = value.includes(optValue);
    if (isSelected) {
      onChange(value.filter((val) => val !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  // Selecionar todos os itens elegíveis
  const handleSelectAll = () => {
    if (disabled) return;
    const allEligibleValues = filteredOptions
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value);
    
    // Mescla preservando os já selecionados se busca estiver ativa
    const merged = Array.from(new Set([...value, ...allEligibleValues]));
    onChange(merged);
  };

  // Limpar seleção
  const handleClearAll = () => {
    if (disabled) return;
    if (searchQuery.trim()) {
      // Se tiver busca ativa, limpa apenas os filtrados
      const filteredSet = new Set(filteredOptions.map((opt) => opt.value));
      onChange(value.filter((val) => !filteredSet.has(val)));
    } else {
      onChange([]);
    }
  };

  // Texto amigável no botão do trigger
  const displayLabel = useMemo(() => {
    if (formatDisplayValue) {
      return formatDisplayValue(selectedOptions, options.length);
    }
    if (value.length === 0) {
      return placeholder;
    }
    if (value.length === 1 && selectedOptions[0]) {
      return selectedOptions[0].label;
    }
    if (options.length > 1 && value.length === options.length) {
      return allSelectedLabel;
    }
    return `${value.length} selecionados`;
  }, [value, selectedOptions, options.length, placeholder, allSelectedLabel, formatDisplayValue]);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex flex-col', (label || error || helperText) && 'gap-1.5', fullWidth && 'w-full', containerClassName)}
    >
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text-muted">
          {label}
        </label>
      )}

      {/* Botão Gatilho (Trigger) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between text-left transition-colors focus:outline-none select-none',
          variantTriggerClasses[variant],
          sizeClasses[selectSize],
          disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-300',
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn('truncate mr-2', value.length === 0 && 'text-gray-400 dark:text-gray-500 font-normal')}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-gray-600 dark:text-dark-text'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1.5 w-full min-w-[240px] max-w-[360px] bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl shadow-xl z-50 p-2 text-xs space-y-2 animate-[fadeIn_0.15s_ease-out]',
            dropdownClassName
          )}
          role="listbox"
          tabIndex={-1}
        >
          {/* Caixa de Busca */}
          {searchable && (
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-bg px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-gray-800 dark:text-dark-text placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Barra de Ações: Selecionar Todos / Limpar */}
          {showSelectAll && (
            <div className="flex items-center justify-between px-1 text-[11px]">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-primary-600 dark:text-primary-400 hover:underline font-bold transition-colors cursor-pointer"
              >
                {selectAllLabel}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-gray-500 dark:text-dark-text-muted hover:underline transition-colors cursor-pointer"
              >
                {clearAllLabel}
              </button>
            </div>
          )}

          {/* Lista de Opções */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-0.5 [color-scheme:light] dark:[color-scheme:dark]">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-400 dark:text-dark-text-muted">
                {emptyLabel}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer',
                      opt.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-700 dark:text-dark-text font-medium'
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex flex-col truncate mr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="text-[10px] text-gray-400 dark:text-dark-text-muted font-normal">
                          {opt.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-gray-500 dark:text-dark-text-muted">{helperText}</span>
      )}
    </div>
  );
}

export default MultiSelect;
