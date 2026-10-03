import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { cn } from '../utils/cn';

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  size = 'md',
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none select-none',
        'bg-white/80 dark:bg-dark-surface/80 border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light shadow-xs',
        sizeClasses[size],
        className
      )}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
    >
      {isDark ? (
        <Sun className={cn(iconSizes[size], 'text-amber-400 transition-transform duration-300 transform rotate-0 hover:rotate-45')} />
      ) : (
        <Moon className={cn(iconSizes[size], 'text-indigo-600 transition-transform duration-300 transform rotate-0 hover:-rotate-12')} />
      )}
      {showLabel && (
        <span className="ml-2 font-semibold">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      )}
    </button>
  );
}
