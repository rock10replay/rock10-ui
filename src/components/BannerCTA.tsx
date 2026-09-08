import { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../utils/cn';

export interface BannerCTAProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionText: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  actionHref?: string;
  variant?: 'primary' | 'dark' | 'emerald';
  className?: string;
}

const variantStyles = {
  primary: 'from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 border-primary-500/20 text-white',
  dark: 'from-gray-900 to-gray-800 dark:from-dark-surface dark:to-dark-surface-light border-gray-700 text-white',
  emerald: 'from-emerald-600 to-teal-800 dark:from-emerald-700 dark:to-teal-900 border-emerald-500/20 text-white',
};

export function BannerCTA({
  title,
  description,
  icon,
  actionText,
  actionIcon = <ArrowUpRight className="w-5 h-5" />,
  onAction,
  actionHref,
  variant = 'primary',
  className,
}: BannerCTAProps) {
  const isLink = Boolean(actionHref);
  const ActionComponent = isLink ? 'a' : 'button';

  return (
    <section className={cn('w-full max-w-[1400px] mx-auto px-4 py-12 select-none', className)}>
      <div
        className={cn(
          'relative rounded-3xl overflow-hidden bg-gradient-to-r shadow-xl py-12 px-6 sm:px-12 text-center flex flex-col items-center gap-6 border',
          variantStyles[variant]
        )}
      >
        {/* Efeito de iluminação radial */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* Ícone em destaque */}
        {icon && (
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            {icon}
          </div>
        )}

        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold m-0 leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm opacity-90 mt-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Botão de Chamada */}
        <ActionComponent
          href={actionHref}
          onClick={onAction}
          className="w-full sm:w-auto mt-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-base hover:bg-primary-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 border-none hover:scale-[1.02]"
        >
          <span>{actionText}</span>
          {actionIcon && <span className="shrink-0">{actionIcon}</span>}
        </ActionComponent>
      </div>
    </section>
  );
}

export default BannerCTA;
