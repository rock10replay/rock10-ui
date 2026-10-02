import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportViewerModal } from './ReportViewerModal';
import { useReportEngine } from './useReportEngine';
import { paginateReport } from './reportPaginator';
import type { ReportConfig } from './reportTypes';

interface MockItem {
  id: number;
  nome: string;
  arena: string;
  duracaoMin: number;
  data: string;
}

const mockData: MockItem[] = [
  { id: 1, nome: 'Final Masculina', arena: 'Arena Praia', duracaoMin: 90, data: '2026-10-01' },
  { id: 2, nome: 'Semifinal A', arena: 'Arena Central', duracaoMin: 45, data: '2026-10-02' },
  { id: 3, nome: 'Semifinal B', arena: 'Arena Central', duracaoMin: 60, data: '2026-09-30' },
];

const mockConfig: ReportConfig<MockItem> = {
  title: 'Relatório de Transmissões Esportivas',
  subtitle: 'Período: Outubro de 2026',
  emitterInfo: {
    arenaName: 'Complexo Esportivo Rock 10',
    unit: 'Quadras de Areia',
    operatorName: 'Cristiano Groberio',
  },
  filtersApplied: [
    { label: 'Arenas', value: 'Arena Praia, Arena Central' },
    { label: 'Status', value: 'Concluído' },
  ],
  columns: [
    { key: 'nome', header: 'Nome da Partida', sortable: true },
    { key: 'arena', header: 'Arena', sortable: true },
    {
      key: 'duracaoMin',
      header: 'Duração (min)',
      align: 'right',
      aggregate: 'sum',
      formatAggregate: (v) => `${v} min`,
      render: (item) => `${item.duracaoMin} min`,
    },
    { key: 'data', header: 'Data', align: 'center' },
  ],
  groupOptions: [
    {
      key: 'arena',
      label: 'Por Arena',
      groupBy: (i) => i.arena,
    },
  ],
  sortOptions: [
    {
      key: 'nome',
      label: 'Nome (A-Z)',
      sortAccessor: (i) => i.nome,
    },
    {
      key: 'duracaoMin',
      label: 'Duração',
      sortAccessor: (i) => i.duracaoMin,
    },
  ],
  summaryMetrics: [
    {
      id: 'totalDuracao',
      label: 'Tempo Total',
      value: (items) => `${items.reduce((acc, curr) => acc + curr.duracaoMin, 0)} min`,
      highlight: true,
    },
  ],
};

describe('useReportEngine Hook', () => {
  it('initializes with default orientation and calculates total records', () => {
    const { result } = renderHook(() => useReportEngine(mockData, mockConfig));
    expect(result.current.orientation).toBe('portrait');
    expect(result.current.totalRecords).toBe(3);
    expect(result.current.overallTotals['duracaoMin']).toBe('195 min');
    expect(result.current.pages.length).toBe(1);
    expect(result.current.pages[0].pageNumber).toBe(1);
  });

  it('sorts data ascending and descending', () => {
    const { result } = renderHook(() => useReportEngine(mockData, mockConfig));

    // Padrão: nome ASC ('Final Masculina', 'Semifinal A', 'Semifinal B')
    expect(result.current.groupedData[0].items[0].nome).toBe('Final Masculina');

    // Inverte direção para DESC
    act(() => {
      result.current.toggleSortDirection();
    });
    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.groupedData[0].items[0].nome).toBe('Semifinal B');

    // Altera sortKey para duracaoMin
    act(() => {
      result.current.setSortKey('duracaoMin');
      result.current.setSortDirection('asc');
    });
    expect(result.current.groupedData[0].items[0].nome).toBe('Semifinal A'); // 45 min
  });

  it('groups data and computes subtotals per group', () => {
    const { result } = renderHook(() => useReportEngine(mockData, mockConfig));

    act(() => {
      result.current.setSelectedGroupKey('arena');
    });

    expect(result.current.groupedData.length).toBe(2); // Arena Praia e Arena Central

    const arenaCentral = result.current.groupedData.find((g) => g.groupKey === 'Arena Central');
    expect(arenaCentral).toBeDefined();
    expect(arenaCentral?.items.length).toBe(2);
    expect(arenaCentral?.subtotals['duracaoMin']).toBe('105 min'); // 45 + 60

    const arenaPraia = result.current.groupedData.find((g) => g.groupKey === 'Arena Praia');
    expect(arenaPraia?.items.length).toBe(1);
    expect(arenaPraia?.subtotals['duracaoMin']).toBe('90 min');
  });
});

describe('reportPaginator Module', () => {
  it('divides 46 items into multiple A4 pages when exceeding single page height', () => {
    const largeDataset: MockItem[] = Array.from({ length: 46 }, (_, i) => ({
      id: i + 1,
      nome: `Partida ${i + 1}`,
      arena: 'Arena 15A Beach Sports',
      duracaoMin: 60,
      data: '2026-10-02',
    }));

    const groups = [
      {
        groupKey: 'all',
        groupLabel: '',
        items: largeDataset,
        subtotals: {},
      },
    ];

    const pages = paginateReport(groups, mockConfig, 'portrait');
    expect(pages.length).toBeGreaterThan(1);
    expect(pages[0].pageNumber).toBe(1);
    expect(pages[0].totalPages).toBe(pages.length);
    expect(pages[0].isFirstPage).toBe(true);
    expect(pages[pages.length - 1].isLastPage).toBe(true);
    expect(pages[pages.length - 1].showSummary).toBe(true);
  });
});

describe('ReportViewerModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders report header, table rows and summary when open', () => {
    render(
      <ReportViewerModal
        isOpen={true}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );

    // Título e Emissor
    expect(screen.getAllByText('Relatório de Transmissões Esportivas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Complexo Esportivo Rock 10')).toBeDefined();

    // Filtros aplicados
    expect(screen.getByText(/Arena Praia, Arena Central/i)).toBeDefined();

    // Linhas da Tabela
    expect(screen.getByText('Final Masculina')).toBeDefined();
    expect(screen.getByText('Semifinal A')).toBeDefined();
    expect(screen.getByText('Semifinal B')).toBeDefined();

    // Totalizador Geral
    expect(screen.getByText('Fechamento Geral do Relatório')).toBeDefined();
    expect(screen.getAllByText('195 min').length).toBeGreaterThanOrEqual(1);

    // Rodapé
    expect(screen.getAllByText('Rock 10 Replay').length).toBeGreaterThanOrEqual(1);
  });

  it('toggles orientation between portrait and landscape', () => {
    render(
      <ReportViewerModal
        isOpen={true}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );

    const landscapeBtn = screen.getByText('📑 Paisagem');
    fireEvent.click(landscapeBtn);

    const a4Pages = document.querySelectorAll('.a4-page');
    expect(a4Pages.length).toBeGreaterThan(0);
    expect(a4Pages[0].className).toContain('orientation-landscape');

    const portraitBtn = screen.getByText('📄 Retrato');
    fireEvent.click(portraitBtn);
    expect(a4Pages[0].className).toContain('orientation-portrait');
  });

  it('calls window.print when clicking Imprimir / PDF button', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <ReportViewerModal
        isOpen={true}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );

    const printBtn = screen.getByRole('button', { name: /Imprimir \/ PDF/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});
