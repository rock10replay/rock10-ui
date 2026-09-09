import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Grid, List, Film } from 'lucide-react';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/Navigation/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  args: {
    value: 'todos',
    size: 'sm',
    fullWidth: false,
    options: [
      { value: 'todos', label: 'Todos os Lances', mobileLabel: 'Todos' },
      { value: 'favoritos', label: 'Favoritos', mobileLabel: 'Favs' },
      { value: 'baixados', label: 'Baixados', mobileLabel: 'Downloads' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(args.value);
    return (
      <SegmentedControl
        {...args}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState('grid');
    return (
      <SegmentedControl
        value={viewMode}
        onChange={setViewMode}
        options={[
          { value: 'grid', label: 'Grade', icon: <Grid className="w-4 h-4" /> },
          { value: 'list', label: 'Lista', icon: <List className="w-4 h-4" /> },
          { value: 'stories', label: 'Stories 9:16', icon: <Film className="w-4 h-4" /> },
        ]}
      />
    );
  },
};

export const FullWidthMobileGrid: Story = {
  render: () => {
    const [filter, setFilter] = useState('16:9');
    return (
      <div className="w-96">
        <SegmentedControl
          fullWidth
          value={filter}
          onChange={setFilter}
          options={[
            { value: '16:9', label: 'Widescreen (16:9)', mobileLabel: '16:9' },
            { value: '9:16', label: 'Stories Vertical (9:16)', mobileLabel: '9:16' },
          ]}
        />
      </div>
    );
  },
};
