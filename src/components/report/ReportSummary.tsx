import { ShieldCheck } from 'lucide-react';
import type { ReportConfig } from './reportTypes';

export interface ReportSummaryProps<T> {
  data: T[];
  config: ReportConfig<T>;
  overallTotals: Record<string, number | string>;
  totalRecords: number;
  className?: string;
}

export function ReportSummary<T>({
  data,
  config,
  overallTotals,
  totalRecords,
  className = '',
}: ReportSummaryProps<T>) {
  const { summaryMetrics, columns } = config;

  const aggregateColumns = columns.filter((col) => col.aggregate && overallTotals[col.key] !== undefined);

  return (
    <div className={`report-summary-block mt-4 pt-3 border-t-2 border-gray-400 ${className}`}>
      {/* 1. Scorecards de Indicadores / Métricas Resumidas (se configuradas) */}
      {summaryMetrics && summaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {summaryMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`p-2.5 rounded-lg border text-left ${
                metric.highlight
                  ? 'bg-primary-50/80 border-primary-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>{metric.label}</span>
                {metric.icon && <span className="text-gray-400">{metric.icon}</span>}
              </div>
              <div className="text-sm font-black text-gray-900 mt-0.5">
                {metric.value(data)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Totalizador Consolidado das Colunas (Tabela Resumo de Fechamento) */}
      <div className="bg-gray-100/90 border border-gray-300 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-gray-800">
            Fechamento Geral do Relatório
          </span>
          <div className="text-[10.5px] text-gray-600 font-medium">
            Total de registros listados:{' '}
            <strong className="text-gray-900 font-bold">{totalRecords}</strong>
          </div>
        </div>

        {aggregateColumns.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-900">
            {aggregateColumns.map((col) => (
              <div key={col.key} className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">
                  Total {col.header}
                </span>
                <span className="text-sm font-black text-primary-700">
                  {String(overallTotals[col.key])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Nota de Auditoria e Integridade Institucional */}
      <div className="mt-2.5 p-2 bg-gray-50 border border-gray-200 rounded-md text-[9px] text-gray-600 leading-snug flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-primary-600 shrink-0" />
        <p>
          <strong className="text-gray-800 font-bold">Relatório Oficial de Auditoria: </strong>
          Dados processados pelo ecossistema Rock 10 Replay. Registros gerados para fins administrativos e
          operacionais. Horário oficial de Brasília (UTC-3).
        </p>
      </div>
    </div>
  );
}
