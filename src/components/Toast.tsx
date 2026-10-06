import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export type ToastInput = string | Omit<ToastItem, 'id'>;

export interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (input: ToastInput) => string;
  removeToast: (id: string) => void;
  toast: {
    (input: ToastInput): string;
    success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string;
    error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string;
    warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string;
    info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  {
    badge: string;
    icon: typeof CheckCircle2;
  }
> = {
  success: {
    badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60',
    icon: CheckCircle2,
  },
  error: {
    badge: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/70 dark:border-red-800/60',
    icon: AlertCircle,
  },
  warning: {
    badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/60',
    icon: AlertTriangle,
  },
  info: {
    badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60',
    icon: Info,
  },
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

function ToastCard({ toast, onClose }: ToastCardProps) {
  const { id, title, message, variant = 'info', duration = 4000, action } = toast;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose(id);
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id, duration, onClose]);

  const style = variantStyles[variant];
  const IconComponent = style.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto w-full bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border rounded-2xl shadow-xl p-3.5 flex items-start gap-3 transition-all duration-200 select-none'
      )}
    >
      {/* Ícone badge */}
      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', style.badge)}>
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Conteúdo textual */}
      <div className="flex-1 min-w-0 pr-1">
        {title && (
          <h5 className="text-xs font-bold text-gray-900 dark:text-dark-text tracking-tight mb-0.5 truncate">
            {title}
          </h5>
        )}
        <p className="text-xs font-medium text-gray-700 dark:text-dark-text-muted leading-relaxed break-words">
          {message}
        </p>

        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              onClose(id);
            }}
            className="mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Botão fechar */}
      <button
        type="button"
        onClick={() => onClose(id)}
        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors shrink-0 cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Posição do container de toasts na viewport */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Limite máximo de toasts empilhados simultaneamente */
  maxToasts?: number;
}

const positionClasses: Record<string, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (input: ToastInput) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem =
        typeof input === 'string'
          ? { id, message: input, variant: 'info' }
          : { id, ...input };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        if (next.length > maxToasts) {
          return next.slice(0, maxToasts);
        }
        return next;
      });

      return id;
    },
    [maxToasts]
  );

  const toastHelper = useCallback(
    (input: ToastInput) => addToast(input),
    [addToast]
  ) as ToastContextValue['toast'];

  toastHelper.success = useCallback(
    (message: string, options = {}) =>
      addToast({ message, variant: 'success', ...options }),
    [addToast]
  );

  toastHelper.error = useCallback(
    (message: string, options = {}) =>
      addToast({ message, variant: 'error', ...options }),
    [addToast]
  );

  toastHelper.warning = useCallback(
    (message: string, options = {}) =>
      addToast({ message, variant: 'warning', ...options }),
    [addToast]
  );

  toastHelper.info = useCallback(
    (message: string, options = {}) =>
      addToast({ message, variant: 'info', ...options }),
    [addToast]
  );

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    toast: toastHelper,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Container Flutuante de Toasts */}
      <div
        className={cn(
          'fixed z-[99999] pointer-events-none flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0',
          positionClasses[position]
        )}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook para acionar toasts em qualquer componente dentro de um ToastProvider */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback gracioso se chamado fora do provider para não explodir
    const fallbackFn = (msg: any) => {
      console.warn('useToast foi chamado fora de um <ToastProvider />:', msg);
      return '';
    };
    const fallbackToast: any = (msg: any) => fallbackFn(msg);
    fallbackToast.success = fallbackFn;
    fallbackToast.error = fallbackFn;
    fallbackToast.warning = fallbackFn;
    fallbackToast.info = fallbackFn;

    return {
      toasts: [],
      addToast: () => '',
      removeToast: () => {},
      toast: fallbackToast,
    };
  }
  return context;
}

export default ToastProvider;
