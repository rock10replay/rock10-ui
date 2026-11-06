import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders pagination buttons and handles page change', async () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        page={1}
        totalPages={5}
        totalItems={50}
        pageSize={10}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/mostrando/i)).toBeInTheDocument();
    expect(screen.getByText(/mostrando/i)).toHaveTextContent('Mostrando 1-10 de 50 registros');

    const nextPageBtn = screen.getByTitle('Próxima página');
    await userEvent.click(nextPageBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    const page3Btn = screen.getByRole('button', { name: '3' });
    await userEvent.click(page3Btn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous and first buttons on page 1', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByTitle('Primeira página')).toBeDisabled();
    expect(screen.getByTitle('Página anterior')).toBeDisabled();
    expect(screen.getByTitle('Próxima página')).toBeEnabled();
  });

  it('renders page size selector and calls onPageSizeChange', async () => {
    const handlePageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        totalPages={3}
        totalItems={60}
        pageSize={20}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageChange={vi.fn()}
        onPageSizeChange={handlePageSizeChange}
      />
    );

    const select = screen.getByLabelText(/itens por página/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('20');

    await userEvent.selectOptions(select, '50');
    expect(handlePageSizeChange).toHaveBeenCalledWith(50);
  });
});
