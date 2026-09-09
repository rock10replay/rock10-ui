import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    isOpen: {
      control: 'boolean',
    },
    closeOnOutsideClick: {
      control: 'boolean',
    },
  },
  args: {
    isOpen: true,
    title: 'Detalhes da Partida',
    size: 'md',
    closeOnOutsideClick: true,
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-3">
        <p>Partida final do Torneio de Inverno na Quadra 01.</p>
        <p className="text-xs text-gray-400">Duração: 1h 45min • 4 câmeras sincronizadas • Formato MP4 H.264.</p>
      </div>
    ),
    footer: (
      <>
        <Button variant="outline" size="sm">Fechar</Button>
        <Button variant="primary" size="sm">Baixar Pacote ZIP</Button>
      </>
    ),
  },
};
