import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';
import { Video, Calendar, Settings, Shield } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    activeTab: 'replays',
    tabs: [
      { id: 'replays', label: 'Lances & Replays', icon: <Video className="w-4 h-4" /> },
      { id: 'agenda', label: 'Agenda de Quadras', icon: <Calendar className="w-4 h-4" /> },
      { id: 'security', label: 'Segurança & Permissões', icon: <Shield className="w-4 h-4" /> },
      { id: 'config', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(args.activeTab);
    return (
      <div className="w-[500px]">
        <Tabs {...args} activeTab={current} onChange={setCurrent} />
        <div className="p-4 text-sm text-gray-600 dark:text-dark-text">
          Conteúdo selecionado: <strong className="text-primary-500">{current}</strong>
        </div>
      </div>
    );
  },
};
