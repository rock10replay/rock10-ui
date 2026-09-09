import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, within } from 'storybook/test';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/Forms/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showClear: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Buscar atleta, quadra ou lance...',
    size: 'md',
    showClear: true,
    onSearch: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[500px]">
      <SearchBar {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /campo de busca/i });
    await userEvent.type(input, 'Torneio Rock10');
    await expect(input).toHaveValue('Torneio Rock10');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[500px]">
      <SearchBar size="sm" placeholder="Tamanho SM" onSearch={() => {}} />
      <SearchBar size="md" placeholder="Tamanho MD" onSearch={() => {}} />
      <SearchBar size="lg" placeholder="Tamanho LG" onSearch={() => {}} />
    </div>
  ),
};
