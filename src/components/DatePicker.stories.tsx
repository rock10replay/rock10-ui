import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Data da Gravação',
    initialDate: '2026-09-09',
    onDateSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <DatePicker {...args} />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: (args) => (
    <div className="w-80">
      <DatePicker
        {...args}
        label="Período Disponível para Replay"
        minDate="2026-09-01"
        maxDate="2026-09-30"
      />
    </div>
  ),
};
