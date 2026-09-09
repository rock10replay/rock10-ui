import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { Skeleton } from './Skeleton';

const colorThemes = {
  purple: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/50 dark:border-purple-950/20',
  },
  blue: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/50 dark:border-blue-950/20',
  },
  emerald: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/50 dark:border-emerald-950/20',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/50 dark:border-amber-950/20',
  },
  red: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    border: 'border-red-200/50 dark:border-red-950/20',
  },
  cyan: {
    text: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200/50 dark:border-cyan-950/20',
  },
  pink: {
    text: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    border: 'border-pink-200/50 dark:border-pink-950/20',
  },
  yellow: {
    text: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200/50 dark:border-yellow-950/20',
  },
};

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: ReactNode;
  description?: ReactNode;
  trend?: {
    value: number | string;
    isPositive?: boolean;
  };
  icon?: ReactNode;
  color?: keyof typeof colorThemes;
  variant?: 'default' | 'horizontal' | 'compact';
  isLoading?: boolean;
  animateValue?: boolean;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  description,
  trend,
  icon,
  color = 'purple',
  variant = 'default',
  isLoading = false,
  animateValue = true,
  className,
  onClick,
}: StatCardProps) {
  const effectiveSubtitle = subtitle ?? description;
  const [displayedValue, setDisplayedValue] = useState<string | number>(
    typeof value === 'number' && animateValue ? 0 : value
  );

  const theme = colorThemes[color] || colorThemes.purple;

  useEffect(() => {
    if (typeof value !== 'number' || !animateValue) {
      setDisplayedValue(value);
      return;
    }

    let active = true;
    let startTimestamp: number | null = null;
    const duration = 1000;

    const step = (timestamp: number) => {
      if (!active) return;
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * value);

      setDisplayedValue(current.toLocaleString('pt-BR'));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayedValue(value.toLocaleString('pt-BR'));
      }
    };

    window.requestAnimationFrame(step);
    return () => {
      active = false;
    };
  }, [value, animateValue]);

  if (isLoading) {
    if (variant === 'horizontal' || variant === 'compact') {
      return (
        <div className={cn("bg-white dark:bg-dark-surface p-4 rounded-2xl border border-gray-150 dark:border-dark-border shadow-xs flex items-center gap-4", className)}>
          <Skeleton variant="circular" width={44} height={44} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={12} />
            <Skeleton width="60%" height={24} />
          </div>
        </div>
      );
    }

    return (
      <div className={cn("bg-white dark:bg-dark-surface p-5 rounded-2xl border border-gray-150 dark:border-dark-border shadow-xs", className)}>
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="50%" height={14} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
        <Skeleton width="40%" height={32} className="my-2" />
        <Skeleton width="70%" height={12} />
      </div>
    );
  }

  const formattedValue =
    typeof value === 'number' && !animateValue
      ? value.toLocaleString('pt-BR')
      : displayedValue;

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'bg-white dark:bg-dark-surface p-5 rounded-2xl border border-gray-150 dark:border-dark-border shadow-xs hover:shadow-sm transition-all flex items-center gap-4',
          onClick && 'cursor-pointer hover:-translate-y-0.5',
          className
        )}
      >
        {icon && (
          <div className={cn('p-3 rounded-xl flex items-center justify-center shrink-0', theme.bg)}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className={cn('text-[11px] font-bold uppercase tracking-wider block truncate', theme.text)}>
            {title}
          </span>
          <div className="text-2xl font-black text-gray-900 dark:text-dark-text leading-tight mt-0.5 truncate">
            {formattedValue}
          </div>
          {effectiveSubtitle && (
            <div className="text-xs text-gray-500 dark:text-dark-text-muted font-medium mt-0.5 truncate">
              {effectiveSubtitle}
            </div>
          )}
          {trend && (
            <div className={cn('text-xs font-bold mt-1 flex items-center gap-0.5', trend.isPositive ? 'text-emerald-600' : 'text-red-600')}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'bg-white dark:bg-dark-surface p-3.5 rounded-xl border border-gray-150 dark:border-dark-border shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3',
          onClick && 'cursor-pointer hover:-translate-y-0.5',
          className
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider block truncate', theme.text)}>
              {title}
            </span>
            {trend && (
              <span className={cn('text-[10px] font-bold shrink-0', trend.isPositive ? 'text-emerald-600' : 'text-red-600')}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-dark-text leading-tight mt-0.5 truncate">
            {formattedValue}
          </div>
          {effectiveSubtitle && (
            <div className="text-[11px] text-gray-500 dark:text-dark-text-muted font-medium mt-0.5 truncate">
              {effectiveSubtitle}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', theme.bg)}>
            {icon}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-dark-surface p-5 rounded-2xl border border-gray-150 dark:border-dark-border shadow-xs hover:shadow-sm transition-all',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-xs font-bold uppercase tracking-wider', theme.text)}>
          {title}
        </span>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', theme.bg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-gray-900 dark:text-dark-text tracking-tight">
        {formattedValue}
      </div>

      <div className="flex items-center justify-between gap-2 mt-1.5">
        {effectiveSubtitle && (
          <div className="text-xs text-gray-500 dark:text-dark-text-muted font-medium flex items-center gap-1">
            {effectiveSubtitle}
          </div>
        )}
        {trend && (
          <span className={cn('text-xs font-bold', trend.isPositive ? 'text-emerald-600' : 'text-red-600')}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
