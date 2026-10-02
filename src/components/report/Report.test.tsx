import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportViewerModal } from './ReportViewerModal';
import { useReportEngine } from './useReportEngine';
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
    expect(result.current.groupedData[0].items[0].duracaoMin).toBe(45);
  });

  it('groups data and computes subtotals by group', () => {
    const { result } = renderHook(() => useReportEngine(mockData, mockConfig));

    act(() => {
      result.current.setSelectedGroupKey('arena');
    });

    // Deve ter 2 grupos: Arena Praia e Arena Central
    expect(result.current.groupedData.length).toBe(2);

    const arenaCentral = result.current.groupedData.find((g) => g.groupKey === 'Arena Central');
    expect(arenaCentral).toBeDefined();
    expect(arenaCentral?.items.length).toBe(2);
    // Subtotal de Arena Central: 45 + 60 = 105 min
    expect(arenaCentral?.subtotals['duracaoMin']).toBe('105 min');

    const arenaPraia = result.current.groupedData.find((g) => g.groupKey === 'Arena Praia');
    expect(arenaPraia?.items.length).toBe(1);
    expect(arenaPraia?.subtotals['duracaoMin']).toBe('90 min');
  });
});

describe('ReportViewerModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ReportViewerModal
        isOpen={false}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );
    expect(screen.queryByText('Relatório de Transmissões Esportivas')).toBeNull();
  });

  it('renders complete A4 document elements when isOpen is true', () => {
    render(
      <ReportViewerModal
        isOpen={true}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );

    // Header & Título
    expect(screen.getAllByText('Relatório de Transmissões Esportivas').length).toBeGreaterThan(0);
    expect(screen.getByText('Período: Outubro de 2026')).toBeDefined();
    expect(screen.getByText('Complexo Esportivo Rock 10')).toBeDefined();

    // Filtros
    expect(screen.getByText('Arena Praia, Arena Central')).toBeDefined();

    // Linhas da Tabela
    expect(screen.getByText('Final Masculina')).toBeDefined();
    expect(screen.getByText('Semifinal A')).toBeDefined();
    expect(screen.getByText('Semifinal B')).toBeDefined();

    // Totalizador Geral
    expect(screen.getByText('Fechamento Geral do Relatório')).toBeDefined();
    expect(screen.getAllByText('195 min').length).toBeGreaterThanOrEqual(1);

    // Rodapé
    expect(screen.getByText('Rock 10 Replay')).toBeDefined();
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

    const printContainer = document.getElementById('rock10-report-print');
    expect(printContainer?.className).toContain('orientation-landscape');

    const portraitBtn = screen.getByText('📄 Retrato');
    fireEvent.click(portraitBtn);
    expect(printContainer?.className).toContain('orientation-portrait');
  });

  it('calls window.print when clicking Imprimir / Salvar PDF button', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <ReportViewerModal
        isOpen={true}
        onClose={vi.fn()}
        data={mockData}
        config={mockConfig}
      />
    );

    const printBtn = screen.getByText('Imprimir / Salvar PDF');
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});
