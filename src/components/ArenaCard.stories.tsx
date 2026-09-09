import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArenaCard } from './ArenaCard';

const meta: Meta<typeof ArenaCard> = {
  title: 'Components/Data Display/ArenaCard',
  component: ArenaCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    arena: {
      id: 1,
      nome: 'Arena Verão Beach Club',
      cidade: 'Santos',
      uf: 'SP',
      total_quadras: 6,
      ativo: true,
      logo_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=120&q=80',
    },
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ArenaCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <ArenaCard {...args} />
    </div>
  ),
};

export const Inactive: Story = {
  render: (args) => (
    <div className="w-80">
      <ArenaCard
        {...args}
        arena={{
          ...args.arena,
          nome: 'Arena São Paulo Replay',
          ativo: false,
        }}
      />
    </div>
  ),
};
