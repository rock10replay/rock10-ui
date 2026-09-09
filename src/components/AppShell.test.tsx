import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell, AppHeader, AppSidebar } from './AppShell';

describe('AppShell', () => {
  it('renders sidebar, header and children content', () => {
    render(
      <AppShell
        header={<AppHeader title="Dashboard Administrativo" />}
        sidebar={
          <AppSidebar brand={<div>Rock10 Logo</div>}>
            <div>Links de Navegação</div>
          </AppSidebar>
        }
        footer={<div>Rock10 v1.0</div>}
      >
        <div>Conteúdo Principal da Página</div>
      </AppShell>
    );

    expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Rock10 Logo')).toBeInTheDocument();
    expect(screen.getByText('Links de Navegação')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo Principal da Página')).toBeInTheDocument();
    expect(screen.getByText('Rock10 v1.0')).toBeInTheDocument();
  });

  it('triggers onToggleSidebar on mobile hamburger click', async () => {
    const handleToggle = vi.fn();
    render(<AppHeader title="Painel" onToggleSidebar={handleToggle} />);

    const menuButton = screen.getByRole('button', { name: /abrir menu de navegação/i });
    await userEvent.click(menuButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
