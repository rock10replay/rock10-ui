import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { Play, ArrowRight, Trash2, CheckCircle } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'purple', 'link'],
      description: 'Variante visual do botão',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do botão',
    },
    isLoading: {
      control: 'boolean',
      description: 'Exibe spinner de carregamento',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita interação com o botão',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura disponível',
    },
  },
  args: {
    onClick: fn(),
    children: 'Confirmar Ação',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Ação Principal',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secundário',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Borda Sutil',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Botão Transparente',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Excluir Item',
    leftIcon: <Trash2 className="w-4 h-4" />,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Salvo com Sucesso',
    leftIcon: <CheckCircle className="w-4 h-4" />,
  },
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    children: 'Assistir Replay',
    leftIcon: <Play className="w-4 h-4 fill-white" />,
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Processando...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Indisponível',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm" variant="primary">Pequeno (sm)</Button>
      <Button size="md" variant="primary">Médio (md)</Button>
      <Button size="lg" variant="primary">Grande (lg)</Button>
    </div>
  ),
};
