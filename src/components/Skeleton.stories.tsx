import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'card'],
    },
  },
  args: {
    variant: 'text',
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="80%" height={16} />
      <Skeleton variant="text" width="60%" height={16} />
    </div>
  ),
};

export const VideoCardSkeleton: Story = {
  render: () => (
    <div className="w-80 p-4 border border-gray-200 dark:border-dark-border rounded-2xl space-y-3 bg-white dark:bg-dark-surface">
      <Skeleton variant="rectangular" width="100%" height={160} />
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" width="70%" height={14} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
    </div>
  ),
};
