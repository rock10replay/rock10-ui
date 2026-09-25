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
        'relative py-2 sm:py-2.5 px-3.5 sm:px-4 my-2.5 sm:my-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden select-none animate-slideDown',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:pointer-events-none before:transition-opacity hover:before:opacity-100',
        sticky && 'sticky top-0 z-30 mt-0',
        onToggleCollapse && 'cursor-pointer',
        className
      )}
      onClick={onToggleCollapse}
    >
      <div
        className={cn(
          'relative flex items-center justify-center gap-2 mx-auto w-fit z-10',
          onClick && 'cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]'
        )}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 opacity-90" />
        <h2 className="m-0 font-heading text-sm sm:text-base font-bold text-shadow-xs tracking-tight">
          {date}
        </h2>
        {videoCount !== undefined && videoCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 sm:min-w-[22px] sm:h-5.5 px-1.5 bg-white/20 backdrop-blur-md rounded-full font-sans text-[11px] sm:text-xs font-bold shadow-2xs">
            {videoCount}
          </span>
        )}
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-white cursor-pointer p-1.5 rounded-full hover:bg-white/15 transition-all duration-200 flex items-center justify-center w-7 h-7"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-250 ease-out opacity-90',
              isCollapsed ? '-rotate-90' : 'rotate-0'
            )}
          />
        </button>
      )}
    </div>
  );
}

export default DateSeparator;
