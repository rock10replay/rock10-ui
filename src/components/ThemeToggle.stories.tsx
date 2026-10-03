import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { ThemeProvider } from '../theme/ThemeContext';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div className="p-8 flex items-center justify-center bg-gray-50 dark:bg-dark-bg min-h-[200px] transition-colors">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithLabel: Story = {
  args: {
    size: 'md',
    showLabel: true,
  },
};
