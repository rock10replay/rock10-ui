import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
  it('renders with label and formats initial value', () => {
    render(<CurrencyInput label="Valor Mensal" value={150.5} />);

    expect(screen.getByText('Valor Mensal')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('150,50');
    expect(screen.getByText('R$')).toBeInTheDocument();
  });

  it('shifts digits right-to-left when typing digits', async () => {
    const handleValueChange = vi.fn();
    render(<CurrencyInput value={0} onValueChange={handleValueChange} />);

    const input = screen.getByRole('textbox');
    input.focus();

    fireEvent.keyDown(input, { key: '1' });
    expect(handleValueChange).toHaveBeenCalledWith(0.01, '0,01');

    fireEvent.keyDown(input, { key: '5' });
    expect(handleValueChange).toHaveBeenCalledWith(0.15, '0,15');

    fireEvent.keyDown(input, { key: '0' });
    expect(handleValueChange).toHaveBeenCalledWith(1.5, '1,50');
  });

  it('deletes centavos when pressing Backspace', async () => {
    const handleValueChange = vi.fn();
    render(<CurrencyInput value={15.5} onValueChange={handleValueChange} />);

    const input = screen.getByRole('textbox');
    input.focus();

    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(handleValueChange).toHaveBeenCalledWith(1.55, '1,55');
  });

  it('resets to 0 and calls onClear when clicking clear button', async () => {
    const handleValueChange = vi.fn();
    const handleClear = vi.fn();
    render(
      <CurrencyInput
        value={100}
        clearable
        onValueChange={handleValueChange}
        onClear={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /limpar/i });
    await userEvent.click(clearBtn);

    expect(handleValueChange).toHaveBeenCalledWith(0, '0,00');
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('handles paste of formatted currency text', () => {
    const handleValueChange = vi.fn();
    render(<CurrencyInput value={0} onValueChange={handleValueChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => 'R$ 1.250,90',
      },
    });

    expect(handleValueChange).toHaveBeenCalledWith(1250.9, '1.250,90');
  });
});
