import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface HeroAction {
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface HeroBannerProps {
  badge?: { text: string; icon?: ReactNode };
  title: ReactNode;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  ambientGlow?: boolean;
  className?: string;
}

export function HeroBanner({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  ambientGlow = true,
  className,
}: HeroBannerProps) {
  const renderAction = (action: HeroAction, isPrimary: boolean) => {
    const isLink = Boolean(action.href);
    const Component = isLink ? 'a' : 'button';

    const baseClasses =
      'w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-transparent active:scale-95 shadow-sm';

    const variantClasses =
      (action.variant || (isPrimary ? 'primary' : 'secondary')) === 'primary'
        ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/20 hover:shadow-lg'
        : (action.variant || 'secondary') === 'outline'
        ? 'border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
        : 'bg-gray-100 dark:bg-dark-surface-light hover:bg-gray-200 dark:hover:bg-dark-surface text-gray-700 dark:text-dark-text';

    return (
      <Component
        key={action.label}
        href={action.href}
        onClick={action.onClick}
        className={cn(baseClasses, variantClasses)}
      >
        {action.icon && <span className="shrink-0">{action.icon}</span>}
        <span>{action.label}</span>
      </Component>
    );
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-primary-500/10 via-transparent to-transparent py-16 sm:py-24 border-b border-gray-100 dark:border-dark-border/40 select-none',
        className
      )}
    >
      {/* Luzes de ambientação com blur */}
      {ambientGlow && (
        <>
          <div className="absolute top-0 right-0 -z-10 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 w-[250px] h-[250px] bg-secondary-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20 pointer-events-none" />
        </>
      )}

      <div className="w-full max-w-[1400px] mx-auto px-4 text-center">
        {/* Badge superior */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-950/30 text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 mb-6 animate-fadeIn">
            {badge.icon && <span className="shrink-0">{badge.icon}</span>}
            <span>{badge.text}</span>
          </div>
        )}

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-gray-800 dark:text-dark-text leading-[1.15]">
          {title}
        </h1>

        {/* Parágrafo Descritivo */}
        {description && (
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-dark-text-muted leading-relaxed">
            {description}
          </p>
        )}

        {/* Botões de Ação */}
        {(primaryAction || secondaryAction) && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryAction && renderAction(primaryAction, true)}
            {secondaryAction && renderAction(secondaryAction, false)}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;
