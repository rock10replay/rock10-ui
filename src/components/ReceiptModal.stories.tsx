import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ReceiptModal } from './ReceiptModal';

const meta: Meta<typeof ReceiptModal> = {
  title: 'Components/Overlays/ReceiptModal',
  component: ReceiptModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    receiptNumber: '2026-08412',
    issuerName: 'Rock10 Replay & Arenas Esportivas Ltda',
    issuerSubtitle: 'CNPJ: 12.345.678/0001-90 • São Paulo, SP',
    payerName: 'Mariana Guimarães de Souza',
    payerDocument: '345.678.901-22',
    amountPaid: 220.00,
    totalAmount: 220.00,
    paymentDate: '2026-09-09',
    paymentMethod: 'PIX Instantâneo',
    description: 'Locação da Quadra 01 (Beach Tennis) - 2 Horas c/ Sistema Replay 4K',
    documentNumber: '1094',
    competence: 'Setembro / 2026',
    operatorName: 'Recepção Arena Central',
    onClose: fn(),
    onPrint: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ReceiptModal>;

export const IntegralPayment: Story = {
  args: {},
};

export const PartialPayment: Story = {
  args: {
    amountPaid: 100.00,
    totalAmount: 200.00,
    description: 'Entrada para Reserva de Torneio (Sinal 50%)',
  },
};
