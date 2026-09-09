import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        charts: resolve(__dirname, 'src/charts.ts'),
      },
      name: 'Rock10UI',
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'es.js' : 'umd.js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'recharts'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          recharts: 'Recharts',
        },
      },
    },
  },
});
