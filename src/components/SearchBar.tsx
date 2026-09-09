import { useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Callback chamado quando o valor muda (com debounce) */
  onSearch: (value: string) => void;
  /** Tempo de debounce em ms */
  debounceMs?: number;
  /** Placeholder do input */
  placeholder?: string;
  /** Valor inicial */
  initialValue?: string;
  /** Se true, mostra botão de limpar */
  showClear?: boolean;
  /** Se true, foca automaticamente ao montar */
  autoFocus?: boolean;
  /** Tamanho do input */
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar = ({
  onSearch,
  debounceMs = 300,
  placeholder = 'Pesquisar vídeos...',
  initialValue = '',
  showClear = true,
  autoFocus = false,
  size = 'md',
  className = '',
  ...props
}: SearchBarProps): JSX.Element => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Debounce da busca
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, onSearch, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleClear = (): void => {
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  // Height configurations (mobile-first optimizations)
  const sizeClasses = {
    sm: "h-9 text-sm rounded-lg",
    md: "h-11 sm:h-12 text-base rounded-xl", // taller, thumb-friendly on mobile
    lg: "h-13 sm:h-14 text-lg rounded-2xl",
  };

  const iconSizes = {
    sm: "w-4 h-4 ml-3",
    md: "w-5 h-5 ml-4",
    lg: "w-6 h-6 ml-5",
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-[600px] bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border shadow-sm transition-all duration-150 overflow-hidden",
        isFocused ? "border-primary-500 ring-3 ring-primary-100 dark:ring-primary-900/30" : "hover:border-gray-400 dark:hover:border-dark-border/80 hover:shadow",
        sizeClasses[size],
        className
      )}
    >
      <Search className={cn("text-gray-400 dark:text-dark-text-muted flex-shrink-0", iconSizes[size])} aria-hidden="true" />

      <input
        ref={inputRef}
        type="text"
        className="flex-1 h-full px-3 py-2 border-none bg-transparent font-sans text-gray-900 dark:text-dark-text outline-none placeholder-gray-400 dark:placeholder-dark-text-muted text-inherit"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label="Campo de busca"
        {...props}
      />

      {showClear && value && (
        <button
          type="button"
          className={cn(
            "flex items-center justify-center mr-3 bg-gray-100 dark:bg-dark-surface-light border-none rounded-full cursor-pointer text-gray-500 dark:text-dark-text-muted transition-all duration-150 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-dark-surface-light/80 hover:scale-105 active:scale-95",
            size === 'sm' ? "w-5 h-5 p-0.5" : size === 'md' ? "w-6 h-6 p-1" : "w-7 h-7 p-1.5"
          )}
          onClick={handleClear}
          aria-label="Limpar busca"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
