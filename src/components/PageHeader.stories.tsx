import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { Badge } from './Badge';
import { Video, Plus, Download } from 'lucide-react';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Gerenciador de Lances',
    description: 'Histórico completo de partidas e cortes em alta definição',
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[700px] p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-dark-border">
      <PageHeader
        {...args}
        icon={<Video className="w-6 h-6 text-primary-500" />}
        badge={<Badge variant="primary">Temporada 2026</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Exportar
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Novo Lance
            </Button>
          </>
        }
      />
    </div>
  ),
};
