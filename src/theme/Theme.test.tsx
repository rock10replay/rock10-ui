import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

function TestConsumer() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolvedTheme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider & useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('inicia com o defaultTheme quando nao ha valor persistido', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('resolvedTheme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('alterna tema para escuro e adiciona classe .dark no html', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <TestConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolvedTheme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('rock10-theme')).toBe('dark');
  });

  it('alterna usando toggleTheme()', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <TestConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('resolvedTheme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('resolvedTheme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('ThemeToggle component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renderiza o botao de alternancia e responde a cliques', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /alternar para modo escuro/i });
    expect(button).toBeDefined();

    await user.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    const buttonAfter = screen.getByRole('button', { name: /alternar para modo claro/i });
    expect(buttonAfter).toBeDefined();
  });
});
