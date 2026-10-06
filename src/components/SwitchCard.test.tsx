import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Warehouse } from 'lucide-react';
import { SwitchCard } from './SwitchCard';

describe('SwitchCard', () => {
  it('renders correctly with Lucide forwardRef icon component without React error #31', () => {
    render(
      <SwitchCard
        id="test-arena-ativo"
        title="Arena Ativa na Plataforma"
        description="Habilita a operação da arena e sua visibilidade no aplicativo"
        icon={Warehouse}
        checked={true}
      />
    );

    expect(screen.getByText('Arena Ativa na Plataforma')).toBeInTheDocument();
    expect(
      screen.getByText('Habilita a operação da arena e sua visibilidade no aplicativo')
    ).toBeInTheDocument();
    const checkbox = screen.getByRole('switch');
    expect(checkbox).toBeChecked();
  });

  it('renders correctly with JSX element as icon', () => {
    render(
      <SwitchCard
        id="test-jsx-icon"
        title="Card com JSX"
        icon={<Warehouse data-testid="custom-icon" />}
        checked={false}
      />
    );

    expect(screen.getByText('Card com JSX')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('handles toggle changes and calls onCheckedChange', async () => {
    const handleChange = vi.fn();
    render(
      <SwitchCard
        id="test-toggle"
        title="Toggle Test"
        checked={false}
        onCheckedChange={handleChange}
      />
    );

    const switchEl = screen.getByRole('switch');
    expect(switchEl).not.toBeChecked();

    await userEvent.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
