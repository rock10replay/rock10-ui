import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Star, Settings, Trash2, Search, Plus, Save } from 'lucide-react';
import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    icon: <Star className="w-5 h-5 fill-white" />,
    ariaLabel: 'Favoritar',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: <Settings className="w-5 h-5" />,
    ariaLabel: 'Configurações',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    icon: <Trash2 className="w-5 h-5" />,
    ariaLabel: 'Excluir',
    variant: 'danger',
  },
};

export const Ghost: Story = {
  args: {
    icon: <Search className="w-5 h-5" />,
    ariaLabel: 'Pesquisar',
    variant: 'ghost',
  },
};

export const Rounded: Story = {
  args: {
    icon: <Plus className="w-5 h-5" />,
    ariaLabel: 'Adicionar',
    variant: 'primary',
    rounded: true,
  },
};

export const Loading: Story = {
  args: {
    icon: <Save className="w-5 h-5" />,
    ariaLabel: 'Salvando',
    variant: 'primary',
    loading: true,
  },
};
