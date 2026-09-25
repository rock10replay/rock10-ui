import type { Meta, StoryObj } from '@storybook/react';
import { StoriesOverlay } from './StoriesOverlay';

const meta: Meta<typeof StoriesOverlay> = {
  title: 'Domain/StoriesOverlay',
  component: StoriesOverlay,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StoriesOverlay>;

export const HorizontalScreenHorizontalVideo: Story = {
  args: {
    arenaName: '15A Beach Sports',
    arenaSlug: '15a-beach-sports',
    arenaLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop',
    courtName: 'Quadra 1 (Principal)',
    videoDate: new Date(),
    currentIndex: 3,
    totalVideos: 12,
    progressPercent: 65,
    isPlaying: true,
    isMuted: false,
    isCached: true,
    screenOrientation: 'horizontal',
    videoOrientation: 'horizontal',
  },
  render: (args) => (
    <div className="relative w-full h-[600px] bg-slate-900 overflow-hidden flex items-center justify-center">
      <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center text-white/30 text-2xl font-bold">
        [Simulação de Vídeo 16:9 Horizontal]
      </div>
      <StoriesOverlay {...args} />
    </div>
  ),
};

export const VerticalTotemVerticalVideo: Story = {
  args: {
    arenaName: '15A Beach Sports',
    arenaSlug: '15a-beach-sports',
    courtName: 'Quadra 2',
    videoDate: new Date(),
    currentIndex: 0,
    totalVideos: 8,
    progressPercent: 30,
    isPlaying: true,
    isMuted: true,
    isCached: false,
    screenOrientation: 'vertical',
    videoOrientation: 'vertical',
  },
  render: (args) => (
    <div className="relative w-[360px] h-[640px] mx-auto bg-slate-900 overflow-hidden rounded-3xl shadow-2xl">
      <div className="w-full h-full bg-gradient-to-b from-slate-950 via-zinc-900 to-black flex items-center justify-center text-white/30 text-xl font-bold text-center p-4">
        [Simulação de Vídeo 9:16 Vertical Totem]
      </div>
      <StoriesOverlay {...args} />
    </div>
  ),
};
