import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DateSelector } from './DateSelector';

const meta: Meta<typeof DateSelector> = {
  title: 'Components/Forms/DateSelector',
  component: DateSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    allowRange: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
  args: {
    allowRange: true,
    placeholder: 'Filtrar por período',
    onDateChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DateSelector>;

export const Default: Story = {
  args: {
    initialStartDate: '2026-09-01',
    initialEndDate: '2026-09-09',
  },
};

export const SingleDateOnly: Story = {
  args: {
    allowRange: false,
    placeholder: 'Selecionar dia do jogo',
  },
};
