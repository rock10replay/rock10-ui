import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoPreviewModal } from './VideoPreviewModal';

describe('VideoPreviewModal', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  const mockVideoHorizontal = {
    id: 101,
    nome: 'Golaço da Final',
    url: 'https://cdn.example.com/replay1.mp4',
    poster: 'https://cdn.example.com/poster1.jpg',
    is_vertical: false,
    dthr: '2026-05-10T15:30:00.000Z',
    grupo_nome: 'Grupo Alfa',
    grupo_slug: 'grupo-alfa',
    arena_nome: 'Arena Central',
    quadra_nome: 'Quadra 01',
    visualizacoes: 250,
    curtidas: 42,
    downloads: 12,
    compartilhamentos: 8,
  };

  const mockVideoVertical = {
    ...mockVideoHorizontal,
    id: 102,
    nome: 'Replay Vertical Stories',
    is_vertical: true,
  };

  it('renders null when not open', () => {
    const { container } = render(
      <VideoPreviewModal isOpen={false} onClose={vi.fn()} video={mockVideoHorizontal} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when video is null', () => {
    const { container } = render(
      <VideoPreviewModal isOpen={true} onClose={vi.fn()} video={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders horizontal video player and metadata', () => {
    render(
      <VideoPreviewModal isOpen={true} onClose={vi.fn()} video={mockVideoHorizontal} />
    );

    expect(screen.getByText('Golaço da Final')).toBeInTheDocument();
    expect(screen.getByText(/Gravação Horizontal \(16:9\)/)).toBeInTheDocument();
    expect(screen.getByText('Grupo Alfa')).toBeInTheDocument();
    expect(screen.getByText('Arena Central')).toBeInTheDocument();
    expect(screen.getByText('Quadra 01')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders vertical stories badge when is_vertical is true', () => {
    render(
      <VideoPreviewModal isOpen={true} onClose={vi.fn()} video={mockVideoVertical} />
    );

    expect(screen.getByText(/Formato Stories \/ Reels \(9:16\)/)).toBeInTheDocument();
    expect(screen.getByText(/Gravação Vertical \(9:16\)/)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <VideoPreviewModal isOpen={true} onClose={onClose} video={mockVideoHorizontal} />
    );

    const [closeBtn] = screen.getAllByRole('button', { name: /fechar/i });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('copies video url via CopyButton', async () => {
    render(
      <VideoPreviewModal isOpen={true} onClose={vi.fn()} video={mockVideoHorizontal} />
    );

    const copyBtn = screen.getByRole('button', { name: /copiar link/i });
    expect(copyBtn).toBeInTheDocument();

    await userEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://cdn.example.com/replay1.mp4');
  });
});
