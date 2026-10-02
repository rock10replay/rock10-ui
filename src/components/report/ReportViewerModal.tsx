import { useRef } from 'react';
import {
  Printer,
  X,
  FileSpreadsheet,
  ArrowUpDown,
  Layers,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '../Button';

import { useReportEngine } from './useReportEngine';
import { ReportHeader } from './ReportHeader';
import { ReportTable } from './ReportTable';
import { ReportSummary } from './ReportSummary';
import { ReportFooter } from './ReportFooter';
import type { ReportConfig } from './reportTypes';
import './report.css';

export interface ReportViewerModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  config: ReportConfig<T>;
  showCsvExport?: boolean;
}

export function ReportViewerModal<T>({
  isOpen,
  onClose,
  data,
  config,
  showCsvExport = true,
}: ReportViewerModalProps<T>) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const {
    orientation,
    setOrientation,
    selectedGroupKey,
    setSelectedGroupKey,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    groupedData,
    totalRecords,
    overallTotals,
    triggerPrint,
    triggerCsvExport,
  } = useReportEngine(data, config);

  if (!isOpen) return null;

  // Monta opções de agrupamento para o select
  const groupSelectOptions = [
    { value: 'none', label: 'Sem Agrupamento' },
    ...(config.groupOptions || []).map((g) => ({
      value: g.key,
      label: g.label,
    })),
  ];

  // Monta opções de ordenação para o select
  const sortSelectOptions = (config.sortOptions || []).map((s) => ({
    value: s.key,
    label: s.label,
  }));

  // Se não houver sortOptions explícito, usa as colunas ordenáveis
  if (sortSelectOptions.length === 0) {
    config.columns
      .filter((c) => c.sortable || c.sortAccessor)
      .forEach((c) => {
        sortSelectOptions.push({
          value: c.key,
          label: c.header,
        });
      });
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      {/* 1. BARRA DE FERRAMENTAS SUPERIOR (TOTALMENTE OCULTA NA IMPRESSÃO) */}
      <div className="w-full max-w-6xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-t-2xl shadow-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 no-print z-20">
        {/* Esquerda: Identificação do Relatório */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text leading-tight">
              {config.title}
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-dark-text-muted">
              {totalRecords} registro(s) • Visualização de Impressão A4
            </p>
          </div>
        </div>

        {/* Centro: Controles Reativos (Orientação, Agrupamento e Ordenação) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Orientação (Retrato / Paisagem) */}
          <div className="flex items-center rounded-lg bg-gray-100 dark:bg-dark-surface-light p-0.5 border border-gray-200 dark:border-dark-border text-xs">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                orientation === 'portrait'
                  ? 'bg-white dark:bg-dark-surface text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-gray-600 dark:text-dark-text-muted hover:text-gray-900'
              }`}
            >
              📄 Retrato
            </button>
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                orientation === 'landscape'
                  ? 'bg-white dark:bg-dark-surface text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-gray-600 dark:text-dark-text-muted hover:text-gray-900'
              }`}
            >
              📑 Paisagem
            </button>
          </div>

          {/* Seletor de Agrupamento */}
          {config.groupOptions && config.groupOptions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-dark-text-muted">
              <Layers className="w-3.5 h-3.5" />
              <select
                value={selectedGroupKey}
                onChange={(e) => setSelectedGroupKey(e.target.value)}
                className="bg-gray-50 dark:bg-dark-surface-light border border-gray-200 dark:border-dark-border text-gray-800 dark:text-dark-text text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary-500 outline-hidden cursor-pointer"
              >
                {groupSelectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Seletor de Ordenação */}
          {sortSelectOptions.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-dark-text-muted">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-gray-50 dark:bg-dark-surface-light border border-gray-200 dark:border-dark-border text-gray-800 dark:text-dark-text text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary-500 outline-hidden cursor-pointer"
              >
                {sortSelectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleSortDirection}
                title={`Sentido: ${sortDirection === 'asc' ? 'Crescente (A-Z / 1-9)' : 'Decrescente (Z-A / 9-1)'}`}
                className="px-2 py-1.5 bg-gray-100 dark:bg-dark-surface-light border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text text-xs rounded-lg font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {sortDirection === 'asc' ? 'ASC ▲' : 'DESC ▼'}
              </button>
            </div>
          )}
        </div>

        {/* Direita: Ações (Exportar CSV, Imprimir/Salvar PDF, Fechar) */}
        <div className="flex items-center gap-2">
          {showCsvExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={triggerCsvExport}
              icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Exportar CSV
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={triggerPrint}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Imprimir / Salvar PDF
          </Button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE PRÉ-VISUALIZAÇÃO EM TELA (Scrollable & Paper-Styled) */}
      <div className="w-full max-w-6xl flex-1 bg-gray-800/80 rounded-b-2xl overflow-y-auto p-4 sm:p-6 flex justify-center">
        <div
          ref={printAreaRef}
          id="rock10-report-print"
          className={`a4-preview-paper ${
            orientation === 'landscape'
              ? 'orientation-landscape report-orientation-landscape'
              : 'orientation-portrait report-orientation-portrait'
          } rounded-sm relative flex flex-col justify-between`}
        >
          {/* Corpo do Documento */}
          <div>
            {/* Cabeçalho Oficial Rock 10 (Página 1) */}
            <ReportHeader config={config} />

            {/* Tabela de Dados Formatada */}
            <ReportTable
              columns={config.columns}
              groups={groupedData}
              showSubtotals={true}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={(k) => {
                if (sortKey === k) {
                  toggleSortDirection();
                } else {
                  setSortKey(k);
                  setSortDirection('asc');
                }
              }}
            />

            {/* Totalizadores e Resumo de Fechamento */}
            <ReportSummary
              data={data}
              config={config}
              overallTotals={overallTotals}
              totalRecords={totalRecords}
            />
          </div>

          {/* Rodapé Oficial de Auditoria e Paginação */}
          <ReportFooter systemName="Rock 10 Replay" />
        </div>
      </div>

      {/* 3. ESTILO DE IMPRESSÃO DINÂMICO PARA SELEÇÃO RETRATO / PAISAGEM */}
      <style>{`
        @media print {
          @page {
            size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'} !important;
            margin: 10mm 12mm !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReportViewerModal;
