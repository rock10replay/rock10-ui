import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    switchSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Notificações via WhatsApp',
    description: 'Enviar link do lance por mensagem após a jogada',
    switchSize: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole('switch');
    await userEvent.click(switchEl);
    await expect(switchEl).not.toBeChecked();
  },
};

export const Inactive: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'Modo Transmissão Ao Vivo (Em manutenção)',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch switchSize="sm" label="Tamanho SM" defaultChecked />
      <Switch switchSize="md" label="Tamanho MD" defaultChecked />
      <Switch switchSize="lg" label="Tamanho LG" defaultChecked />
    </div>
  ),
};
