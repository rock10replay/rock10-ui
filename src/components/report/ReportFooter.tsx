import { useMemo } from 'react';

export interface ReportFooterProps {
  systemName?: string;
  systemUrl?: string;
  generationDateTime?: string;
  className?: string;
}

export function ReportFooter({
  systemName = 'Rock 10 Replay',
  systemUrl = 'adm.rock10.com.br',
  generationDateTime,
  className = '',
}: ReportFooterProps) {
  const formattedDateTime = useMemo(() => {
    if (generationDateTime) return generationDateTime;
    return new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [generationDateTime]);

  return (
    <footer
      className={`report-footer-container border-t border-gray-300 pt-2 mt-4 flex items-center justify-between text-[9px] text-gray-500 font-medium ${className}`}
    >
      <div>
        <span className="font-bold text-gray-800">{systemName}</span>
        {systemUrl && (
          <>
            {' '}• <span className="text-gray-500">{systemUrl}</span>
          </>
        )}
      </div>

      <div>
        Data e hora da emissão:{' '}
        <span className="font-bold text-gray-700">{formattedDateTime}</span>
      </div>

      <div className="text-right">
        {/* Indicador de página - na impressão via CSS paged media @bottom-right substitui/complementa */}
        <span className="font-bold text-gray-800 report-page-indicator">
          Página <span className="page-current">1</span> de <span className="page-total">1</span>
        </span>
      </div>
    </footer>
  );
}
