import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ShareLinkModal } from './ShareLinkModal';

const meta: Meta<typeof ShareLinkModal> = {
  title: 'Components/Overlays/ShareLinkModal',
  component: ShareLinkModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    title: 'Cadastro do Atleta',
    badgeText: 'Público',
    subtitle: 'Divulgue na recepção, redes sociais e WhatsApp',
    entityName: 'Arena Verão Rock10',
    url: 'https://rock10.com.br/cadastro/arena-verao',
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ShareLinkModal>;

export const Default: Story = {
  args: {},
};
