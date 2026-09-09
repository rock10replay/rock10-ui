import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    page: 1,
    totalPages: 10,
    totalItems: 98,
    pageSize: 10,
    showEdges: true,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return (
      <div className="w-[600px] bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-dark-border">
        <Pagination {...args} page={page} onPageChange={setPage} />
      </div>
    );
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return (
      <div className="w-[500px] bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-dark-border">
        <Pagination
          page={page}
          totalPages={3}
          totalItems={24}
          pageSize={10}
          onPageChange={setPage}
        />
      </div>
    );
  },
};
