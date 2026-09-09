import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LikeButton } from './LikeButton';

const meta: Meta<typeof LikeButton> = {
  title: 'Components/Actions/LikeButton',
  component: LikeButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Dimensão do botão',
    },
    initialLikes: {
      control: 'number',
      description: 'Contagem inicial de curtidas',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Exibe somente o ícone de coração',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão',
    },
    useLucide: {
      control: 'boolean',
      description: 'Utiliza ícone SVG vetorial ao invés de emoji',
    },
  },
  args: {
    initialLikes: 42,
    size: 'md',
    iconOnly: false,
    disabled: false,
    useLucide: true,
    onLikeChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LikeButton>;

export const Default: Story = {
  args: {
    initialLikes: 128,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onLikeChange).toHaveBeenCalledWith(129);
  },
};

export const ZeroLikes: Story = {
  args: {
    initialLikes: 0,
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    initialLikes: 15,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LikeButton size="sm" initialLikes={10} />
      <LikeButton size="md" initialLikes={50} />
      <LikeButton size="lg" initialLikes={120} />
    </div>
  ),
};
