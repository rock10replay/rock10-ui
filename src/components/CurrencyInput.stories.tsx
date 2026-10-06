import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CurrencyInput } from './CurrencyInput';

const meta: Meta<typeof CurrencyInput> = {
  title: 'Components/Forms/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'filter', 'purple'],
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    allowNegative: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Valor da Mensalidade',
    inputSize: 'md',
    fullWidth: false,
    currencyPrefix: 'R$',
    clearable: true,
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <CurrencyInput {...args} value={150.0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveValue('150,00');
  },
};

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <CurrencyInput label="Padrão" variant="default" value={99.9} />
      <CurrencyInput label="Filtro" variant="filter" value={250.0} />
      <CurrencyInput label="Roxo / Master" variant="purple" value={1490.5} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <CurrencyInput label="Pequeno (sm)" inputSize="sm" value={50} />
      <CurrencyInput label="Médio (md)" inputSize="md" value={150} />
      <CurrencyInput label="Grande (lg)" inputSize="lg" value={500} />
    </div>
  ),
};
