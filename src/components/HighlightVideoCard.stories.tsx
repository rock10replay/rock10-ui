import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { HighlightVideoCard } from './HighlightVideoCard';
import { Eye, Heart, Download } from 'lucide-react';

const meta: Meta<typeof HighlightVideoCard> = {
  title: 'Components/Data Display/HighlightVideoCard',
  component: HighlightVideoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Mais Visualizado',
    metricName: 'Visualizações',
    value: 1420,
    accentColor: 'purple',
    icon: <Eye className="w-4 h-4" />,
    video: {
      nome: 'Ponto do Torneio - Match Point 3º Set',
      arena_nome: 'Arena Verão Rock10',
      quadra_nome: 'Quadra Central',
      poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
      dthr: '2026-09-08T18:30:00Z',
    },
    onPlay: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof HighlightVideoCard>;

export const MostViewed: Story = {
  render: (args) => (
    <div className="w-88">
      <HighlightVideoCard {...args} />
    </div>
  ),
};

export const MostLiked: Story = {
  render: (args) => (
    <div className="w-88">
      <HighlightVideoCard
        {...args}
        title="Mais Curtido"
        metricName="Curtidas"
        value={890}
        accentColor="red"
        icon={<Heart className="w-4 h-4" />}
      />
    </div>
  ),
};

export const MostDownloaded: Story = {
  render: (args) => (
    <div className="w-88">
      <HighlightVideoCard
        {...args}
        title="Mais Baixado"
        metricName="Downloads"
        value={340}
        accentColor="emerald"
        icon={<Download className="w-4 h-4" />}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className="w-88">
      <HighlightVideoCard {...args} isLoading={true} />
    </div>
  ),
};
