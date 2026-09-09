import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';
import { Mail, Search, Lock } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Nome do Usuário',
    placeholder: 'Digite seu nome completo',
    inputSize: 'md',
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Digite seu nome completo');
    await userEvent.type(input, 'Cristiano Groberio');
    await expect(input).toHaveValue('Cristiano Groberio');
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input
        label="E-mail"
        placeholder="arena@rock10.com.br"
        startIcon={<Mail className="w-4 h-4" />}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        startIcon={<Lock className="w-4 h-4" />}
      />
      <Input
        placeholder="Buscar vídeos ou lances..."
        startIcon={<Search className="w-4 h-4" />}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <Input
        label="CPF do Responsável"
        defaultValue="123.456.789"
        error="CPF incompleto ou inválido"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Input
        label="Identificador da Câmera (Fixo)"
        defaultValue="CAM-QUADRA-01-4K"
        disabled
        helperText="Campo configurado diretamente pelo gateway"
      />
    </div>
  ),
};
