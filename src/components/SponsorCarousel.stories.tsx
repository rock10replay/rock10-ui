import type { Meta, StoryObj } from '@storybook/react-vite';
import { SponsorCarousel } from './SponsorCarousel';

const meta: Meta<typeof SponsorCarousel> = {
  title: 'Components/Data Display/SponsorCarousel',
  component: SponsorCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    intervalMs: 3000,
    height: 80,
    autoplay: true,
    items: [
      {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        title: 'Patrocinador Master Rock10',
      },
      {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        title: 'Bebida Oficial Beach Tennis',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SponsorCarousel>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[500px] border border-gray-200 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-surface">
      <SponsorCarousel {...args} />
    </div>
  ),
};
