import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { HeroBanner } from './HeroBanner';
import { Sparkles, Play, Calendar } from 'lucide-react';

const meta: Meta<typeof HeroBanner> = {
  title: 'Components/Data Display/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    badge: {
      text: 'Novo Sistema 4K Instalado',
      icon: <Sparkles className="w-4 h-4 text-primary-500" />,
    },
    title: 'Seus Melhores Lances Gravados em Alta Definição',
    description: 'Acesse instantaneamente replays em 4K das suas partidas na Arena Verão. Assista, baixe e compartilhe direto no seu perfil.',
    primaryAction: {
      label: 'Ver Replays de Hoje',
      icon: <Play className="w-4 h-4 fill-white" />,
      onClick: fn(),
    },
    secondaryAction: {
      label: 'Agendar Quadra',
      icon: <Calendar className="w-4 h-4" />,
      onClick: fn(),
    },
    ambientGlow: true,
  },
};

export default meta;
type Story = StoryObj<typeof HeroBanner>;

export const Default: Story = {
  args: {},
};
