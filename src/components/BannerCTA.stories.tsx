import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BannerCTA } from './BannerCTA';
import { Trophy } from 'lucide-react';

const meta: Meta<typeof BannerCTA> = {
  title: 'Components/Data Display/BannerCTA',
  component: BannerCTA,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'dark', 'emerald'],
    },
  },
  args: {
    title: 'Transforme sua Arena com o Sistema Rock10 Replay',
    description: 'Instalação rápida de 4 câmeras 4K por quadra, botão físico de acionamento e transmissão instantânea para o celular dos seus clientes.',
    actionText: 'Solicitar Demonstração Gratuita',
    variant: 'primary',
    icon: <Trophy className="w-8 h-8 text-white" />,
    onAction: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BannerCTA>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
  },
};

export const Emerald: Story = {
  args: {
    variant: 'emerald',
  },
};
