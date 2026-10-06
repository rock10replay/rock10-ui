import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  ComponentType,
  isValidElement,
  useId,
} from 'react';
import { cn } from '../utils/cn';

export type SwitchCardColor = 'purple' | 'primary' | 'emerald' | 'teal' | 'amber' | 'blue';
export type SwitchCardSize = 'sm' | 'md';

export interface SwitchCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title'> {
  /** Título principal da configuração */
  title: ReactNode;
  /** Descrição explicativa do toggle */
  description?: ReactNode;
  /** Ícone exibido no card (componente Lucide ou ReactNode) */
  icon?: ComponentType<{ className?: string }> | ReactNode;
  /** Se o switch está ativo */
  checked?: boolean;
  /** Cor de destaque do switch e do container quando ativo (default: 'purple') */
  colorScheme?: SwitchCardColor;
  /** Badge opcional exibido ao lado do título */
  badge?: ReactNode;
  /** Tamanho do card (default: 'md') */
  cardSize?: SwitchCardSize;
  /** Callback com valor booleano direto */
  onCheckedChange?: (checked: boolean) => void;
  /** Classes extras para o container do card */
  containerClassName?: string;
}

const colorClasses: Record<
  SwitchCardColor,
  {
    activeCard: string;
    activeIcon: string;
    activeTrack: string;
  }
> = {
  purple: {
    activeCard: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20',
    activeIcon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',
    activeTrack: 'peer-checked:bg-purple-600',
  },
  primary: {
    activeCard: 'border-primary-200 dark:border-primary-900/50 bg-primary-50/40 dark:bg-primary-950/20',
    activeIcon: 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300',
    activeTrack: 'peer-checked:bg-primary-500',
  },
  emerald: {
    activeCard: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20',
    activeIcon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',
    activeTrack: 'peer-checked:bg-emerald-600',
  },
  teal: {
    activeCard: 'border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-950/20',
    activeIcon: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300',
    activeTrack: 'peer-checked:bg-teal-600',
  },
  amber: {
    activeCard: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20',
    activeIcon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300',
    activeTrack: 'peer-checked:bg-amber-600',
  },
  blue: {
    activeCard: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20',
    activeIcon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
    activeTrack: 'peer-checked:bg-blue-600',
  },
};

export const SwitchCard = forwardRef<HTMLInputElement, SwitchCardProps>(
  (
    {
      className,
      containerClassName,
      title,
      description,
      icon,
      checked = false,
      colorScheme = 'purple',
      badge,
      cardSize = 'md',
      disabled,
      id,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const colors = colorClasses[colorScheme];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    const renderIcon = () => {
      if (!icon) return null;

      let iconContent: ReactNode;
      if (isValidElement(icon)) {
        iconContent = icon;
      } else if (
        typeof icon === 'function' ||
        (typeof icon === 'object' &&
          icon !== null &&
          ('render' in (icon as any) || '$$typeof' in (icon as any)))
      ) {
        const IconComponent = icon as ComponentType<{ className?: string }>;
        iconContent = <IconComponent className={cardSize === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />;
      } else {
        iconContent = icon as ReactNode;
      }

      return (
        <div
          className={cn(
            'rounded-xl transition-colors shrink-0 flex items-center justify-center',
            cardSize === 'sm' ? 'p-1.5' : 'p-2',
            checked ? colors.activeIcon : 'bg-gray-100 dark:bg-dark-surface-light text-gray-400 dark:text-gray-500'
          )}
        >
          {iconContent}
        </div>
      );
    };

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'w-full border rounded-2xl transition-all flex items-center justify-between gap-4 cursor-pointer select-none',
          cardSize === 'sm' ? 'p-3' : 'p-3.5 sm:p-4',
          checked
            ? colors.activeCard
            : 'border-gray-200 dark:border-dark-border bg-gray-50/40 dark:bg-dark-surface-light/20 opacity-80 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          containerClassName,
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {renderIcon()}

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900 dark:text-dark-text leading-tight">
                {title}
              </span>
              {badge}
            </div>

            {description && (
              <span className="text-xs text-gray-500 dark:text-dark-text-muted mt-0.5 leading-relaxed">
                {description}
              </span>
            )}
          </div>
        </div>

        <div className="relative inline-flex items-center shrink-0">
          <input
            id={switchId}
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 bg-gray-200 dark:bg-dark-surface-light peer-focus:outline-none rounded-full peer transition-colors duration-200 ease-in-out border border-transparent',
              'peer-checked:after:translate-x-full peer-checked:after:border-white',
              "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm dark:border-gray-600",
              colors.activeTrack
            )}
          />
        </div>
      </label>
    );
  }
);

SwitchCard.displayName = 'SwitchCard';
export default SwitchCard;
