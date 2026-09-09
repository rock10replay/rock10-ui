import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PixPaymentModal } from './PixPaymentModal';

const meta: Meta<typeof PixPaymentModal> = {
  title: 'Components/Overlays/PixPaymentModal',
  component: PixPaymentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    title: 'Cobrança PIX Instantânea',
    payerName: 'Carlos Eduardo da Silva',
    documentNumber: '89421',
    competence: '09/2026',
    amount: 150.00,
    dueDate: '2026-09-15',
    pixPayload: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865406150.005802BR5913Rock10 Replay6009Sao Paulo62070503***6304ABCD',
    arenaName: 'Arena Verão Rock10',
    whatsappPhone: '11999998888',
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PixPaymentModal>;

export const Default: Story = {
  args: {},
};
