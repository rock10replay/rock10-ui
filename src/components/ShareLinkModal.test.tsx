import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShareLinkModal } from './ShareLinkModal';

describe('ShareLinkModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    entityName: 'Arena Central',
    url: 'https://example.com/arena-central/cadastro',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ShareLinkModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title, entity name, and QR code SVG when isOpen is true', () => {
    render(<ShareLinkModal {...defaultProps} />);

    expect(screen.getByText('Auto-Cadastro do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Arena Central')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/arena-central/cadastro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /compartilhar no whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /baixar qr code/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ShareLinkModal {...defaultProps} />);

    const closeBtn = screen.getByRole('button', { name: 'Fechar' });
    fireEvent.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('opens WhatsApp with encoded URL when share button is clicked', () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(<ShareLinkModal {...defaultProps} />);

    const whatsappBtn = screen.getByRole('button', { name: /compartilhar no whatsapp/i });
    fireEvent.click(whatsappBtn);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/?text='),
      '_blank'
    );

    window.open = originalOpen;
  });
});
