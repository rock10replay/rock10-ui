import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EmptyState } from './EmptyState';
import { VideoOff, Search, AlertCircle } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Data Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Nenhum replay encontrado',
    description: 'Não foram encontrados lances gravados para o filtro e período selecionados.',
    variant: 'default',
    icon: <VideoOff className="w-8 h-8" />,
    action: {
      label: 'Limpar Filtros de Busca',
      onClick: fn(),
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[500px] border border-gray-200 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-surface">
      <EmptyState {...args} />
    </div>
  ),
};

export const SearchEmpty: Story = {
  render: () => (
    <div className="w-[500px] border border-gray-200 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-surface">
      <EmptyState
        variant="search"
        icon={<Search className="w-8 h-8" />}
        title="Busca sem resultados"
        description="Tente pesquisar com outros termos ou verifique a ortografia do nome do atleta."
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="w-[500px] border border-gray-200 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-surface">
      <EmptyState
        variant="error"
        icon={<AlertCircle className="w-8 h-8" />}
        title="Erro ao carregar vídeos"
        description="Não foi possível se comunicar com o serviço de streaming da arena."
        action={{
          label: 'Tentar Novamente',
          onClick: fn(),
        }}
      />
    </div>
  ),
};
