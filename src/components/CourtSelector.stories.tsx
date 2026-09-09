import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CourtSelector, type CourtItem } from './CourtSelector';

const meta: Meta<typeof CourtSelector> = {
  title: 'Components/Navigation/CourtSelector',
  component: CourtSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Filtrar por Quadra:',
    allLabel: 'Todas as Quadras',
    defaultCollapsed: false,
    courts: [
      { id: 1, nome: 'Quadra 01 (Beach Tennis)' },
      { id: 2, nome: 'Quadra 02 (Futevôlei)' },
      { id: 3, nome: 'Quadra 03 (Padel)' },
      { id: 4, nome: 'Quadra 04 (Vôlei de Praia)' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof CourtSelector>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<CourtItem | null>(null);
    return (
      <div className="w-[600px] p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-dark-border">
        <CourtSelector
          {...args}
          selectedCourt={selected}
          onSelectCourt={setSelected}
        />
        <div className="text-xs text-gray-500 mt-2">
          Quadra selecionada:{' '}
          <strong className="text-primary-600 dark:text-primary-400">
            {selected ? selected.nome : 'Todas as Quadras'}
          </strong>
        </div>
      </div>
    );
  },
};
