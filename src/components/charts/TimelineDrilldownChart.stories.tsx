import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimelineDrilldownChart, type TimelineItem, type TimelineFetchParams } from './TimelineDrilldownChart';

const meta: Meta<typeof TimelineDrilldownChart> = {
  title: 'Components/Charts/TimelineDrilldownChart',
  component: TimelineDrilldownChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof TimelineDrilldownChart>;

// Mock data generator for 12 months, 30 days, or 24 hours
const mockFetchTimeline = async (params: TimelineFetchParams): Promise<TimelineItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simula latência realista

  if (params.day) {
    // 24 horas
    return Array.from({ length: 24 }, (_, i) => ({
      key: i,
      label: `${String(i).padStart(2, '0')}:00`,
      hour: i,
      videos: Math.floor(Math.random() * 8) + 1,
      visualizacoes: Math.floor(Math.random() * 60) + 10,
      downloads: Math.floor(Math.random() * 15) + 2,
      curtidas: Math.floor(Math.random() * 30) + 5,
      compartilhamentos: Math.floor(Math.random() * 10),
    }));
  }

  if (params.month) {
    // 30 dias
    return Array.from({ length: 30 }, (_, i) => ({
      key: i + 1,
      label: `Dia ${i + 1}`,
      day: i + 1,
      videos: Math.floor(Math.random() * 40) + 10,
      visualizacoes: Math.floor(Math.random() * 300) + 50,
      downloads: Math.floor(Math.random() * 80) + 10,
      curtidas: Math.floor(Math.random() * 150) + 20,
      compartilhamentos: Math.floor(Math.random() * 50) + 5,
    }));
  }

  // 12 meses
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months.map((m, idx) => ({
    key: idx + 1,
    label: m,
    month: idx + 1,
    videos: Math.floor(Math.random() * 500) + 100,
    visualizacoes: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 1200) + 200,
    curtidas: Math.floor(Math.random() * 2500) + 400,
    compartilhamentos: Math.floor(Math.random() * 800) + 100,
    prev_videos: Math.floor(Math.random() * 400) + 80,
    prev_visualizacoes: Math.floor(Math.random() * 4000) + 800,
    prev_downloads: Math.floor(Math.random() * 900) + 150,
    prev_curtidas: Math.floor(Math.random() * 1800) + 300,
    prev_compartilhamentos: Math.floor(Math.random() * 600) + 80,
  }));
};

export const Default: Story = {
  render: () => (
    <div className="max-w-5xl mx-auto">
      <TimelineDrilldownChart
        title="Métricas Temporais Rock10"
        titleSuffix="Arena Central"
        onFetchData={mockFetchTimeline}
        initialYear={2026}
      />
    </div>
  ),
};
