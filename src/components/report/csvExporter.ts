import type { ReportColumn } from './reportTypes';

/**
 * Utilitário de exportação para CSV formatado em UTF-8 com BOM para Excel
 */
export function exportReportToCsv<T>(
  data: T[],
  columns: ReportColumn<T>[],
  filename = 'relatorio'
): void {
  const exportableCols = columns.filter((col) => col.csvExportable !== false);

  const headers = exportableCols.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(';');

  const rows = data.map((item) => {
    return exportableCols
      .map((col) => {
        let val: unknown;
        if (col.csvAccessor) {
          val = col.csvAccessor(item);
        } else if (col.sortAccessor) {
          val = col.sortAccessor(item);
        } else {
          val = (item as Record<string, unknown>)[col.key];
        }

        if (val === null || val === undefined) {
          return '""';
        }
        if (val instanceof Date) {
          return `"${val.toLocaleString('pt-BR')}"`;
        }
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(';');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
