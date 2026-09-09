import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepCards } from './StepCards';
import { Camera, Play, Share2, Award } from 'lucide-react';

const meta: Meta<typeof StepCards> = {
  title: 'Components/Data Display/StepCards',
  component: StepCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    columns: 4,
    steps: [
      {
        title: 'Jogue na Arena',
        description: 'Entre em uma de nossas quadras equipadas com 4 câmeras 4K.',
        icon: <Camera className="w-6 h-6 text-primary-500" />,
      },
      {
        title: 'Gere o Lance',
        description: 'Aperte o botão físico ou gere o replay pelo app em segundos.',
        icon: <Play className="w-6 h-6 text-primary-500" />,
      },
      {
        title: 'Compartilhe',
        description: 'Envie direto para os Stories do Instagram ou WhatsApp.',
        icon: <Share2 className="w-6 h-6 text-primary-500" />,
      },
      {
        title: 'Suba no Ranking',
        description: 'Acumule curtidas e visualizações no ranking oficial Rock10.',
        icon: <Award className="w-6 h-6 text-primary-500" />,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof StepCards>;

export const FourSteps: Story = {
  render: (args) => (
    <div className="w-[1000px]">
      <StepCards {...args} />
    </div>
  ),
};

export const TwoSteps: Story = {
  render: (args) => (
    <div className="w-[600px]">
      <StepCards
        {...args}
        columns={2}
        steps={args.steps.slice(0, 2)}
      />
    </div>
  ),
};
