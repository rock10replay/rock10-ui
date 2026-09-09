import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOutsideClick?: boolean;
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md', closeOnOutsideClick = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="fixed inset-0" onClick={closeOnOutsideClick ? onClose : undefined} />
      <div
        className={cn(
          "relative w-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-[slideUp_0.2s_ease-out]",
          sizeClasses[size]
        )}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text">{title}</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded-lg cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 dark:text-dark-text-muted">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
