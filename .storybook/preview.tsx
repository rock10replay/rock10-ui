import type { Preview } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import './storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      toc: true,
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Alternar entre tema Claro e Escuro (Rock10)',
      defaultValue: 'dark',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'moon', title: 'Dark (Padrão Rock10)' },
          { value: 'light', icon: 'sun', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }, [theme]);

      return (
        <div
          className={`rock10-preview-container ${
            theme === 'dark'
              ? 'dark bg-[#0F1419] text-[#E2E8F0]'
              : 'bg-[#F8FAFC] text-gray-900'
          } p-4 min-h-[120px] rounded-lg font-sans transition-colors duration-200`}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;