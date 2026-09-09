import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadButton } from './DownloadButton';

const meta: Meta<typeof DownloadButton> = {
  title: 'Components/Actions/DownloadButton',
  component: DownloadButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconOnly: {
      control: 'boolean',
    },
    downloadCount: {
      control: 'number',
    },
  },
  args: {
    videoUrl: 'https://example.com/video.mp4',
    fileName: 'lance_rock10.mp4',
    downloadCount: 24,
    size: 'md',
    iconOnly: false,
    useLucide: true,
  },
};

export default meta;
type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {
  args: {
    downloadCount: 88,
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    downloadCount: 12,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DownloadButton size="sm" videoUrl="#" fileName="video_sm.mp4" downloadCount={5} />
      <DownloadButton size="md" videoUrl="#" fileName="video_md.mp4" downloadCount={15} />
      <DownloadButton size="lg" videoUrl="#" fileName="video_lg.mp4" downloadCount={30} />
    </div>
  ),
};
