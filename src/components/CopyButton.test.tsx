import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders with label and copies text on click', async () => {
    const onCopy = vi.fn();
    render(<CopyButton text="rock10-token-123" label="Copiar Token" onCopy={onCopy} />);

    const button = screen.getByRole('button', { name: /copiar/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('rock10-token-123');
    expect(onCopy).toHaveBeenCalledWith('rock10-token-123');
    expect(screen.getByText('Copiado!')).toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    render(<CopyButton text="test" disabled label="Copiar" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
