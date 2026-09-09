import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'info', 'purple', 'neutral', 'primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    shape: {
      control: 'select',
      options: ['pill', 'rounded'],
    },
    dot: {
      control: 'boolean',
    },
    pulseDot: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'primary',
    children: 'QUADRA 1',
    size: 'sm',
    shape: 'pill',
    dot: false,
    pulseDot: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'ROCK10 REPLAY',
  },
};

export const LiveRecording: Story = {
  args: {
    variant: 'danger',
    children: 'GRAVANDO AO VIVO',
    dot: true,
    pulseDot: true,
    size: 'md',
  },
};

export const ActiveCourt: Story = {
  args: {
    variant: 'success',
    children: 'QUADRA DISPONÍVEL',
    dot: true,
  },
};

export const StatusPills: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="primary">PRIMÁRIO</Badge>
      <Badge variant="secondary">ENERGIA</Badge>
      <Badge variant="success" dot>CONECTADO</Badge>
      <Badge variant="warning" dot>PENDENTE</Badge>
      <Badge variant="danger" dot pulseDot>EM GRAVAÇÃO</Badge>
      <Badge variant="info">INFO</Badge>
      <Badge variant="purple">TORNEIO VIP</Badge>
      <Badge variant="neutral">FINALIZADO</Badge>
    </div>
  ),
};
