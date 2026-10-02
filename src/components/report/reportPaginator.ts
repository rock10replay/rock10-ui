import type {
  ReportConfig,
  ReportOrientation,
  ReportGroupData,
  ReportPage,
  ReportPageGroup,
} from './reportTypes';

interface LayoutHeights {
  usableHeight: number;
  page1Header: number;
  continuationHeader: number;
  tableHeader: number;
  row: number;
  groupHeader: number;
  groupSubtotal: number;
  summary: number;
  safetyBuffer: number;
}

function getLayoutHeights<T>(
  orientation: ReportOrientation,
  config: ReportConfig<T>
): LayoutHeights {
  const isLandscape = orientation === 'landscape';
  const hasFilters = Boolean(
    (config.appliedFilters && config.appliedFilters.length > 0) ||
    (config.filtersApplied && config.filtersApplied.length > 0)
  );
  const hasMetrics = Boolean(config.summaryMetrics && config.summaryMetrics.length > 0);

  if (isLandscape) {
    return {
      usableHeight: 180, // 210mm - 20mm padding - 10mm footer
      page1Header: 46 + (hasFilters ? 12 : 0),
      continuationHeader: 12,
      tableHeader: 8.5,
      row: 8.5,
      groupHeader: 8.5,
      groupSubtotal: 8.5,
      summary: (hasMetrics ? 26 : 0) + 18 + 10,
      safetyBuffer: 12,
    };
  }

  // Portrait (297mm x 210mm)
  // Usable height inside 10mm top + 10mm bottom padding: 277mm.
  // Reserving 12mm for ReportFooter: 265mm available for content.
  // Rows can wrap to 2 lines (dates, long quadra names), measuring ~9.8-10.0mm each in DOM.
  return {
    usableHeight: 265,
    page1Header: 50 + (hasFilters ? 14 : 0), // 64mm with filters, 50mm without
    continuationHeader: 12,
    tableHeader: 9.0,
    row: 10.0, // accurately accounts for 2-line wrapped cells and status badges
    groupHeader: 9.0,
    groupSubtotal: 9.0,
    summary: (hasMetrics ? 26 : 0) + 20 + 12, // 58mm with metrics, 32mm without
    safetyBuffer: 16,
  };
}

/**
 * Divide os grupos e linhas em páginas A4 rigorosamente respeitando o limite físico da folha.
 * Quando o conteúdo atinge a altura limite de uma folha A4, cria uma nova página.
 */
export function paginateReport<T>(
  groups: ReportGroupData<T>[],
  config: ReportConfig<T>,
  orientation: ReportOrientation
): ReportPage<T>[] {
  const totalItemsCount = groups.reduce((acc, g) => acc + g.items.length, 0);

  // Caso 0 registros: 1 página vazia com resumo
  if (totalItemsCount === 0) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        isFirstPage: true,
        isLastPage: true,
        groups: groups.map((g) => ({
          ...g,
          itemStartIndex: 0,
          isContinuation: false,
          showSubtotals: true,
        })),
        showSummary: true,
      },
    ];
  }

  const H = getLayoutHeights(orientation, config);
  const hasMultipleGroups = groups.length > 1 || (groups.length === 1 && groups[0].groupKey !== 'all');

  // Verifica se tudo cabe confortavelmente em uma única folha A4
  const totalGroupHeadersHeight = hasMultipleGroups ? groups.length * H.groupHeader : 0;
  const totalSubtotalsHeight = hasMultipleGroups ? groups.length * H.groupSubtotal : 0;
  const totalItemsHeight = totalItemsCount * H.row;
  const totalNeededForSinglePage =
    H.page1Header +
    H.tableHeader +
    totalGroupHeadersHeight +
    totalItemsHeight +
    totalSubtotalsHeight +
    H.summary +
    H.safetyBuffer;

  if (!config.pageSize && totalNeededForSinglePage <= H.usableHeight) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        isFirstPage: true,
        isLastPage: true,
        groups: groups.map((g) => ({
          ...g,
          itemStartIndex: 0,
          isContinuation: false,
          showSubtotals: true,
        })),
        showSummary: true,
      },
    ];
  }

  // Multi-páginas: distribui os itens e grupos respeitando o orçamento de altura
  const pages: ReportPage<T>[] = [];
  let currentPageNumber = 1;

  let currentUsedHeight = H.page1Header + H.tableHeader;
  let currentMaxHeight = H.usableHeight - H.safetyBuffer;
  let currentPageGroups: ReportPageGroup<T>[] = [];

  // Fila de grupos a processar
  for (let gIdx = 0; gIdx < groups.length; gIdx++) {
    const group = groups[gIdx];
    let groupItems = [...group.items];
    let isContinuation = false;
    let itemStartIndex = 0;

    while (groupItems.length > 0 || (!isContinuation && hasMultipleGroups)) {
      // Se precisamos de um novo grupo nesta folha
      const groupHeaderCost = hasMultipleGroups ? H.groupHeader : 0;

      // Se nem o cabeçalho do grupo cabe, fecha a página atual e abre uma nova
      if (
        currentPageGroups.length > 0 &&
        currentUsedHeight + groupHeaderCost + H.row > currentMaxHeight
      ) {
        pages.push({
          pageNumber: currentPageNumber,
          totalPages: 0, // calculado no final
          isFirstPage: currentPageNumber === 1,
          isLastPage: false,
          groups: currentPageGroups,
          showSummary: false,
        });

        currentPageNumber++;
        currentPageGroups = [];
        currentUsedHeight = H.continuationHeader + H.tableHeader;
        currentMaxHeight = H.usableHeight - H.safetyBuffer;
      }

      currentUsedHeight += groupHeaderCost;

      // Quantos itens deste grupo cabem nesta página?
      const remainingHeight = currentMaxHeight - currentUsedHeight;
      let capacityInRows = Math.floor(remainingHeight / H.row);

      // Respeita config.pageSize se fornecido explicitamente
      if (config.pageSize && config.pageSize > 0) {
        capacityInRows = Math.min(capacityInRows, config.pageSize);
      }

      // Se couber 0 linhas e a página já tiver conteúdo, fecha a folha
      if (capacityInRows <= 0 && currentPageGroups.length > 0) {
        pages.push({
          pageNumber: currentPageNumber,
          totalPages: 0,
          isFirstPage: currentPageNumber === 1,
          isLastPage: false,
          groups: currentPageGroups,
          showSummary: false,
        });

        currentPageNumber++;
        currentPageGroups = [];
        currentUsedHeight = H.continuationHeader + H.tableHeader;
        currentMaxHeight = H.usableHeight - H.safetyBuffer;
        continue;
      }

      // Garante ao menos 1 linha se a página estiver em branco
      capacityInRows = Math.max(1, capacityInRows);

      const itemsForThisPage = groupItems.slice(0, capacityInRows);
      groupItems = groupItems.slice(capacityInRows);

      const isGroupFinished = groupItems.length === 0;
      const subtotalCost = hasMultipleGroups && isGroupFinished ? H.groupSubtotal : 0;

      currentPageGroups.push({
        groupKey: group.groupKey,
        groupLabel: group.groupLabel,
        isContinuation,
        items: itemsForThisPage,
        itemStartIndex,
        subtotals: group.subtotals,
        showSubtotals: isGroupFinished,
      });

      currentUsedHeight += itemsForThisPage.length * H.row + subtotalCost;
      itemStartIndex += itemsForThisPage.length;

      // Se ainda restam itens neste grupo para a próxima página
      if (!isGroupFinished) {
        isContinuation = true;
        pages.push({
          pageNumber: currentPageNumber,
          totalPages: 0,
          isFirstPage: currentPageNumber === 1,
          isLastPage: false,
          groups: currentPageGroups,
          showSummary: false,
        });

        currentPageNumber++;
        currentPageGroups = [];
        currentUsedHeight = H.continuationHeader + H.tableHeader;
        currentMaxHeight = H.usableHeight - H.safetyBuffer;
      }
    }
  }

  // Verifica se o bloco de resumo/totalizador cabe na página atual
  if (currentUsedHeight + H.summary <= currentMaxHeight) {
    // Cabe na página final junto com os últimos itens
    pages.push({
      pageNumber: currentPageNumber,
      totalPages: 0,
      isFirstPage: currentPageNumber === 1,
      isLastPage: true,
      groups: currentPageGroups,
      showSummary: true,
    });
  } else {
    // Não cabe na página atual: fecha a página atual de itens e cria uma página dedicada ao resumo
    if (currentPageGroups.length > 0) {
      pages.push({
        pageNumber: currentPageNumber,
        totalPages: 0,
        isFirstPage: currentPageNumber === 1,
        isLastPage: false,
        groups: currentPageGroups,
        showSummary: false,
      });
      currentPageNumber++;
    }

    // Página exclusiva de fechamento / totalizadores
    pages.push({
      pageNumber: currentPageNumber,
      totalPages: 0,
      isFirstPage: false,
      isLastPage: true,
      groups: [],
      showSummary: true,
    });
  }

  // Preenche o totalPages correto em todas as folhas geradas
  const totalPages = pages.length;
  pages.forEach((p) => {
    p.totalPages = totalPages;
  });

  return pages;
}
