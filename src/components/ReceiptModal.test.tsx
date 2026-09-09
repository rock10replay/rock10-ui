import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReceiptModal } from './ReceiptModal';

describe('ReceiptModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ReceiptModal
        isOpen={false}
        onClose={vi.fn()}
        receiptNumber="REC-101"
        issuerName="Arena Central"
        payerName="Maria Souza"
        amountPaid={200}
      />
    );
    expect(screen.queryByText('REC-101')).toBeNull();
  });

  it('renders receipt details and handles print button click', () => {
    const handlePrint = vi.fn();
    render(
      <ReceiptModal
        isOpen={true}
        onClose={vi.fn()}
        receiptNumber="REC-101"
        issuerName="Arena Central"
        payerName="Maria Souza"
        amountPaid={200}
        onPrint={handlePrint}
      />
    );

    expect(screen.getByText('Arena Central')).toBeDefined();
    expect(screen.getByText('RECIBO #REC-101')).toBeDefined();
    expect(screen.getByText('Maria Souza')).toBeDefined();

    const printBtn = screen.getByText('Imprimir Recibo');
    fireEvent.click(printBtn);
    expect(handlePrint).toHaveBeenCalledTimes(1);
  });
});
