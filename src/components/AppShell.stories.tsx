import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppShell, AppHeader, AppSidebar } from './AppShell';
import { Video, Calendar, Shield, Settings, Bell, User } from 'lucide-react';
import { Badge } from './Badge';

const meta: Meta<typeof AppShell> = {
  title: 'Components/Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
      <div className="min-h-[500px] border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
        <AppShell
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
          header={
            <AppHeader
              title="Painel Administrativo Arena Rock10"
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              actions={
                <button type="button" className="p-2 text-gray-500 hover:text-primary-500 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
              }
              userSlot={
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline">Admin Arena</span>
                </div>
              }
            />
          }
          sidebar={
            <AppSidebar
              brand={
                <div className="flex items-center gap-2 font-black text-lg text-primary-500 tracking-wider">
                  <span className="p-1 bg-primary-500 text-white rounded-lg">R10</span>
                  ROCK10 REPLAY
                </div>
              }
            >
              <div className="flex flex-col gap-1 text-sm font-semibold">
                <a href="#lances" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                  <Video className="w-4 h-4" /> Lances & Replays
                </a>
                <a href="#agenda" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-surface-light">
                  <Calendar className="w-4 h-4" /> Agenda das Quadras
                </a>
                <a href="#seguranca" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-surface-light">
                  <Shield className="w-4 h-4" /> Segurança
                </a>
                <a href="#config" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-surface-light">
                  <Settings className="w-4 h-4" /> Configurações
                </a>
              </div>
            </AppSidebar>
          }
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Transmissões Ativas</h2>
              <Badge variant="success" dot pulseDot>4 Câmeras Gravando</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-40 rounded-2xl bg-gray-100 dark:bg-dark-surface p-4 border border-gray-200 dark:border-dark-border flex items-center justify-center font-bold text-gray-400">
                Quadra 1 (Beach Tennis)
              </div>
              <div className="h-40 rounded-2xl bg-gray-100 dark:bg-dark-surface p-4 border border-gray-200 dark:border-dark-border flex items-center justify-center font-bold text-gray-400">
                Quadra 2 (Futevôlei)
              </div>
            </div>
          </div>
        </AppShell>
      </div>
    );
  },
};
