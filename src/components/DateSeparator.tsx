import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export interface DateSeparatorProps {
  date: string;
  videoCount?: number;
  sticky?: boolean;
  onClick?: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  className?: string;
}

export function DateSeparator({
  date,
  videoCount,
  sticky = false,
  onClick,
  onToggleCollapse,
  isCollapsed = false,
  className,
}: DateSeparatorProps) {
  return (
    <div
      className={cn(
        'relative p-3.5 sm:p-4 my-4 mb-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl shadow-md overflow-hidden select-none animate-slideDown',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:pointer-events-none before:transition-opacity hover:before:opacity-100',
        sticky && 'sticky top-0 z-30 mt-0',
        onToggleCollapse && 'cursor-pointer',
        className
      )}
      onClick={onToggleCollapse}
    >
      <div
        className={cn(
          'relative flex items-center justify-center gap-2.5 mx-auto w-fit z-10',
          onClick && 'cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]'
        )}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <Calendar className="w-5 h-5 shrink-0" />
        <h2 className="m-0 font-heading text-lg sm:text-xl font-bold text-shadow-md">
          {date}
        </h2>
        {videoCount !== undefined && videoCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 px-1.5 sm:px-2 bg-white/20 backdrop-blur-md rounded-full font-sans text-xs sm:text-sm font-bold shadow-xs">
            {videoCount}
          </span>
        )}
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white cursor-pointer p-2 rounded-full hover:bg-white/15 transition-all duration-200 flex items-center justify-center w-8 h-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform duration-250 ease-out',
              isCollapsed ? '-rotate-90' : 'rotate-0'
            )}
          />
        </button>
      )}
    </div>
  );
}

export default DateSeparator;
