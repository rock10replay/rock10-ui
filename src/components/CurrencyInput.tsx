import {
  InputHTMLAttributes,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export type CurrencyInputVariant = 'default' | 'filter' | 'purple';
export type CurrencyInputSize = 'sm' | 'md' | 'lg';

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  value?: number | string | null;
  onValueChange?: (numericValue: number, formattedValue: string) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  helperText?: string;
  currencyPrefix?: string;
  clearable?: boolean;
  onClear?: () => void;
  variant?: CurrencyInputVariant;
  inputSize?: CurrencyInputSize;
  fullWidth?: boolean;
  containerClassName?: string;
  allowNegative?: boolean;
  allowEmpty?: boolean;
  align?: 'left' | 'right';
  max?: number;
  min?: number;
}

const variantClasses: Record<CurrencyInputVariant, string> = {
  default:
    'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text focus:bg-white dark:focus:bg-dark-bg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
  filter:
    'bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border text-gray-900 dark:text-dark-text shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
  purple:
    'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
};

const sizeClasses: Record<CurrencyInputSize, string> = {
  sm: 'h-8 text-xs rounded-xl',
  md: 'h-10 text-sm rounded-xl',
  lg: 'h-12 text-base rounded-xl',
};

// Helper: converte número ou string para centavos inteiros (ex: 120.50 -> 12050)
function parseToCents(val: number | string | null | undefined): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') {
    return Math.round(val * 100);
  }
  // Se for string, trata tanto formato "1.250,50" quanto "1250.50"
  const cleanStr = val.toString().trim();
  if (!cleanStr) return 0;

  // Se tem vírgula como separador decimal
  if (cleanStr.includes(',')) {
    const sanitized = cleanStr.replace(/[^\d,-]/g, '').replace(',', '.');
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }

  // Se é float tradicional em inglês ou dígitos puros
  const parsed = parseFloat(cleanStr.replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

// Helper: formata centavos para pt-BR sem o símbolo "R$" (ex: 12050 -> "120,50")
function formatCentsToCurrencyString(cents: number): string {
  const isNegative = cents < 0;
  const absCents = Math.abs(cents);
  const formatted = (absCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-${formatted}` : formatted;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      currencyPrefix = 'R$',
      clearable = false,
      onClear,
      variant = 'default',
      inputSize = 'md',
      fullWidth = true,
      disabled,
      readOnly,
      value,
      onValueChange,
      onChange,
      allowNegative = false,
      allowEmpty = false,
      align = 'left',
      max,
      min,
      id,
      placeholder = '0,00',
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [cents, setCents] = useState<number>(() => parseToCents(value));
    const [isEmpty, setIsEmpty] = useState<boolean>(() => {
      return allowEmpty && (value === '' || value === null || value === undefined);
    });

    // Sincroniza estado interno caso a prop `value` seja alterada externamente
    useEffect(() => {
      const incomingCents = parseToCents(value);
      if (allowEmpty && (value === '' || value === null || value === undefined)) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
        setCents(incomingCents);
      }
    }, [value, allowEmpty]);

    // Emite mudanças para os consumidores
    const emitValue = useCallback(
      (newCents: number, currentEmpty: boolean) => {
        let finalCents = newCents;

        // Limites min / max
        if (max !== undefined && finalCents > Math.round(max * 100)) {
          finalCents = Math.round(max * 100);
        }
        if (min !== undefined && finalCents < Math.round(min * 100)) {
          finalCents = Math.round(min * 100);
        }

        setCents(finalCents);
        setIsEmpty(currentEmpty);

        const numericValue = currentEmpty ? 0 : finalCents / 100;
        const formattedString = currentEmpty ? '' : formatCentsToCurrencyString(finalCents);

        if (onValueChange) {
          onValueChange(numericValue, formattedString);
        }

        if (onChange) {
          // Cria evento sintético compatível com inputs HTML padrão
          const syntheticEvent = {
            target: {
              value: numericValue.toString(),
              name: props.name || '',
            },
            currentTarget: {
              value: numericValue.toString(),
              name: props.name || '',
            },
          } as unknown as ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      },
      [max, min, onValueChange, onChange, props.name]
    );

    // Manipula digitação via teclado (algoritmo ATM / centavos deslocados)
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;

      // Teclas de controle permitidas (Tab, Enter, Arrow, etc.)
      if (
        ['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(
          e.key
        ) ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Backspace: remove o último dígito centavo
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (isEmpty) return;

        const currentCentsAbs = Math.abs(cents);
        const newCentsAbs = Math.floor(currentCentsAbs / 10);
        const newCents = cents < 0 ? -newCentsAbs : newCentsAbs;

        if (newCents === 0 && allowEmpty) {
          emitValue(0, true);
        } else {
          emitValue(newCents, false);
        }
        return;
      }

      // Delete: zera ou limpa
      if (e.key === 'Delete') {
        e.preventDefault();
        emitValue(0, allowEmpty);
        return;
      }

      // Tecla '-': alterna sinal negativo caso permitido
      if (e.key === '-' && allowNegative) {
        e.preventDefault();
        emitValue(-cents, false);
        return;
      }

      // Dígitos de 0 a 9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const digit = parseInt(e.key, 10);
        const currentCentsAbs = isEmpty ? 0 : Math.abs(cents);
        const newCentsAbs = currentCentsAbs * 10 + digit;

        // Evita overflow absurdo (máximo 1 trilhão de reais)
        if (newCentsAbs > 1000000000000) return;

        const newCents = cents < 0 ? -newCentsAbs : newCentsAbs;
        emitValue(newCents, false);
      }
    };

    // Suporte a colar texto (clipboard paste)
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      e.preventDefault();

      const pastedData = e.clipboardData.getData('text');
      if (!pastedData) return;

      const parsedCents = parseToCents(pastedData);
      emitValue(allowNegative ? parsedCents : Math.abs(parsedCents), false);
    };

    const handleClear = () => {
      emitValue(0, allowEmpty);
      if (onClear) onClear();
    };

    const inputId = id || (label ? `currency-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const displayValue = isEmpty ? '' : formatCentsToCurrencyString(cents);

    // Ajuste de paddings baseado em tamanho e prefixo
    const prefixPaddingClass = {
      sm: 'pl-8',
      md: 'pl-10',
      lg: 'pl-12',
    }[inputSize];

    const clearablePaddingClass = {
      sm: 'pr-8',
      md: 'pr-10',
      lg: 'pr-12',
    }[inputSize];

    return (
      <div
        className={cn(
          'flex flex-col',
          (label || error || helperText) && 'gap-1.5',
          fullWidth && 'w-full',
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {currencyPrefix && (
            <div
              className={cn(
                'absolute flex items-center pointer-events-none font-bold select-none text-gray-400 dark:text-dark-text-muted',
                inputSize === 'sm' && 'left-2.5 text-xs',
                inputSize === 'md' && 'left-3.5 text-sm',
                inputSize === 'lg' && 'left-4 text-base'
              )}
            >
              {currencyPrefix}
            </div>
          )}

          <input
            id={inputId}
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            readOnly={readOnly}
            value={displayValue}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onChange={() => {}} // Gerenciado por onKeyDown e onPaste
            className={cn(
              'w-full font-bold transition-all focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed',
              align === 'right' ? 'text-right' : 'text-left',
              variantClasses[variant],
              sizeClasses[inputSize],
              currencyPrefix && prefixPaddingClass,
              (clearable || !isEmpty) && clearablePaddingClass,
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-300',
              className
            )}
            {...props}
          />

          {clearable && !isEmpty && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpar valor"
              className={cn(
                'absolute flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-dark-text-muted dark:hover:text-dark-text transition-colors',
                inputSize === 'sm' && 'right-2.5 p-0.5',
                inputSize === 'md' && 'right-3.5 p-1',
                inputSize === 'lg' && 'right-4 p-1.5'
              )}
            >
              <X className={inputSize === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            </button>
          )}
        </div>

        {error ? (
          <span className="text-xs font-semibold text-red-500 dark:text-red-400">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500 dark:text-dark-text-muted">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
