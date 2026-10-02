import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ReportViewerModal } from '../components/report/ReportViewerModal';
import { Button } from '../components/Button';
import type { ReportConfig } from '../components/report/reportTypes';

interface TransmissaoEsportiva {
  id: number;
  partida: string;
  arena: string;
  quadra: string;
  duracaoSegundos: number;
  status: 'Concluída' | 'No Ar' | 'Falha';
  modoVideo: string;
  dataHora: string;
  visualizacoes: number;
}

const mockTransmissoes: TransmissaoEsportiva[] = [
  {
    id: 101,
    partida: 'Circuito Verão - Final Open Masc',
    arena: 'Arena Central',
    quadra: 'Quadra 1 (Principal)',
    duracaoSegundos: 5400, // 1h 30min
    status: 'Concluída',
    modoVideo: 'GPU (HW)',
    dataHora: '02/10/2026 10:00',
    visualizacoes: 342,
  },
  {
    id: 102,
    partida: 'Torneio Amador - Semifinal A',
    arena: 'Arena Central',
    quadra: 'Quadra 2',
    duracaoSegundos: 3600, // 1h
    status: 'Concluída',
    modoVideo: 'CPU (SW)',
    dataHora: '02/10/2026 11:30',
    visualizacoes: 185,
  },
  {
    id: 103,
    partida: 'Treino Tático Seleção Sub-20',
    arena: 'Arena Central',
    quadra: 'Quadra 1 (Principal)',
    duracaoSegundos: 7200, // 2h
    status: 'No Ar',
    modoVideo: 'GPU (HW)',
    dataHora: '02/10/2026 14:00',
    visualizacoes: 410,
  },
  {
    id: 104,
    partida: 'Campeonato Estadual - Fase de Grupos',
    arena: 'Arena Praia Grande',
    quadra: 'Quadra Central Areia',
    duracaoSegundos: 4200, // 1h 10min
    status: 'Concluída',
    modoVideo: 'GPU (HW)',
    dataHora: '01/10/2026 09:00',
    visualizacoes: 520,
  },
  {
    id: 105,
    partida: 'Copa Regional - Oitavas',
    arena: 'Arena Praia Grande',
    quadra: 'Quadra 3',
    duracaoSegundos: 2700, // 45min
    status: 'Falha',
    modoVideo: 'Passthrough',
    dataHora: '01/10/2026 16:00',
    visualizacoes: 32,
  },
  {
    id: 106,
    partida: 'Desafio Noturno de Beach Tennis',
    arena: 'Arena Ilha Sports',
    quadra: 'Quadra Ilha VIP',
    duracaoSegundos: 4800, // 1h 20min
    status: 'Concluída',
    modoVideo: 'GPU (HW)',
    dataHora: '02/10/2026 19:30',
    visualizacoes: 290,
  },
];

function formatarDuracao(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}min`;
  return `${m}min`;
}

const configExemplo: ReportConfig<TransmissaoEsportiva> = {
  title: 'Relatório Executivo de Transmissões ao Vivo',
  subtitle: 'Competições Regionais e Treinos Oficiais • Período: Outubro/2026',
  emitterInfo: {
    arenaName: 'Rede Rock 10 Replay Brasil',
    unit: 'Operações e Transmissões',
    document: 'CNPJ: 12.345.678/0001-90',
    operatorName: 'Cristiano Groberio (Master Admin)',
    systemName: 'Rock 10 Replay Cloud',
  },
  filtersApplied: [
    { label: 'Período', value: '01/10/2026 a 02/10/2026' },
    { label: 'Arenas', value: 'Todas (3 ativas)' },
    { label: 'Origem', value: 'Painel Master' },
  ],
  columns: [
    {
      key: 'partida',
      header: 'Partida / Descrição',
      sortable: true,
      width: '28%',
    },
    {
      key: 'arena',
      header: 'Arena',
      sortable: true,
      width: '18%',
    },
    {
      key: 'quadra',
      header: 'Quadra',
      width: '18%',
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (item) => {
        const bg =
          item.status === 'No Ar'
            ? 'bg-emerald-100 text-emerald-800'
            : item.status === 'Concluída'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-rose-100 text-rose-800';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bg}`}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'modoVideo',
      header: 'Modo Vídeo',
      align: 'center',
    },
    {
      key: 'duracaoSegundos',
      header: 'Duração',
      align: 'right',
      sortable: true,
      sortAccessor: (i) => i.duracaoSegundos,
      aggregate: 'sum',
      aggregateAccessor: (i) => i.duracaoSegundos,
      formatAggregate: (total) => formatarDuracao(total),
      render: (item) => formatarDuracao(item.duracaoSegundos),
    },
    {
      key: 'visualizacoes',
      header: 'Views',
      align: 'right',
      sortable: true,
      aggregate: 'sum',
      formatAggregate: (v) => `${v.toLocaleString('pt-BR')} views`,
      render: (item) => item.visualizacoes.toLocaleString('pt-BR'),
    },
  ],
  groupOptions: [
    {
      key: 'arena',
      label: 'Por Arena',
      groupBy: (i) => i.arena,
    },
    {
      key: 'status',
      label: 'Por Status',
      groupBy: (i) => i.status,
    },
    {
      key: 'modoVideo',
      label: 'Por Modo de Vídeo',
      groupBy: (i) => i.modoVideo,
    },
  ],
  sortOptions: [
    {
      key: 'partida',
      label: 'Partida (A-Z)',
      sortAccessor: (i) => i.partida,
    },
    {
      key: 'duracaoSegundos',
      label: 'Maior Duração',
      sortAccessor: (i) => i.duracaoSegundos,
    },
    {
      key: 'visualizacoes',
      label: 'Mais Visualizados',
      sortAccessor: (i) => i.visualizacoes,
    },
  ],
  summaryMetrics: [
    {
      id: 'totalSessoes',
      label: 'Total de Sessões',
      value: (items) => `${items.length} transmissões`,
    },
    {
      id: 'tempoTotal',
      label: 'Horas Transmitidas',
      value: (items) => formatarDuracao(items.reduce((acc, curr) => acc + curr.duracaoSegundos, 0)),
      highlight: true,
    },
    {
      id: 'taxaSucesso',
      label: 'Taxa de Sucesso',
      value: (items) => {
        const ok = items.filter((i) => i.status !== 'Falha').length;
        return `${items.length > 0 ? ((ok / items.length) * 100).toFixed(1) : 100}%`;
      },
    },
    {
      id: 'totalViews',
      label: 'Audiência Acumulada',
      value: (items) => `${items.reduce((acc, curr) => acc + curr.visualizacoes, 0).toLocaleString('pt-BR')} views`,
    },
  ],
  defaultOrientation: 'portrait',
  fileName: 'relatorio_executivo_transmissoes_rock10',
};

const meta: Meta<typeof ReportViewerModal> = {
  title: 'Reports/ReportViewerModal',
  component: ReportViewerModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ReportViewerModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="p-8 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Demonstração: Padrão de Relatórios A4 Rock 10</h1>
        <p className="text-sm text-gray-400">
          Clique no botão abaixo para abrir a visualização A4 do relatório interativo.
        </p>
        <Button onClick={() => setIsOpen(true)}>Abrir Relatório A4</Button>

        <ReportViewerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          data={mockTransmissoes}
          config={configExemplo}
        />
      </div>
    );
  },
};

export const LandscapeOrientation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const landscapeConfig = { ...configExemplo, defaultOrientation: 'landscape' as const };

    return (
      <div className="p-8 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <Button onClick={() => setIsOpen(true)}>Abrir Relatório Paisagem (Landscape)</Button>

        <ReportViewerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          data={mockTransmissoes}
          config={landscapeConfig}
        />
      </div>
    );
  },
};
