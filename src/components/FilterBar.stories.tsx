import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterBar } from './FilterBar';
import { Input } from './Input';
import { Select } from './Select';

const meta: Meta<typeof FilterBar> = {
  title: 'Components/Layout/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Filtrar Lances',
    hasActiveFilters: true,
    activeFiltersCount: 2,
    onClearFilters: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[800px]">
      <FilterBar {...args}>
        <Input placeholder="Buscar por jogador..." inputSize="sm" />
        <Select
          selectSize="sm"
          options={[
            { value: '', label: 'Todas as Quadras' },
            { value: '1', label: 'Quadra 1' },
            { value: '2', label: 'Quadra 2' },
          ]}
        />
        <Select
          selectSize="sm"
          options={[
            { value: '', label: 'Qualquer Resolução' },
            { value: '4k', label: 'Ultra HD 4K' },
            { value: '1080p', label: 'Full HD' },
          ]}
        />
      </FilterBar>
    </div>
  ),
};
