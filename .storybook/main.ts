import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    if (!config.plugins) config.plugins = [];
    const hasTailwind = (config.plugins as any[]).some(
      (p) => (p as { name?: string })?.name === '@tailwindcss/vite'
    );
    if (!hasTailwind) {
      (config.plugins as any[]).unshift(tailwindcss());
    }
    // Exclui o vite-plugin-dts do build do Storybook para não poluir nem gerar declarações desnecessárias
    config.plugins = (config.plugins as any[]).filter((plugin) => {
      if (!plugin) return true;
      const name = (plugin as { name?: string }).name;
      return name !== 'vite:dts';
    });
    return config;
  },
};

export default config;