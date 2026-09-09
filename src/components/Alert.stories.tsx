import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
  },
  args: {
    variant: 'info',
    title: 'Informação Importante',
    children: 'O sistema de replay armazena as gravações em 4K por até 7 dias úteis.',
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  render: (args) => (
    <div className="w-96">
      <Alert {...args} />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="w-96">
      <Alert variant="success" title="Pagamento Aprovado">
        A cobrança PIX no valor de R$ 45,00 foi compensada instantaneamente.
      </Alert>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="w-96">
      <Alert variant="warning" title="Câmera Offline">
        A câmera da Quadra 3 não respondeu ao ping nos últimos 60 segundos.
      </Alert>
    </div>
  ),
};

export const Danger: Story = {
  render: () => (
    <div className="w-96">
      <Alert variant="danger" title="Erro no Processamento">
        Falha ao gerar o corte de vídeo. O disco do servidor atingiu 98% de ocupação.
      </Alert>
    </div>
  ),
};
