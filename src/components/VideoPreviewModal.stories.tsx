import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VideoPreviewModal } from './VideoPreviewModal';

const meta: Meta<typeof VideoPreviewModal> = {
  title: 'Components/Overlays/VideoPreviewModal',
  component: VideoPreviewModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VideoPreviewModal>;

export const WidescreenHorizontal: Story = {
  args: {
    video: {
      id: 1042,
      nome: 'Jogada Decisiva - Smash na Quadra Central',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
      is_vertical: false,
      grupo_nome: 'Grupo Rock10 Arena',
      grupo_slug: 'rock10-sp',
      arena_nome: 'Arena Verão Rock10',
      quadra_nome: 'Quadra 01 (Beach Tennis)',
      dthr: '2026-09-08T17:45:00Z',
      visualizacoes: 1840,
      curtidas: 312,
      downloads: 84,
      compartilhamentos: 45,
    },
  },
};

export const StoriesVertical: Story = {
  args: {
    video: {
      id: 2055,
      nome: 'Ace no Saque - Câmera de Fundo',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=600&q=80',
      is_vertical: true,
      grupo_nome: 'Grupo Rock10 Arena',
      arena_nome: 'Arena Verão Rock10',
      quadra_nome: 'Quadra 02 (Futevôlei)',
      dthr: '2026-09-09T10:15:00Z',
      visualizacoes: 2450,
      curtidas: 520,
      downloads: 140,
      compartilhamentos: 88,
    },
  },
};
