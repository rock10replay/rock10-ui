import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface StepItem {
  stepNumber?: string | number;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface StepCardsProps {
  steps: StepItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function StepCards({ steps, columns = 4, className }: StepCardsProps) {
  return (
    <div className={cn('grid gap-6 sm:gap-8 relative select-none', columnClasses[columns], className)}>
      {steps.map((step, idx) => {
        const stepNum = step.stepNumber !== undefined ? step.stepNumber : idx + 1;
        const formattedNum = typeof stepNum === 'number' && stepNum < 10 ? `0${stepNum}` : `${stepNum}`;

        return (
          <div
            key={idx}
            className="relative p-6 rounded-3xl border border-gray-150/40 dark:border-dark-border/40 bg-white dark:bg-dark-surface hover:shadow-md transition-all duration-300 flex flex-col gap-4 text-center md:text-left hover:-translate-y-1"
          >
            {/* Ícone e Número grande em marca d'água */}
            <div className="flex items-center justify-center md:justify-between w-full">
              {step.icon && (
                <div className="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-950/30 flex items-center justify-center">
                  {step.icon}
                </div>
              )}
              <span className="hidden md:inline text-5xl font-black text-gray-100 dark:text-dark-border/30 select-none">
                {formattedNum}
              </span>
            </div>

            {/* Conteúdo textual */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StepCards;
