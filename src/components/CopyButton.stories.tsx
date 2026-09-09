import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CopyButton } from './CopyButton';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/Actions/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'icon'],
      description: 'Estilo visual do botão de cópia',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
      description: 'Tamanho do botão',
    },
    text: {
      control: 'text',
      description: 'Texto copiado para a área de transferência',
    },
    label: {
      control: 'text',
      description: 'Rótulo padrão antes do clique',
    },
    copiedLabel: {
      control: 'text',
      description: 'Rótulo exibido após a cópia bem-sucedida',
    },
  },
  args: {
    text: 'https://rock10replay.com.br/video/arena-sp/12345',
    label: 'Copiar Link',
    copiedLabel: 'Link Copiado!',
    variant: 'outline',
    size: 'sm',
    onCopy: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    label: 'Copiar Chave PIX',
    text: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000',
  },
  play: async ({ canvasElement, args }) => {
    // Garante que o clipboard do browser não rejeite por falta de foco/permissão de janela no Chromium headless
    try {
      if (typeof navigator !== 'undefined') {
        if (!navigator.clipboard) {
          Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: async () => {} },
            configurable: true,
            writable: true,
          });
        } else {
          navigator.clipboard.writeText = async () => {};
        }
      }
    } catch {}

    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onCopy).toHaveBeenCalled();
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Copiar Código de Acesso',
    text: 'ROCK10-VIP-2026',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'icon',
    label: undefined,
    copiedLabel: undefined,
    text: 'https://rock10.com.br',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CopyButton size="xs" text="Valor XS" label="Copiar XS" />
      <CopyButton size="sm" text="Valor SM" label="Copiar SM" />
      <CopyButton size="md" text="Valor MD" label="Copiar MD" />
    </div>
  ),
};
