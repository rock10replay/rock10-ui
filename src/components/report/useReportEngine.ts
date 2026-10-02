import { useState, useMemo, useCallback } from 'react';
import type {
  ReportConfig,
  ReportOrientation,
  ReportGroupData,
  ReportColumn,
  ReportPage,
} from './reportTypes';
import { exportReportToCsv } from './csvExporter';
import { paginateReport } from './reportPaginator';

export interface UseReportEngineReturn<T> {
  orientation: ReportOrientation;
  setOrientation: (o: ReportOrientation) => void;
  selectedGroupKey: string;
  setSelectedGroupKey: (k: string) => void;
  sortKey: string;
  setSortKey: (k: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (d: 'asc' | 'desc') => void;
  toggleSortDirection: () => void;
  groupedData: ReportGroupData<T>[];
  pages: ReportPage<T>[];
  totalRecords: number;
  overallTotals: Record<string, number | string>;
  triggerPrint: () => void;
  triggerCsvExport: () => void;
}

function calculateColumnTotal<T>(items: T[], col: ReportColumn<T>): number | string {
  if (!col.aggregate) return '';

  const accessor = col.aggregateAccessor || ((item: T) => {
    const raw = (item as Record<string, unknown>)[col.key];
    const num = Number(raw);
    return isNaN(num) ? 0 : num;
  });

  if (col.aggregate === 'count') {
    const val = items.length;
    return col.formatAggregate ? col.formatAggregate(val) : String(val);
  }

  const sum = items.reduce((acc, curr) => acc + (accessor(curr) || 0), 0);

  if (col.aggregate === 'sum') {
    return col.formatAggregate ? col.formatAggregate(sum) : sum;
  }

  if (col.aggregate === 'avg') {
    const avg = items.length > 0 ? sum / items.length : 0;
    return col.formatAggregate ? col.formatAggregate(avg) : avg;
  }

  return '';
}

export function useReportEngine<T>(
  data: T[],
  config: ReportConfig<T>
): UseReportEngineReturn<T> {
  const [orientation, setOrientation] = useState<ReportOrientation>(
    config.defaultOrientation || 'portrait'
  );

  const [selectedGroupKey, setSelectedGroupKey] = useState<string>(
    config.defaultGroupKey || 'none'
  );

  // Define ordenação padrão
  const defaultSort = useMemo(() => {
    if (config.defaultSortKey) return config.defaultSortKey;
    if (config.sortOptions && config.sortOptions.length > 0) return config.sortOptions[0].key;
    const firstSortable = config.columns.find((c) => c.sortable || c.sortAccessor);
    return firstSortable ? firstSortable.key : '';
  }, [config.defaultSortKey, config.sortOptions, config.columns]);

  const [sortKey, setSortKey] = useState<string>(defaultSort);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    config.defaultSortDirection || 'asc'
  );

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  // 1. Aplica ordenação
  const sortedData = useMemo(() => {
    if (!sortKey) return [...data];

    // Procura no sortOptions primeiro
    const explicitSortOpt = config.sortOptions?.find((o) => o.key === sortKey);
    // Ou procura na coluna
    const colDef = config.columns.find((c) => c.key === sortKey);

    const getVal = (item: T) => {
      if (explicitSortOpt) return explicitSortOpt.sortAccessor(item);
      if (colDef?.sortAccessor) return colDef.sortAccessor(item);
      return (item as Record<string, unknown>)[sortKey];
    };

    return [...data].sort((a, b) => {
      const valA = getVal(a);
      const valB = getVal(b);

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let result = 0;
      if (valA instanceof Date && valB instanceof Date) {
        result = valA.getTime() - valB.getTime();
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        result = valA - valB;
      } else {
        result = String(valA).localeCompare(String(valB), 'pt-BR', { numeric: true });
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortDirection, config.sortOptions, config.columns]);

  // 2. Aplica agrupamento dinâmico
  const groupedData = useMemo<ReportGroupData<T>[]>(() => {
    if (selectedGroupKey === 'none' || !config.groupOptions) {
      // Sem agrupamento: grupo único consolidado
      const subtotals: Record<string, number | string> = {};
      config.columns.forEach((col) => {
        if (col.aggregate) {
          subtotals[col.key] = calculateColumnTotal(sortedData, col);
        }
      });
      return [
        {
          groupKey: 'all',
          groupLabel: '',
          items: sortedData,
          subtotals,
        },
      ];
    }

    const groupOpt = config.groupOptions.find((g) => g.key === selectedGroupKey);
    if (!groupOpt) {
      return [
        {
          groupKey: 'all',
          groupLabel: '',
          items: sortedData,
          subtotals: {},
        },
      ];
    }

    const map = new Map<string, T[]>();
    sortedData.forEach((item) => {
      const gVal = groupOpt.groupBy(item) || 'Não informado';
      const existing = map.get(gVal);
      if (existing) {
        existing.push(item);
      } else {
        map.set(gVal, [item]);
      }
    });

    const groups: ReportGroupData<T>[] = [];
    map.forEach((items, groupVal) => {
      const label = groupOpt.groupLabel
        ? groupOpt.groupLabel(groupVal, items)
        : `${groupOpt.label}: ${groupVal} (${items.length})`;

      const subtotals: Record<string, number | string> = {};
      config.columns.forEach((col) => {
        if (col.aggregate) {
          subtotals[col.key] = calculateColumnTotal(items, col);
        }
      });

      groups.push({
        groupKey: groupVal,
        groupLabel: label,
        items,
        subtotals,
      });
    });

    return groups;
  }, [sortedData, selectedGroupKey, config.groupOptions, config.columns]);

  // 3. Totais gerais
  const overallTotals = useMemo(() => {
    const totals: Record<string, number | string> = {};
    config.columns.forEach((col) => {
      if (col.aggregate) {
        totals[col.key] = calculateColumnTotal(sortedData, col);
      }
    });
    return totals;
  }, [sortedData, config.columns]);

  // 4. Paginação física A4 com corte rigoroso de limite de folha
  const pages = useMemo(() => {
    return paginateReport(groupedData, config, orientation);
  }, [groupedData, config, orientation]);

  const triggerPrint = useCallback(() => {
    window.print();
  }, []);

  const triggerCsvExport = useCallback(() => {
    exportReportToCsv(sortedData, config.columns, config.fileName || config.title);
  }, [sortedData, config.columns, config.fileName, config.title]);

  return {
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
    pages,
    totalRecords: sortedData.length,
    overallTotals,
    triggerPrint,
    triggerCsvExport,
  };
}
