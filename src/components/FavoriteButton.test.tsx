import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('renders correctly with default state', () => {
    render(<FavoriteButton />);
    const button = screen.getByRole('button', { name: /salvar nos favoritos/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles favorite state and calls onFavoriteChange', async () => {
    const handleChange = vi.fn();
    render(<FavoriteButton initialFavorito={false} onFavoriteChange={handleChange} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders in text mode when showText is true', () => {
    render(<FavoriteButton initialFavorito={true} showText />);
    expect(screen.getByText('Favoritado')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<FavoriteButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
