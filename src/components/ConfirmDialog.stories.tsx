import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, within } from 'storybook/test';
import ConfirmDialog from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/Overlays/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    message: {
      control: 'text',
    },
    confirmText: {
      control: 'text',
    },
    cancelText: {
      control: 'text',
    },
    isLoading: {
      control: 'boolean',
    },
  },
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Excluir Gravação',
    message: 'Tem certeza de que deseja excluir este replay permanentemente? Esta ação liberará espaço no disco.',
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelBtn);
    await expect(args.onClose).toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
