import React from 'react';

export type ReportOrientation = 'portrait' | 'landscape';

export interface ReportColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  /** Função de extração de valor para ordenação */
  sortAccessor?: (item: T) => string | number | Date | null | undefined;
  /** Tipo de agregação automática para subtotais e totais */
  aggregate?: 'sum' | 'count' | 'avg' | 'custom';
  aggregateAccessor?: (item: T) => number;
  formatAggregate?: (value: number) => string;
  /** Se deve ser incluído na exportação CSV (padrão true) */
  csvExportable?: boolean;
  csvAccessor?: (item: T) => string | number;
}

export interface ReportGroupOption<T> {
  key: string;
  label: string;
  groupBy: (item: T) => string;
  groupLabel?: (groupValue: string, items: T[]) => string;
}

export interface ReportSortOption<T> {
  key: string;
  label: string;
  sortAccessor: (item: T) => string | number | Date | null | undefined;
}

export interface ReportSummaryMetric<T> {
  id: string;
  label: string;
  value: (items: T[]) => React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export interface ReportEmitterInfo {
  arenaName?: string;
  unit?: string;
  document?: string; // ex: CNPJ / CPF
  contact?: string;
  operatorName?: string;
  systemName?: string;
}

export interface ReportFilterBadge {
  label: string;
  value: string;
}

export interface ReportConfig<T> {
  title: string;
  subtitle?: string;
  emitterName?: string;
  emitterInfo?: ReportEmitterInfo;
  filtersApplied?: ReportFilterBadge[];
  appliedFilters?: ReportFilterBadge[];
  columns: ReportColumn<T>[];
  groupOptions?: ReportGroupOption<T>[];
  sortOptions?: ReportSortOption<T>[];
  summaryMetrics?: ReportSummaryMetric<T>[];
  defaultOrientation?: ReportOrientation;
  defaultGroupKey?: string;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  /** Limite máximo opcional de itens por página A4 (calculado dinamicamente caso omitido) */
  pageSize?: number;
  /** Nome do arquivo ao baixar CSV ou sugerir no PDF (sem extensão) */
  fileName?: string;
}

export interface ReportGroupData<T> {
  groupKey: string;
  groupLabel: string;
  items: T[];
  subtotals: Record<string, number | string>;
}

export interface ReportPageGroup<T> {
  groupKey: string;
  groupLabel: string;
  isContinuation?: boolean;
  items: T[];
  itemStartIndex: number;
  subtotals?: Record<string, number | string>;
  showSubtotals?: boolean;
}

export interface ReportPage<T> {
  pageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  groups: ReportPageGroup<T>[];
  showSummary: boolean;
}
