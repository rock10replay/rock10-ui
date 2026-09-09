import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
  args: {
    label: 'Observações do Lance / Partida',
    placeholder: 'Descreva os detalhes importantes da gravação...',
    rows: 4,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => (
    <div className="w-88">
      <Textarea {...args} />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-88">
      <Textarea
        {...args}
        defaultValue="Texto inválido"
        error="O campo ultrapassou o limite de caracteres permitidos."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-88">
      <Textarea
        {...args}
        disabled
        defaultValue="Registro bloqueado para edição pela administração."
      />
    </div>
  ),
};
