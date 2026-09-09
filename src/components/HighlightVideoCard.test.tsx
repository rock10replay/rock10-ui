import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighlightVideoCard } from './HighlightVideoCard';
import { Eye } from 'lucide-react';

describe('HighlightVideoCard', () => {
  const mockVideo = {
    nome: 'Super Jogada de Vôlei',
    poster: 'https://example.com/poster.jpg',
    arena_nome: 'Arena Verão',
    quadra_nome: 'Quadra 2',
    dthr: '2026-06-15T10:00:00.000Z',
  };

  it('renders card title, metric value and video details', () => {
    render(
      <HighlightVideoCard
        title="Mais Assistido"
        metricName="Visualizações"
        value={1540}
        icon={<Eye data-testid="metric-icon" />}
        video={mockVideo}
        accentColor="emerald"
      />
    );

    expect(screen.getByText('Mais Assistido')).toBeInTheDocument();
    expect(screen.getByText('1.540')).toBeInTheDocument();
    expect(screen.getByText('Super Jogada de Vôlei')).toBeInTheDocument();
    expect(screen.getByText(/Arena Verão • Quadra 2/)).toBeInTheDocument();
    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
  });

  it('renders empty fallback when video is not present or value is 0', () => {
    render(
      <HighlightVideoCard
        title="Mais Curtido"
        metricName="Curtidas"
        value={0}
        icon={<Eye />}
        video={null}
      />
    );

    expect(screen.getByText('Nenhum vídeo registrado no período')).toBeInTheDocument();
    expect(screen.getByText('Sem reprodução')).toBeInTheDocument();
  });

  it('triggers onPlay callback when thumbnail is clicked', async () => {
    const onPlay = vi.fn();
    render(
      <HighlightVideoCard
        title="Mais Compartilhado"
        metricName="Shares"
        value={50}
        icon={<Eye />}
        video={mockVideo}
        onPlay={onPlay}
      />
    );

    const playBtn = screen.getByRole('button', { name: /assistir super jogada de vôlei/i });
    await userEvent.click(playBtn);
    expect(onPlay).toHaveBeenCalled();
  });
});
