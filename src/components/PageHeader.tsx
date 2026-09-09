import { ReactNode, isValidElement, createElement } from 'react';
import { cn } from '../utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode | React.ComponentType<{ className?: string }>;
  badge?: ReactNode;
  action?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

function renderIcon(icon?: ReactNode | React.ComponentType<{ className?: string }>, className = 'w-6 h-6') {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
    return createElement(icon as React.ComponentType<{ className?: string }>, { className });
  }
  return icon as ReactNode;
}

export function PageHeader({
  title,
  description,
  subtitle,
  icon,
  badge,
  action,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  const desc = description || subtitle;
  const renderedActions = actions || action;
  const renderedIcon = renderIcon(icon);

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none',
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {breadcrumb && <div className="text-xs text-gray-500 mb-0.5">{breadcrumb}</div>}
        <div className="flex items-center gap-3 flex-wrap">
          {renderedIcon && <span className="shrink-0">{renderedIcon}</span>}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text tracking-tight">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {desc && (
          <div className="text-sm text-gray-500 dark:text-dark-text-muted mt-0.5 font-medium">
            {desc}
          </div>
        )}
      </div>

      {renderedActions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">{renderedActions}</div>
      )}
    </div>
  );
}

export default PageHeader;
