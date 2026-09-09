import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders default vertical card', () => {
    render(<StatCard title="Total de Arenas" value={15} animateValue={false} />);
    expect(screen.getByText('Total de Arenas')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders horizontal variant', () => {
    render(
      <StatCard
        title="Quadras Ativas"
        value={42}
        variant="horizontal"
        subtitle="Em 10 arenas"
        animateValue={false}
      />
    );
    expect(screen.getByText('Quadras Ativas')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Em 10 arenas')).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<StatCard title="Vídeos Hoje" value={120} variant="compact" animateValue={false} />);
    expect(screen.getByText('Vídeos Hoje')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });
});
