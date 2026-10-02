import { Logo } from '../Logo';
import type { ReportConfig } from './reportTypes';

export interface ReportHeaderProps<T> {
  config: ReportConfig<T>;
  className?: string;
}

export function ReportHeader<T>({ config, className = '' }: ReportHeaderProps<T>) {
  const { title, subtitle, emitterInfo, filtersApplied } = config;

  return (
    <header className={`report-header-container border-b-2 border-primary-600 pb-4 mb-4 ${className}`}>
      {/* Linha Superior: Logo Oficial Rock 10 + Informações Institucionais do Emissor */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo variant="full" themeMode="light" size="lg" className="h-10 w-auto shrink-0" />
          <div className="border-l border-gray-300 pl-3">
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-600 font-medium mt-0.5 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Emissor / Arena */}
        <div className="text-right text-[10px] text-gray-500 leading-tight">
          <div className="font-bold text-gray-800 text-xs">
            {emitterInfo?.arenaName || 'Rock 10 Replay'}
          </div>
          {emitterInfo?.unit && <div>Unidade: {emitterInfo.unit}</div>}
          {emitterInfo?.document && <div>Doc: {emitterInfo.document}</div>}
          {emitterInfo?.operatorName && <div>Operador: {emitterInfo.operatorName}</div>}
          <div>{emitterInfo?.systemName || 'Ecossistema Rock10'}</div>
        </div>
      </div>

      {/* Badges de Filtros Aplicados */}
      {filtersApplied && filtersApplied.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">
            Filtros:
          </span>
          {filtersApplied.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] text-gray-700"
            >
              <strong className="text-gray-900 font-semibold">{f.label}:</strong> {f.value}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

/**
 * Mini-cabeçalho discreto para exibição em páginas secundárias se necessário
 */
export function ReportMiniHeader({ title }: { title: string }) {
  return (
    <div className="report-mini-header hidden print:flex items-center justify-between border-b border-gray-300 pb-1 mb-2 text-[9px] text-gray-500">
      <span className="font-bold text-gray-700 uppercase">Rock 10 Replay • {title}</span>
      <span>Documento Oficial</span>
    </div>
  );
}
