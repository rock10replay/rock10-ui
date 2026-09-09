import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DateSeparator } from './DateSeparator';

const meta: Meta<typeof DateSeparator> = {
  title: 'Components/Layout/DateSeparator',
  component: DateSeparator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    date: 'Hoje • 09 de Setembro de 2026',
    videoCount: 14,
    sticky: false,
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DateSeparator>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[500px]">
      <DateSeparator {...args} />
    </div>
  ),
};

export const Collapsible: Story = {
  render: (args) => (
    <div className="w-[500px]">
      <DateSeparator
        {...args}
        onToggleCollapse={fn()}
        isCollapsed={false}
      />
    </div>
  ),
};
