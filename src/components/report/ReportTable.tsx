import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ReportColumn, ReportGroupData } from './reportTypes';

export interface ReportTableProps<T> {
  columns: ReportColumn<T>[];
  groups: ReportGroupData<T>[];
  showSubtotals?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string) => void;
  className?: string;
}

export function ReportTable<T>({
  columns,
  groups,
  showSubtotals = true,
  sortKey,
  sortDirection,
  onSortChange,
  className = '',
}: ReportTableProps<T>) {
  const hasMultipleGroups = groups.length > 1 || (groups.length === 1 && groups[0].groupKey !== 'all');

  return (
    <div className={`report-table-wrapper w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse text-[10.5px] leading-tight">
        {/* Cabeçalho da Tabela - thead com repetição automática em quebras de página */}
        <thead className="table-header-group bg-gray-100 text-gray-800 uppercase font-black tracking-wider border-y-2 border-gray-300">
          <tr>
            {columns.map((col) => {
              const alignClass =
                col.align === 'right'
                  ? 'text-right'
                  : col.align === 'center'
                  ? 'text-center'
                  : 'text-left';

              const isSorted = sortKey === col.key;

              return (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`py-2 px-2.5 font-bold border-b border-gray-300 select-none ${alignClass} ${
                    col.sortable && onSortChange ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''
                  }`}
                  onClick={() => {
                    if (col.sortable && onSortChange) {
                      onSortChange(col.key);
                    }
                  }}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {isSorted && (
                      <span className="no-print inline-block text-primary-600">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDown className="w-3 h-3 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Corpo com Grupos e Itens */}
        <tbody className="divide-y divide-gray-200">
          {groups.map((group, groupIdx) => {
            const hasSubtotals =
              showSubtotals &&
              hasMultipleGroups &&
              columns.some((c) => c.aggregate && group.subtotals[c.key] !== undefined && group.subtotals[c.key] !== '');

            return (
              <React.Fragment key={group.groupKey || groupIdx}>
                {/* Linha de Cabeçalho do Grupo (quando aplicável) */}
                {hasMultipleGroups && group.groupLabel && (
                  <tr className="group-header bg-gray-200/90 text-gray-900 font-bold border-t-2 border-b border-gray-400">
                    <td colSpan={columns.length} className="py-1.5 px-2.5 text-[11px]">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mr-2" />
                      {group.groupLabel}
                    </td>
                  </tr>
                )}

                {/* Linhas de Dados */}
                {group.items.map((item, itemIdx) => {
                  const isEven = itemIdx % 2 === 0;

                  return (
                    <tr
                      key={itemIdx}
                      className={`report-row transition-colors hover:bg-gray-50 ${
                        isEven ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {columns.map((col) => {
                        const alignClass =
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left';

                        return (
                          <td
                            key={col.key}
                            className={`py-1.5 px-2.5 text-gray-800 border-b border-gray-200 align-middle ${alignClass}`}
                          >
                            {col.render
                              ? col.render(item, itemIdx)
                              : String((item as Record<string, unknown>)[col.key] ?? '—')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Linha de Subtotal do Grupo */}
                {hasSubtotals && (
                  <tr className="group-subtotal bg-gray-100/90 text-gray-900 font-bold border-t border-b-2 border-gray-300">
                    {columns.map((col, cIdx) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      if (cIdx === 0) {
                        return (
                          <td key={col.key} className={`py-1.5 px-2.5 text-[10px] text-gray-600 uppercase ${alignClass}`}>
                            Subtotal ({group.items.length}):
                          </td>
                        );
                      }

                      const subVal = group.subtotals[col.key];
                      return (
                        <td key={col.key} className={`py-1.5 px-2.5 text-[10.5px] ${alignClass}`}>
                          {subVal !== undefined && subVal !== '' ? String(subVal) : ''}
                        </td>
                      );
                    })}
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
