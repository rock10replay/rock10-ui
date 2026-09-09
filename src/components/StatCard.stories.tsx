import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './StatCard';
import { DollarSign, Video, Users, Eye } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Data Display/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['purple', 'blue', 'emerald', 'amber', 'red', 'cyan', 'pink', 'yellow'],
    },
    variant: {
      control: 'select',
      options: ['default', 'horizontal', 'compact'],
    },
    isLoading: {
      control: 'boolean',
    },
    animateValue: {
      control: 'boolean',
    },
  },
  args: {
    title: 'Visualizações de Replay',
    value: 12480,
    subtitle: 'Neste mês (+18% vs anterior)',
    color: 'emerald',
    variant: 'default',
    trend: { value: 18, isPositive: true },
    icon: <Eye className="w-5 h-5" />,
    animateValue: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <StatCard {...args} />
    </div>
  ),
};

export const Financial: Story = {
  render: () => (
    <div className="w-80">
      <StatCard
        title="Receita de Cobranças PIX"
        value="R$ 38.450,00"
        subtitle="382 transações liquidadas"
        color="purple"
        icon={<DollarSign className="w-5 h-5" />}
        trend={{ value: 12.4, isPositive: true }}
        animateValue={false}
      />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-96">
      <StatCard
        variant="horizontal"
        title="Atletas Cadastrados"
        value={1540}
        subtitle="Usuários ativos no portal da arena"
        color="blue"
        icon={<Users className="w-5 h-5" />}
        trend={{ value: 8.2, isPositive: true }}
        animateValue={false}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-80">
      <StatCard
        variant="compact"
        title="Lances Gravados"
        value={4320}
        subtitle="Últimos 7 dias"
        color="amber"
        icon={<Video className="w-4 h-4" />}
        trend={{ value: 4.1, isPositive: true }}
        animateValue={false}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="w-80">
      <StatCard
        title="Carregando métricas..."
        value={0}
        isLoading
      />
    </div>
  ),
};
