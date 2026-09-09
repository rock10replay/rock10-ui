import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Selecione a Quadra',
    selectSize: 'md',
    options: [
      { value: '1', label: 'Quadra 1 (Beach Tennis)' },
      { value: '2', label: 'Quadra 2 (Futevôlei)' },
      { value: '3', label: 'Quadra 3 (Padel)' },
      { value: '4', label: 'Quadra 4 (Manutenção)', disabled: true },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Select {...args} />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-80">
      <Select
        {...args}
        error="Campo obrigatório para continuar o agendamento"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <Select
        {...args}
        disabled
        helperText="Selecione primeiro uma arena ativa"
      />
    </div>
  ),
};
