import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VideoCard } from './VideoCard';

const meta: Meta<typeof VideoCard> = {
  title: 'Components/Data Display/VideoCard',
  component: VideoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    video: {
      id: 501,
      nome: 'Jogada Final do Set - Beach Tennis',
      dthr: '2026-09-09T15:30:00Z',
      poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      downloads: 48,
      curtidas: 156,
      visualizacoes: 980,
      compartilhamentos: 32,
      arena_nome: 'Arena Verão Rock10',
      quadra_nome: 'Quadra 01',
      is_vertical: true,
    },
    onPlay: fn(),
    onShare: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VideoCard>;

export const VerticalStories: Story = {
  render: (args) => (
    <div className="w-72">
      <VideoCard {...args} />
    </div>
  ),
};

export const HorizontalWidescreen: Story = {
  render: (args) => (
    <div className="w-96">
      <VideoCard
        {...args}
        video={{
          ...args.video,
          is_vertical: false,
          nome: 'Transmissão Panorâmica Quadra Central',
        }}
      />
    </div>
  ),
};
