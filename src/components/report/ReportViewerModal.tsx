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
import { ReportContinuationHeader } from './ReportContinuationHeader';
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
    pages,
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="report-modal-backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-hidden"
    >
      {/* 1. BARRA DE FERRAMENTAS SUPERIOR (NÃO IMPRESSA) */}
      <div className="no-print w-full max-w-6xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-t-2xl px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Esquerda: Identificação e Total de Páginas */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
              <span>{config.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-surface-light text-gray-600 dark:text-dark-text-muted font-medium">
                {totalRecords} registro{totalRecords !== 1 ? 's' : ''}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold">
                {pages.length} folha{pages.length !== 1 ? 's' : ''} A4
              </span>
            </h2>
            {config.subtitle && (
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                {config.subtitle}
              </p>
            )}
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
              className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              title="Baixar planilha compatível com Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={triggerPrint}
            className="flex items-center gap-1.5 text-xs shadow-xs"
            title="Imprimir ou Salvar como PDF em folha A4"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
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

      {/* 2. ÁREA DE PRÉ-VISUALIZAÇÃO EM TELA (Scrollable & Folhas A4 Físicas) */}
      <div className="report-modal-scroll-area w-full max-w-6xl flex-1 bg-gray-800/80 rounded-b-2xl overflow-y-auto overflow-x-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          ref={printAreaRef}
          id="rock10-report-print"
          className="report-pages-container w-full flex flex-col items-center gap-8 py-2"
        >
          {pages.map((page) => (
            <div
              key={page.pageNumber}
              className="report-page-wrapper flex flex-col items-center w-full"
            >
              {/* Indicador visual de folha em tela */}
              <div className="no-print mb-2 text-xs font-semibold text-gray-300 flex items-center gap-2">
                <span className="bg-gray-700/90 px-2.5 py-0.5 rounded-full border border-gray-600 text-[11px] shadow-xs">
                  Folha {page.pageNumber} de {page.totalPages}
                </span>
                <span className="text-gray-400 text-[10px]">
                  (A4 {orientation === 'landscape' ? 'Paisagem 297x210mm' : 'Retrato 210x297mm'})
                </span>
              </div>

              {/* Folha A4 Física */}
              <div
                className={`a4-page ${
                  orientation === 'landscape'
                    ? 'orientation-landscape report-orientation-landscape'
                    : 'orientation-portrait report-orientation-portrait'
                } bg-white text-slate-900 shadow-2xl transition-all rounded-xs relative flex flex-col justify-between`}
              >
                {/* Corpo do Documento da Folha */}
                <div className="w-full flex-1 min-h-0 flex flex-col justify-start">
                  {/* Cabeçalho Oficial Rock 10 (Página 1) ou Cabeçalho de Continuação (Páginas 2+) */}
                  {page.isFirstPage ? (
                    <ReportHeader config={config} />
                  ) : (
                    <ReportContinuationHeader
                      config={config}
                      pageNumber={page.pageNumber}
                      totalPages={page.totalPages}
                    />
                  )}

                  {/* Tabela de Dados com os Itens desta Folha */}
                  {page.groups.length > 0 && (
                    <ReportTable
                      columns={config.columns}
                      groups={page.groups}
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
                  )}

                  {/* Totalizadores e Resumo de Fechamento (Última Folha) */}
                  {page.showSummary && (
                    <ReportSummary
                      data={data}
                      config={config}
                      overallTotals={overallTotals}
                      totalRecords={totalRecords}
                    />
                  )}
                </div>

                {/* Rodapé Oficial da Folha com Paginação Real */}
                <ReportFooter
                  systemName="Rock 10 Replay"
                  pageNumber={page.pageNumber}
                  totalPages={page.totalPages}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ESTILO DE IMPRESSÃO DINÂMICO PARA SELEÇÃO RETRATO / PAISAGEM */}
      <style>{`
        @media print {
          @page {
            size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'} !important;
            margin: 0 !important;
          }
          html, body {
            overflow: visible !important;
            height: auto !important;
            min-height: 100% !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .report-modal-backdrop,
          .report-modal-scroll-area {
            position: static !important;
            inset: auto !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            width: 100% !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          #rock10-report-print,
          .report-pages-container {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            display: block !important;
            overflow: visible !important;
            gap: 0 !important;
          }
          .report-page-wrapper {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .report-page-wrapper:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .a4-page {
            position: relative !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .a4-page.orientation-portrait {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            padding: 10mm 12mm !important;
          }
          .a4-page.orientation-landscape {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            padding: 10mm 12mm !important;
          }
          .a4-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .report-table-wrapper {
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          thead {
            display: table-header-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
          tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          td, th {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReportViewerModal;
