import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PixPaymentModal } from './PixPaymentModal';

describe('PixPaymentModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <PixPaymentModal
        isOpen={false}
        onClose={vi.fn()}
        payerName="João Silva"
        amount={150}
      />
    );
    expect(screen.queryByText('João Silva')).toBeNull();
  });

  it('renders payer name, amount and calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(
      <PixPaymentModal
        isOpen={true}
        onClose={handleClose}
        payerName="João Silva"
        amount={150}
        pixPayload="00020126580014br.gov.bcb.pix"
      />
    );

    expect(screen.getByText('João Silva')).toBeDefined();
    expect(screen.getByText('Cobrança Pix Instantânea')).toBeDefined();

    const closeBtn = screen.getByLabelText('Fechar');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
