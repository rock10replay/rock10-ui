import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Feedback/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'skeleton'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    text: {
      control: 'text',
    },
  },
  args: {
    variant: 'spinner',
    size: 'md',
    text: 'Carregando gravações da arena...',
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const CardSkeleton: Story = {
  args: {
    variant: 'skeleton',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loading size="sm" text="Pequeno" />
      <Loading size="md" text="Médio" />
      <Loading size="lg" text="Grande" />
    </div>
  ),
};
