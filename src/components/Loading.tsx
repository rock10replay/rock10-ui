import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export interface LoadingProps {
  variant?: 'spinner' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({ 
  variant = 'spinner', 
  size = 'md', 
  text,
  fullScreen = false 
}: LoadingProps): JSX.Element => {
  
  // Sizes mapping for spinner
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  // Text sizes mapping
  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-semibold',
  };

  if (variant === 'skeleton') {
    // Premium loading skeleton card representation
    return (
      <div 
        className={cn(
          "w-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden shadow-sm animate-pulse",
          size === 'sm' ? 'max-w-xs' : size === 'md' ? 'max-w-sm' : 'max-w-md'
        )}
      >
        {/* Thumbnail skeleton */}
        <div className="aspect-video bg-gray-200 dark:bg-dark-surface-light w-full" />
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-dark-surface-light rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-dark-surface-light rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-dark-surface-light rounded w-5/6" />
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      <Loader2 
        className={cn(
          "text-primary-500 animate-spin", 
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className={cn("text-gray-500 dark:text-dark-text-muted select-none", textClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center w-full">{content}</div>;
};

export default Loading;
