import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Data Display/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['full', 'icon'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    variant: 'full',
    size: 'lg',
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const FullLogo: Story = {
  args: {
    variant: 'full',
    size: 'lg',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'icon',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  ),
};
