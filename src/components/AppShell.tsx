import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../utils/cn';

export interface AppShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  className?: string;
}

export function AppShell({
  sidebar,
  header,
  children,
  footer,
  sidebarOpen: controlledOpen,
  onSidebarOpenChange,
  className,
}: AppShellProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onSidebarOpenChange?.(newOpen);
  };

  return (
    <div className={cn('min-h-screen bg-gray-50/50 dark:bg-dark-bg text-gray-900 dark:text-dark-text flex', className)}>
      {/* Sidebar Desktop e Mobile */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-dark-surface border-r border-gray-150 dark:border-dark-border flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebar}
      </aside>

      {/* Backdrop mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-w-0 min-h-screen">
        {header}

        <main className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex-1 max-w-7xl w-full mx-auto">{children}</div>
        </main>

        {footer && (
          <footer className="w-full py-4 px-6 text-center text-xs font-semibold text-gray-400 border-t border-gray-150 dark:border-dark-border bg-white/50 dark:bg-dark-surface/50">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export interface AppHeaderProps {
  title?: ReactNode;
  onToggleSidebar?: () => void;
  actions?: ReactNode;
  userSlot?: ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  onToggleSidebar,
  actions,
  userSlot,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-150 dark:border-dark-border px-4 md:px-6 flex items-center justify-between transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-900 dark:text-dark-text-muted dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light p-2 rounded-xl transition-all cursor-pointer shrink-0"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {typeof title === 'string' ? (
          <h1 className="text-lg font-bold text-gray-950 dark:text-white tracking-tight truncate">
            {title}
          </h1>
        ) : (
          title
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {actions}
        {userSlot}
      </div>
    </header>
  );
}

export interface AppSidebarProps {
  brand: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ brand, children, footer, className, onNavigate }: AppSidebarProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="h-16 flex items-center px-6 border-b border-gray-150 dark:border-dark-border shrink-0">
        {brand}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" onClick={onNavigate}>
        {children}
      </nav>

      {footer && (
        <div className="p-4 border-t border-gray-150 dark:border-dark-border shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}

export default AppShell;
