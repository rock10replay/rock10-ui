import type { ReportConfig } from './reportTypes';
import { Logo } from '../Logo';

export interface ReportContinuationHeaderProps<T> {
  config: ReportConfig<T>;
  pageNumber: number;
  totalPages: number;
  className?: string;
}

export function ReportContinuationHeader<T>({
  config,
  pageNumber,
  totalPages,
  className = '',
}: ReportContinuationHeaderProps<T>) {
  return (
    <header
      className={`report-continuation-header border-b border-gray-300 pb-2 mb-3 flex items-center justify-between text-xs ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <Logo variant="icon" size="sm" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-extrabold text-gray-900 tracking-tight text-[11px]">
            {config.title}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            (Continuação)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
        {config.emitterName && (
          <>
            <span className="text-gray-700 font-semibold">{config.emitterName}</span>
            <span>•</span>
          </>
        )}
        <span className="text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-[9.5px]">
          Folha {pageNumber} de {totalPages}
        </span>
      </div>
    </header>
  );
}
